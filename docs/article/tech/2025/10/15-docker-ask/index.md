# Docker 常见问题
## windows 不能直接安装docker
- 严格来说，Windows 本身不能直接像在 Linux 上那样原生安装 Docker Engine，
- 原因是 Docker Engine 依赖 Linux 内核特性（cgroups、namespace 等），而 Windows 内核不支持这些。
- WSL2 + Docker Engine（开源免费）
  - 在 Windows 上启用 WSL2（轻量 Linux 内核）
  - Docker Engine 安装在 WSL2 的 Linux 发行版里
  - Windows 可通过命令行调用 Docker
```bash
# 安装 WSL2 默认会安装 Ubuntu 发行版
wsl --install
# 确认 WSL 版本为 2：
wsl --list --verbose
# 如果不是
wsl --set-version Ubuntu-22.04 2
```
```bash
# 打开 WSL Ubuntu 终端：
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
# 测试
docker --version
docker run hello-world
```
## 删除 docker 镜像
```bash
docker rmi <image_id>
```
- 问题：遇到 unable to delete image_id (must be forced) - image is referenced in multiple repositorie
- 原因：多个仓库（repository/tag）引用着，因此 Docker 不允许直接删除

- 方法一：
```bash
# 强制删除
docker rmi -f <image_id>
```
- 方法二：
```bash
# 先查看引用情况
docker images -a | grep <image_id>
# myapp:latest        fb7129778e26
# myapp:v1.0          fb7129778e26
# 逐个删除引用
docker rmi myapp:latest
docker rmi myapp:v1.0
# 然后再删镜像：
docker rmi <image_id>
```
- 方法三：
```bash
# 如果镜像还有容器依赖，也可能导致冲突。
# 检查引用镜像的容器
docker ps -a --filter "ancestor=<image_id>"
# 如果有容器在运行或存在，先删除容器
docker rm -f <container_id>
# 再执行
docker rmi <image_id>
```
## 清除无用镜像
```bash
# 清理 <none> 镜像 需要确认
docker image prune
# 清理 <none> 镜像 不需要确认
docker image prune -f
# 删除所有未被容器使用的镜像(有tag 和 <none>) 需要确认
docker image prune -a
# 清除 镜像 + 容器 + 网络 + build cache 不需要确认
# 清理 <none> 镜像
# 删除未使用镜像
# 删除停止容器、无用网络、build缓存
docker system prune -f
# 清理 volumes
docker volume prune -f
```
## “同名 + 同标签”镜像的行为
- 如果本地已经存在一个名为 image-name:latest 的镜像，
- Docker 再次构建同名+同标签镜像 `docker build -t image-name:latest .`
- 自动覆盖旧的 tag 指向，旧的镜像本身仍然存在（以镜像 ID 区分），
- 但 latest 这个标签会被重新绑定到新的镜像 ID，
- 标签只是一个“指针”，新构建的镜像不会真正删除旧镜像，只是“latest”这个名字被移动了。
## Docker Hub（registry-1.docker.io）无法访问
- 镜像源无法访问：增加镜像源
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    # 支持阿里云服务器
    # https://cr.console.aliyun.com/cn-chengdu/instances/mirrors 找到镜像加速器
    "https://xxxxx.mirror.aliyuncs.com"
    "https://docker.m.daocloud.io",
    "https://mirror.ccs.tencentyun.com",
    "https://docker.nju.edu.cn",
    "https://dockerproxy.cn"
  ]
}
EOF
# 重启 Docker
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart docker
```
- 还有可能是dns的问题
- 另外可以使用更可靠的镜像源:名称映射 [public-image-mirror](https://github.com/DaoCloud/public-image-mirror)
```bash
docker run -d -P m.daocloud.io/docker.io/library/nginx
```
## 磁盘空间不足 `ERR_CONTENT_LENGTH_MISMATCH`
- 报错 GET https://www.xxxx.com/static/js/2.eda3eeaf.chunk.js net::ERR_CONTENT_LENGTH_MISMATCH 200 (OK)
- nginx 排查
```bash
tail -n 100 -f /var/log/nginx/error.log
# `No space left on device` -> 磁盘空间不足
```
- docker 排查
```bash
docker system df
# TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
# Images          21        12        2.75GB    1.038GB (37%)
# Containers      12        10        22.8MB    22.79MB (99%)
# Local Volumes   107       1         4.921GB   4.921GB (100%)
# Build Cache     0         0         0B        0B
```
- 查看磁盘空间
```bash
df -h -> use 100%
```
- 处理
  - 1、none docker  批量删除
    - docker rmi $(docker images | grep "none" |awk '{print $3}')
  - 2、[prune 清除](./#清除无用镜像)
## 进入docker
```bash
docker exec -it your_container_name /bin/sh
```
## 环境变量
- 运行容器时手动设置（可覆盖 Dockerfile 环境变量）
```bash
docker run -e APP_ENV=production myapp
```
| 设置方式                       | 优先级    |
| -------------------------- | ------ |
| docker run `-e`            | ✅最高    |
| docker-compose environment | ✅中     |
| Dockerfile `ENV`           | ✅默认/最低 |

## 查看docker volumes

- 列出所有 volume
```bash
docker volume ls
```
输出类似：
```bash
DRIVER    VOLUME NAME
local     db_data
```
- 查看 volume 的挂载路径
```bash
docker volume inspect db_data
```
输出类似：这里的 Mountpoint 就是宿主机上实际存储的目录。
```bash
[
    {
        "Name": "db_data",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/db_data/_data",
        ...
    }
]
```
- 进入 volume 目录
```bash
ls /var/lib/docker/volumes/db_data/_data
```
## 查看docker network
```bash
tail -n 100 -f /var/log/nginx/error.log
# 目的：先从入口（Nginx）确认是网络/转发问题，还是上游应用自身 5xx。
# 结论：如果出现 connect() failed / timeout / 502，多半是上游进程没起来、端口不通或容器不健康；
#       如果只是看到上游返回 500，需要继续看容器应用日志拿到 Python 堆栈。

docker ps -a | grep 18e853abb0aa
# 目的：确认容器是否存在、状态是否 Up/Exited、是否频繁重启（CrashLoop）。
# 结论：如果容器不断 Exited/重启，优先怀疑镜像/依赖/启动命令而不是 Nginx 配置。

docker logs 18e853abb0aa
# 目的：读取容器 stdout/stderr，拿到应用侧完整异常堆栈。
# 结论：若看到 `ModuleNotFoundError: No module named 'langchain_core'`，基本可定位为容器运行时 Python 环境 import 不到该模块。

docker exec -it 18e853abb0aa bash -c "pip list | grep langchain_core"
# 目的：进入容器检查依赖是否安装。
# 注意：`pip` 不一定等同于应用实际使用的解释器环境（多 Python/venv/路径差异），所以该结果不足以单独闭环。
# 建议补充“一锤定音”（同一解释器验证 pip + import）：
#   python -V
#   python -m pip -V
#   python -m pip list | grep -E "langchain|langchain-core|langchain_core" || true
#   python -c "import langchain_core; print(langchain_core.__file__)"

docker stop 18e853abb0aa
# 目的：停止异常容器，避免持续重启/占用端口，便于做对照排查。

docker run -it --rm --entrypoint bash english-server:latest -c "sleep 300"
# 目的：用同一镜像起一个“不会立刻跑应用”的容器，留时间 300s进入镜像内部检查环境（依赖、解释器路径、入口脚本等）。
# 价值：避免应用一启动就崩导致来不及 exec 进去排查。
```