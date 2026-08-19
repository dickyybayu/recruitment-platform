FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json

RUN corepack pnpm@9.7.1 install --frozen-lockfile

COPY apps/frontend apps/frontend

WORKDIR /app/apps/frontend

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN corepack pnpm@9.7.1 build

EXPOSE 3000

CMD ["corepack", "pnpm@9.7.1", "start"]
