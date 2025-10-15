---
outline: deep
---
# tailwindcss
## 安装
### v4
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
## 插件
- [eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
## 应用
- 任意值（arbitrary value）语法
```js
<div class="m-[50%]">
  内容
</div>
//  => margin: 50%;
```
- 宽度由内容撑开
  - `<div class="w-max bg-gray-100 p-2">`
  - w-max 表示容器的宽度由内容撑开（相当于 width: max-content）
- 不支持动态计算类名
  - `const num = 3 <p className={`text-${num}xl`}>文本</p>` 
  - 不可以动态计算num来控制
  - Tailwind CSS 在构建阶段就会扫描所有类名，把它们编译成 CSS
  - 不会生效，因为 Tailwind 在构建时无法“看懂”这个字符串
