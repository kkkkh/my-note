# Dockfile
## 原理
### Docker 层缓存
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
```
- 原理：
  - 在 Dockerfile 中，每条 RUN、COPY 等指令都会形成一层（layer）
  - 如果上层指令的内容没变（这里是 COPY requirements.txt ./），Docker 就会 直接复用该层缓存，不会重新执行 RUN pip install
  - 复用的是 整层的结果，也就是 site-packages 已经安装好了。
  - 如果 requirements.txt 发生变化 → Docker 认为上一层缓存失效 → RUN pip install 会重新执行，重新下载/安装所有依赖
- 应用：
  - 分层 COPY：
  - 先 COPY lock 文件（如 requirements.txt/pnpm-lock.yaml）
  - RUN 安装依赖
  - 再 COPY 源码
  - 这样源码改动不会触发依赖重新安装，提高构建效率
### --no-cache-dir使用
| 情况                  | Docker 层缓存 | pip 自己缓存                         | 结果                           |
| ------------------- |------------------------------ | ---------------------- | ---------------------------- |
| 不用 `--no-cache-dir` | 如果 requirements.txt 没变，Docker 层缓存命中 → 不会重新 pip install；如果 Docker 构建上下文或指令变化，Docker 会重新执行 pip install，此时 pip 会先尝试用 `/root/.cache/pip` 的缓存包 | pip 会把下载文件保存在 `/root/.cache/pip` | 构建速度更快，镜像稍大|
| 用 `--no-cache-dir`  | Docker 层缓存命中 → 不会执行 pip install；Docker 重新执行 pip install → pip 不用缓存，每次都重新下载 | pip 不保存下载文件 | 构建镜像更小，但如果 Docker 层失效，每次重新下载 |
## 常见配置
- nextjs.Dockerfile
::: details 查看代码
<<< ./Dockerfile/nextjs.Dockerfile{dockerfile}
:::
- python.Dockerfile
::: details 查看代码
<<< ./Dockerfile/python.Dockerfile{dockerfile}
:::
## .dockerignore
### 常见配置
- nextjs dockerignore
::: details 查看代码
<<< ./.dockerignore/nextjs/.dockerignore{bash}
:::
- python dockerignore
::: details 查看代码
<<< ./.dockerignore/python/.dockerignore{bash}
:::