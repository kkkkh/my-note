# Https
## Lib
- [letsencrypt](https://letsencrypt.org/zh-cn/getting-started/) 免费证书颁发机构
- [certbot](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)  ACME 客户端
## Certbot 获取 Let's Encrypt 证书
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
