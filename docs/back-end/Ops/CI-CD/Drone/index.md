# Drone
## 关于 plugins
- [drone plugins](https://plugins.drone.io)
## 核心
- volumes 的重要性
  - 如果没有加volumes，drone的一个step，则是在docker中运行的
  - 此时如果无法连接dockerhub 则连接失败
  - 如果添加volumes则，走宿主机的docker
  - 可以对宿主机docker的 /etc/docker/daemon.json增加加速镜像源
  - 实现快速拉取
- 手动缓存
  - 每一层step是独立的，
  - 想复用缓存，则需要volumes支持，使用宿主机的docker，
  - 已经下载的镜像，下一次可以直接服用，
  - 如果想要复用包缓存，比如pnpm 缓存/pip
  - 则同样可以使用volumes实现（手动缓存）
  ::: details 查看代码
  <<< ./.drone.pnpm-cache.yml
  :::
  ::: details 查看代码
  <<< ./.drone.pip-cache.yml
  :::
## 部署思路
### 1、宿主机打包、并部署
- docker镜像打包到本宿主机
- docker实例直接部署到本宿主机

### 2、宿主机打包、发布、分发其他服务器部署
- docker镜像打包
- 发布到dockerhub 或 [阿里云容器镜像服务](https://cr.console.aliyun.com/cn-chengdu/instances)
- 其他服务器也可以拉取镜像部署
## 常用配置
### switch to ssh
drone（国内服务器）默认拉取github代码，总是超时，改为 ssh 拉取
::: details 查看代码
<<< ./.drone.switch-to-ssh.yml
:::
### 共享宿主机docker，打包镜像，创建实例
::: details 查看代码
<<< ./.drone.run.yml
:::
### 临时卷
::: details 查看代码
<<< ./.drone.temp.yml
:::
### 宿主机齐全的配置
::: details 查看代码
<<< ./.drone.total.yml
:::
### plugins/docker
- 特点
  - 主要用来 build 和 push [plugins/docker](https://plugins.drone.io/plugins/docker)
  - 生成镜像
    - Drone 用 plugins/docker 构建镜像时在宿主机留下了两个 tag
    - 一个是你指定的 image-name:latest
    - 另一个是随机字符串（如 mtzrzdibwh2st7wq:latest）。
- 实现打包不推送：
  - ai给的配置 skip_push、push、skip_login（没有生效）❌
  - 查看了官方文档，其实只配置 dry_run: true 即可实现 ✅
  ::: details 查看代码
  <<< ./.drone.no-push.yml{27}
  :::
- 打包发布
  ::: details 查看代码
  <<< ./.drone.push.yml
  :::
- 只拉取，不发布 （不支持）❌
  ::: details 查看代码
  <<< ./.drone.pull.yml#pull-and-run
  :::
### 登录
- 直接使用 Secrets ❌
- Must provide --username with --password-stdin（获取不到环境变量）
::: details 查看代码
<<< ./.drone.login.yml#no-env
:::
- 设置环境变量 ✅
::: details 查看代码
<<< ./.drone.login.yml#env
:::
### 直接拉取 （依赖登录）
::: details 查看代码
<<< ./.drone.pull.yml#pull-image
:::
### 其他服务器拉取发布
- 配置 key ❌
  - ssh.ParsePrivateKey: ssh: no key found
  - ssh: handshake failed: ssh: unable to authenticate, attempted methods `[none]`, no supported methods remain
  - 其他配置（未生效）
```bash
# 目标服务器生成密钥
ssh-keygen -t rsa -b 4096 -C "drone-deploy" # 只是给密钥加一个注释
ssh-keygen -t rsa -b 2048 -C "email@example.com" -f ~/.ssh/gitlab/id_rsa

# 如果私钥格式是：-----BEGIN OPENSSH PRIVATE KEY-----
# 则需要将其转换为传统 PEM 格式（Drone 的某些版本对新格式支持不好）。
ssh-keygen -p -m PEM -f ~/.ssh/id_rsa
# 把 /root/.ssh/id_rsa.pub 内容添加到目标服务器 /root/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys # 这里的 ~ 对应 root 用户家目录
# 目标服务器授权公钥是否正确
cat ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub
# 检查权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
# 确认手动 SSH 可用，测试目标服务器
ssh -i /root/.ssh/id_rsa root@<server-address>
# /etc/ssh/sshd_config
PermitRootLogin yes
PubkeyAuthentication yes
systemctl restart sshd
```
- 配置 password ✅
  - 成功
::: details 查看代码
<<< ./.drone.deploy.yml{10-13}
:::
- 执行docker-compose
  - docker-compose.deploy.yml处于其他服务器：拉取docker镜像，部署
  - 服务器已登录相应docker仓库 `docker login --username=<username> xxxx.cr.aliyuncs.com`
::: details 查看代码
<<< ../../Docker/Base/docker-compose/docker-compose.deploy.yml
:::

