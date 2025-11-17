# Plasmo
## 基础开发
### 开发思路
#### 🧩 场景 1：UI 独立于页面 DOM（不依赖原页面结构）
- 自己挂载到一个单独的 DOM 节点中（Plasmo 默认在 shadow DOM 内）；
- 不依赖页面原有结构；
- 可以完全使用 React/Vue/Svelte 等现代框架开发。
- ✅ 推荐技术：
  - React + Plasmo 原生支持的 UI 渲染；
  - 使用 Tailwind、ShadCN、Radix UI 等配合；
  - Plasmo 自带的 @plasmohq/messaging、@plasmohq/storage 帮助通信和状态持久化。
#### 🧩 场景 2：UI 依附于页面已有结构（嵌入、改动页面）
- ✅ 推荐技术思路：
- 不使用 React 管理整棵树，而是：
  - 用原生 DOM API、MutationObserver、事件代理等方式操作；
  - 或者使用轻量库（jQuery、Zepto、Cash.js）加速选择、绑定事件、动画等操作。
- 在局部使用 React（混合方案）
  - 在每个你“控制的节点”里挂一个小 React 根节点（通过 ReactDOM.createRoot(node)）；
  - 外层用 DOM 操作找到位置、创建挂载点；
  - 内层用 React 管理这块 UI 的状态。
```ts
// 找到页面上的目标节点
const target = document.querySelector(".chat-answer")
// 创建一个容器
const uiRoot = document.createElement("div")
uiRoot.className = "my-plugin-root"
target.appendChild(uiRoot)
// 在其中挂载 React 组件
createRoot(uiRoot).render(<MyButton />)
```
### 开发结构
- 项目初始结构
```txt
project/
 └─ src/
     ├─ popup.tsx
     ├─ content.tsx
     └─ manifest.json
package.json
```
- 浏览器配置
  - 打开 chrome://extensions
  - 打开开发者模式
  - 选择“加载已解压的扩展程序”
  - 选择 build/chrome-mv3-prod 或 chrome-mv3-dev
- manifest
```json
{
  "manifest": {
    "manifest_version": 3,
    "name": "Plasmo Demo",
    "version": "1.0.0",
    // 控制能不能访问网页的 API（如 fetch dom 权限）
    "host_permissions": ["https://*/*"],
    "permissions": ["storage"]
  }
}
```
- 配置文件
| 文件                        | 用途                                           | 是否必须     |
| ------------------------- | -------------------------------------------- | -------- |
| `plasmo.config.js`        | **Plasmo 专属构建配置**（比如 HMR、bundler、自定义 loader） | 可选       |
| `package.json → manifest` | 推荐写 **Chrome Manifest 配置**                   | ✅ 推荐     |
| `src/manifest.json`       | 补充 / 覆盖 manifest 配置                          | 可选（高级模式） |

- 文件区别
| 文件路径                         | Plasmo 会做什么                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `src/popup.tsx`              | 自动作为插件 Popup UI                                             |
| `src/options.tsx`            | 自动作为插件 Options 页                                            |
| `src/background.ts`          | 自动作为 service worker / background                            |
| `src/content.tsx`            | 自动注入页面，作为 content script                                    |
| `src/contents/**.tsx`        | 自动注入页面，作为 content script（可多文件）                              |
| `src/content-scripts/**.tsx` | **如果在 manifest 或 plasmo.config.js 中声明了 content script** 才生效 |

## 开发实践
### 操作页面已有结构
- 报错 setTimeout 延迟处理调用
### tailwindcss v3
```bash
# pnpm / npm / yarn 二选一
pnpm create plasmo --with-tailwindcss
# 或
npm create plasmo -- --with-tailwindcss
```
### tailwindCSS v4 生效
- 实现思路
  - plasmo/content/\*.tsx or  plasmo/content.tsx 是在一个隔离的#shadow-root中
  - export default ()=>{} 默认导出这个组件，就在隔离的#shadow-root中
  - 如果想要tailwindcss 生效必须将编译出的 tailwindcss导入到shadow-root中
