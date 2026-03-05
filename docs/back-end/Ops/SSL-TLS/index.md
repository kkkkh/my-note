# SSL/TLS
## Lib
- [letsencrypt](https://letsencrypt.org/zh-cn/getting-started/) 免费证书颁发机构
- [certbot](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)  ACME 客户端
## Certbot 安装 Let's Encrypt 证书
```bash
# 安装 Certbot
sudo snap install --classic certbot
# 确保certbot命令能够运行
sudo ln -s /snap/bin/certbot /usr/local/bin/certbot
# 获取证书、自动编辑Nginx配置https
sudo certbot --nginx
```
