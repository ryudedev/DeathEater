import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface CapsuleState {
  userId: string;
  userIcon: string;
  isOpened: boolean;
  state: 'OK' | '-';
}

@WebSocketGateway({ cors: true })
export class CapsuleGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, Set<string>> = new Map();
  private userStreams: Map<string, MediaStream> = new Map();
  private capsuleStates: Map<string, CapsuleState[]> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const { user, roomId } = client.handshake.query;

    if (roomId) {
      this.joinRoom(client, String(roomId), String(user));
    }

    // ユーザーの初期状態を設定
    this.initializeUserState(String(roomId), String(user));

    // 現在の状態を送信
    this.broadcastRoomState(String(roomId));
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const { user, roomId } = client.handshake.query;

    if (roomId && user) {
      this.leaveRoom(client, String(roomId), String(user));
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { roomId: string; userId: string }) {
    this.joinRoom(client, data.roomId, data.userId);
  }

  @SubscribeMessage('joinVoiceRoom')
  handleJoinVoiceRoom(
    client: Socket,
    data: { roomId: string; userId: string },
  ) {
    const room = this.getOrCreateRoom(data.roomId);
    room.add(data.userId);

    // 既存の参加者のストリーム情報を新規参加者に送信
    this.userStreams.forEach((stream, streamUserId) => {
      if (streamUserId !== data.userId) {
        client.emit('userStream', {
          userId: streamUserId,
          stream: stream,
        });
      }
    });
  }

  @SubscribeMessage('startVoice')
  handleStartVoice(
    client: Socket,
    data: { roomId: string; userId: string; stream: MediaStream },
  ) {
    const { roomId, userId, stream } = data;
    this.userStreams.set(userId, stream);

    // ルームの他のメンバーに新しいストリームを通知
    client.to(roomId).emit('newUserStream', {
      userId: userId,
      stream: stream,
    });
  }

  @SubscribeMessage('stopVoice')
  handleStopVoice(client: Socket, data: { roomId: string; userId: string }) {
    this.userStreams.delete(data.userId);
    client.to(data.roomId).emit('userStreamStopped', { userId: data.userId });
  }

  @SubscribeMessage('openCapsule')
  handleOpenCapsule(
    client: Socket,
    data: { userId: string; userIcon: string; roomId: string },
  ) {
    console.log(`Open capsule request received from ${client.id}:`, data);

    const roomStates = this.getRoomState(data.roomId);
    const existingEntry = roomStates.find(
      (entry) => entry.userId === data.userId,
    );

    if (existingEntry) {
      if (existingEntry.isOpened) {
        console.log(`Capsule for user ${data.userId} is already opened.`);
        return;
      }

      existingEntry.isOpened = true;
      existingEntry.state = 'OK';
    } else {
      roomStates.push({
        userId: data.userId,
        userIcon: data.userIcon,
        isOpened: true,
        state: 'OK',
      });
    }

    this.broadcastRoomState(data.roomId);

    // 全員が開封したかチェック
    const allOpened = roomStates.every((entry) => entry.isOpened);
    if (allOpened) {
      this.server
        .to(data.roomId)
        .emit('redirect', { url: `/live/${data.roomId}/view` });
    }
  }

  private joinRoom(client: Socket, roomId: string, userId: string) {
    client.join(roomId);
    const room = this.getOrCreateRoom(roomId);
    room.add(userId);
    this.broadcastRoomState(roomId);

    // Notify other users about the new user
    client.to(roomId).emit('newUserJoined', userId);
  }

  private leaveRoom(client: Socket, roomId: string, userId: string) {
    client.leave(roomId);
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
        this.capsuleStates.delete(roomId);
      }
    }
  }

  private getOrCreateRoom(roomId: string): Set<string> {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    return this.rooms.get(roomId)!;
  }

  private getRoomState(roomId: string): CapsuleState[] {
    if (!this.capsuleStates.has(roomId)) {
      this.capsuleStates.set(roomId, []);
    }
    return this.capsuleStates.get(roomId)!;
  }

  private initializeUserState(roomId: string, userId: string) {
    const roomStates = this.getRoomState(roomId);
    if (!roomStates.find((state) => state.userId === userId)) {
      roomStates.push({
        userId: userId,
        userIcon: 'https://via.placeholder.com/50',
        isOpened: false,
        state: '-',
      });
    }
  }

  private broadcastRoomState(roomId: string) {
    const states = this.getRoomState(roomId);
    const formattedStates = states.map(
      ({ userId, userIcon, isOpened, state }) => ({
        userId,
        userIcon,
        status: isOpened ? state : '-',
      }),
    );

    console.log(`Broadcasting state to room ${roomId}:`, formattedStates);
    this.server.to(roomId).emit('stateUpdate', formattedStates);
  }

  @SubscribeMessage('offer')
  handleOffer(
    client: Socket,
    data: {
      targetUserId: string;
      offer: RTCSessionDescriptionInit;
      roomId: string;
    },
  ) {
    const { offer, roomId } = data;
    this.server.to(roomId).emit('offer', {
      fromUserId: client.handshake.query.user,
      offer,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    client: Socket,
    data: {
      targetUserId: string;
      answer: RTCSessionDescriptionInit;
      roomId: string;
    },
  ) {
    const { answer, roomId } = data;
    this.server.to(roomId).emit('answer', {
      fromUserId: client.handshake.query.user,
      answer,
    });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    client: Socket,
    data: {
      targetUserId: string;
      candidate: RTCIceCandidateInit;
      roomId: string;
    },
  ) {
    const { candidate, roomId } = data;
    this.server.to(roomId).emit('ice-candidate', {
      fromUserId: client.handshake.query.user,
      candidate,
    });
  }
}
