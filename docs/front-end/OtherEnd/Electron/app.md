## 功能实现思路
### webview使用与配置
### 启动窗口
- 是否单例锁
- 启动时向 Chromium 命令行传递参数
- 崩溃日志
- 启动窗口
- 自定义控制新窗口的行为
- 注册监听事件
- session 权限设置
- 计算窗口大小
- 从partition获取session，安装浏览器插件
- 设置代理（app、session）
- 初始化托盘 Tray
- 注册 ipcMain
- 注册版本升级
- 注册全局快捷键
### 关闭窗口
- 退出登录
- 注销监听事件
- 注销 session 权限设置
- 移除所有事件 `win.removeAllListeners()`
- 注销版本升级
- 注销全局快捷键 `import { globalShortcut } from 'electron'`
- 注销 ipcMain
- 第三方软件quit
### 接口请求
- 登录：公钥加密密码
- 发起登录请求：
  - fetch：`session.defaultSession.fetch(url,opts)`
  - opts：`{header:{Accept: 'application/json; charset=utf-8',}}` 等其他请求头
- 存储token到store
- 其他接口请求：
  - 获取token
  - `header:{Authorization: `Bearer ${token}`}` + 其他请求头
### 获取token
- 1、是否有accessToken，
  - 有 ✅
  - 没有：则没有登录
- 2、是否过期
  - 未过期 ✅
  - 过期：如果当前时间 > 过期时间-间隔时间 
- 3、是否有 tokenRefreshTask
  - 有 ✅
  - 没有
- 4、是否有refreshToken：
    - 没有：没有登录
    - 有：tokenRefreshTask
- 5、发起刷新token请求 
  - tokenRefreshTask(tokenData.accessToken, tokenData.refreshToken)
  - 成功：返回token✅
