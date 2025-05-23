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
  - [viteconf](https://www.youtube.com/@viteconf)
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
- 动态导入
  ```js
  const modules = import.meta.glob('./dir/*.js')
  // vite 生成的代码
  const modules = {
    './dir/foo.js': () => import('./dir/foo.js'),
    './dir/bar.js': () => import('./dir/bar.js'),
  }
  ```
- 直接引入所有的模块
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
- 在做组件库，测试
  - 想使用import.meta.glob("./components/*.js")引入全部组件
  - 再使用`export * from './components/*.js'`全部导出
  - 不能实现，因为`export * from './components/*.js'`并不支持动态导出，只支持文件导出
  ```js
  export const App = () => {
    return <div>App</div>
  }

  ```
  ```js
  const modules = import.meta.glob("./components/*.js",{
    eager:true,
    import:'App'
  })
  // vite 生成的代码
  import { App as __vite_glob_0_0 } from './components/bar.js'
  import { App as __vite_glob_0_1 } from './components/foo.js'
  const modules = {
    './components/bar.js': __vite_glob_0_0,
    './components/foo.js': __vite_glob_0_1,
  }
  // 不能实现
  export * from modules
  // 可以实现
  export * from './components/index.js'
  ```
- 参考：[viet glob-import](https://cn.vitejs.dev/guide/features#glob-import)

### 静态资源处理

- 静态资源处理方式，有很多种，[参考 vite assets](https://cn.vitejs.dev/guide/assets)

## 配置
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
### 分包
```js
export default ({ mode }) => {
  return defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            lodash: ['lodash'],
            element: ['element-ui'],
            xlsx: ['xlsx'],
            axios: ['axios'],
          },
        },
      },
    }
  })
}
```
### lib 打包
```js
export default {
  build: {
    lib: {
      entry: ['src/index.js'],
      formats: ['es', 'cjs', 'iife'], // 打包输出格式
      name: 'MyLib',
      fileName: '[name]',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
}
```
### link 本地包配置
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    include: ['react-s'] // 链接的包不会被预构建。使用此选项可强制预构建链接的包。
  },
  resolve: {
    // 启用此选项会使 Vite 通过原始文件路径（即不跟随符号链接的路径）而不是真正的文件路径（即跟随符号链接后的路径）确定文件身份
    preserveSymlinks: true, 
  },
  // build: {
  //   rollupOptions: {
  //     external: ['react-s'],
  //     output: {
  //       globals: {
  //         react: 'React',
  //         'react-dom': 'ReactDOM'
  //       }
  //     }
  //   }
  // }
})

```
## 命令
### 清除缓存
```bash
vite --force # 强制 Vite 重新预构建依赖，忽略缓存
rm -rf node_modules/.vite
```
## bugs
### process is not defined
- 场景：项目启动报 process is not defined
- 解决：
  ```js
  export default ({ mode }) => {
    return defineConfig({
      // 在这里进行配置
      define: {
        'process.env': {},
        'process.env.NODE_ENV': '"production"' // process.env是动态，在这里静态替换
      },
    })
  }
  ```
- 参考：
  - [csdn](https://blog.csdn.net/henryhu712/article/details/117897998)
  - [github](https://github.com/vitejs/vite/issues/1973#issuecomment-787571499)
  - [vite 文档](https://cn.vitejs.dev/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
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
