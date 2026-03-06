---
outline: deep
---
# Ts Plugin
## jsDoc
- JSDoc 是在 js 的注释里通过 @type、@typedef、@template、@param 等来定义类型，然后开启 checkJS 和 allowJS 的配置之后，tsc 就可以对 js 做类型检查

- 参考：
  - [JSDoc 真能取代 TypeScript？](https://cloud.tencent.com/developer/article/2351090)
  - [typescript 官网 JSDoc 参考](https://tslang.com.cn/zh/docs/handbook/jsdoc-supported-types.html)
## tsDoc
- 1、jsdoc 与 tscode 对比
  - JSDoc 主要目的是给 JS 添加类型提示，顺便生成文档，但是该规范非常复杂，写起来很繁琐（需要写大量处理类型相关的注释）；
  - TSDoc 是微软官方推出的，专门针对 TypeScript 项目，TSDoc 规范非常轻量，不需要额外考虑类型。
- 2、api-extractor 的作用可简单理解为：提取源码中根据[TSDoc 规范](#TSDoc 规范)编写的注释以及 TS 类型签名。
  - 解析源码中代码注释为文档模型文件 `*.api.json*`，类似于 babel 对源代码进行解析得到 AST 树；
  - 像 rollup 一样整合 TS 输出的类型声明文件 *.d.ts，可以根据源码中 @public @beta  @internal 等标记以及配置规则过滤掉不必要的类型声明；
  - 整合所有对外导出的 API 签名，每次代码变更时将对比新代码的 API 签名与以前的签名是否一致，以此来检查代码变更是否会影响包的对外导出，比如：是否意外的修改了方法名、方法参数数量、误删了对外导出等。
- 3、api-documenter 的作用可简单理解为：将上一步 api-extractor 提取的文档模型文件转换为便于阅读的 markdown 文件。
- 4、Vuepress 的作用可简单理解为：将上一步 api-documenter 生成的 markdown 文件编译为 HTML 页面，相当于化了个美美的妆💅。

- 参考：
  - [基于TSDoc规范生成漂亮的开源项目文档](https://juejin.cn/post/7275943600780787753)
