# Reminico
Reminicoは、学校やイベント会場向けのデジタルタイムカプセルサービスです。写真、動画、音声、テキストをまとめてタイムカプセルに保存し、指定した日にカプセルを解放できます。管理者はコンテンツを精査し、許可されたメディアのみがタイムカプセルに保存されるため、安全かつ適切な内容が保持されます。
## 機能
- タイムカプセルの作成: クラス単位でタイムカプセルを作成し、メディアを保存。
- メディアのアップロードと審査: 生徒がメディアをアップロードし、管理者（先生）が承認・拒否を行います。
- グループ機能: 生徒や管理者は複数のクラスやグループに参加可能。
- 通知機能: タイムカプセルの解放通知をメールやWeb通知で受け取ります。
- ストレージプラン: 2GB、5GB、10GBのプランから選択し、S3バケットに保存。
- 履歴管理: タイムカプセルの作成、メディア追加、解放の履歴を確認可能。
- ライブ機能: 将来的には動画や音声のライブ機能を提供予定。

## セットアップ
### 必要な環境
- Node.js 18.x
- pnpm
- Docker
- AWSアカウント（S3バケット用）
- Stripeアカウント

## 環境変数の設定
### .envファイルをプロジェクトルートに作成し、以下の環境変数を設定します。
```properties
# api/.env
POSTGRES_HOST=Slackに記載している
POSTGRES_PORT=Slackに記載している
POSTGRES_USER=Slackに記載している
POSTGRES_PASSWORD=Slackに記載している
POSTGRES_DB=Slackに記載している
DATABASE_URL=Slackに記載している
```

```properties
# web/.env
BACKEND_URL=http://localhost:3001
```

### 開発環境の構築
1. リポジトリをクローンします。
```bash
git clone https://github.com/ryudedev/DeathEater.git
cd DeathEater
```

2. パッケージをインストールします。
```bash
pnpm install
```

3. Dockerコンテナを起動します。
```bash
pnpm start:build
```

4. サーバーを確認する。
- Frontend
    - http://localhost:3000
- Backend
    - GraphQL
        - http://localhost:3001/graphql
    - Prisma
        - http://localhost:5555
- SwaggerUI
    - http://localhost:8002
