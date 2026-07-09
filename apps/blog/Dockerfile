# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f apps/blog/Dockerfile -t blog:latest .

FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/blog/package.json ./apps/blog/
RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

COPY scripts ./scripts
COPY docs/article ./docs/article
COPY docs/submodule ./docs/submodule
COPY apps/blog ./apps/blog

RUN pnpm blog:build

FROM nginx:mainline-alpine-slim AS runner
COPY apps/blog/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/blog/dist /usr/share/nginx/html

EXPOSE 80
