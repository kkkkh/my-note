---
outline: deep
---
## Vite plugin
### unplugin-vue-components 
- On-demand components auto importing for Vue.
- 按需加载组件
```js
// vite.config.js
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'unplugin-vue-components/resolvers'
// your plugin installation
Components({
  resolvers: [
    AntDesignVueResolver(),
    ElementPlusResolver(),
    VantResolver(),
  ],
})
```
### unplugin-icons
- 按需加载图标
```js
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
export default {
  plugins: [
    Components({
      resolvers: [
        IconsResolver()
      ],
    }),
    Icons(),
  ],
}
```
### rollup-plugin-visualizer
- 可视化并分析您的 Rollup 包，看看哪些模块占用了空间
```js
import { visualizer } from "rollup-plugin-visualizer";
module.exports = {
  plugins: [visualizer()],
};
```
### vite-plugin-babel
- 主要作用：
  -  build：构建时
  -  runtime：运行时，支持es新特性（esbuild不支持的）
```js
import { defineConfig } from 'vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    babel({
      babelHelpers: 'bundled', // 或者 'runtime'，根据你的需求选择
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead', // 根据你的目标浏览器调整
            useBuiltIns: 'usage', // 或者 'entry'，根据你的需求选择
            corejs: 3, // 或者 2，根据你的需求选择
          },
        ],
      ],
    }),
  ],
});
```
### @vitejs/plugin-legacy
- 为 Vite 项目添加对旧版浏览器的支持
```js
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    legacy({
      polyfills: true,
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```
