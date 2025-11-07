## Plasmo
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
### 开发
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
"manifest": {
  "manifest_version": 3,
  "name": "Plasmo Demo",
  "version": "1.0.0",
  "host_permissions": ["https://*/*"],
  "permissions": ["storage"]
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

### 发布
https://chatgpt.com/c/690b0dc5-8b20-8325-9236-573635ed8ecf
