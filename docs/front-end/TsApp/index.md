# Ts App
## 常见问题：
### 没有类型声明文件的第三方库
- 写一个module-env.d.ts模块声明文件
```ts
// declare module 'xxx' 用于给第三方模块声明类型。
declare module 'moudleName' {
  const moudle: any;
  export default moudle;
}
```
- global-env.d.ts 用于全局类型
```ts
// declare global 用于给全局对象（如 window）扩展类型。
declare global {
  interface Window {
    particlesJS: any;
  }
}
export {};
```
- 如果两个混用
  - 在 TypeScript 中，带 export {} 的 .d.ts 文件会被认为是一个模块，这个模块的作用域默认 不是全局的
  - 你把 declare global { ... } 写在模块中没问题，但是 同一个文件里如果直接写 declare module '...'
  - 它会被认为是在模块作用域里声明，不是全局生效的，可能导致模块声明无效或者报错
### 保证ts可以正确的识别moudleName模块
- global-env.d.ts 放在项目根目录或 src 目录下
  - 通常，TypeScript 会自动识别项目中的 .d.ts 文件，无论它们在哪里，只要它们不在 exclude 列表里。
- 2、可以在 tsconfig.json 中使用 include 字段明确包含它
```js
{
  "include": [
    "src/**/*.ts",       // 包含所有 TypeScript 文件
    "global-env.d.ts"    // 显式包含 global-env.d.ts
  ]
}
```
- 3、如果你有多个类型声明文件目录，使用 typeRoots
  - 创建一个 types 目录，将 global-env.d.ts 放到其中
```js
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types", // 保留默认的类型根目录
      "./types"                // 自定义类型根目录
    ]
  }
}
```
4、使用 types 配置
```js
{
  "compilerOptions": {
    "types": [
      "global-env"  // 这里是你自定义的类型声明文件名
    ]
  }
}
```
### 忽略ts检查
```js
// @ts-ignore
```
## tsconfig.json 配置
### moduleResolution
模块导入路径的解析：确定模块的物理文件路径。模块类型的解析：加载对应的类型定义文件（如 .d.ts 文件）。
- node	模拟 Node.js 模块解析规则，支持 node_modules。	现代项目的默认选择。
- classic	早期规则，不支持 node_modules，仅支持简单路径解析。	旧项目或全局脚本模式。
- bundler	兼容现代打包工具，支持复杂导入规则（如条件导入）。	配合现代工具链（如 Vite）。
  - 更好地支持现代打包工具（如 Vite、Webpack 和 Rollup）的模块解析逻辑。
  - 它特别适用于那些使用 ES 模块和路径别名的项目，并希望 TypeScript 的解析与实际运行环境的解析行为保持一致。
  - 支持根据 package.json 的 exports 和 imports 字段解析模块，确保模块解析符合 ES 模块标准。
  - bundler 模式可以准确处理使用现代模块导出（exports 字段）的第三方库，这些库在 node 模式下可能会导致解析问题。 
```json
{
  "compilerOptions": {
    "composite": true,
    "baseUrl": "./",
    "module": "ESNext",
    /* moduleResolution 指定模块解析策略，决定 TypeScript 如何寻找模块文件（例如通过 import 或 require）。它的配置对模块的加载方式有直接影响。*/
    "moduleResolution": "Bundler",
    "typeRoots": [
      "./node_modules/@types", // 保留默认的类型根目录
      "./types"                // 自定义类型根目录
    ],
    "types": [
      "global-env"  // 这里是你自定义的类型声明文件名
    ]
  }
}
```
