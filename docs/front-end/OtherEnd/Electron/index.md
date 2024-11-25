# Eletron
## 文档：
- [electronjs](https://www.electronjs.org/zh/docs/latest/)
- [chromium](https://www.chromium.org/chromium-projects/)
- [nodejs](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [electronforge](https://www.electronforge.io/)
## 基本原理
### electron
- app 模块，它控制应用程序的事件生命周期。
- BrowserWindow 模块，它创建和管理应用程序 窗口。
```js
// commonjs
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
```
```js
//esm
import { fileURLToPath } from 'node:url'
import {app, BrowserWindow} from "electron"
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
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```
- 使用预加载脚本来增强渲染器：为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 预加载 的特殊脚本。
### build
- [electron-builder](https://www.electron.build/)
- [electronforge](https://www.electronforge.io/)
### dev
- [@tomjs/electron-devtools-installer](https://www.npmjs.com/package/@tomjs/electron-devtools-installer)

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
