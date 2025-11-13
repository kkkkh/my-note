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
- 不一定非得手动设置 networks
  - 如果你有多个 Compose 项目或外部容器，需要把它们放到同一个自定义网络里。
  - 需要更复杂的网络隔离或指定子网。
  ```yml
  version: "3"
  services:
    web:
      image: my-web-app
      networks:
        - mynet
      depends_on:
        - redis
    redis:
      image: redis:7
      networks:
        - mynet

  networks:
    mynet:
      driver: bridge
  ```
- 例如：
  - my_server 连接 my_redis，同一 Docker Compose 里
  - 不应该用宿主机端口9000，而应该用 容器名称和容器内部端口 6379
  - `r = redis.Redis(host='my_redis', port=6379, password='你的密码')`
  - 如果你在宿主机上访问 Redis，可以用：`r = redis.Redis(host='127.0.0.1', port=9003, password='...')`
::: details 查看代码
<<< ./docker-compose/docker-compose.build.yml#redis
:::
### 顶层 volumes
- 顶层 volumes 主要用于 命名卷的声明和配置，以及外部卷（external）且必须声指定 external: true
  - 需要多个服务共享数据。
  - 不想依赖宿主机目录，或者想让 Docker 来管理存储位置。
  - 命令式操作
  ```bash
  docker volume create sqlite_data
  ```
  ```bash
  docker run -d \
    -v sqlite_data:/app/db \
    -p 8000:8000 \
    --name myapp \
    myapp:latest
  ```
- 在services中一个具体的服务，volumes主要用：绑定挂载（bind mount）
  - ✅ 优点：热更新方便，路径清晰。
  - ❌ 缺点：路径硬编码，依赖宿主机目录存在；如果想在多个环境（dev/prod）共享卷或管理更灵活，bind mount 就不太方便。
::: details 查看代码
<<< ./docker-compose/docker-compose.build.yml
:::
#### 顶层 volumes 作用
- 声明命名卷（Named Volume）：告诉 Docker Compose 这个卷的名字是什么，可以被多个服务共享。
例如：
```yaml
volumes:
  mydata:
```
- 配置卷驱动（Driver）默认使用 local 驱动：可以指定其他卷驱动（如 nfs、local-persist、云存储卷插件等）。
例如：
```yaml
volumes:
  mydata:
    driver: local
```
- 设置卷的挂载选项（Driver Options）：你可以指定路径、权限、缓存策略等。
```yaml
volumes:
  mydata:
    driver: local
    driver_opts:
      type: none
      device: /path/on/host
      o: bind
```
- 声明外部卷（External Volume）：用于已有卷，而不是让 Compose 自动创建。
- 适合多项目共享同一卷，或使用集群/云环境中的已有存储。
```yaml
volumes:
  existing_volume:
    external: true
```
#### 顶层 volumes 使用场景
- 需要多个服务共享数据：比如数据库和备份服务共享数据目录
```yaml
services:
  db:
    image: postgres
    volumes:
      - db_data:/var/lib/postgresql/data
  backup:
    image: some-backup-tool
    volumes:
      - db_data:/backup
volumes:
  db_data:
```
- 需要指定卷驱动或挂载选项：比如使用 NFS 或自定义驱动
```yaml
volumes:
  nfs_data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=10.0.0.1,rw
      device: ":/exported/path"
```
- 使用已有卷（external）：避免 Docker Compose 重建卷覆盖数据
```yaml
volumes:
  production_db:
    external: true
```
- 保持项目可读性和可维护性：顶层声明命名卷让其他开发者一眼就知道有哪些卷，而不是分散在各服务里。
### v1、v2 区别
```bash
# Docker Compose V1
docker-compose -f docker-compose.yml build server
# Docker Compose V2
docker compose -f docker-compose.yml build server
docker compose --file docker-compose.yml build server
```
