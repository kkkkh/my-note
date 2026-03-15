---
title: electron 基本操作和实战
date: 2026-03-15
tags:
  - front-end
  - OtherEnd
  - electron
---
# electron 基本操作和实战
本文汇聚一些electron的基本操作和实战
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


## 实践
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
### 1、electron 配置内嵌的 webview
- new BrowserWindow 配置开启

<<< @/submodule/play-electron/src/main/index.ts#main-BrowserWindow{10}

- vite 配置：webiew 非自定义元素

<<< @/submodule/play-electron/electron.vite.config.ts#vite-webview{5}

- vue组件中 `<webview>`元素配置，src 配置外部链接，preload 同时注入

<<< @/submodule/play-electron/src/renderer/src/components/Webview.vue#webviewRef{5,7}

- 外部链接中 `http://.../files/index.html` 调用electron主进程

<<< @/submodule/play-electron/src/renderer/src/files/index.html#ipcRenderer{3 js}


