# Docker use
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
```
### “同名 + 同标签”镜像的行为
- 如果本地已经存在一个名为 image-name:latest 的镜像，
- Docker 再次构建同名+同标签镜像 `docker build -t image-name:latest .`
- 自动覆盖旧的 tag 指向，旧的镜像本身仍然存在（以镜像 ID 区分），
- 但 latest 这个标签会被重新绑定到新的镜像 ID，
- 标签只是一个“指针”，新构建的镜像不会真正删除旧镜像，只是“latest”这个名字被移动了。
