# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# 指定 pnpm store 目录并使用 BuildKit cache
RUN corepack enable && pnpm config set store-dir /root/.pnpm-store
# 这里使用 cache mount：缓存会保存在 BuildKit 管理的缓存中
RUN --mount=type=cache,target=/root/.pnpm-store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build


# syntax=docker/dockerfile:1.4
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
# 使用 BuildKit cache
RUN --mount=type=cache,target=/root/.cache/pip pip install --no-cache-dir -r requirements.txt
COPY . .
