
set -e

# migrationsディレクトリが存在する場合は削除
if [ -d prisma/migrations ]; then
  echo Removing existing migrations directory...
  rm -rf prisma/migrations
fi
# Prismaのマイグレーションとクライアント生成
pnpm dlx prisma migrate reset --force --skip-seed
pnpm dlx prisma migrate dev --name init
sleep 5
# pnpm dlx prisma generate
pnpm dlx prisma db seed

# サーバーの起動
pnpm dlx prisma studio

