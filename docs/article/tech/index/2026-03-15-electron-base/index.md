---
title: electron 基本原理、操作和架构
date: 2026-03-15
tags:
  - front-end
  - OtherEnd
  - electron
---
# electron 基本原理、操作和架构
## preload

### 基本原理
- preload 是 Renderer 页面 和 Electron/Node 能力之间的一层安全桥
- 页面脚本运行在 Main World
- preload.js 运行在 Isolated World
- 页面和 preload 不是同一个 JS context
- `window` 上暴露的只是桥接入口，不是原始高权限对象本体

### contextBridge + preload
- `contextBridge.exposeInMainWorld()` 是 Electron 提供的原生桥接能力
- 它会把受控 API 暴露到页面 world 的 `window[apiKey]` 上
- 本质属于：跨上下文通信（Cross-Context Communication） + 安全隔离下的能力暴露
- 可以理解为：在受限浏览器环境中，安全地开放少量系统能力

### 底层原理
- Electron 借助 Chromium / V8 的多上下文能力，在页面 world 的 `window` 上注入一个受控代理入口
- 页面调用该入口时，再把调用桥接回 preload 所在的 Isolated World
- preload 如有需要，再通过 IPC 连接主进程

#### 1. 创建两个 V8 context
- Electron / Chromium 把页面 world 和 preload world 分开
- Electron 运行的是自己改造过的 Chromium 渲染环境

#### 2. 原生把 API 注入到目标 world 的 global object
- `binding.exposeAPIInWorld(0, key, api)` 不是普通 JS
- 而是原生层把 API 入口挂进 Main World 的 `window[key]`

#### 3. 函数不是直通，而是代理
- 页面拿到的函数不是 preload 原函数本体，而是代理函数
- 代理函数保存原函数引用、receiver、context
- 调用时通过代理把参数和返回值跨 context 转换
- 调用能回到 preload，不是靠监听，而是靠代理函数保存了跨上下文执行路径

#### 4. preload 再通过 IPC 进主进程
- preload 中真正调用 `ipcRenderer`
- 再走 Electron 的 renderer-to-main IPC 通道进入主进程

#### 5. 参数和返回值为什么也能跨过去
- 因为底层会做“跨 context 值转换”
- 所以看起来像直接调用，其实不是共享内存
- 本质上每次过桥都要做值适配

### @electron-toolkit/preload
- `window.electronAPI.ipcRenderer.send(...)`
- 本质上是把 `ipcRenderer` 暴露在 `electronAPI` 上
- 属于偏方便开发的封装，不是最严格安全方案
- 最佳推荐
  ```js
  // preload 用“业务 API 封装”
  contextBridge.exposeInMainWorld('api', {
    getUserInfo: () => ipcRenderer.invoke('get-user-info'),
    saveFile: (data) => ipcRenderer.send('save-file', data)
  })
  // render
  window.api.getUserInfo()
  ```
## 基本操作
### 如何通信

> 主线程与渲染线程之间的通信通过 IPC（Inter-Process Communication，进程间通信） 机制来实现。

- **渲染进程 ipcRenderer.invoke / 主进程 ipcMain.handle**
- **渲染进程 ipcRenderer.send / 主进程 ipcMain.on**
- **主进程 win.webContents.send / 渲染进程 ipcRenderer.on**

#### 渲染进程 -> 主进程 通信
- 渲染进程 invoke / 主进程 handle （异步请求-响应）
  ```js
  // 渲染进程
  import {ipcRenderer} from 'electron'
  async () => {
    const result = await ipcRenderer.invoke('my-invokable-ipc', arg1, arg2)
    // ...
  }
  // 主进程
  import {ipcMain} from 'electron'
  ipcMain.handle('my-invokable-ipc', async (event, ...args) => {
    const result = await somePromise(...args)
    return result
  })
  ```
- 渲染进程 send / 主进程 on (异步发消息，不等待响应)
  ```js
  // 渲染进程
  import {ipcRenderer} from 'electron'
  ipcRenderer.send(channel, ...args)
  // 主进程
  import {ipcMain} from 'electron'
  ipcMain.on(channel, listener)
  ```
  ```js
  // 双向转发
  // 渲染进程
  ipcRenderer.send('channel1', {  name: 'param1' },{ name: 'param2' });
  ipcRenderer.on('channel2', (param1,param)2=>{});
  // 主进程
  ipcMain.on('channel1', (event, param1, param2) => {
    event.sender.send('channel2', param1, param2)
    // 同上
    event.reply('channel2', param1, param2)
  })
  ```
