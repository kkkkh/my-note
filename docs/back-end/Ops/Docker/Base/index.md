# Docker Base
## 镜像
```sh
#### pull 拉取镜像
docker pull ubuntu:18.04
# 相当于
docker pull registry.hub.docker.com/ubuntu:18.04  #从默认的注册服务器DockerHub Registry
#### images
#查看镜像
docker images
# REPOSITORY                  TAG       IMAGE ID       CREATED         SIZE
# drone/drone                 latest    2c093bf79fcb   8 months ago    50.8MB
# gitlab/gitlab-ce            latest    7b5584f94046   8 months ago    2.15GB
# drone/drone-runner-docker   latest    10fa1860657d   8 months ago    26.3MB
# drone/agent                 latest    7f3b68100bd5   22 months ago   19.4MB

# 为本地镜像打标签
docker tag ubuntu:latest myubuntu:latest # 镜像id完全一样，实际指向同一个镜像文件
# inspect 命令获取镜像详细信息
docker inspect myubuntu:latest
# 将列出各层的创建信息
docker history ubuntu:18.04
# 搜索
docker search --filter=is-official=true nginx
docker search --filter=stars=4 tensorflow
# 删除镜像
# 删除标签，如果标签多个，不删除镜像，如果只有一个则删除镜像
docker rmi myubuntu:latest
#当有该镜像创建的容器存在时，镜像文件默认是无法被删除的，可强制删除
docker rmi -f ubuntu:latest
# 推荐 先删除容器 再删除镜像
docker ps -a # 看到本机上存在的所有容器
docker rm a21c0840213e # 删除容器
docker rmi 8f1bd21bd25c # 删除镜像ID
# 命令会自动清理临时的遗留镜像文件层
docker image prune
#### 创建镜像
# - 1、基于已有容器创建
# 第一步 创建容器、并修改
docker run -it ubuntu:18.04 /bin/bash
root@a925cb40b3f0:/ touch test
root@a925cb40b3f0:/ exit
# 第二步 创建镜像
docker commit -m "Added a new file" -a "Docker Newbee" a925cb40b3f0 test:0.1
# - 2、基于本地模板导入
# - 3、基于Dockerfile创建
docker build -t ej/mds-webapp:deploy -f docker/Dockerfile . 
#### 存出和载入
# 将镜像导出为本地打包文件
docker save -o ubuntu.tar ubuntu
# 将打包镜像 导入本地镜像库
docker load -i ubuntu.tar
#### push
docker tag test:latest user/test:latest #user -> docker hub 用户id
docker push user/test:latest
#### login
docker login
# - docker_id
# - docker_password
```
## 容器
```bash
## 新建容器
docker create -it ubuntu:lastest
docker ps -a
# CONTAINER ID   IMAGE                     COMMAND             CREATED          STATUS
# ebf0da5d6414   kkkkh/myubuntu:1.0        "bash"              16 minutes ago   Up About a minute
## 启动容器
docker start ebf0da5d6414 # 容器id
# 创建并启动
docker run ubuntu   /bin/echo 'Hello world'
docker run -it ubuntu   /bin/bash
# 守护态运行
docker run -d ubuntu  /bin/sh -c "while true; do echo hello world; sleep 1; done"
# 查看容器日志
docker logs ebf0da5d6414
docker run --name test --rm -it ubuntu bash
# 暂停
docker pause test
# 停止
docker stop test
docker container prune # 清除掉所有处于停止状态的容器
#重启
docker start test
docker restart test #终止 再重启
# 进入容器
docker attach c8d3ae4e3155 #不推荐
docker exec -it c8d3ae4e3155 /bin/bash # /bin/bash 启动会bash 
# 删除
docker rm c8d3ae4e3155
docker rm -f c8d3ae4e3155 #强制删除
# 导出容器 -> 打包文件
docker export -o test.tar e71d3793258c
# 导入容器 -> 变成镜像
docker import test.tar test/ubuntu
#查看
docker container inspect e71d3793258c #查看容器详情
docker top e71d3793258c #查看容器进程
docker stats e71d3793258c #查看统计信息
#其他
docker cp 1.text e71:/tmp/ #主机文件拷贝到容器
docker container diff e71 #查看容器内文件系统的变更
docker container port e71 #查看容器端口映射
docker update --cpu-quota 1000000 e71 #限制CPU调度器CFS配额 1s
docker update --cpu-quota 1000000 e71 #占比10%
```
## 数据卷
```bash
# 创建数据卷
docker volumn create -d local test
# 查看/var/lib/docker/volumes路径下，会发现所创建的数据卷位置
ls -l /var/lib/docker/volumes
# 绑定数据卷  /webapp主机地址 /opt/webapp 容器地址
docker run -d -P --name web --mount type=bind,source=/webapp,destination=/opt/webapp training/webapp python app.py
docker run -d -P --name web -v /webapp:/opt/webapp training/webapp python app.py
# 数据卷容器
docker run -it -v /dbdata --name dbdata ubuntu
# 挂载
docker run -it --volumes-from dbdata --name db1 ubuntu
docker run -it --volumes-from dbdata --name db2 ubuntu
# 备份
docker run -itd -v /dbdata --name dbdata ubuntu
# 1、利用ubuntu镜像创建了一个容器worker
# 2、--volumes-from  dbdata worker容器挂载dbdata容器的数据卷
# 3、使用-v$(pwd):/backup参数来挂载本地的当前目录到worker容器的/backup目录
# 4、tar cvf /backup/backup.tar /dbdata  将/dbdata下内容备份为容器内的/backup/backup.tar
docker  run  -itd --volumes-from  dbdata  -v  $(pwd):/backup  --name  worker  ubuntu  tar cvf backup/backup.tar dbdata
ls
# 恢复
docker run -it -v /dbdata --name dbdata2 ubuntu /bin/bash
# tar xvf /backup/backup.tar 在容器当前目录，解压backup.tar 替换 dbdata（恢复）
docker run -itd --volumes-from dbdata2 -v $(pwd):/backup --name busybox ubuntu tar xvf /backup/backup.tar
```
## 端口映射
```bash
#Docker会随机映射一个49000～49900的端口
docker run -d -P training/webapp python app.py
# 0.0.0.0:49155->5000/tcp
docker ps -l
# 本地的5000端口映射到容器的5000端口
docker run -d -p 5000:5000 training/webapp python app.py
# 指定映射使用一个特定地址
docker run -d -p 127.0.0.1:5000:5000 training/webapp python app.py
# localhost的任意端口到容器的5000端口
docker run -d -p 127.0.0.1::5000 training/webapp python app.py
# 查看端口
docker port gitlab 22
# 0.0.0.0:13022
```
## 容器互联
```bash
#自定义容器命名
docker run -d --name web  training/webapp python app.py
# 查看命名
docker inspect -f "{{.Name}}" c8d3ae4e3155
# /gitlab
# db容器和web容器建立互联关系
docker run -d --name db training/postgres
docker run -d -P --name web --link db:db training/webapp python app.py #--link name:alias，其中name是要链接的容器的名称，alias是别名

# 两种方式为容器公开连接信息
# 1、更新环境变量
docker run -rm --name web2 --link db:db training/webapp env
# PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# HOSTNAME=5ade2540e405
# DB_PORT=tcp://172.18.0.3:5432
# DB_PORT_5432_TCP=tcp://172.18.0.3:5432
# DB_PORT_5432_TCP_ADDR=172.18.0.3
# DB_PORT_5432_TCP_PORT=5432
# DB_PORT_5432_TCP_PROTO=tcp
# DB_NAME=/web2/db
# DB_ENV_PG_VERSION=9.3
# HOME=/root

# 2、更改 /etc/hosts文件
docker exec -it web /bin/bash
cat /ect/hosts
# 127.0.0.1       localhost
# ::1     localhost ip6-localhost ip6-loopback
# fe00::0 ip6-localnet
# ff00::0 ip6-mcastprefix
# ff02::1 ip6-allnodes
# ff02::2 ip6-allrouters
# 172.18.0.3      db 25e44f94ea1c  #db容器 主机名
# 172.18.0.4      2946eae0fade #web容器 用自己的id默认做主机名
apt-get install -yqq inetutils-ping #安装ping
ping db
# PING db (172.18.0.3): 56 data bytes
# 64 bytes from 172.18.0.3: icmp_seq=0 ttl=64 time=0.092 ms
# ...
```
