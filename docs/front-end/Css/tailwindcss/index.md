---
outline: deep
---
# tailwindcss
## JIT
Tailwind JIT（Just-In-Time 编译模式）是一种按需生成 CSS 的机制，从 Tailwind v3 起默认启用（不需要手动开启）。
- 1️⃣ 按需生成（On-demand）
  - 只有你实际写了的类才会出现。
  - 比如你从未写过 bg-blue-500→ JIT 就不会生成它。
- 2️⃣ 实时编译（Ultra Fast）
  - 你只要保存文件，Tailwind 就立即生成 CSS。
  - JIT 的速度超快，因为：
    - 它不会生成全部 CSS（几 MB）
    - 只构建你需要的部分
  - 以流式方式监听文件变化
- 3️⃣ 支持“任意值语法”（Arbitrary Values）
```html
<div class="bg-[#FAA533]"></div>
<div class="w-[37px]"></div>
<div class="h-[calc(100vh-50px)]"></div>
<div class="animate-[spin_2s_linear_infinite]"></div>
```
- 4️⃣ 极大减少产物文件大小
  - 生产环境下 JIT 会自动 Purge，只保留你使用到的类。
  - 通常最终 CSS < 10KB。
## 配置
### v4 基础安装
```bash
npm install tailwindcss @tailwindcss/vite
```
```js
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```
```css
/* styles.css */
@import "tailwindcss";
```
### vscode Tailwind CSS IntelliSense 生效（写tailwindcss 有代码的提示）
- 旧版本支持tailwind.config.js
- v4 不支持直接读取 tailwind.config.js
- 会在 vscode 底部区域 Output 报错
- Tailwind v4 推荐 “CSS‑first” 配置方式
- 要求 项目中有一个 .css 文件，并且这个 CSS 文件里必须引入 @import "tailwindcss"
- 在 .vscode/setttings 中 tailwindCSS.experimental.configFile 配置入口文件 tailwind.css
- 官方扩展对完全 “CSS‑only (无 JS config)” 支持不足  @import "tailwindcss" + @config 混合配置
- [参考](https://open-vsx.org/extension/bradlc/vscode-tailwindcss#tailwind-css-v4.x-(css-entrypoints))
```json
{
  "tailwindCSS.experimental.configFile": "./**/tailwind.css"
}
```
```css
/* tailwind.css */
@import "tailwindcss";
/* 这里引用 tailwind.config.js */
@config "./**/tailwind.config.js"；
```
- ~~这些生效部分或者不生效，或者是缓存，不使用以下引入~~
```js
/* 替代 base */
@import "tailwindcss/preflight";  /* [!code --] */
/* 替代 components + utilities */
@tailwind utilities;  /* [!code --] */
```
### 配置自定义颜色 @theme 和 theme
- CSS 自定义属性（CSS Variables）：在 tailwind.css 中配置变量，会生成在css全局变量
```css
/* tailwind.css */
@theme{
  --color-theme: #FAA533;
}
```
- tailwind.config.js 配置 theme.extend.colors.*
```js
module.exports = {
  content: [
    "src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        theme: "var(--color-theme)",
      },
    }
  },
  plugins: []
}
```
- 代码中使用
```jsx
<button
  className="bg-theme">
  拷贝
</button>
```
- 生成 output.css
```css
/* =============================== */
@layer theme {
  :root, :host {
    /* ... */
    --color-theme: #FAA533;
  }
}
@layer utilities {
  .bg-theme {
    background-color: var(--color-theme);
  }
}
```
## 插件
- [eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
## 应用
### 任意值（arbitrary value）语法
```js
<div class="m-[50%]">
  内容
</div>
//  => margin: 50%;
```
### 宽度由内容撑开
- `<div class="w-max bg-gray-100 p-2">`
- w-max 表示容器的宽度由内容撑开（相当于 width: max-content）
### 不支持动态计算类名
- `const num = 3 <p className={`text-${num}xl`}>文本</p>`
- 不可以动态计算num来控制
- Tailwind CSS 在构建阶段就会扫描所有类名，把它们编译成 CSS
- 不会生效，因为 Tailwind 在构建时无法“看懂”这个字符串
### 背景
- 渐变颜色
  - bg-gradient-to-r：表示渐变方向 从左到右（right）。
  - from-blue-500：渐变起始颜色。
  - to-green-500：渐变结束颜色。
  - via-yellow-400（可选）：中间过渡颜色。
  - /50 表示 50% 不透明度。
```html
<div class="bg-gradient-to-r from-blue-500/50 via-purple-500 to-green-500/70 ...">
  内容
</div>
```
- 背景图
```html
<div class="bg-[url('/images/bg.jpg')] bg-cover bg-center h-64 w-full">
  内容
</div>
```
- 背景图 + 渐变
```html
<div class="h-64 w-full bg-[linear-gradient(to_bottom,rgba(59,130,246,0.6),rgba(16,185,129,0.6)),url('/images/bg.jpg')] bg-cover bg-center">
  内容
</div>
```
