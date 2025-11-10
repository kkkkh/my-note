# cursor
## 设置
### 主题
- Windows：Ctrl + Shift + P
- preference > color theme > 选择主题
## cursor 第三方
### go-cursor-help
- 基本操作
  - Cursor设置：退出登录
  - Cursor官网：删除自己的账号
  - PowerShell 管理员权限，执行下边命令，选1(禁止更新)
  ```bash
  irm https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_win_id_modifier.ps1 | iex
  ```
- 参考
  - [go-cursor-help](https://github.com/yuaotian/go-cursor-help/blob/master/README_CN.md)
  - [Cursor 全攻略：注册、使用到无限续杯，一次性讲清楚](https://zhuanlan.zhihu.com/p/23874722853)
### cursor vip
- 参考
  - [cursor vip](https://cursor.jeter.eu.org/)
### cursor-free-vip
- 参考
  - [cursor-free-vip](https://github.com/yeongpin/cursor-free-vip)
### YCursor
- 1、需要一个动态的邮箱：购买一个域名，挂到Cloudflare上，使用其邮箱功能进行注册；
  - 1、购买域名；
  - 2、把域名添加到 Cloudflare
    - 登录 Cloudflare：https://dash.cloudflare.com
    - 右上角 Add a domain（添加站点）
  - 3、：把域名 DNS 指向 Cloudflare
    - Cloudflare 会给你两个 NS 域名，比如：
    ```bash
    xx.ns.cloudflare.com
    xx.ns.cloudflare.com
    ```
    - 然后你去 域名购买平台 把原来的 NS 改成这两个。pdm
  - 4：Email Routing 设置
    - 目标地址：创建一个，用于转发接受邮件，填一个`临时邮箱`；
    - Catch-all：打开并设为这个创建的目标地址；
    - 自定义地址：只能固定一个邮箱地址；
- 2、临时邮箱：Cloudflare邮箱接收到信息，转为给`临时邮箱`
  - [tempmail](https://tempmail.plus/zh/)
  - 可以设置一个token，只要有这个token，那么就可以获取到邮箱的信息
- 3、自动化调用cursor 注册api，重置机器码、动态邮箱、邮箱数据读取
- 参考
  - [YCursor](https://github.com/YanCchen/YCursor)
