# Docker use
## 原理
### windows
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
## 常用场景
### 删除 docker 镜像
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
### 清除无用镜像
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
### “同名 + 同标签”镜像的行为
- 如果本地已经存在一个名为 image-name:latest 的镜像，
- Docker 再次构建同名+同标签镜像 `docker build -t image-name:latest .`
- 自动覆盖旧的 tag 指向，旧的镜像本身仍然存在（以镜像 ID 区分），
- 但 latest 这个标签会被重新绑定到新的镜像 ID，
- 标签只是一个“指针”，新构建的镜像不会真正删除旧镜像，只是“latest”这个名字被移动了。
### Docker Hub（registry-1.docker.io）无法访问
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
### 磁盘空间不足 `ERR_CONTENT_LENGTH_MISMATCH`
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
### 进入docker
```bash
docker exec -it your_container_name /bin/sh
```
