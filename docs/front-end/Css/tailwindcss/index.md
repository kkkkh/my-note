---
outline: deep
---
# tailwindcss
文档
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