- 实现步骤
  - 1、tailwindcss cli 编译
    - 因为 v4的版本不支持 tailwindcss npm 包直接编译
    - 直接下载[tailwindcss-windows-x64.exe](https://github.com/tailwindlabs/tailwindcss/releases) 文件
    - 或者 使用 `@tailwindcss/cli`包
    - `npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch`
  - 2、导入到hadow-root中
    - 在plasmo/content/\*.tsx，将 ./src/output.css 导入到hadow-root中
    - `import styleText from "data-text:~/src/output.css"`
    - 再导出一个 [getStyle](https://github.com/PlasmoHQ/examples/blob/main/with-tailwindcss/src/content.tsx) `export const getStyle = () => {}`
  ```js
  import styleText from "data-text:~/src/output.css"

  export const getStyle = (): HTMLStyleElement => {
    const baseFontSize = 16
    let updatedCssText = styleText.replaceAll(":root", ":host(plasmo-csui)")
    const remRegex = /([\d.]+)rem/g
    updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
      const pixelsValue = parseFloat(remValue) * baseFontSize
      return `${pixelsValue}px`
    })
    const styleElement = document.createElement("style")
    styleElement.textContent = updatedCssText
    return styleElement
  }
  ```
### 针对网站注入脚本（content/*.tsx）
- host_permissions 控制能不能访问网页的 API（如 fetch dom 权限）
- content.tsx 注入逻辑不依赖 host_permissions，依赖 matches
```ts
// - 在Plasmo中不适合使用此方法，manifest content_scripts matches 自动生成
// - 标准 Chrome 插件手写 manifest”的框架
import type { PlasmoManifest } from "plasmo"
export const manifest: PlasmoManifest = {
  content_scripts: [
    {
      matches: ["https://chatgpt.com/*"],
      js: ["content.tsx"]
    }
  ]
}
```
- 注释方式，从 Plasmo v0.60+ 开始，不再支持
```js
// plasmo:content-script
// plasmo:content-scripts-matches=https://chatgpt.com/*
export default function Panel() {
  return (
    <div>Your UI here</div>
  )
}
```
- 使用 `export const config` 方式
- [参考](https://github.com/PlasmoHQ/examples/blob/main/with-many-content-scripts/contents/plasmo.ts)
```ts
import type { PlasmoCSConfig } from "plasmo"
export const config: PlasmoCSConfig = {
  // 只在 chatgpt.com 下注入
  matches: ["https://chatgpt.com/*"]
}
export default function ChatGPTPanel() {
  return (
    <div>
      ChatGPT UI Active
    </div>
  )
}
```
### 事件绑定
- 移除事件无效
  - 在 content.tsx的export default ()=>{}
  - 进行事件绑定，绑定没有问题
  - 如果，要把绑定的事件移除，则无效
- 原因
  - content-script 中添加的事件监听器与页面中注册的事件监听器处于不同的 JS world，removeEventListener 无法跨 world 移除
  - Chrome 不允许 content-script 移除 page script 添加的事件，也不允许 page script 移除 content-script 添加的事件
  - 添加事件监听：
    - 是在 content-script 当前 world 注册 → DOM 确实响应事件。
  - 移除事件监听：
    - removeEventListener 的调用处于 新加载的 content-script world，和之前注册监听器的 world 已经不是同一个 world。
    - Chrome 将 content script "重加载" 或 "重新运行" 时，会产生新的 JS world，因此：你 remove 的其实不是原来的监听器。
- 解决：
  - 绑定事件和移除事件的方法，不放到content.tsx的export default ()=>{} 组件中
  - 只在content.tsx的export default ()=>{}中进行触发调用
## 发布
https://chatgpt.com/c/690b0dc5-8b20-8325-9236-573635ed8ecf
