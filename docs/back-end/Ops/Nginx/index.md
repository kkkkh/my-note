# Nginx
## 域名
- com         → 顶级域名（Top-level domain）
- baidu.com   → 一级域名（主域名 / 根域名）
- map.baidu.com → 二级域名（子域名）
## linux
### 目录地址
| 类型     | 路径                                  | 说明                               |
| ------ | ----------------------------------- | -------------------------------- |
| 主程序    | `/usr/sbin/nginx`                   | 可执行文件，命令 `nginx` 实际就是这里          |
| 主配置文件  | `/etc/nginx/nginx.conf`             | 主配置文件，启动和全局配置                    |
| 站点配置目录 | `/etc/nginx/conf.d/`                | 子配置（vhost）文件目录                   |
| 网站根目录  | `/var/www/html/`                    | 默认网页目录                           |
| 日志目录   | `/var/log/nginx/`                   | 访问日志 access.log、错误日志 error.log   |
| 运行时文件  | `/var/run/nginx.pid`                | Nginx 运行时的 PID 文件                |
| 服务脚本   | `/lib/systemd/system/nginx.service` | Systemd 启动脚本（可通过 `systemctl` 控制） |
## 常用配置
- 基础配置

<<< ./config/base.conf{nginx}

- 服务端配置
  - 为二级域名配置反向代理，转发8000端口
  - 动态设置 CORS（跨域资源共享）的 Origin 响应头，允许其他二级域名跨域访问

<<< ./config/server.conf{nginx}

- web端配置
  - 为二级域名配置反向代理，转发3000端口

<<< ./config/web.conf{nginx}

