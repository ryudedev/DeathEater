#!/bin/sh
set -e
until pg_isready -h "db" -p 5432 -U "${POSTGRES_USER}"; do
  echo "$(date) - waiting for db to start"
  sleep 1
done

# Prismaのマイグレーションとクライアント生成
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma generate

# サーバーの起動
pnpm start:prisma:dev
