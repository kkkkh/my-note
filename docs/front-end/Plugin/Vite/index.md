---
outline: deep
---
## Vite plugin
### unplugin-vue-components / unplugin-auto-import 按需加载
- 按需加载组件示例：
::: details 查看代码
```js
// AntDesignVue、ElementPlus、Vant、Icons
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default {
  plugins: [
    Components({
      resolvers: [
        AntDesignVueResolver(),
        ElementPlusResolver(),
        VantResolver(),
        IconsResolver()
      ],
    }),
    Icons(),
  ],
}
```
:::
- vue2 按需加载element-ui组件
::: details 查看代码
<<< @/submodule/play/packages/vue2/vite.config.js
:::
- vue3 按需加载naive-ui组件 / 按需加载 vue api 、naive-ui api
::: details 查看代码
<<< @/submodule/play/packages/vue3/vite.config.base.ts
:::
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
