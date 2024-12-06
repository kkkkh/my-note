---
outline: deep
---
## Vite
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
