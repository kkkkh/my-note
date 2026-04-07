---
title: 关于 nextjs DockerFile 更新
date: 2026-03-05 15:47
tags:
  - Ops
  - Docker
---
# 关于 nextjs DockerFile 更新
## 较早的配置
```dockerfile
# ===== 1. 构建阶段 =====
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm \
  --registry=https://registry.npmmirror.com
# 仅复制依赖文件，利用缓存
COPY pnpm-lock.yaml package.json ./
# 安装依赖（包括 devDependencies）
RUN pnpm install --frozen-lockfile  \
  --registry=https://registry.npmmirror.com
# 复制项目文件（由 .dockerignore 控制排除）
COPY . .
# 构建 Next.js 应用
RUN pnpm build
# ===== 2. 运行阶段 =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["pnpm", "start"]
```
## 新配置 standalone
```js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```
```dockerfile
# 少了 pnpm 作为 PID1、少了运行期依赖不一致、也减少了很多探针误报。
FROM node:20-bookworm-slim AS builder
WORKDIR /app

RUN npm i -g pnpm --registry=https://registry.npmmirror.com
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

COPY . .
RUN pnpm build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

# 拷贝 standalone 输出（不需要整份 node_modules）
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["node","server.js"]
```
## 为什么生产环境更推荐 standalone
  - 不需要完整 node_modules
  - 镜像更小
  - 依赖固定
  - 减少 spawn 子进程
  - 避免 pnpm runtime
  - 启动更快
  - 业界部署通用：很多大厂 Next.js Docker 部署都这么做
## 为什么 node:20-bookworm-slim 比 node:20-alpine 更推荐
- Node.js / Next.js / SSR 应用里通常推荐 Debian 系列（bookworm）
| 镜像                    | libc  | 说明                    |
| --------------------- | ----- | --------------------- |
| node:20-bookworm-slim | glibc | 兼容性最好                 |
| node:20-alpine        | musl  | 容易出现 native module 问题 |

- libc: C Standard Library（C 标准库）
- glibc(GNU libc): Linux默认标准库、兼容、常见、稳定
- musl(轻量级 libc):小、简单、适合容器、但兼容性稍差
## tini 的作用
- 解决两个 Docker 常见问题：
  - 1、信号转发：容器停止时 docker stop，会发送 SIGTERM，tini 会正确转发给 Node。
  - 2、回收僵尸进程：Node 可能创建子进程 child_process、worker_threads、ffmpeg，退出后会产生 zombie process，tini 会回收这些进程。
## ENTRYPOINT 的作用
- ENTRYPOINT 是 容器启动时的固定命令
- Docker 启动时执行：ENTRYPOINT + CMD
- `
ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["node","server.js"]
` ->  /usr/bin/tini -- node server.js
- 如果没有 tini PID1 = node，如果使用 tini，PID1 = tini，PID2 = node server.js
- 推荐结构：tini (PID1)
     └── node server.js