- 渲染进程 sendSync / 主进程 on （同步阻塞通信，不推荐）
  ```js
  // 渲染进程
  let returnValue = ipcRenderer.sendSync('msg_render2main', {  name: 'param1' },{ name: 'param2' });
  console.log(returnValue) // 123
  // 主进程
  ipcMain.on('msg_render2main', (event, param1, param2) => {
    console.log("param1",param1)
    console.log("param2",param2)
    // event.reply('msg_main2render', param1, param2)
    event.returnValue = "123"
  })
  ```
- postMessage / on （更底层）
#### 主进程 -> 渲染进程 通信
- 主进程 send / on
  ```js
  // 主进程
  import { BrowserWindow } from 'electron'
  const allWindows = BrowserWindow.getAllWindows()
  for (const win of allWindows) {
    win.webContents.send("browserWindow-webContents", value)
  }
  // 渲染进程
  import {ipcRenderer} from 'electron'
  ipcRenderer.on("browserWindow-webContents",(value)=>{
    console.log(value)
  })
  ```
- postMessage / on （更底层）
### aap.getPath

<<< @/submodule/play-electron/src/main/ipc/on/appGetPath.ts
#### AppData
- Windows 操作系统中的 AppData
在 Windows 操作系统中，AppData 是一个目录，用于存储应用程序的用户数据。这个目录通常位于 `C:\Users\<YourUsername>\AppData`。
AppData 目录下有三个子目录：
- Roaming: 用于存储可以在不同设备之间漫游的数据，例如应用程序的配置设置、用户偏好等。这些数据会跟随用户的 Microsoft 账户在不同的电脑上同步。
- Local: 用于存储不应该漫游到其他设备的数据，例如缓存文件、大型数据文件等。这些数据仅存储在本地设备上。
- LocalLow: 用于存储低完整性级别的应用程序的数据，例如在受限环境中运行的应用程序。

#### userData
- `app.getPath('userData')` 返回的目录对应于 Windows 系统中的 `C:\Users\<YourUsername>\AppData\Roaming\<YourAppName>` 。
- 实际上是 AppData 目录下的一个特定子目录，用于存储特定应用程序的数据。
- 这个目录是应用存储和读取用户相关数据的安全且推荐的位置

- 操作平台
  - macOS: `~/Library/Application Support/<YourAppName>`
  - Windows: `%APPDATA%/<YourAppName>`，通常是 `C:\Users\<YourUsername>\AppData\Roaming\<YourAppName>`
  - Linux: `~/.config/<YourAppName>`

### 其他目录
- temp 目录用于存储应用程序在运行时生成的临时文件。这些文件通常用于缓存数据、处理中间结果或在不同进程之间传递数据。
  -  `C:\Users\HAOTIA~1.ZHA\AppData\Local\Temp`
- downloads 目录是用户存储从网络下载文件的默认位置。
  - `C:\Users\usename\Downloads`
- exe 文件是打包后的应用程序的主程序。当用户安装你的应用程序后，.exe 文件通常位于安装目录下
  - `D:\projectname\node_modules\.pnpm\electron@35.5.1\node_modules\electron\dist\electron.exe`


## 架构
### play-electron 整体架构
- 大目录
  - src/main 主进程相关
  - src/renderer 与 renderer 相关页面和组件
  - src/preload 预加载绑定到window上的electron调用
  - src/electron 与 electron 相关的各种函数的封装
- 主线程入口文件 src/main/index.ts
  - app.whenReady() 之后开始注册
    - new BrowserWindow 创建一个浏览器窗口
    - 监听 ipcMain.on 和 ipcMain.handle
- ipcMain.on
  - src/main/ipc.index 注册和注销 ipcMain.on 各个模块的函数
  - src/main/modules/* 各个模块
  - src/electron/utils/ipc 对 ipcMain.on 等的函数封装
  - src/main/handle 和 src/main/on 没有注册的，直接绑定
- 渲染进程调用
  - preload/index.js 加载到 new BrowserWindow.webPreferences.preload
  - preload中绑定 window.electron（调用ipcRenderer.invoke 或者 ipcRenderer.send）
  - preload中绑定 window.electronAPI.app.*方法（是 ipcRenderer.send 的封装）



