---
title: 关于 SSL-TLS 证书过期排查
date: 2026-03-05
tags:
  - Ops
  - SSL-TLS
---
# 关于SSL-TLS 证书过期排查
## 1、证书过期更新
```bash
# 查看证书状态
sudo certbot certificates
# 过期
# Certificate Name: example.com
#     Domains: example.com www.example.com
#     Expiry Date: 2025-09-01 12:00:00+00:00 (INVALID: EXPIRED)
#     Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
#     Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
```
```bash
# 续期
sudo certbot renew
# 成功
# Congratulations, all renewals succeeded
# 失败
# 80端口（HTTP） 和 443端口（HTTPS） 已经被其他进程占用了，导致 nginx 无法绑定这两个端口。
# 所以在 Certbot 尝试 reload nginx 的时候失败了。
# Encountered exception during recovery:
# certbot.errors.MisconfigurationError: nginx restart failed:
# nginx: [emerg] bind() to [::]:443 failed (98: Unknown error)
# nginx: [emerg] bind() to 0.0.0.0:443 failed (98: Unknown error)
# nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Unknown error)
# nginx: [emerg] bind() to [::]:80 failed (98: Unknown error)
```
```bash
# 停止nginx再续期
sudo systemctl stop nginx
sudo certbot renew
sudo systemctl start nginx
sudo systemctl status nginx
```
## 2、证书过期更新nginx重启失败
- 问题：Nginx 进程一直在运行旧配置，没有重新加载新的证书配置
- 原因有三个叠加：
  - nginx reload / restart 一直失败
    - `bind() to 0.0.0.0:443 failed bind() to 0.0.0.0:80 failed`
  - nginx.pid 文件损坏（为空）
    - `invalid PID number "" in "/run/nginx.pid"`
  - systemctl restart nginx 因端口占用失败
    `Job for nginx.service failed because the control process exited with error code. See "systemctl status nginx.service" and "journalctl -xeu nginx.service" for details.`
- 排查过程
  - 浏览器查看证书过期
  - 但服务证书是新的
  - certbot renew 显示正常 `Certificate not yet due for renewal`
  - 问题在 nginx加载证书阶段
### 1、检查服务器真实返回证书
```bash
# 远程访问端口
openssl s_client -connect domain:443 -servername domain | openssl x509 -noout -dates
#  服务器本机
echo | openssl s_client -connect 127.0.0.1:443 -servername domain | openssl x509 -noout -dates 
# notAfter=Feb 26 （旧证书 nginx未 reload）
```
### 2、检查证书文件
```bash
openssl x509 -in /etc/letsencrypt/live/domain/fullchain.pem -noout -dates # 
# notAfter=Apr 27 （新证书）
```
### 3、检查 nginx 监听端口
```bash
ss -lntp | grep :443
# 确认 nginx 是否处理 HTTPS nginx pid=xxxx
# LISTEN 0    511     0.0.0.0:443   0.0.0.0:*   users:(("nginx",pid=xxxx,fd=x),("nginx",pid=xxxx,fd=x),("nginx",pid=xxxx,fd=x))
```
### 4、检查 nginx 配置
```bash
nginx -T # 查看 nginx 实际加载配置
# ...实际配置
nginx -t # 确保 nginx 配置可用
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```
###  5、尝试 reload nginx
```bash
nginx -s reload
# 如果 reload 失败检查 PID（nginx.pid 文件损坏）
cat /run/nginx.pid
# 找出当前 nginx master pid
ps -ef | grep nginx # 找到 nginx: master process ... ← 这就是 master PID
# 强制重新加载配置
kill -HUP masterPID # 生效关键点
```
## 3、为什么找  nginx: master process
- Master 是 控制中心，主要职责：
  - 1️⃣ 读取 nginx 配置文件
  - 2️⃣ 监听端口（80 / 443）
  - 3️⃣ 创建 worker 进程
  - 4️⃣ 管理 worker 生命周期
  - 5️⃣ 接收信号（reload / stop / reopen log）
- kill -HUP masterPID（重新加载SSL证书）
  - 重新加载 nginx.conf
  - 重新加载 SSL 证书
  - 重启 worker
- Worker 只做一件事：处理 HTTP 请求，不会读取配置文件
  - 接收连接
  - 处理请求
  - 反向代理
  - 发送响应
## 4、nginx 常见信号
| 信号   | 作用         |
| ---- | ---------- |
| HUP  | reload 配置  |
| QUIT | 优雅停止       |
| TERM | 快速停止       |
| USR1 | reopen log |
| USR2 | 平滑升级       |

