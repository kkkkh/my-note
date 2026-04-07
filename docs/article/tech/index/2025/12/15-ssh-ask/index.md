---
title: ssh 常见问题
date: 2025-12-15
tags:
  - ops
  - linux
  - ssh
---
# ssh 常见问题
## 修改 服务器 ssh 登录端口
```ini
# vim /etc/ssh/sshd_config
Port 33
systemctl restart sshd
```
## REMOTE HOST IDENTIFICATION HAS CHANGED

- 第一次使用 SSH 连接时，会生成一个认证，储存在客户端的 known_hosts 中
- 由于服务器重新安装系统了，所以会出现以上错误
- 解决办法：ssh-keygen -R 服务器端的 ip 地址

## git push 失败 Permission denied (publickey). fatal: Could not read from remote repository.  
- 主要原因：SSH key 没有持久化到 ssh-agent
- 临时处理
```bash
eval `ssh-agent`
ssh-add ~/.ssh/id_rsa 
```
- 使用 macOS Keychain 持久化 SSH Key（推荐）重启后自动加载：
- 打开终端，先确认 key 没有被添加：
```bash
ssh-add -l
```
如果提示 The agent has no identities.，说明没加载。
- 添加 key 并保存到 Keychain：
```bash
ssh-add --apple-use-keychain ~/.ssh/id_rsa
```
- 确认添加成功：会显示你的 key。
```bash
ssh-add -l
```
- 为了让 Git 每次都用这个 key，可以在 ~/.ssh/config 里添加：
```bash
Host github.com
AddKeysToAgent yes
UseKeychain yes
IdentityFile ~/.ssh/id_rsa
```
## ssh安全组ip的配置
- sftp 是ssh连接的，连接ssh 22 端口，在阿里云安全组设置 可访问的公网ip；
- 不推荐0.0.0.0/0，临时用用完立刻删，因为这样任何人都可以访问了；
- 缩小范围
  - 123.45.67.89/32 （/32 表示“只允许这一个 IP”）这是 最小、最精确、最安全 的授权方式。
  - （IP地址 / 子网掩码位数）
  - 123.45.67.0/24 等于允许：123.45.67.1 ~ 123.45.67.254

- 123.45.67.0/24 中 24 和 254 关系
  - 123.45.67.0 -> 01111011.00101101.01000011.00000000 主机位
  - 每一个ip值是8位
  - /24 的意思是：固定前3组，前 24 位是“网络位”，后 8 位是“主机位”
  - 2⁸ = 256 个组合 x.x.x.0  ~  x.x.x.255
- 为什么不是 256，而是 254？
- 因为 有 2 个地址不能分配给主机 👇
- 🚫 1️⃣ 网络地址（Network Address）
  ```
  123.45.67.0
  ```
  - 主机位全是 0
  - 表示「这个网段本身」
  - ❌ 不能给设备用
- 🚫 2️⃣ 广播地址（Broadcast Address）
  ```
  123.45.67.255
  ```
  - 主机位全是 1
  - 用来「广播给整个网段」
  - ❌ 不能给设备用
  - 查看外网 IP（公网 IP）
  - 所以就是 256 - 2 = 254
- 查看公网IP curl ifconfig.me
```bash
curl ifconfig.me
```
- 第一个数字动态变化：
  - 动态公网 IP（最常见）
  - 你开着 VPN / 代理 / 加速器
  - 校园网、公司网络
    - 👉 实际上是从 不同出口节点 出网
    - 👉 每次都会不一样

- 为什么本地电脑一开始连不上，后来连上了
  - 大概率是 有更大范围123.45.0.0/16，或者vpn访问
- mac查看ip
  - 查看本机局域网 IP（Wi-Fi）
  ```bash
  ipconfig getifaddr en0
  ```
  - 如果用的是有线网络（Ethernet）
  ```bash
  ipconfig getifaddr en1
  ```
  - 查看所有网络信息（找到 en0 或 en1 下的 inet 192.168.xx.xx）
  ```bash
  ifconfig
  ```
