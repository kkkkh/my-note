---
outline: deep
---
# React plugin
## immutable
```js
const { Map } = require('immutable');
const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = Map({ a: 1, b: 2, c: 3 });
map1.equals(map2); // true
map1 === map2; // false
```
## immer
```jsx
import React from "react";
import { useImmer } from "use-immer";
function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useImmer([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
  ]);
  const handleSubmit = (title) => {
    setTodoList(draft => {
      draft.unshift({ title, status: new Date().toDateString() });
    });
  };
}
```
## ladle
Ladle 在 monorepo 根目录的基本配置
- 安装依赖
```bash
pnpm add -D @ladle/react vite @vitejs/plugin-react
pnpm add react react-dom
```
- 配置 vite.config.ts
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // 允许访问 packages 目录
      allow: ["./packages"],
    },
  },
});
```
- 配置 ladle.config.ts
```js
/** @type {import('@ladle/react').UserConfig} */
export default {
  outDir: "./docs",
  base: "/base/",
  stories: "./packages/**/src/**/*.stories.{js,jsx,ts,tsx,mdx}",
};
```
