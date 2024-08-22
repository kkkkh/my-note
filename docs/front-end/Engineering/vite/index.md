---
outline: deep
---

# Vite 汇总

## 1、概念

### 基本原理

- 启动：
  - 依赖 ：esbuild go 编写 比 js 编写的打包器预构建依赖快的 10-100 倍
  - 源码：以 原生 ESM 方式提供源码、动态导入代码（基于路由拆分）
- 热更新
  - HMR 是在原生 ESM 上执行的。
  - 当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活

## 2、功能

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

### new URL(url, import.meta.url)/静态资源处理

- 示例代码：

  ```js
  // 1
  const imgUrl = new URL('./img.png', import.meta.url).href
  document.getElementById('hero-img').src = imgUrl
  // 2支持动态
  function getImageUrl(name) {
    return new URL(`./dir/${name}.png`, import.meta.url).href
  }
  ```

- new URL(url, base)

  - url：一个表示绝对或相对 URL
  - base：一个表示基准 URL 的字符串，当 url 为相对 URL 时，它才会生效
  - new URL(`./dir/${name}.png`, import.meta.url)

- import.meta.url

  - import.meta.url 是一个 ESM 的原生功能，会暴露当前模块的 URL
  - 在一个项目中 console.log(import.meta.url) => `http://localhost:8000/xx/src/views/xx.vue?t=172196193xxxx` 相当于当前模块的路径所在，作为基准值，第一个参数再为一个相对路径

- 参考：

  - [new URL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL)
  - [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)
  - [import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta) 元属性将特定上下文的元数据暴露给 JavaScript 模块，vite 在原生的基础上拓展了功能，例如 import.meta.env

- 在 esm 中路径解析，[参考 import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta)

  ```js
  // 之前（CommonJS）：
  const fs = require('fs/promises')
  const path = require('path')
  const filePath = path.join(__dirname, 'someFile.txt')
  fs.readFile(filePath, 'utf8').then(console.log)
  // 之后（ES 模块）：
  import fs from 'node:fs/promises'
  const fileURL = new URL('./someFile.txt', import.meta.url)
  fs.readFile(fileURL, 'utf8').then(console.log)
  ```

