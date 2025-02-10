import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface SignalData {
  type?: 'offer' | 'answer';
  candidate?: RTCIceCandidate;
}

interface JoinRoomData {
  roomId: string;
}

interface SignalPayload {
  signal: SignalData;
  roomId: string;
}

interface UserJoinedResponse {
  userId: string;
  userCount: number;
}

interface SignalResponse {
  signal: SignalData;
  userId: string;
}

interface UserLeftResponse {
  userId: string;
  userCount: number;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class SignalingGateway {
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, Set<string>> = new Map();

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: JoinRoomData,
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId);
    if (room) {
      room.add(client.id);
      client.join(roomId);

      this.server.to(roomId).emit('userJoined', {
        userId: client.id,
        userCount: room.size,
      } as UserJoinedResponse);

      console.log(`User ${client.id} joined room ${roomId}`);
    }
  }

  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody() data: SignalPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Signal from ${client.id} in room ${data.roomId}`);
    client.to(data.roomId).emit('signal', {
      signal: data.signal,
      userId: client.id,
    } as SignalResponse);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    this.rooms.forEach((users, roomId) => {
      if (users.has(client.id)) {
        users.delete(client.id);
        this.server.to(roomId).emit('userLeft', {
          userId: client.id,
          userCount: users.size,
        } as UserLeftResponse);
      }
    });
  }
}
