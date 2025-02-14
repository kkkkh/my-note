---
outline: deep
---
# Plugin

## Lib
### ui
- ui
  - [storybook](https://storybook.js.org/docs)
- 表格
  - [xlsx](https://docs.sheetjs.com/docs/getting-started/examples/export#live-demo) excel
  - [<s>Luckysheet</s>](https://dream-num.github.io/LuckysheetDocs/zh/guide/) (停止维护) => [univer](https://github.com/dream-num/univer/blob/dev/README-zh.md)
- 富文本
  - [slatejs](https://docs.slatejs.org/) 富文本
  - [wangeditor](https://www.wangeditor.com/v5/getting-started.html)
  - [Tiptap Editor](https://tiptap.dev/docs)
  - [textbus](https://github.com/textbus/textbus)
- 日历
  - [vue-calendar](https://github.com/jinzhe/vue-calendar) => 更完善 [vue-calendar-h5](https://github.com/2277419213/vue-calendar-h5)
  - [vcalendar](https://vcalendar.io/)
- 交互
  - [popper.js v2](https://popper.js.org/docs/v2/) &nbsp;&nbsp;&nbsp;[floating-ui](https://floating-ui.com/docs/getting-started) [Tippy.js](https://atomiks.github.io/tippyjs/) 创建“浮动”元素
  - [sortablejs](https://github.com/SortableJS/Sortable) &nbsp;&nbsp;&nbsp;[sortablejs demo](https://sortablejs.github.io/Sortable/) 拖拽
  - [panzoom](https://github.com/anvaka/panzoom) 缩放平移
  - [clipboard.js](https://clipboardjs.com/) 剪切
  - [vue-seamless-scroll](https://chenxuan0000.github.io/vue-seamless-scroll/guide/) 滚动
- 高亮 & 代码编辑 & 解析器
  - [prismjs](https://prismjs.com/)
  - [monaco-editor](https://github.com/microsoft/monaco-editor)
  - [marked](https://marked.js.org/) markdown 解析器
  - json
    - [JSON Editor](https://github.com/josdejong/jsoneditor) => [json-editor-vue3](https://github.com/guyue88/json-editor-vue3)
    - [JSON Editor doc](https://jsoneditoronline.org/docs/)
    - [JSON Editor online](https://jsoneditoronline.org/#right=local.mepaki)
    - [jsonrepair](https://github.com/josdejong/jsonrepair)
    - [json-editor/json-editor](https://github.com/json-editor/json-editor)
- icons
  - [iconify 文档](https://iconify.design/docs/) &nbsp;&nbsp;&nbsp;[Browse Icons](https://icon-sets.iconify.design/) &nbsp;&nbsp;&nbsp;[icones](https://icones.js.org/)(Icon Explorer with Instant searching, powered by Iconify)
  - [svg4everybody](https://www.npmjs.com/package/svg4everybody) svg兼容
- pdf
  - [jspdf](https://parall.ax/products/jspdf)
  - [html2pdf](https://github.com/eKoopmans/html2pdf.js)
  - [html2canvas](https://html2canvas.hertzen.com/)
- css
  - [normalize.css](https://necolas.github.io/normalize.css/)
- 动画
  - [lottie-ios](https://github.com/airbnb/lottie-ios)
### 功能
- 工具函数
  - [lodash](https://lodash.com/docs/4.17.15)
  - [qs](https://github.com/ljharb/qs) Querystring
  - [ajv](https://ajv.js.org/guide/getting-started.html) 数据验证
- number
  - [bignumber](https://github.com/MikeMcl/bignumber.js/)
- 指标
  - [web-vitals](https://www.npmjs.com/package/web-vitals) 测量真实用户的所有Web Vitals指标
- date
  - [date-fns](https://date-fns.org/docs/Getting-Started) 日期操作
  - [datejs](https://day.js.org/docs/en/installation/installation)
  - [fecha](https://github.com/taylorhakes/fecha)
- zpl
  - [zpl-image](https://www.npmjs.com/package/zpl-image)
  - [zpl-image-2](https://www.npmjs.com/package/zpl-image-2) 图像转换为 Z64 编码或 ACS 编码的 GRF 位图以与 ZPL 一起使用
  - [jszpl](https://www.npmjs.com/package/jszpl) 生成 ZPL
- mock数据
  - [fakerjs](https://fakerjs.dev/guide/) &nbsp;&nbsp;&nbsp;[mockm](https://github.com/wll8/mockm) &nbsp;&nbsp;&nbsp;[mockjs(停止维护)](https://github.com/nuysoft/Mock/wiki/Getting-Started)
- crypto
  - [jsencrypt](https://github.com/travist/jsencrypt) 加密
  - [crypto-js](https://github.com/brix/crypto-js) 数据摘要（停止维护：NodeJS 和现代浏览器都有原生 Crypto 模块）
  - [SparkMD5](https://github.com/satazor/js-spark-md5) md5 实现
- http
  - cookie
    - [Cookies.js](https://github.com/ScottHamper/Cookies)
    - [js-cookie](https://github.com/js-cookie/js-cookie)
  - [mime](https://www.npmjs.com/package/mime)
### 基建
- env
  - [cross-env](https://github.com/kentcdodds/cross-env) 解决跨平台环境变量问题
  - [dotenv](https://dotenvx.com/docs/) 管理本地的 .env 配置文件
- Terminal 终端
  - [enquirer](https://github.com/termapps/enquirer) 在终端中创建交互式提示
  - [node-draftlog](https://github.com/ivanseidel/node-draftlog) 动态加载日志
  - [ora](https://github.com/sindresorhus/ora) 终端旋转器
  - [vue-termui](https://vue-termui.dev/guide/introduction.html) 更强大终端应用程序，构建交互式提示，可以部署到网页并使其在终端中运行的应用程序 vue
  - [ink](https://github.com/vadimdemedes/ink/#israwmodesupported) react
- git
  - [degit](https://github.com/Rich-Harris/degit)
  - git hooks
    - [husky](https://typicode.github.io/husky/)
    - [lint-staged](https://www.npmjs.com/package/lint-staged#configuration)
    - [release-it](https://github.com/release-it/release-it)
    - [release-it/conventional-changelog](https://github.com/release-it/conventional-changelog) 版本提交日志
## Vue plugin (Vue 扩展)
### cli
- [<s>Vue CLI</s>](https://cli.vuejs.org/)(停止维护) => [create-vue](https://github.com/vuejs/create-vue)
### component
- [DMap(谛听)](https://juejin.cn/post/6844903593284206605) ([vue-bigdata-table](https://github.com/lison16/vue-bigdata-table))
- [Vxe Table](https://vxetable.cn/#/start/install)
  - [v4.7+(vue 3.x)](https://vxetable.cn/v4/#/start/install)
  - [v3.0~3.8(vue 2.6)](https://vxetable.cn/v3.8/#/table/start/install)
- [vue-images](https://github.com/littlewin-wang/vue-images)
- [vue-drag-select](https://github.com/ZhiJieZhang1/vue-drag-select)
### api
- [VueRequest](https://cn.attojs.org/guide/introduction.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%80%89%E6%8B%A9-vuerequest)
  - [useRequest](https://cn.attojs.org/api/#%E5%85%AC%E5%85%B1-api)
  - [usePagination](https://cn.attojs.org/api/pagination.html)
- [VueUse](https://vueuse.org/guide/)
- eventBus vue2 事件总线
- [mitt](https://github.com/developit/mitt) vue3 事件总线
- [composition-api](https://github.com/vuejs/composition-api/blob/main/README.zh-CN.md) &nbsp;&nbsp;&nbsp;[composition-api-faq](https://cn.vuejs.org/guide/extras/composition-api-faq)
### vuepress
- [vuepress-theme-hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope?tab=readme-ov-file)
- [vuepress-theme-antdocs](https://github.com/zpfz/vuepress-theme-antdocs)
- [vuepress-theme-reco](https://github.com/vuepress-reco/vuepress-theme-reco)

## React plugin (React 扩展)
- [immutable](https://immutable-js.com/) 不可变数据
- [immerjs](https://immerjs.github.io/immer/zh-CN/)

## Webpack plugin (Webpack 扩展)
### loader
- [vue-loader](https://vue-loader.vuejs.org/zh/)

## Vite plugin (Vite 扩展)
- [unplugin-vue-components](https://www.npmjs.com/package/unplugin-vue-components#Configuration) 按需加载
- [unplugin-icons](https://www.npmjs.com/package/unplugin-icons#auto-importing#Migrate%20from%20vite-plugin-icons) 图标
- [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer) build分析可视化
- [vite-plugin-inspect](https://github.com/antfu-collective/vite-plugin-inspect) 检查Vite插件的中间状态-调试和创作插件

## typescript
### jsdoc
- [jsDoc](https://jsdoc.app/) &nbsp;&nbsp;&nbsp; [jsdoc 中文](https://www.jsdoc.com.cn/) 注释 + 类型
### tsdoc
- [tsDoc](https://tsdoc.org/) 注释（比jsdoc更规范，针对ts）
- [typedoc](https://typedoc.org/) 为ts项目生成文档（一个 API 参考生成器，支持jsdoc/tsdoc）
- [api-extractor](https://api-extractor.com/pages/setup/invoking/) （API 报告、d.ts 汇总、API 文档）
- [api-documenter](https://www.npmjs.com/package/@microsoft/) 将api-extractor生成的文档模型文件转换为markdown
- [rushstack](https://rushstack.io/zh-cn/) 为 web 项目的大规模 monorepo 仓库来提供可复用技术

## canvas / svg / webgl
- 绘图
  - [raphael](https://dmitrybaranovskiy.github.io/raphael/)
  - [fabricjs](http://fabricjs.com/)
- svg

- flowble
  - [bpmn](https://bpmn.io/) bpmn
- gl
  - [kepler.gl](https://kepler.gl/)
- art
  - [p5js](https://p5js.org/zh-Hans/)
  - [roughjs](https://roughjs.com/)
- other
  - [sigmajs](https://www.sigmajs.org/) 节点
  - [getspringy](http://getspringy.com/) 图形布局

## 极客时间(代码地址)
- 现代 React Web 开发实战
  - [oh-my-kanban](https://gitee.com/evisong/geektime-column-oh-my-kanban)
  - [oh-my-kit](https://gitee.com/evisong/geektime-column-oh-my-kit)
- 重学 TypeScript
  - [jike2](https://github.com/aimingoo/jike2)
