# syntax=docker/dockerfile:1
# Build from monorepo root: docker build -f apps/blog/Dockerfile -t blog:latest .

ARG NODE_BASE_IMAGE=node:22-bookworm-slim
ARG NGINX_BASE_IMAGE=nginx:mainline-alpine-slim

FROM ${NODE_BASE_IMAGE} AS builder
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

FROM ${NGINX_BASE_IMAGE} AS runner
COPY apps/blog/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/blog/dist /usr/share/nginx/html

EXPOSE 80
