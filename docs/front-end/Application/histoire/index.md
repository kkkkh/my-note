---
title: histoire 使用记录
date: 2025-06-13
---
# histoire
## 1、在monorepo中使用
### 方案1：
- 1.1、在根目录下创建一个histoire.config.ts文件，然后使用histoire的api来配置histoire
- 1.2、但是涉及到packages中，有vue2和vue3情况，写两个histoire.config.ts文件，分别走不同的配置
  ```js
  const mode = process.env.MODE || 'vue3'
  import histoireConfigVue2 from './histoire.config.vue2.js'
  import histoireConfigVue3 from './histoire.config.vue3.js'

  export default mode === 'vue2' ? histoireConfigVue2 : histoireConfigVue3
  ```
- 1.3、plugins配置：走不同的vue2 `@histoire/plugin-vue2`和vue3 `@histoire/plugin-vue`的插件
- 1.4、vite配置：vue插件使用不同的插件 vue3 `@vitejs/plugin-vue` vue2 `@vitejs/plugin-vue2`
- 1.5、但是应该是依旧报错，vue如何区分是一个问题，使用包别名来区分，还是？尝试各种配置无果，改用方案2

### 方案2：
- 2.1、在packages vue3、vue2的文件夹中配置histoire.config.ts文件、并且安装histoire
- 2.2、在根目录下创建一个使用`pnpm --filter @play/vue3 dev:story` 调用内部执行
- 2.3、这样就避免的了冲突报错


## 2、histoire 配置
### vue2中的配置
- histoire.config.js

<<< @/submodule/play/packages/vue2/histoire.config.js

- histoire.setup.js

<<< @/submodule/play/packages/vue2/histoire.setup.js

### vue3中的配置
- histoire.config.ts

<<< @/submodule/play/packages/vue3/histoire.config.ts

- histoire.setup.ts

<<< @/submodule/play/packages/vue3/histoire.setup.ts

