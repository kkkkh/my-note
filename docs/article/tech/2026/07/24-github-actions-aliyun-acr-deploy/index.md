---
title: 从服务器本地构建迁移到 GitHub Actions + 阿里云 ACR
日期: 2026-07-24
date: 2026-07-24
tags:
  - Ops
  - Docker
---

# 【Docker】从服务器本地构建迁移到 GitHub Actions + 阿里云 ACR

最初的部署流程是：代码推送后，由云服务器上的 CI 直接执行 `docker build`，再用新镜像替换线上容器。

这套方案一开始足够简单，但它把源码拉取、依赖安装、基础镜像下载、应用构建和线上部署全部压在同一台服务器上。随着国内 Docker Hub 访问和公共镜像代理越来越不稳定，构建开始频繁出现超时、代理返回 500、镜像层不完整和 BuildKit 缓存锁冲突。

最终将流程调整为：

```text
GitHub Actions
  → 构建 Docker 镜像
  → 推送到阿里云 ACR
  → 临时开放 ECS 的 SSH 入口
  → ECS 只从 ACR 拉取最终镜像
  → 健康检查后替换线上容器
  → 删除临时 SSH 规则
```

这次改造的核心不是简单替换 CI 工具，而是把**镜像构建从生产服务器移走**。

## 一、为什么不再让生产服务器构建镜像

服务器本地构建通常依赖以下环节：

```text
Git 仓库
Docker Hub 或镜像代理
npm Registry
BuildKit 缓存
服务器 CPU、内存和磁盘
```

其中任意一个环节不稳定，部署就会失败。

实际遇到的问题主要集中在基础镜像下载：

```text
镜像代理返回 HTTP 500
直接访问 Docker Hub 超时
代理只有 manifest，没有完整 blob
并发构建导致 BuildKit 缓存被锁
```

继续增加镜像代理只能缓解问题，不能保证代理缓存长期完整，也不能消除生产服务器承担构建任务带来的资源竞争。

更合理的职责划分是：

```text
GitHub Runner：负责构建
阿里云 ACR：负责保存产物
ECS：只负责拉取和运行
```

这样 ECS 部署时不再访问 Docker Hub，也不再需要安装 Node.js、pnpm 或项目源码。

## 二、最终部署架构

完整链路如下：

```text
push main
  → GitHub Actions 检出代码
  → Docker Buildx 构建镜像
  → 推送 latest 和 commit SHA 标签到 ACR
  → 获取当前 Runner 公网 IPv4
  → 通过阿里云 API 临时放行该 IP/32 访问 22 端口
  → SSH 登录 ECS
  → ECS 按 digest 拉取本次镜像
  → 启动临时容器做 HTTP 检查
  → 替换正式容器
  → 失败时恢复旧镜像
  → 回收临时安全组规则
```

部署阶段使用本次构建输出的镜像 digest：

```text
registry.example.com/namespace/app@sha256:...
```

而不是只依赖 `latest`。

`latest` 适合人工查看，digest 才能保证部署的就是当前工作流刚刚构建的不可变镜像。

## 三、固定 pnpm 版本，保证构建可复现

迁移到 GitHub Actions 后，依赖安装阶段曾出现：

```text
ERR_PNPM_IGNORED_BUILDS
Ignored build scripts: esbuild, sharp, @parcel/watcher
```

最初容易误判为 npm 镜像问题，但依赖其实已经下载完成。真正原因是 Dockerfile 使用了：

```dockerfile
RUN corepack enable && corepack prepare pnpm@latest --activate
```

`pnpm@latest` 会随着时间变化。即使代码和锁文件没有改动，某一天 CI 也可能因为 pnpm 升级、依赖安装脚本策略改变而突然失败。

解决方式是在项目和 Dockerfile 中同时固定版本：

```json
{
  "packageManager": "pnpm@9.5.0"
}
```

```dockerfile
RUN corepack enable && corepack prepare pnpm@9.5.0 --activate
RUN pnpm install --frozen-lockfile
```

构建从国内服务器转移到 GitHub Runner 后，也不再需要在 Dockerfile 中强制指定国内 npm 镜像。

这里修复的本质是：**保证本地、CI 和 Docker 构建使用同一个包管理器版本**。

## 四、构建并推送到 ACR

GitHub Actions 中的构建 job 主要完成四件事：

```text
检出代码
登录 ACR
构建镜像
推送镜像并输出 digest
```

