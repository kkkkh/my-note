---
outline: deep
---

# Vite

## 基本原理
- 开发策略
  - 依赖 ：Vite 将会使用 esbuild 预构建依赖
  - 源码：Vite 以 原生 ESM 方式提供源码，动态导入代码（基于路由拆分），让浏览器接管了打包程序的部分工作
  - 热替换（HMR）
    - 热更新速度也会随着应用规模的增长而显著下降
    - 在 Vite 中，HMR 是在原生 ESM 上执行的
    - Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活[1]（大多数时候只是模块本身），HMR 始终能保持快速更新
    - 源码模块的请求会根据 304 Not Modified 进行协商缓存，
    - 依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存
- 生产策略
  - 生产不使用esm
    - ESM 由于嵌套导入会导致额外的网络往返，效率低下（即使使用 HTTP/2）
    - 生产环境中获得最佳的加载性能：将代码进行 tree-shaking、懒加载和 chunk 分割、
  - 不使用esbuild打包
    - Vite 采用了 Rollup 灵活的插件 API 和基础建设
  - Rolldown rust编写，取代 Rollup 和 esbuild
- 参考：
  - [esm](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

## 功能
- 开发
  - index.html 不在public，在项目最外层
- 预构建：
  - 裸模块导入，将 CommonJS / UMD 转换为 ESM 格式，esbuild 执行，重写导入为合法的 URL（/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd）
  - 先将以 CommonJS 或 UMD 形式提供的依赖项转换为 ES 模块（即使模块内部的导出方式不固定，Vite 也能通过分析依赖关系，确保在导入时可以正确获取指定的导出项）
  - 许多内部模块的 ESM 依赖项转换为单个模块
  - optimizeDeps.include 或 optimizeDeps.exclude（如果依赖项很大（包含很多内部模块）或者是 CommonJS，那么你应该包含它；如果依赖项很小，并且已经是有效的 ESM，则可以排除它，让浏览器直接加载它。）
    - cssCodeSplit:true //自动地将一个异步 chunk 模块中使用到的 CSS 代码抽取出来并为其生成一个单独的文件
    - cssCodeSplit:false //将所有的 CSS 抽取到一个文件中
- 热更新：
- ts：仅执行 .ts 文件的转译工作，Vite 使用 esbuild 将 TypeScript 转译到 JavaScript
  - [TypeScript 编译器选项](https://cn.vitejs.dev/guide/features.html#typescript-compiler-options)一些处理
- glob 导入
- WebAssembly/Web Workers一些如何引入
- 插件：利用 Rollup 插件 +  增强
  - [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- 静态资源处理 
- 生产
  - vite.config.js & lib 
  ```js
  // vite.config.js
  import { resolve } from 'path'
  import { defineConfig } from 'vite'

  export default defineConfig({
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'lib/main.js'),
        name: 'MyLib',
        // the proper extensions will be added
        fileName: 'my-lib',
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  })
  ```
  ```json
  // 如果 lib package.json 不包含 "type": "module"，Vite 会生成不同的文件后缀名以兼容 Node.js。.js 会变为 .mjs 而 .cjs 会变为 .js 。
  // 推荐在你库的 package.json 中使用如下格式：
  {
    "name": "my-lib",
    "type": "module",
    "files": ["dist"],
    "main": "./dist/my-lib.umd.cjs",
    "module": "./dist/my-lib.js",
    "exports": {
      ".": {
        "import": "./dist/my-lib.js",
        "require": "./dist/my-lib.umd.cjs"
      }
    }
  }
  // 或者，如果暴露了多个入口起点：
  {
    "name": "my-lib",
    "type": "module",
    "files": ["dist"],
    "main": "./dist/my-lib.cjs",
    "module": "./dist/my-lib.js",
    "exports": {
      ".": {
        "import": "./dist/my-lib.js",
        "require": "./dist/my-lib.cjs"
      },
      "./secondary": {
        "import": "./dist/secondary.js",
        "require": "./dist/secondary.cjs"
      }
    }
  }
  ```
  - 在库模式中，所有 import.meta.env.* 的使用都会在构建生产版本时被静态替换。
  - 但是，process.env.* 的使用不会，这样你的库的使用者就可以动态地改变它。
  - 如果这是不可取的，你可以使用 define: { 'process.env.NODE_ENV': '"production"' } 来静态替换它们，
  - 或者使用 esm-env 来更好地兼容打包工具和运行时。
- 环境变量
  - .env.production优先级高于.env
  - 只有以 VITE_ 为前缀的变量才会暴露
  - https://github.com/motdotla/dotenv-expand
  - html
  ```html
  <h1>Vite is running in %MODE%</h1>
  <p>Using data from %VITE_API_URL%</p>
  ```
- 性能
  - 浏览器：浏览器无痕、关闭禁用缓存
  - vite 插件
  - 解析：导入路径 `import './Component.jsx'`带扩展名
  - 避免使用桶文件：`// src/utils/index.js export * from './color.js'`
  - 预热常用文件
  - 使用更少或更原生化的工具链
    -  @vitejs/plugin-react-swc
    - swc：https://swc.rs/
- mudule
  - package.json 中添加 "type": "module"，所有 *.js 文件现在都被解释为 ESM，.cjs 扩展名来继续使用 CJS
  - 如果项目 package.json 没有 "type": "module"，所有 *.js 文件都被解释为 CJS，.mjs 扩展名来使用 ESM

### Glob 导入

- 功能：将一个文件夹中的所有的文件导入

- 使用场景：比如将 image 批量化引入到项目中

- 分析代码：

  - 示例代码

    ```js
    const modules = import.meta.glob('./dir/*.js')
    // vite 生成的代码
    const modules = {
      './dir/foo.js': () => import('./dir/foo.js'),
      './dir/bar.js': () => import('./dir/bar.js'),
    }
    ```

  - 此时是动态导入，如果想直接引入所有的模块

    ```js
    const modules = import.meta.glob('./dir/*.js', { eager: true })
    // vite 生成的代码
    import * as __glob__0_0 from './dir/foo.js'
    import * as __glob__0_1 from './dir/bar.js'
    const modules = {
      './dir/foo.js': __glob__0_0,
      './dir/bar.js': __glob__0_1,
    }
    ```

  - 设置 import 为 default 可以加载默认导出。

    ```js
    const modules = import.meta.glob('./dir/*.js', {
      import: 'default',
      eager: true,
    })
    // vite 生成的代码
    import __glob__0_0 from './dir/foo.js'
    import __glob__0_1 from './dir/bar.js'
    const modules = {
      './dir/foo.js': __glob__0_0,
      './dir/bar.js': __glob__0_1,
    }
    ```

  - 其他功能，参考文档

- 参考：[viet glob-import](https://cn.vitejs.dev/guide/features#glob-import)

### 静态资源处理

- 静态资源处理方式，有很多种，[参考 vite assets](https://cn.vitejs.dev/guide/assets)

## 插件
- [unplugin-vue-components](https://www.npmjs.com/package/unplugin-vue-components#Configuration) 
- [unplugin-icons](https://www.npmjs.com/package/unplugin-icons#auto-importing#Migrate%20from%20vite-plugin-icons)
- [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)

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
