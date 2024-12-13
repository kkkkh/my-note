---
outline: deep
---
## Eletron
### 其他文档：
- [chromium](https://www.chromium.org/chromium-projects/)
- [nodejs](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
### electron 基本原理
- app 模块，它控制应用程序的事件生命周期。
- BrowserWindow 模块，它创建和管理应用程序 窗口。
```js
// index.js
// commonjs 写法
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // console.log(path.join(__dirname, 'preload.js'))
  // D:\\WorkSpace\\1MOM\\my-electron-app\\preload.js
  win.loadFile('index.html')
}
//esm 写法
import { fileURLToPath } from 'node:url'
import {app, BrowserWindow, ipcMain} from "electron"
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: fileURLToPath(new URL('./preload.js',import.meta.url).href)
      // 等同
      // preload: fileURLToPath(import.meta.resolve('./preload.js'))
    }
  })
  // console.log("new URL('./preload.js',import.meta.url)",new URL('./preload.js',import.meta.url))//1
  // console.log("new URL('./preload.js',import.meta.url).href", new URL('./preload.js',import.meta.url).href) //2
  // console.log("import.meta.resolve('./preload.js')",import.meta.resolve('./preload.js'))//3
  // 2等同3
  // console.log("fileURLToPath(new URL('./preload.js',import.meta.url).href)",fileURLToPath(new URL('./preload.js',import.meta.url).href))//4
  // console.log("import.meta.resolve('./preload.js')",fileURLToPath(import.meta.resolve('./preload.js')))//5
  // 4等同5
  win.loadFile('index.html')
}
// 共同
app.whenReady().then(() => {
  createWindow()
  ipcMain.handle('ping', () => 'pong')
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```
- 使用预加载脚本来增强渲染器：为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 预加载 的特殊脚本。
```js
// preload.js
const { contextBridge,ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // 除函数之外，我们也可以暴露变量
})
```
- 渲染进程
```js
// renderer.js
const information = document.getElementById('info')
information.innerText = `本应用正在使用 
Chrome (v${versions.chrome()}), 
Node.js (v${versions.node()}), 和 
Electron (v${versions.electron()})`
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // 打印 'pong'
}
func()
```
- build工具
  - [electron-builder](https://www.electron.build/)
  - [electron forge](https://www.electronforge.io/)
### api
#### ipcRenderer
- ipcRenderer.invoke
  ```js
  import {ipcRenderer} from 'electron'
  async () => {
    const result = await ipcRenderer.invoke('my-invokable-ipc', arg1, arg2)
    // ...
  }
  ```
#### ipcMain
- ipcMain.handle(channel, listener)
- 为一个 invokeable的IPC 添加一个handler。 每当一个渲染进程调用 ipcRenderer.invoke(channel, ...args) 时这个处理器就会被调用。
```js
ipcMain.handle('my-invokable-ipc', async (event, ...args) => {
  const result = await somePromise(...args)
  return result
})
```
#### app
- app.getAppPath() 返回 string - 当前应用程序目录。
```js
console.log(app.getAppPath())
// D:\WorkSpace\Project_Name
```
- [app.getPath(name)](https://www.electronjs.org/zh/docs/latest/api/app#appgetpathname)
  - name string - 您可以通过名称请求以下路径：
    - appData 每个用户的应用程序数据目录，默认情况下指向：
    - `userData` 储存你应用程序配置文件的文件夹，默认是 appData 文件夹附加应用的名称 按照习惯用户存储的数据文件应该写在此目录，同时不建议在这写大文件，因为某些环境会备份此目录到云端存储。
    - sessionData 此目录存储由 Session 生成的数据，例如 localStorage，cookies，磁盘缓存，下载的字典，网络 状态，开发者工具文件等。 默认为 userData 目录。 Chromium 可能在此处写入非常大的磁盘缓存，因此，如果您的应用不依赖于浏览器存储（如 localStorage 或 cookie）来保存用户数据，建议将此目录设置为其他位置，以避免污染 userData 目录。
    - temp 临时文件夹
    - downloads 用户下载目录的路径
    - logs 应用程序的日志文件夹
```js
import { app } from 'electron'
console.log("app.getPath('userData')", app.getPath('userData'))
console.log("app.getPath('appData')", app.getPath('appData'))
console.log("app.getPath('sessionData')", app.getPath('sessionData'))
console.log("app.getPath('temp')", app.getPath('temp'))
console.log("app.getPath('downloads')", app.getPath('downloads'))
console.log("app.getPath('logs')", app.getPath('logs'))
// app.getPath('userData') C:\Users\User_Name\AppData\Roaming\App_Name
// app.getPath('appData') C:\Users\User_Name\AppData\Roaming
// app.getPath('sessionData') C:\Users\User_Name\AppData\Roaming\App_Name
// app.getPath('temp') C:\Users\ABCDE~1.FGH\AppData\Local\Temp
// app.getPath('downloads') C:\Users\User_Name\Downloads
// app.getPath('logs') C:\Users\User_Name\AppData\Roaming\App_Name\logs
```
- 补充：8.3 文件名格式
  - C:\Users\ABCDE~1.FGH 是一种 8.3 文件名格式，也称为 短文件名格式，
  - 这种格式限制文件或目录名为 8 个字符，扩展名为 3 个字符
  - Electron 使用的 app.getPath() 方法依赖于操作系统 API，可能返回短文件名以确保兼容旧版 Windows 和 MS-DOS 等不支持长文件名的系统。
- app.getVersion()
  - 返回 string - 加载应用程序的版本号。 如果应用程序的 package. json 文件中找不到版本号, 则返回当前包或者可执行文件的版本。
#### shell
```js
import { shell } from 'electron'
shell.openPath('path') //以桌面的默认方式打开给定的文件。
shell.openExternal('https://github.com') // 打开网址
```
### electron forge
- 使用electron forge
  - 脚手架初始化一个项目 vite + ts [初始化](https://www.electronforge.io/templates/vite-+-typescript)
    ```bash
    npm init electron-app@latest my-new-app -- --template=vite-typescript
    ```
  - 在原项目使用 [electron-forge](https://www.electronjs.org/zh/docs/latest/tutorial/%E6%89%93%E5%8C%85%E6%95%99%E7%A8%8B)
    ```bash
    npm install --save-dev @electron-forge/cli
    npx electron-forge import
    ```
    ```json
    // package.json
    //...
    "scripts": {
      "start": "electron-forge start",
      "package": "electron-forge package",
      "make": "electron-forge make"
    },
    //...
    ```
    ```bash
    # 分发文件 运行了 electron-forge make 命令
    npm run make
    ```
  - [支持vite](https://www.electronforge.io/config/plugins/vite)
    ```bash
    npm install --save-dev @electron-forge/plugin-vite
    ```
- 开发工具
- 参考：
  - [详解 Electron 打包](https://juejin.cn/post/7250085815430430781) Electron Builder、Electron Forge对比
  - [详解 Electron 中的 asar 文件](https://juejin.cn/post/7213171235577036860) [@electron/asar](https://github.com/electron/asar)
  - [前端工程化之强大的glob语法](https://juejin.cn/post/6876363718578405384)
### electron-builder
### 开发Lib
  - [@tomjs/electron-devtools-installer](https://www.npmjs.com/package/@tomjs/electron-devtools-installer)（[中文](https://github.com/tomjs/electron-devtools-installer/blob/HEAD/README.zh_CN.md) ）为 Electron 安装 Chrome 扩展
  - [vite-plugin-electron](https://www.npmjs.com/package/vite-plugin-electron) vite支持electron
  - [electron-log](https://www.npmjs.com/package/electron-log) electron 打印日志
  - [winax](https://www.npmjs.com/package/winax) Windows C++ Node.JS 插件，实现 COM IDispatch 对象包装器，模拟 cscript.exe 上的 ActiveXObject

### 模块
#### winax COM接口
- Node.js 的 npm 包，专门帮助在 Windows 系统上通过 `COM（Component Object Model 组件对象模型）接口`与`本地应用程序进行交互`。
- 特别是在 Electron 项目中，winax 常用于自动化任务，比如控制 Microsoft Office 等 Windows 原生应用程序，调用 Windows 系统级 API，访问文件系统或服务等。
- 主要功能包括：
  - 通过 JavaScript 调用 Windows 的 COM 对象。
  - 访问和执行 COM 方法、属性以及处理事件。
  - 在 Electron 应用中集成 Windows 本地功能。
  - 适用于需要与 Windows 原生组件或服务交互的场景。
```js
  const app = new winax.Object('Lppx2.Application', {
    activate: true,
  })
```
- Lppx2.Application
  - 'Lppx2.Application' 指的是一个通过 COM 对象与某个特定 Windows 应用程序进行交互的实例。
  - 通常，这种格式用于引用已注册的 COM 程序的标识符 (ProgID)。
  - 'Lppx2.Application' 看起来不像是 Windows 系统或常见的软件（如 Microsoft Office 等）的标准 ProgID，
  - 可能是与某个自定义或行业特定的应用程序相关联的 COM 对象。
  - 你可以检查本地注册表中的 HKEY_CLASSES_ROOT 路径下，寻找 Lppx2.Application 的详细信息，了解它对应的具体软件。

- winax
  ```js
  /** 
   * Create ADO Connection throw global function
   * 创建ADO连接抛出全局函数
  */
  require('winax');
  var con = new ActiveXObject('ADODB.Connection');

  /**
   * Or using Object prototype
   * 或者使用对象原型
  */
  var winax = require('winax');
  var con = new winax.Object('ADODB.Connection');
  /**
  * Release COM objects (but other temporary objects may be keep references too)
  * 释放 COM 对象（但其他临时对象也可能保留引用）
  */
  winax.release(con, rs, fields)
  ```
### 其他框架
- [NW.js](https://nwjs.io/) &nbsp;[中文](https://nwjs-cn.readthedocs.io/zh-cn/latest/Base/Getting%20Started/index.html)
- [Tauri](https://v2.tauri.app/start/)
- NW.js 通过修改源码合并了 Node.js 和 Chromium 的事件循环机制；
- Electron 则是通过各操作系统的，打通了 Node.js 和 Chromium 的事件循环机制（新版本的 Electron 是通过一个独立的线程完成这项工作的）。
- Tauri使用Rust作为底层，通过Web技术（HTML、CSS和JavaScript）构建用户界面。它与Chromium和Node.js没有直接依赖关系，因此可以更轻量级和高效。
- 参考：[NW.js和Electron优缺点综合对比](https://blog.csdn.net/LIangell/article/details/122055029)