镜像同时推送两个标签：

```text
app:latest
app:<完整 commit SHA>
```

构建时启用 GitHub Actions Cache，可以复用依赖层和构建层，减少后续部署时间：

```yaml
cache-from: type=gha,scope=app-image
cache-to: type=gha,mode=max,scope=app-image
```

服务器端不再执行 `docker build`，只需要：

```bash
docker login <ACR 域名>
docker pull <镜像 digest>
docker run <镜像 digest>
```

## 五、部署前预检，失败时自动回滚

直接删除旧容器再启动新容器风险很高。新镜像即使成功构建，也可能因为 Nginx 配置、端口、静态产物或运行参数错误而无法正常提供服务。

因此部署分为两步。

第一步，使用新镜像启动一个只监听本机的候选容器：

```text
容器名：app-check
地址：127.0.0.1:19000
```

只有候选容器的 HTTP 检查通过，才停止正式容器。

第二步，替换正式容器并再次检查：

```text
旧容器运行
  → 候选容器检查成功
  → 记录旧镜像 ID
  → 停止旧容器
  → 启动新容器
  → 正式端口检查
```

替换前记录旧镜像 ID：

```bash
PREVIOUS_IMAGE_ID="$(
  docker inspect -f '{{.Image}}' app 2>/dev/null || true
)"
```

新容器启动失败或正式端口检查失败时，重新使用旧镜像启动容器。

这样，构建失败、推送失败、拉取失败和候选容器检查失败，都不会影响正在运行的旧服务。

## 六、GitHub Actions 没有固定出口 IP

ECS 的 SSH 入口通常只允许白名单 IP，而 GitHub 托管 Runner 没有固定出口地址。

一种做法是把 GitHub 公布的大量 Azure 网段全部加入安全组，但这些网段数量多、会变化，也扩大了 SSH 暴露面。

最终采用动态放行方案：

```text
获取本次 Runner 公网 IPv4
  → 临时添加 IP/32 安全组规则
  → 执行 SSH 部署
  → 无论部署成功或失败都删除该规则
```

获取并验证当前 Runner IPv4：

```bash
RUNNER_IP="$(curl -4 -fsSL https://api.ipify.org)"

python3 - "$RUNNER_IP" <<'PY'
import ipaddress
import sys

address = ipaddress.ip_address(sys.argv[1])
if address.version != 4:
    raise SystemExit(f"Expected IPv4 address, got: {address}")
PY
```

最终传给安全组的是：

```text
203.0.113.10/32
```

只放行当前这一个 Runner。

## 七、使用 RAM 最小权限管理安全组

不应把阿里云主账号 AccessKey 放进 GitHub Secrets。

可以创建一个专门的 RAM 用户，只授予增加和删除安全组入方向规则的权限：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:AuthorizeSecurityGroup",
        "ecs:RevokeSecurityGroup"
      ],
      "Resource": "*"
    }
  ]
}
```

工作流所需的 Secrets：

```text
ACR_USERNAME
ACR_PASSWORD

ECS_HOST
ECS_USER
ECS_SSH_PRIVATE_KEY
ECS_KNOWN_HOSTS

ALIBABA_CLOUD_ACCESS_KEY_ID
ALIBABA_CLOUD_ACCESS_KEY_SECRET
ALIYUN_SECURITY_GROUP_ID
```

其中 SSH 私钥建议为 GitHub Actions 单独生成，不要与开发机或其他 CI 系统复用。

## 八、阿里云 CLI 的 Region 参数有两层

第一次调用安全组接口时出现：

```text
ERROR: region can't be empty
Configuration failed, use `aliyun configure` to configure it
```

命令中明明已经传了：

```bash
--RegionId cn-region-id
```

但阿里云 CLI 仍然认为 region 为空。

原因是这里存在两层参数：

```text
--region
CLI 全局参数，用于确定请求 endpoint

--RegionId
ECS API 自身的业务参数
```

因此需要同时传入：

```bash
aliyun ecs AuthorizeSecurityGroup \
  --region "$ALIYUN_REGION" \
  --RegionId "$ALIYUN_REGION" \
  ...
