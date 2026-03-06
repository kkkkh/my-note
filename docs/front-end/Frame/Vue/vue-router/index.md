# vue-router
## 模式
- 模式
  - createWebHashHistory
  - createWebHistory
  - createMemoryHistory
- 区别
  - hash - 使用 url hash 变化记录路由地址
  - history - 使用 H5 history API 来改 url 记录路由地址
  - abstract - 不修改 url ，路由地址在内存中，**但页面刷新会重新回到首页**。
### hash
- hash 的特点
  - 会触发页面跳转，可使用浏览器的“后退” “前进”
  - 但不会刷新页面，支持 SPA 必须的特性
  - hash 不会被提交到 server 端（因此刷新页面也会命中当前页面，让前端根据 hash 处理路由）
  - url 中的 hash ，是不会发送给 server 端的。前端 `onhashchange` 拿到自行处理。
  ```js
  // 页面初次加载，获取 hash
  document.addEventListener('DOMContentLoaded', () => {
      console.log('hash', location.hash)
  })
  // hash 变化，包括：
  // a. JS 修改 url
  // b. 手动修改 url 的 hash
  // c. 浏览器前进、后退
  window.onhashchange = (event) => {
      console.log('old url', event.oldURL)
      console.log('new url', event.newURL)
      console.log('hash', location.hash)
  }
  ```
  ```js
  // http://127.0.0.1:8881/hash.html?a=100&b=20#/aaa/bbb
  location.protocol // 'http:'
  location.hostname // '127.0.0.1'
  location.host // '127.0.0.1:8881'
  location.port // '8881'
  location.pathname // '/hash.html'
  location.search // '?a=100&b=20'
  location.hash // '#/aaa/bbb'
  ```
### H5 history API

- 调用`history.pushState` `window.onpopstate`
- 问题：
  - 由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 https://example.com/user/id，就会得到一个 404 错误。这就尴尬了。
  - 要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 index.html 相同的页面（首页）。
  - [参考](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)
- 分析
  - 按照 url 规范，不同的 url 对应不同的资源，例如：
    - `https://github.com/` server 返回首页
    - `https://github.com/username/` server 返回用户页
    - `https://github.com/username/project1/` server 返回项目页
  - 但是用了 SPA 的前端路由，就改变了这一规则，假如 github 用了的话：
    - `https://github.com/` server 返回首页
    - `https://github.com/username/` server 返回首页，前端路由跳转到用户页
    - `https://github.com/username/project1/` server 返回首页，前端路由跳转到项目页
  - 所以，从开发者的实现角度来看，前端路由是一个违反规则的形式。
  - 但是从不关心后端，只关心前端页面的用户，或者浏览器来看，更喜欢 `pushState` 这种方式。
## 钩子函数
### activated/mounted 触发
触发四种情况：
- this.$router.push
  - 如果组件不存在，调用activated 和 mounted
  - 如果组件存在，调用activated
- router-link（组件存在）
  - 调用activated
- this.$router.replace（在当前路由，替换为其他路由，再替换回来，组件不存在）
  - 调用mounted
- 页面全量刷新
  - 调用mounted
总结：（只要涉及到这个页面）
  - 缓存的：keep-alive、已加载的：activated
  - 第一次加载：mounted
