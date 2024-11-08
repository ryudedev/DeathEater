#!/bin/sh
set -e
until pg_isready -h "db" -p 5432 -U "${POSTGRES_USER}"; do
  echo "$(date) - waiting for db to start"
  sleep 1
done

echo "db connected"

# migrationsディレクトリが存在する場合は削除
if [ -d "prisma/migrations" ]; then
  echo "Removing existing migrations directory..."
  rm -rf prisma/migrations
fi

# Prismaのマイグレーションとクライアント生成
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma generate

# サーバーの起動
pnpm dlx prisma studio