```

删除安全组规则时也一样。

这个问题比较隐蔽：环境变量和 `--RegionId` 看起来都已经存在，但 CLI 在真正调用 ECS API 前，仍需要全局 `--region` 来确定 endpoint。

## 九、最终脱敏部署脚本

下面是一份完整的 GitHub Actions 工作流示例。仓库地址、镜像名称、地域、端口和账号信息都已脱敏，并在关键位置增加了注释。

```yaml
name: Build and deploy application

on:
  push:
    branches:
      - main
  # 允许在 GitHub Actions 页面手动执行
  workflow_dispatch:

# 工作流只需要读取仓库内容
permissions:
  contents: read

# 防止两个生产部署同时替换同一个容器
concurrency:
  group: production-deploy
  cancel-in-progress: false

env:
  # 替换为自己的 ACR Registry 域名，不要包含命名空间和镜像名
  REGISTRY: registry-id.region.personal.cr.aliyuncs.com

  # 替换为 ACR 中的命名空间/镜像仓库
  IMAGE_NAME: namespace/application

  # 替换为 ECS 和安全组所在地域
  ALIYUN_REGION: cn-region-id

  # 阿里云 CLI 也支持从该环境变量读取默认地域
  ALIBABA_CLOUD_REGION_ID: cn-region-id