- 静态资源处理方式，有很多种，[参考 vite assets](https://cn.vitejs.dev/guide/assets)

## 3、bugs

### process is not defined

- 场景：项目启动报 process is not defined
- 解决：
  ```js
  export default ({ mode }) => {
    return defineConfig({
      // 在这里进行配置
      define: {
        'process.env': {},
      },
    })
  }
  ```
- 参考：[csdn](https://blog.csdn.net/henryhu712/article/details/117897998) [github](https://github.com/vitejs/vite/issues/1973#issuecomment-787571499)

### storybook 中 When I use the tsx/jsx file , the vue prompt is invalid vnode type

[github bug ](https://github.com/storybookjs/storybook/issues/21681)

- 场景：storybook 6.5 中使用 vite 编译 vue-jsx，报错 When I use the tsx/jsx file , the vue prompt is invalid vnode type
- 分析：默认的插件是 react，将其替换为 vue-jsx 插件
- 临时解决方案

  ```js
  // version: 6.5
  // framework: @storybook/vue3
  // builder:@storybook/builder-vite
  const vueJsx = require('@vitejs/plugin-vue-jsx')
  module.exports = {
    ...
    "framework": "@storybook/vue3",
    "core": {
      "builder": "@storybook/builder-vite",
    },
    viteFinal: async (config, { configType }) => {
      config.resolve.alias['~'] = path.resolve(__dirname, '../src')
      config.resolve.alias['@'] = path.resolve(__dirname, '../src')
      console.log(config.plugins)
      // vite中内置了react插件
      // 临时解决方案：将其替换为vue-jsx插件
      config.plugins.forEach((element,index) => {
        if(Array.isArray(element)){
          config.plugins[index] = vueJsx()
        }
      });
      ...
      return config
    }
  }
  ```

  ```js
  // console.log(config.plugins) 打印结果
  [
      {
          name: 'storybook-vite-code-generator-plugin',
          enforce: 'pre',
          configureServer: [Function: configureServer],
          config: [Function: config],
          configResolved: [Function: configResolved],
          resolveId: [Function: resolveId],
          load: [AsyncFunction: load],
          transformIndexHtml: [AsyncFunction: transformIndexHtml]
      },
      {
          name: 'storybook-vite-source-loader-plugin',
          enforce: 'pre',
          transform: [AsyncFunction: transform]
      },
      {
          name: 'storybook-vite-mdx-plugin',
          enforce: 'pre',
          configResolved: [Function: configResolved],
          transform: [AsyncFunction: transform]
      },
      {
          name: 'no-fouc',
          enforce: 'post',
          transformIndexHtml: [AsyncFunction: transformIndexHtml]
      },
      {
          name: 'storybook-vite-inject-export-order-plugin',
          enforce: 'post',
          transform: [AsyncFunction: transform]
      },
      // 内置了react插件
      [
          {
          name: 'vite:react-babel',
          enforce: 'pre',
          config: [Function: config],
          configResolved: [Function: configResolved],
          transform: [AsyncFunction: transform]
          },
          {
          name: 'vite:react-refresh',
          enforce: 'pre',
          config: [Function: config],
          resolveId: [Function: resolveId],
          load: [Function: load],
          transformIndexHtml: [Function: transformIndexHtml]
          },
          {
          name: 'vite:react-jsx',
          enforce: 'pre',
          config: [Function: config],
          resolveId: [Function: resolveId],
          load: [Function: load]
          }
      ],
      {
          name: 'vite-plugin-storybook-allow',
          enforce: 'post',
          config: [Function: config]
      },
      {
          name: 'vite:vue',
          handleHotUpdate: [Function: handleHotUpdate],
          config: [Function: config],
          configResolved: [Function: configResolved],
          configureServer: [Function: configureServer],
          buildStart: [Function: buildStart],
          resolveId: [AsyncFunction: resolveId],
          load: [Function: load],
          transform: [Function: transform]
      },
      { name: 'vue-docgen', transform: [AsyncFunction: transform] }
  ]
  ```

- 最终解决方案：[升级到 7.0](https://storybook.js.org/migration-guides/7.0)

### Message 主题色没有变化

- 场景：在 vue3 项目中，全局引入的 element-plus，设置新主题色，Message 主题色没有生效

  ```scss
  // main.scss
  $color-primary: rgba(16, 185, 129);
  :root {
    --color-primary: rgba(16, 185, 129);
  }
  ```

  ```scss
  // index.scss
  @use 'main';
  @forward 'element-plus/theme-chalk/src/common/var.scss' with (
    $colors: (
      'primary': (
        'base': main.$color-primary,
      ),
    )
  );
  ```

  ```js
  // main.ts
  import { createApp } from 'vue'
  import './styles/element/index.scss'
  import ElementPlus from 'element-plus'
  import App from './App.vue'
  const app = createApp(App)
  // 全部引入
  app.use(ElementPlus)
  ```

- 解决思路 a：

  - 引入 message.scss

    ```js
    // main ts
    // If you want to use ElMessage, import it.
    import 'element-plus/theme-chalk/src/message.scss'
    ```

  - 参考：
    - [参考项目](https://github.com/element-plus/element-plus-vite-starter)
    - [参考代码](https://github.com/element-plus/element-plus-vite-starter/blob/main/src/main.ts)

- 解决思路 b：
  - 改为 element-plus 按需引入 + 自动导入 + 按需引入样式
    ```js
    import { defineConfig } from 'vite'
    import AutoImport from 'unplugin-auto-import/vite'
    import Components from 'unplugin-vue-components/vite'
    import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
    import ElementPlus from 'unplugin-element-plus/vite'
    // vite.config.ts
    export default defineConfig({
      plugins: [
        vue(),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          // 解决tsx无法渲染element组件的问题
          include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass',
              //directives: true,
              //version: "2.1.5",
            }),
          ],
        }),
        // 或者使用 unplugin-element-plus
        // ElementPlus({
        //   useSource: true,
        // }),
      ],
      // ...
      css: {
        preprocessorOptions: {
          // 使用 scss.additionalData 来编译所有应用 scss 变量的组件。
          scss: {
            additionalData: `@use "/styles/element/index.scss" as *;`,
          },
        },
      },
    })
    ```
  - unplugin-element-plus
  - importStyle: 'sass' 与 useSource: true 目的就是导入 scss 文件，使我们编写的 scss 文件生效
  - useSource: true => import 'element-plus/es/components/button/style/index' 去 npm 库中查看，导入的是 scss 文件
  - useSource: false => import 'element-plus/es/components/button/style/css' 去 npm 库中查看，导入的是 css 文件
  - 参考：
    - [element-plus 文档](https://element-plus.org/zh-CN/guide/quickstart.html)
    - [unplugin-element-plus](https://github.com/element-plus/unplugin-element-plus/blob/main/README.zh-CN.md)
    - [npm element-plus](https://www.npmjs.com/package/element-plus?activeTab=code)

### JavaScript heap out of memory 内存泄漏

- 场景：服务器内存只有 2G，vite 打包占用内存过大，报错`JavaScript heap out of memory`，入口文件 main.ts ，集中所有项目的路由
- 过程探索：
  - 扩大内存，设置 node 内存空间，占用到服务器最大内存仍失败
    ```json
    "scripts": {
      "dev": "cross-env NODE_OPTIONS=--max-old-space-size=4096 vite"
    }
    ```
  - 监测内存使用情况（待进一步）
    - vite 打包时观察内存使用情况
    - 找对应插件 [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)（看哪些模块占用了空间）
  - 全动态加载路由（待进一步）
    - 应该还是会泄漏，因为打包不受加载的影响
- 解决：
  - 每个分项目分别使用，独立的 vite.config.js/main.ts/router.ts/routes.ts
    - 较少的路由的可以，较多的失败
    - vite 打包本身已经占用了一定内存
  - 本地打包，dist 一并上传，不在服务器打包
  - 增大服务器内存

## 4、配置

### 多配置文件 1 script

- 场景：一个 vue 代码仓库，其中包含多个子项目，每个子项目对应，各自配置文件\入口文件
- 示例代码：
  ```json
  {
    "scripts": {
      "dev": "vite --mode gen --config vite.gen.config.ts",
      "dev-lesson": "vite --mode lesson  --config vite.lesson.config.ts",
      "build": "vue-tsc --noEmit && vite build --mode gen --config vite.gen.config.ts",
      "build-lesson": "vite build --mode lesson --config vite.lesson.config.ts"
    }
  }
  ```

### 多配置文件 2 vite.config.js

- 场景：不同子项目，使用不同的 index.html\favicon.ico

- 解决思路 a：（只参考，不推荐使用）
  - 统一在一个根目录下操作，改变所有对应参数（新的子项目根目录设置为 src，与原来的子项目区别开）
    - 1、改变 root -> resolve(\_\_dirname,'src')
      - root 改变以后，所有涉及路径都会发生变化，最好全部使用 `resolve(__dirname,'')`绝对路径不容易出错
      - 围绕一点不变：工作区全部为 src/，以此为参照点路径
    - 2、将新的 index.html 放到到 src/
      - index.html -> `<script type="module" src="/main.ts"></script>`
    - 3、favicon.ico -> `publicDir: resolve(__dirname,'./public/子项目')`
    - 4、alias -> `entries: [{find: /@\/(.*)/, replacement: '/$1'}],`
    - 5、build -> `main: resolve(__dirname, 'src/index.html'),`
    - 6、scss -> `js additionalData: '@use "/styles/element/index.scss" as *;\'`
  - dev:
    - 启动以后，根路径就在 src 下工作，
    - index.html 在 src 下 index.html
    - 再找对应的 main.ts
    - 以及模块中 alias
  - build:
    - index.html 找 resolve(\_\_dirname, 'src/index.html')，
    - favicon.ico 也会去 publicDir 对应的目录下找，
    - 其他与 dev 同
    - 打包结果：index.html 为对应模板、在最外部；favicon 为对应配置
  ```ts
  export default ({ mode }) => {
    return defineConfig({
      // 配置了root为src，其他地方默认都在src中
      root: resolve(__dirname, 'src'),
      plugins: [
        vue(),
        alias({
          entries: [{ find: /@\/(.*)/, replacement: '/$1' }], //@ -> /$1
        }),
        // ...
      ],
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "/styles/element/index.scss" as *;`, // styles 为与src下
          },
        },
      },
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'src/index.html'), // 打包找到对应index.html
          },
        },
        outDir: resolve(__dirname, 'dist'),
      },
      publicDir: resolve(__dirname, './public/lesson'), // public对应目录
    })
  }
  ```
- 解决思路 b：

  - 第一种思路弊端
    - 1、修改有关路径的地方较多，root、alias、css、build
    - 2、当再新增一个子项目 index.html，如何跟 src/index.html 区分
      - 2.1、放入 src 内部文件夹之中，main: resolve(\_\_dirname, 'src/**/**/index.html')，打包出来时，index.html 会嵌套 src 内部的路径
      - 2.2、如果都放在 src 中，用不用的名字 oauth.html，打包出来的 oauth.html 如何改为 index.html
  - 采用新思路

    - 使用 [@rollup/plugin-html](https://www.npmjs.com/package/@rollup/plugin-html) 生成 index.html
    - 优点：
      - 1、路径所有相关不用再修改，恢复到从前
      - 2、html 做了分离，只需要各自配置即可
    - 配置

      - 1、rollupOptions plugins @rollup/plugin-html
      - 1、rollupOptions input index.html => main.ts
      - 3、rollupOptions output es

      ```js
      import { defineConfig, loadEnv } from 'vite'
      import vue from '@vitejs/plugin-vue'
      import html from '@rollup/plugin-html'
      import vueJsx from '@vitejs/plugin-vue-jsx'
      import { resolve } from 'path'

      export default ({ mode }) => {
        return defineConfig({
          // 其他的不必修改
          ...
          build: {
            rollupOptions: {
              input: {
                main: resolve(__dirname, 'src/main.ts'),
              },
              plugins: [
                html({
                  attributes: {},
                  publicPath: '',
                  fileName: 'index.html',
                  title: 'oauth',
                }),
              ],
              output: {
                dir: resolve(__dirname, 'dist'),
                format: 'es',
              },
            },
            outDir: resolve(__dirname, 'dist'),
          },
          publicDir: resolve(__dirname, './public/oauth'), // public 文件夹，放置favicon.ico
        })
      }
      ```
