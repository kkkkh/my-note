---
outline: deep
---
# Eletron
## 原理
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
### 实现原理
#### 渲染进程对 Node.js API 的直接访问
- nodeIntegration: true
  - Electron 使用 V8 引擎同时运行 Chromium 和 Node.js，这使得在渲染进程中可以直接注入 Node.js 的核心模块。
  - Electron 会通过注入机制将 Node.js 的全局变量（如 require、process）添加到渲染进程的 JavaScript 上下文中，使得你可以像在 Node.js 环境中一样访问这些模块。
- contextIsolation: false 
  - 禁用了上下文隔离，网页 JavaScript 和 Electron 的内部上下文运行在同一个环境中，直接共享全局对象。
  - 由于没有隔离，网页的 JS 代码和 Electron 注入的 Node.js API（如 require、process）运行在同一作用域中，开发者可以直接调用 Node.js 的功能。
- 安全性问题
  - 直接访问 Node.js：因为 nodeIntegration: true 允许网页 JavaScript 访问 Node.js API，这意味着任何在渲染进程中运行的脚本（包括第三方库或恶意代码）都可以执行文件操作、网络请求或访问敏感数据。
  - 缺乏隔离：contextIsolation: false 会进一步增加安全风险，因为它允许不受信任的网页代码直接与 Node.js API 交互。
- 技术细节的核心原理
  - Bridge Injection: Electron 创建了一个桥接层，将 Node.js 的模块加载系统注入到渲染进程的上下文中。
  - 全局对象挂载：
    - global 对象（Node.js）与 window 对象（DOM）合并，允许 JS 脚本调用 Node.js API。
    - 例如，require('fs') 会通过 Node.js 的模块系统加载模块，而这些功能本应不存在于普通浏览器环境中。
  - 内置模块加载器：
    - Electron 在渲染进程启动时会加载内置的模块加载器，将 Node.js 和 Web 环境无缝结合。
- 建议
  - 实际开发中不推荐使用此配置，建议通过 preload 脚本显式暴露必要的 API 并启用 contextIsolation 来保障安全性。
## 实践
### 进程之间的通信
#### 渲染进程 -> 主进程 通信
- invoke / handle （通过 channel 向主过程发送消息，并异步等待结果）
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
- send / on （通过channel向主进程发送异步消息，可以发送任意参数）
  ```js
  // 渲染进程
  import {ipcRenderer} from 'electron'
  ipcRenderer.send(channel, ...args)
  // 主进程
  import {ipcMain} from 'electron'
  ipcMain.on(channel, listener)
  ```
- postMessage / on
  ```js
  // 渲染进程
  import {ipcRenderer} from 'electron'
  const channel = new MessageChannel()
  const port1 = channel.port1
  const port2 = channel.port2
  port2.postMessage({ answer: 42 })
  ipcRenderer.postMessage('port', null, [port1])
  // 主进程
  import {ipcMain} from 'electron'
  ipcMain.on('port', (event) => {
    const port = event.ports[0]
    port.on('message', (event) => {
      const data = event.data
    })
    port.start()
  })
  ```