jobs:
  build:
    name: Build and push image
    runs-on: ubuntu-latest
    timeout-minutes: 30

    # 将 build-push-action 输出的 digest 交给 deploy job
    outputs:
      digest: ${{ steps.build.outputs.digest }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          # 项目没有 submodule 时可以删除这一项
          submodules: recursive
          fetch-depth: 1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Aliyun ACR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and push image
        id: build
        uses: docker/build-push-action@v6
        with:
          # monorepo 通常使用仓库根目录作为构建上下文
          context: .

          # 按实际项目路径修改
          file: apps/web/Dockerfile

          # ECS 是 x86_64 时使用 linux/amd64
          platforms: linux/amd64
          push: true
          pull: true

          # 不生成额外 provenance manifest，简化个人 ACR 镜像结构
          provenance: false

          # latest 用于人工查看；commit SHA 用于版本追踪
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

          # 使用 GitHub Actions Cache 缓存构建层
          cache-from: type=gha,scope=application-image
          cache-to: type=gha,mode=max,scope=application-image

  deploy:
    name: Deploy image to ECS
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs:
      - build

    steps:
      - name: Install Alibaba Cloud CLI
        run: |
          set -Eeuo pipefail

          # 安装阿里云 CLI 和 ECS 插件
          /bin/bash -c "$(curl -fsSL https://aliyuncli.alicdn.com/install.sh)"
          aliyun version
          aliyun plugin install --name ecs

      - name: Get runner public IPv4
        id: runner-ip
        run: |
          set -Eeuo pipefail

          # 获取当前 GitHub Runner 的公网 IPv4
          RUNNER_IP="$(curl -4 -fsSL https://api.ipify.org)"

          # 验证返回值，避免接口异常返回 HTML 或 IPv6
          python3 - "$RUNNER_IP" <<'PY'
          import ipaddress
          import sys

          address = ipaddress.ip_address(sys.argv[1])
          if address.version != 4:
              raise SystemExit(f"Expected IPv4 address, got: {address}")
          PY

          echo "ip=$RUNNER_IP" >> "$GITHUB_OUTPUT"
          echo "cidr=$RUNNER_IP/32" >> "$GITHUB_OUTPUT"
          echo "Runner IPv4: $RUNNER_IP"

      - name: Temporarily allow runner SSH access
        id: allow-ssh
        env:
          # 专用 RAM 用户的 AccessKey
          ALIBABA_CLOUD_ACCESS_KEY_ID: ${{ secrets.ALIBABA_CLOUD_ACCESS_KEY_ID }}
          ALIBABA_CLOUD_ACCESS_KEY_SECRET: ${{ secrets.ALIBABA_CLOUD_ACCESS_KEY_SECRET }}

          SECURITY_GROUP_ID: ${{ secrets.ALIYUN_SECURITY_GROUP_ID }}
          RUNNER_CIDR: ${{ steps.runner-ip.outputs.cidr }}
        run: |
          set -Eeuo pipefail

          RULE_DESCRIPTION="github-actions-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"

          # --region 是 CLI 全局参数
          # --RegionId 是 ECS API 参数，两者都要传
          aliyun ecs AuthorizeSecurityGroup \
            --region "$ALIYUN_REGION" \
            --RegionId "$ALIYUN_REGION" \
            --SecurityGroupId "$SECURITY_GROUP_ID" \
            --IpProtocol tcp \
            --PortRange 22/22 \
            --SourceCidrIp "$RUNNER_CIDR" \
            --Policy accept \
            --Priority 1 \
            --Description "$RULE_DESCRIPTION"

          echo "Temporarily allowed SSH from $RUNNER_CIDR"

      - name: Wait for SSH rule propagation
        env:
          ECS_HOST: ${{ secrets.ECS_HOST }}
        run: |
          set -Eeuo pipefail

          # 安全组规则写入后可能需要几秒钟生效
          for attempt in $(seq 1 20); do
            if timeout 3 bash -c "</dev/tcp/${ECS_HOST}/22" 2>/dev/null; then
              echo "SSH port is reachable"
              exit 0
            fi

            echo "Waiting for SSH rule propagation ($attempt/20)..."
            sleep 3
          done

          echo "SSH port did not become reachable"
          exit 1

      - name: Configure SSH
        env:
          ECS_SSH_PRIVATE_KEY: ${{ secrets.ECS_SSH_PRIVATE_KEY }}
          ECS_KNOWN_HOSTS: ${{ secrets.ECS_KNOWN_HOSTS }}
        run: |
          set -Eeuo pipefail

          install -m 700 -d ~/.ssh

          # tr -d '\r' 用于兼容从 Windows 复制进 Secret 的换行符
          printf '%s\n' "$ECS_SSH_PRIVATE_KEY" \
            | tr -d '\r' \
            > ~/.ssh/id_deploy
          chmod 600 ~/.ssh/id_deploy

          printf '%s\n' "$ECS_KNOWN_HOSTS" \
            | tr -d '\r' \
            > ~/.ssh/known_hosts
          chmod 600 ~/.ssh/known_hosts

      - name: Log in to ACR on ECS
        env:
          ECS_HOST: ${{ secrets.ECS_HOST }}
          ECS_USER: ${{ secrets.ECS_USER }}
          ACR_USERNAME: ${{ secrets.ACR_USERNAME }}
          ACR_PASSWORD: ${{ secrets.ACR_PASSWORD }}
        run: |
          set -Eeuo pipefail

          # ECS 只登录 ACR，不再访问 Docker Hub
          printf '%s' "$ACR_PASSWORD" |
            ssh -i ~/.ssh/id_deploy "$ECS_USER@$ECS_HOST" \
              "docker login '${{ env.REGISTRY }}' \
                --username '$ACR_USERNAME' \
                --password-stdin"

      - name: Pull, verify, and deploy image
        env:
          ECS_HOST: ${{ secrets.ECS_HOST }}
          ECS_USER: ${{ secrets.ECS_USER }}

          # 使用本次构建输出的不可变 digest，而不是 latest
          IMAGE_REF: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}@${{ needs.build.outputs.digest }}
          COMMIT_SHA: ${{ github.sha }}
        run: |
          set -Eeuo pipefail

          ssh -i ~/.ssh/id_deploy "$ECS_USER@$ECS_HOST" \
            "IMAGE_REF='$IMAGE_REF' COMMIT_SHA='$COMMIT_SHA' bash -s" \
            <<'REMOTE'
          set -Eeuo pipefail

          # 按实际服务修改这些值
          CONTAINER_NAME="application"
          CHECK_CONTAINER="application-check"
          PUBLIC_PORT="9000"
          CHECK_PORT="19000"

          check_url() {
            local url="$1"

            if command -v curl >/dev/null 2>&1; then
              curl -fsS "$url" >/dev/null
            elif command -v wget >/dev/null 2>&1; then
              wget -qO- "$url" >/dev/null
            else
              echo "curl or wget is required on the ECS host"
              return 1
            fi
          }

          wait_for_http() {
            local url="$1"

            # 最多等待约 30 秒
            for _ in $(seq 1 15); do
              if check_url "$url"; then
                return 0
              fi
              sleep 2
            done

            return 1
          }

          rollback() {
            docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

            if [ -n "${PREVIOUS_IMAGE_ID:-}" ]; then
              echo "Rolling back to $PREVIOUS_IMAGE_ID"

              docker run -d \
                --name "$CONTAINER_NAME" \
                --restart=always \
                -p "${PUBLIC_PORT}:80" \
                "$PREVIOUS_IMAGE_ID"
            else
              echo "No previous image is available for rollback"
            fi
          }

          echo "Pulling $IMAGE_REF"
          docker pull "$IMAGE_REF"

          # 清理上次异常退出可能残留的候选容器
          docker rm -f "$CHECK_CONTAINER" 2>/dev/null || true

          # 先启动候选容器，只监听服务器本机
          docker run -d \
            --name "$CHECK_CONTAINER" \
            -p "127.0.0.1:${CHECK_PORT}:80" \
            "$IMAGE_REF"

          if ! wait_for_http "http://127.0.0.1:${CHECK_PORT}/"; then
            docker logs "$CHECK_CONTAINER" || true
            docker rm -f "$CHECK_CONTAINER" 2>/dev/null || true
            echo "Candidate container health check failed"
            exit 1
          fi

          docker rm -f "$CHECK_CONTAINER"

          # 保存正式容器当前使用的镜像 ID，供失败时回滚
          PREVIOUS_IMAGE_ID="$(
            docker inspect \
              -f '{{.Image}}' \
              "$CONTAINER_NAME" \
              2>/dev/null || true
          )"

          docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

          # 启动正式新容器
          if ! docker run -d \
            --name "$CONTAINER_NAME" \
            --restart=always \
            --label "deployment.commit=$COMMIT_SHA" \
            -p "${PUBLIC_PORT}:80" \
            "$IMAGE_REF"; then
            rollback
            exit 1
          fi

          # 正式端口再次检查，失败则恢复旧镜像
          if ! wait_for_http "http://127.0.0.1:${PUBLIC_PORT}/"; then
            docker logs "$CONTAINER_NAME" || true
            rollback
            exit 1
          fi

          # 只清理悬空镜像，不删除正在使用的镜像
          docker image prune -f

          echo "Deployment succeeded: $COMMIT_SHA"
          REMOTE

      - name: Revoke temporary SSH access
        # 后续步骤失败时也执行，但只有放行成功后才尝试删除
        if: always() && steps.allow-ssh.outcome == 'success'
        env:
          ALIBABA_CLOUD_ACCESS_KEY_ID: ${{ secrets.ALIBABA_CLOUD_ACCESS_KEY_ID }}
          ALIBABA_CLOUD_ACCESS_KEY_SECRET: ${{ secrets.ALIBABA_CLOUD_ACCESS_KEY_SECRET }}
          SECURITY_GROUP_ID: ${{ secrets.ALIYUN_SECURITY_GROUP_ID }}
          RUNNER_CIDR: ${{ steps.runner-ip.outputs.cidr }}
        run: |
          set -Eeuo pipefail

          # 删除与前面完全相同的临时入方向规则
          aliyun ecs RevokeSecurityGroup \
            --region "$ALIYUN_REGION" \
            --RegionId "$ALIYUN_REGION" \
            --SecurityGroupId "$SECURITY_GROUP_ID" \
            --IpProtocol tcp \
            --PortRange 22/22 \
            --SourceCidrIp "$RUNNER_CIDR" \
            --Policy accept \
            --Priority 1

          echo "Revoked temporary SSH access from $RUNNER_CIDR"
