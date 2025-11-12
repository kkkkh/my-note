# docker compose
## 基础
### 特点
- 适用
  - 镜像已发布好，直接从镜像源批量拉取，生成实例
  - 批量构建镜像，生成实例
- 不足
  - 在drone中，如果执行docker-compose，那么只需要一个step执行
### 常用命令
```bash
# 指定要使用的 Compose 文件
docker compose -f docker-compose.yml

# 构建镜像 启动镜像
docker compose build web # 仅构建镜像，不启动容器
docker compose build --no-cache # 强制重新构建（忽略缓存）

# build 只构建镜像，不会动容器；up 才会处理新旧容器替换。
docker compose up # 如果镜像存在（名称和标签匹配），直接用现成的
docker compose up --build # 强制重新构建镜像，如果镜像变则重建容器，否则不创建
docker-compose up --force-recreate # 强制重新创建容器，
# 创建并启动所有定义的容器
# 在后台运行（detached 模式）
# 移除上次运行时存在但当前 Compose 文件中已被删除的服务容器（孤儿容器）
docker compose up -d --remove-orphans

# 停止服务
docker compose -f docker-compose.prod.yml down

# 拉取镜像
docker compose -f docker-compose.prod.yml pull

# 使用多个docker-compose文件
docker compose -f docker-compose.yml -f docker-compose.override.yml pull

# 版本
docker compose version

#查看容器状态
docker compose ps

# help
docker compose --help


```
### 配置文件
- 镜像仓库拉取：本地镜像、mongdb、redis
::: details 查看代码
<<< ./docker-compose/docker-compose.yml
:::
- 镜像仓库拉取：阿里云镜像
::: details 查看代码
<<< ./docker-compose/docker-compose.deploy.yml
:::
## 常见问题
### 容器之间访问
- 在默认情况下，Docker Compose 会把同一个 docker-compose.yml 下的服务放到同一个 自定义网络里，可以通过 容器名互相访问。
- 例如：
  - my_server 连接 my_redis，同一 Docker Compose 里
  - 不应该用宿主机端口9000，而应该用 容器名称和容器内部端口 6379
  - `r = redis.Redis(host='my_redis', port=6379, password='你的密码')`
  - 如果你在宿主机上访问 Redis，可以用：`r = redis.Redis(host='127.0.0.1', port=9003, password='...')`
::: details 查看代码
<<< ./docker-compose/docker-compose.build.yml
:::
### v1、v2 区别
```bash
# Docker Compose V1
docker-compose -f docker-compose.yml build server
# Docker Compose V2
docker compose -f docker-compose.yml build server
docker compose --file docker-compose.yml build server
```
