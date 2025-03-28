# js
## 基础
### localStorage / sessionStorage / cookie
- 区别：
  - localStorage：
    - 只保存在客户端，不会自动发送给服务器；
    - 存储在 localStorage 的数据可以长期保留；
    - 通常为5MB到10MB
    - 同步操作
  - sessionStorage：
    - 当页面被关闭时，存储在 sessionStorage 的数据会被清除。
  - cookie：
    - 用户与服务端数据传输；当浏览器关闭时，会话Cookie会被删除。
    - 持久Cookie：持久Cookie会保存在用户的硬盘上，直到过期时间到达或用户手动删除。
    - 可以通过设置Expires或Max-Age属性来指定过期时间。
    - 通常为4KB左右。
- token为什么要保存在localStorge，为什么不用cookie
  - 安全性问题：
    - Cookie 容易受到跨站请求伪造（CSRF）攻击。（通过设置 SameSite 属性来缓解 CSRF 攻击）
    - localStorage 最主要的风险是容易受到 XSS 攻击，HttpOnly Cookie 中可以防止客户端 JavaScript 访问 Token
  - 性能：
    - Cookie 会随着每次 HTTP 请求自动发送到服务器，这会增加请求的大小，降低性能。
  - 存储：
    - Cookie 的大小限制通常为 4KB，localStorage 提供的存储容量通常比 Cookie 大
