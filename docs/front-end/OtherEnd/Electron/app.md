# MOM-Electron 客户端项目

## 开发环境配置

Electron 开发依赖 node-gyp 和 Visual Studio Build Tools。
- node-gyp：将 C/C++ 库编译为二进制文件，直接在 Node.js 中运行。

安装说明可以见 node-gyp 的 [README](https://github.com/nodejs/node-gyp#on-windows)。

1. 下载并安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools)。

安装时需要选择 “使用 C++ 的桌面开发”

**记得在安装时设置一个安装路径**

2. 安装 VSSetup，该工具可以帮助你在 PowerShell 中调用 Visual Studio 的编译工具。

https://github.com/microsoft/vssetup.powershell

```ps1
Install-Module VSSetup -Scope CurrentUser
```

3. 安装 Windows Store 版本的 python。当前最好使用 3.11 版本。

https://apps.microsoft.com/detail/9nrwmjp3717k

Why? https://github.com/nodejs/node-gyp/issues/2869

node-gyp v10 已经支持 python 最新版本了，但是为了避免不必要的麻烦，还是使用 3.11 版本。
后续可以逐步升级到最新 python 版本。

4. 使用 PowerShell 环境，先运行 install

```ps1
pnpm install
```

然后执行一次 rebuild，以确保所有的依赖都能正确编译。

```ps1
npm run rebuild
```

> 由于 pnpm 的 bug，我们无法使用 pnpm 来进行 打包，最好使用 npm。
> 但是在安装依赖时，需要使用 pnpm。

## 开发

```ps1
pnpm run dev
```

会自动启动 electron，并同时启动 vue-dev-tools。

## 调试

### 断点调试

项目中已经配置好了调试环境，可以直接使用 VScode 来进行调试。具体配置可以参考 `.vscode/launch.json` 和 `.vscode/tasks.json`。

使用 VScode 自带的调试工具，可以直接在编辑器中进行断点调试。

- 打开 VScode 的调试工具（Run And Debug）
- 选择 `Debug App` 进行调试

它会自动启动 electron，并连接到 electron 的调试端口。然后你就可以在 VScode 中进行断点调试了。

### HTTP 请求调试

如果需要调试 HTTP 请求，可以使用 `Charles` 或者 `Fiddler` 等工具。

先启动 Charles，打开 Charles 的代理功能，记录下代理端口，如：`8888`。

然后在项目的 `.env` 文件中配置 `VITE_HTTP_PROXY` 为 Charles 的代理地址。

```bash
# .env.development.local

VITE_HTTP_PROXY = 'http://127.0.0.1:8888'
```

然后重启项目，所有的 HTTP 请求都会经过 Charles 代理。

### Electron 开发者工具

在开发环境中，可以使用快捷键 `Ctrl + Shift + I`（macOS 中使用 `Command + Alt + I`） 来打开 Electron 的开发者工具。

### 客户端版本控制

```
- 执行git add ./
- pnpm commit 按照提示添加相关记录信息
- pnpm release 会生成版本号和对应日志信息
```
