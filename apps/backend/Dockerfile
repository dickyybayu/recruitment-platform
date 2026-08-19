FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN corepack pnpm@9.7.1 install --frozen-lockfile

COPY apps/backend apps/backend

WORKDIR /app/apps/backend

RUN corepack pnpm@9.7.1 build

EXPOSE 3001

CMD ["sh", "-c", "corepack pnpm@9.7.1 db:migrate && corepack pnpm@9.7.1 db:seed && corepack pnpm@9.7.1 start"]
