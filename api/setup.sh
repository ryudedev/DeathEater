set -e
until pg_isready -h "db" -p 5432 -U "${POSTGRES_USER}"; do
  echo "$(date) - waiting for db to start"
  sleep 1
done
exec "$@"
# npx npx prisma migrate dev --name init
pnpm dlx prisma db push
pnpm dlx prisma generate
(pnpm dlx prisma studio&)
pnpm start:prisma:dev