#### 主进程 -> 渲染进程 通信
- send / on
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
- postMessage / on
  ```javascript
  const { BrowserWindow, app, ipcMain, MessageChannelMain } = require('electron')
  app.whenReady().then(async () => {
    // Worker 进程是一个隐藏的 BrowserWindow
    // 它具有访问完整的Blink上下文（包括例如 canvas、音频、fetch()等）的权限
    const worker = new BrowserWindow({
      show: false,
      webPreferences: { nodeIntegration: true }
    })
    await worker.loadFile('worker.html')

    // main window 将发送内容给 worker process 同时通过 MessagePort 接收返回值
    const mainWindow = new BrowserWindow({
      webPreferences: { nodeIntegration: true }
    })
    mainWindow.loadFile('app.html')

    // 在这里我们不能使用 ipcMain.handle() , 因为回复需要传输
    // MessagePort.
    // 监听从顶级 frame 发来的消息
    mainWindow.webContents.mainFrame.ipc.on('request-worker-channel', (event) => {
      // 建立新通道  ...
      const { port1, port2 } = new MessageChannelMain()
      // ... 将其中一个端口发送给 Worker ...
      worker.webContents.postMessage('new-client', null, [port1])
      // ... 将另一个端口发送给主窗口
      event.senderFrame.postMessage('provide-worker-channel', null, [port2])
      // 现在主窗口和工作进程可以直接相互通信，无需经过主进程！
    })
  })
  // 渲染进程 1
  const { ipcRenderer } = require('electron')
  const doWork = (input) => {
    // 一些对CPU要求较高的任务
    return input * 2
  }
  // 我们可能会得到多个 clients, 比如有多个 windows,
  // 或者假如 main window 重新加载了.
  ipcRenderer.on('new-client', (event) => {
    const [ port ] = event.ports
    port.onmessage = (event) => {
      // 事件数据可以是任何可序列化的对象 (事件甚至可以
      // 携带其他 MessagePorts 对象!)
      const result = doWork(event.data)
      port.postMessage(result)
    }
  })
  // 渲染进程 2
  const { ipcRenderer } = require('electron')
  // 我们请求主进程向我们发送一个通道
  // 以便我们可以用它与 Worker 进程建立通信
  ipcRenderer.send('request-worker-channel')
  ipcRenderer.once('provide-worker-channel', (event) => {
    // 一旦收到回复, 我们可以这样做...
    const [ port ] = event.ports
    // ... 注册一个接收结果处理器 ...
    port.onmessage = (event) => {
      console.log('received result:', event.data)
    }
    // ... 并开始发送消息给 work!
    port.postMessage(21)
  })
  ```
- postmessage 优势
  - 传输复杂数据（如果数据中包含非可序列化对象（如 Map、Set、ArrayBuffer 或循环引用）或需要更高效的数据传输）
  - 兼容window.postMessage，支持与 MessagePort 交互的场景
