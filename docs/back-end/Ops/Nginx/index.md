# Nginx
## 域名
- com         → 顶级域名（Top-level domain）
- baidu.com   → 一级域名（主域名 / 根域名）
- map.baidu.com → 二级域名（子域名）
## 常用配置
- 服务端配置
  - 为二级域名配置反向代理，转发8000端口
  - 动态设置 CORS（跨域资源共享）的 Origin 响应头，允许其他二级域名跨域访问

  <<< ./server.conf{nginx}

- web端配置
  - 为二级域名配置反向代理，转发3000端口

  <<< ./web.conf{nginx}