```

## 十、没有采用的方案

### 继续增加 Docker 镜像代理

只能缓解下载问题，无法保证代理缓存完整和长期可用，因此没有继续沿用服务器本地构建。

### 永久放行全部 GitHub Actions 网段

网段数量多且会变化，也扩大 SSH 暴露面，因此改为每次部署临时放行当前 Runner 的 `/32`。

### 构建和部署交给两套 CI 系统

技术上可行，但触发关系、Secrets、日志和失败重试会分散在两个系统中，最终由 GitHub Actions 完成构建、推送和部署。

### 直接用 `latest` 部署

`latest` 会被后续构建覆盖，无法准确判断线上版本，因此保留标签用于查看，实际部署使用 digest。

## 总结

这次改造完成了以下转变：

```text
生产服务器本地构建
  → GitHub Actions 云端构建

公共 Docker 镜像代理
  → 阿里云私有 ACR

latest 模糊部署
  → commit SHA + digest 精确部署

长期开放 SSH
  → Runner IP 临时放行

直接替换容器
  → 候选容器预检 + 失败回滚
```

当生产服务器只负责拉取和运行已经构建好的镜像后，部署链路更稳定，问题边界也更清晰：构建问题留在 CI，镜像版本留在 Registry，服务器只承担运行职责。
