// capsule.gateway.ts
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

@WebSocketGateway({ cors: true }) // CORS設定を有効化
export class CapsuleGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // カプセルの状態を管理する
  private capsuleStates: CapsuleState[] = [];

  // クライアントが接続したとき
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    const { user } = client.handshake.query; // クライアントから送られるユーザーIDを取得

    // ユーザーIDがまだ状態に登録されていない場合にのみ初期状態を追加
    const existingEntry = this.capsuleStates.find(
      (entry) => entry.userId === user,
    );
    if (!existingEntry) {
      console.log('not exist');
      this.capsuleStates.push({
        userId: String(user),
        userIcon: 'https://via.placeholder.com/50', // デフォルトアイコン
        isOpened: false,
        state: '-', // 初期状態は`-`
      });
    }

    // 現在のカプセル状態を接続時に送信
    client.emit('stateUpdate', this.capsuleStates);
  }

  // クライアントが切断したとき
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('openCapsule')
  handleOpenCapsule(
    client: Socket,
    data: { userId: string; userIcon: string },
  ) {
    console.log(`Open capsule request received from ${client.id}:`, data);

    // 既に開封されている場合は無視
    const existingEntry = this.capsuleStates.find(
      (entry) => entry.userId === data.userId,
    );
    if (existingEntry) {
      if (existingEntry.isOpened) {
        console.log(
          `Capsule for user ${data.userId} is already opened. Ignoring request.`,
        );
        return;
      }

      // 状態を更新
      existingEntry.isOpened = true;
      existingEntry.state = 'OK'; // 状態を'OK'に更新
    } else {
      // 新規エントリーを作成
      this.capsuleStates.push({
        userId: data.userId,
        userIcon: data.userIcon,
        isOpened: true,
        state: 'OK',
      });
    }

    // 更新された状態を全クライアントに送信
    this.broadcastState();

    // 全員がスライド済みか確認
    const allOpened = this.capsuleStates.every((entry) => entry.isOpened);

    if (allOpened) {
      console.log(
        'All users have opened their capsules. Redirecting to /live/view',
      );
      this.server.emit('redirect', { url: '/live/view' }); // 全クライアントにリダイレクト指示
    }
  }

  private broadcastState() {
    const state = this.capsuleStates.map(
      ({ userId, userIcon, isOpened, state }) => ({
        userId,
        userIcon,
        status: isOpened ? state : '-', // 開封の場合: OK、閉封の場合: -
      }),
    );

    console.log('Broadcasting state to all clients:', state); // 状態送信前にログを追加

    this.server.emit('stateUpdate', state); // 更新された状態を全クライアントに送信
  }
}
