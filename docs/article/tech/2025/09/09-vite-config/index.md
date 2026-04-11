---
title: vite 配置
date: 2025-09-09 09:00:00
tags:
  - front-end
  - vite
---
# vite 配置
## 共享配置
- css.preprocessorOptions`[extension]`.additionalData
  - 该选项可以用来为每一段样式内容添加额外的代码。
  - 但是要注意，如果你添加的是实际的样式而不仅仅是变量，那这些样式在最终的产物中会重复。
  - 适用：给所有scss文件添加额外的代码 `@use "/styles/element/index.scss" as *;` 直接使用这个scss文件中的变量信息等
  ```js
  export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$injectedColor: orange;`,
        },
      },
    },
  })
  ```
## 多配置文件 1 script
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
## 多配置文件 2 vite.config.js
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
## 分包
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
## lib 打包
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
## link 本地包配置
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