- 参考：
  - [electron postMessage](https://www.electronjs.org/zh/docs/latest/tutorial/message-ports)
- 其他通信参考
  - [web worker 通信](../../JavaScript/Dom/index.md#web-worker)
  - [iframe 通信](../../JavaScript/Dom/index.md#iframe)
  - [MessageChannel 通信](../../JavaScript/Dom/index.md#messagechannel--messageport)
### 主进程 api
#### ipcMain
- ipcMain.handle(channel, listener)
- 为一个 invokeable的IPC 添加一个handler。 每当一个渲染进程调用 ipcRenderer.invoke(channel, ...args) 时这个处理器就会被调用。
```js
import {ipcMain} from 'electron'
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
- app.commandLine 操作Chromium读取的应用程序的命令行参数
  ```js
    app.commandLine.appendSwitch('charset', 'utf8')
    app.commandLine.appendSwitch('lang', 'en')
  ```
- app.requestSingleInstanceLock
- 如果当前进程是应用程序的主要实例，则此方法返回true，同时你的应用会继续运行。 
- 如果当它返回 false如果你的程序没有取得锁，它应该立刻退出
```js
const lock= app.requestSingleInstanceLock({ appCode: "test" })
if(lock){
  // 继续
}else{
  app.quit()
}
```
#### BrowserWindow
- [BaseWindowConstructorOptions(类参数)](https://www.electronjs.org/zh/docs/latest/api/structures/base-window-options)
  - [webPreferences](https://www.electronjs.org/zh/docs/latest/api/structures/web-preferences)
    - partition
      - 决定页面所使用的 session，不同的 partition 值可以隔离页面的会话数据；
      - 如果 partition 以persist:开头, 那么该页面会使用持久化的会话，这些数据会保存在磁盘中，即使应用关闭后再次启动，这些数据仍然存在；
      - 如果没有 persist: 前缀, 页面会使用内存中的会话. 通过分配相同的 partition, 多个页可以共享同一会话；
      - 如果没有设置 partition，页面将使用 Electron 提供的 默认会话
    - webview
      - 启用后，可以在渲染进程中使用 `<webview>` 标签来嵌入其他网页。
      - `<webview>` 标签类似于 iframe，但具有更多的功能，例如独立的上下文和进程隔离，提供额外的控制能力，例如与主进程通信。
      - 利用 will-attach-webview 事件可帮助防范潜在风险。
      - 参考：[WebView性能、体验分析与优化](https://tech.meituan.com/2017/06/09/webviewperf.html)
    - skipTaskbar 是否在任务栏中显示窗口。默认为 false
  - frame 指定 false 以创建无框架窗口
- 实例 
  - win <= `const win = new BrowserWindow()`
  - win.webContent 渲染以及控制 web 页面
#### win.webContent
- win.webContents.setZoomFactor
  - 设置窗口缩放比
- win.webContent.setWindowOpenHandler
  - 用于处理由窗口内的网页触发的 window.open() 调用。
  - 通过这个方法，开发者可以完全控制新窗口的行为，例如允许、拒绝打开，或者对新窗口的配置进行自定义
- win.webContents.session
  - setPermissionCheckHandler(handler: (webContents, permission, requestingOrigin) => boolean)
    - 用于拦截和处理权限检查。
    - 在特定权限（如通知、摄像头、麦克风等）被请求时，调用自定义逻辑以决定是否允许。
    - 返回值为布尔值：true 表示允许，false 表示拒绝。
    ```js
    win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
      if (permission === 'notifications') return true; // 允许通知
      return false; // 禁止其他权限
    });
    ```
  - setDevicePermissionHandler(handler: (details) => boolean)
    - 用于处理设备权限（如访问 USB、hid(蓝牙)、串口设备等）的请求。
    - 返回值为布尔值：true 表示允许访问设备，false 表示拒绝。
    - 参数 details 提供有关请求的信息，包括设备类型和来源。
    ```js
    win.webContents.session.setDevicePermissionHandler((details) => {
      console.log(details.deviceType); // 打印请求的设备类型
      return details.deviceType === 'usb'; // 仅允许 USB 设备
    });
    ```
  - setCertificateVerifyProc(proc: (request, callback) => void)
    - 自定义证书验证逻辑。在安全连接中遇到证书问题（如自签名证书或无效证书）时调用，用于决定是否信任该证书。
    ```js
    win.webContents.session.setCertificateVerifyProc((request, callback) => {
      // 每当一个服务器证书请求验证，proc 将被这样 proc(request, callback) 调用，为 session 设置证书验证过程。
      // 回调函数 callback(0) 接受证书，callback(-2) 驳回证书。
      console.log(request.hostname); // 打印请求的主机名
      if (request.hostname === 'trusted.com') {
          callback(0); // 信任证书
      } else {
          callback(-2); // 拒绝证书
      }
    });
    ```
  - setCertificateVerifyProc 解决内网 HTTPS 请求问题:
    - SSL 验证的核心是浏览器通过检查证书链的有效性，确保通信的安全性和合法性。
    - setCertificateVerifyProc 替代了 Chromium 内部的默认证书验证流程，使你可以完全自定义验证逻辑。callback(0) 明确告诉 Electron 跳过所有验证，即认为任何证书都是合法的。
    - 完整安全验证
      ```js
      const { session } = require('electron');
      // 设置自定义证书验证过程
      session.defaultSession.setCertificateVerifyProc((request, callback) => {
        const { hostname, certificate, errorCode } = request;
        // 定义内网可信的域名列表（根据实际情况配置）
        const trustedInternalDomains = ['intranet.local', 'internal.company.com'];
        // 定义内网的可信证书指纹（SHA-256）
        const trustedFingerprints = [
          '11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44',
        ];
        // 定义内网环境的 IP 地址范围（如 10.0.0.0/8 或 192.168.0.0/16 等）
        const isInternalIP = (hostname) => {
          return /^10\.\d+\.\d+\.\d+$/.test(hostname) || /^192\.168\.\d+\.\d+$/.test(hostname);
        };
        // 1. 允许内网可信域名
        if (trustedInternalDomains.includes(hostname)) {
          console.log(`Trusted internal domain: ${hostname}`);
          callback(0); // 信任
          return;
        }
        // 2. 允许内网可信证书指纹
        if (trustedFingerprints.includes(certificate.fingerprint)) {
          console.log(`Trusted certificate fingerprint: ${certificate.fingerprint}`);
          callback(0); // 信任
          return;
        }
        // 3. 允许特定的内网 IP 地址
        if (isInternalIP(hostname)) {
          console.log(`Trusted internal IP: ${hostname}`);
          callback(0); // 信任
          return;
        }
        // 4. 在开发环境中可以放宽限制
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Development mode: Ignoring untrusted certificate for ${hostname}`);
          callback(0); // 信任
          return;
        }
        // 默认拒绝未知的证书
        console.error(`Untrusted certificate for ${hostname}`);
        callback(-2); // 拒绝
      });
      ```
  - win.webContents.session.on('select-serial-port',...)
#### session
session 管理浏览器会话、cookie、缓存、代理设置等。
- 创建自定义会话
```js
// 从指定的 partition（webPreferences: {partition:"***"}）获取一个对应的会话 (session) 对象
const customSession = session.fromPartition('persist:user1');
const customWindow = new BrowserWindow({
    webPreferences: {
        session: customSession,
    },
});
// 动态设置是否始终为 HTTP NTLM 发送凭据或协商身份验证。
session.defaultSession.allowNTLMCredentialsForDomains('*')
```
#### process
Electron's process 对象继承 Node.js process object。 它新增了事件、属性和方法
- process.resourcesPath 只读
  - 一个 string 值，表示 resources 目录的路径
  - 这个目录通常包含 Electron 应用程序的静态资源文件。
  - 在开发模式下，process.resourcesPath 通常指向 Electron 自带的 resources 目录，而不是你的项目目录。
  - 在生产模式下，process.resourcesPath 指向 Electron 应用的打包资源路径。
#### shell
```js
import { shell } from 'electron'
shell.openPath('path') //以桌面的默认方式打开给定的文件。
shell.openExternal('https://github.com') // 打开网址
```
#### crashReporter
```js
// 将崩溃日志提交给远程服务器
import { crashReporter } from 'electron'
crashReporter.start({
  uploadToServer: "",
})
```
### 渲染进程 api
#### ipcRenderer
- ipcRenderer.invoke
  ```js
  import {ipcRenderer} from 'electron'
  async () => {
    const result = await ipcRenderer.invoke('my-invokable-ipc', arg1, arg2)
    // ...
  }
  ```
#### window.open
从渲染进程打开窗口 window.open(url[, frameName][, features])
### 开发Lib
  - build工具
    - [electron-builder](https://www.electron.build/)
    - [electron forge](https://www.electronforge.io/)
  - [@tomjs/electron-devtools-installer](https://www.npmjs.com/package/@tomjs/electron-devtools-installer)（[中文](https://github.com/tomjs/electron-devtools-installer/blob/HEAD/README.zh_CN.md) ）为 Electron 安装 Chrome 扩展
  - [vite-plugin-electron](https://www.npmjs.com/package/vite-plugin-electron) vite支持electron
  - [electron-log](https://www.npmjs.com/package/electron-log) electron 打印日志
  - [winax](https://www.npmjs.com/package/winax) Windows C++ Node.JS 插件，实现 COM IDispatch 对象包装器，模拟 cscript.exe 上的 ActiveXObject
  - [config](https://www.npmjs.com/package/conf) -> [electron-store](https://www.npmjs.com/package/electron-store) 主进程进行数据持久化存储
  - [serialport](https://serialport.io/docs/api-serialport) 窜口模块
    - [NodeBot](https://nodebots.io/) &nbsp;[NodeBot github](https://github.com/nodebots)
    - [johnny-five](https://johnny-five.io/)
#### electron-builder
#### electron forge
- 使用
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
- bug
  - An unhandled rejection has occurred inside Forge:Error: Unable to use specified module loaders for ".ts".
  - 将`forge.config.ts` 改为 `forge.config.mts` 解决 不知道为什么识别不.ts
- 参考：
  - [详解 Electron 打包](https://juejin.cn/post/7250085815430430781) Electron Builder、Electron Forge对比
  - [详解 Electron 中的 asar 文件](https://juejin.cn/post/7213171235577036860) [@electron/asar](https://github.com/electron/asar)
  - [前端工程化之强大的glob语法](https://juejin.cn/post/6876363718578405384)
#### config / electron-store
- electron-store 相对于 localStorage 的优势
- localStorage 仅在浏览器进程中工作。
- localStorage 的容错能力较差，因此如果您的应用程序遇到错误并意外退出，您可能会丢失数据。
- localStorage 仅支持持久字符串。该模块支持任何 JSON 支持的类型。
- 该模块的 API 更好。您可以设置和获取嵌套属性。您可以设置默认初始配置。
#### winax COM接口
- winax
  - Windows C++ Node.JS 插件，实现 COM IDispatch 对象包装器，模拟 cscript.exe 上的 ActiveXObject
  - 涉及名词解释
    - COM 是微软开发的一种组件软件框架，用于在 Windows 应用程序之间提供互操作性。它允许不同语言编写的程序共享功能和对象。
    - IDispatch: 这是 COM 的一个接口，支持运行时动态调用（例如方法调用、属性访问）。
    - ActiveXObject 是 JavaScript 在 Windows 环境（如 Internet Explorer 或 cscript.exe 脚本宿主）中用于访问和操作 COM 对象的内置接口。`new ActiveXObject('Scripting.FileSystemObject')`
    - cscript.exe: cscript 是 Windows 提供的命令行脚本解释器，用于运行 .vbs 或 .js 脚本。它允许开发者直接在 Windows 环境下通过脚本调用 COM 接口。
    - COM 集成到 Node.js: winax 实现了一个 C++ 插件，用于在 Node.js 中调用 COM 对象。它模拟了 ActiveXObject 的功能，让 Node.js 程序能够像在 cscript.exe 中一样通过 COM 操作 Windows 应用。
    - ActiveXObject 是一个专门用于 Windows 脚本的功能，但 Node.js 本身没有类似能力。winax 实际上复现了 ActiveXObject 的核心功能，即通过 IDispatch 动态操作 COM 对象。因此，这种实现方式被称为“模拟”。
  - winax作用
    - Node.js 的 npm 包，专门帮助在 Windows 系统上通过 `COM（Component Object Model 组件对象模型）接口`与`本地应用程序进行交互`。
    - 特别是在 Electron 项目中，winax 常用于自动化任务，比如控制 Microsoft Office 等 Windows 原生应用程序，调用 Windows 系统级 API，访问文件系统或服务等。
    - 通过 JavaScript 调用 Windows 的 COM 对象、访问和执行 COM 方法、属性以及处理事件。
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
    const app = new winax.Object('Lppx2.Application', {
      activate: true,
    })
    /**
    * Release COM objects (but other temporary objects may be keep references too)
    * 释放 COM 对象（但其他临时对象也可能保留引用）
    */
    winax.release(con, rs, fields)
    ```
- 其他
  - COM
    - 参考：[COM 官方](https://learn.microsoft.com/en-us/windows/win32/com/component-object-model--com--portal)
  - Lppx2.Application
    - COM 对象的 ProgID（程序标识符），标识了应用程序的 COM 接口，用来实例化应用对象
    - 'Lppx2.Application' 指的是一个通过 COM 对象与某个特定 Windows 应用程序进行交互的实例。
    - 參考：
      - [JAVA调用CODESOFT的重要代码](https://www.codesoft.hk/archives/category/support/page/35)
      - [JAVA调用CODESOFT打印条形码标签](https://www.codesoft.hk/archives/6555)
  - codesoft
    - CodeSoft 的 COM 接口文档并没有完全公开到网上，通常只有在购买了产品并成为其授权用户之后，才能获得开发者文档。
  - 注册表查找：
    - 1、通过注册表查找 ProgID
      - 按下 Win + R，输入 regedit，然后按 Enter，打开注册表编辑器。
      - HKEY_CLASSES_ROOT\CLSID：包含注册的所有 COM 类标识符（CLSID）信息。
      - HKEY_CLASSES_ROOT\<ProgID>：包含与 ProgID 相关的详细信息。
      - 使用 Ctrl + F 搜索特定的 ProgID，例如 Excel.Application，或者直接搜索软件相关的名称，注册表会返回匹配项。
    - 2、OLE/COM Object Viewer。
#### serialport 窜口
```js
import { SerialPort, type SerialPortOpenOptions } from 'serialport'
// 连接窜口
const port = new SerialPort({
  path:'/dev/ttyUSB',
  baudRate: 9600,     // 波特率
  dataBits: 8,        // 数据位：5, 6, 7, 8
  parity: 'none',     // 校验位：'none', 'even', 'odd', 'mark', 'space'
  stopBits: 1,        // 停止位：1, 1.5, 2
  flowControl: false  // 是否启用流控制
});
// 窜口列表
SerialPort.list()
// 发送数据
port?.write(res)
// 关闭连接
port?.close((err) => {})
// 连接成功 - 监听事件
port?.on('open', () => { console.log(`Connected`) })
// 报错 - 监听事件
port?.on('error', (err) => { port = null })
// 接受数据 - 监听事件
port.on('data', (data) => {})
// 断开连接 - 监听事件
port?.on('close', ()=>{ port = null })
```
### electron-updater 更新应用程序
参考：[Auto Update](https://www.electron.build/auto-update)
### 其他框架
- [NW.js](https://nwjs.io/) &nbsp;[中文](https://nwjs-cn.readthedocs.io/zh-cn/latest/Base/Getting%20Started/index.html)
- [Tauri](https://v2.tauri.app/start/)
- NW.js 通过修改源码合并了 Node.js 和 Chromium 的事件循环机制；
- Electron 则是通过各操作系统的，打通了 Node.js 和 Chromium 的事件循环机制（新版本的 Electron 是通过一个独立的线程完成这项工作的）。
- Tauri使用Rust作为底层，通过Web技术（HTML、CSS和JavaScript）构建用户界面。它与Chromium和Node.js没有直接依赖关系，因此可以更轻量级和高效。
- 参考：[NW.js和Electron优缺点综合对比](https://blog.csdn.net/LIangell/article/details/122055029)
### 功能实现思路
#### 启动窗口
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
#### 关闭窗口
- 退出登录
- 注销监听事件
- 注销 session 权限设置
- 移除所有事件 `win.removeAllListeners()`
- 注销版本升级
- 注销全局快捷键 `import { globalShortcut } from 'electron'`
- 注销 ipcMain
- 第三方软件quit
#### 接口请求
- 登录：公钥加密密码
- 发起登录请求：
  - fetch：`session.defaultSession.fetch(url,opts)`
  - opts：`{header:{Accept: 'application/json; charset=utf-8',}}` 等其他请求头
- 存储token到store
- 其他接口请求：
  - 获取token
  - `header:{Authorization: `Bearer ${token}`}` + 其他请求头
#### 获取token
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
