# Drone
## 关于 plugins
- [drone plugins](https://plugins.drone.io/docker)
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
- 主要用来 build 和 push [plugins/docker](https://plugins.drone.io/plugins/docker)
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
### 直接拉取
::: details 查看代码
<<< ./.drone.pull.yml#pull-image
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
### 其他服务器拉取发布
- 配置 key ❌
  - ssh.ParsePrivateKey: ssh: no key found
  - ssh: handshake failed: ssh: unable to authenticate, attempted methods `[none]`, no supported methods remain
- 配置 password ✅
  - 成功
::: details 查看代码
<<< ./.drone.deploy.yml{10-13}
:::
- 执行docker-compose
  - docker-compose.deploy.yml处于其他服务器：拉取docker镜像，部署
::: details 查看代码
<<< ../../Docker/Base/docker-compose/docker-compose.deploy.yml
:::
