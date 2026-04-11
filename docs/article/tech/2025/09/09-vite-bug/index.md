---
title: vite 问题排查
date: 2025-09-09 10:00:00
tags:
  - front-end
  - vite
---
# vite 问题排查
## process is not defined

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
## storybook 中 When I use the tsx/jsx file , the vue prompt is invalid vnode type

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
      <!-- console.log(config.plugins) -->
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

## Message 主题色没有变化

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

## JavaScript heap out of memory 内存泄漏

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
### 其他思路
- swap
- 先关 sourcemap 试一次
  - 这是高收益排查项。Vite 相关 issue 里，sourcemap 是非常常见的内存放大器。
- 给 Node 合理提堆，但别无脑拉满
  - 常见做法是：
  - NODE_OPTIONS="--max-old-space-size=4096" pnpm build
  - 或 6144 / 8192 逐步试，而不是一上来极端拉高。因为堆越大，GC 停顿和 swap 风险也会上来。
- 检查插件链
  - Vite 官方性能文档明确提醒，社区插件的 transform / load / resolveId 等 hook 可能显著拖慢并放大成本；大型项目里，插件常常比 Vite 本体更容易成为瓶颈。
- 减少构建期工作量
  - 关闭 build.reportCompressedSize
  - 做更细的 code splitting / dynamic import
  - 避免一次性打进巨量模块
  - 检查是否某些库整包引入、某些插件全量扫描文件
  - Vite 文档提到关闭压缩体积报告可提升大型项目构建性能；Rollup 官方也建议用 code splitting、精细导入、关闭 sourcemap 来减轻内存压力。
  - 必要时升级 Vite / 相关插件，而不是只盯着 Vite 5
  - 因为很多 OOM 其实落点在 Rollup、插件、框架层封装，而不一定是 “Vite 5 本身有个固定 bug”。
