# ===== 1. 构建阶段 =====
# 优化 Dockerfile（先复制 lockfile、用 pnpm/pip 的 frozen install），让依赖成为单独层
FROM node:20-alpine AS builder
WORKDIR /app
# 启用 corepack，确保可以使用 pnpm
RUN corepack enable
# 只复制 package & lockfile —— 这样只要 lockfile 不变，下面这层会被缓存
COPY pnpm-lock.yaml package.json ./
RUN pnpm config set registry https://registry.npmmirror.com \
  && pnpm install --frozen-lockfile
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

# 如果你使用 standalone 模式（Next.js 12+），可以进一步瘦身：
# 会生成 .next/standalone/，其中已包含运行所需的代码和依赖。
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
# 如果有 .env.production，也复制进去（可选）
# COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3000
CMD ["pnpm", "start"]
