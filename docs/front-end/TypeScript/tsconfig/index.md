```json
{
  "compilerOptions": {
    "composite": true,
    "baseUrl": "./",
    "module": "ESNext",
    // 指定模块解析策略，决定 TypeScript 如何寻找模块文件（例如通过 import 或 require）。它的配置对模块的加载方式有直接影响。
    // 1、 模块导入路径的解析：确定模块的物理文件路径。
    // 2、模块类型的解析：加载对应的类型定义文件（如 .d.ts 文件）。
    // node	模拟 Node.js 模块解析规则，支持 node_modules。	现代项目的默认选择。
    // classic	早期规则，不支持 node_modules，仅支持简单路径解析。	旧项目或全局脚本模式。
    // bundler	兼容现代打包工具，支持复杂导入规则（如条件导入）。	配合现代工具链（如 Vite）。
      // 更好地支持现代打包工具（如 Vite、Webpack 和 Rollup）的模块解析逻辑。
      // 它特别适用于那些使用 ES 模块和路径别名的项目，并希望 TypeScript 的解析与实际运行环境的解析行为保持一致。
      // 支持根据 package.json 的 exports 和 imports 字段解析模块，确保模块解析符合 ES 模块标准。
      // bundler 模式可以准确处理使用现代模块导出（exports 字段）的第三方库，这些库在 node 模式下可能会导致解析问题。
    "moduleResolution": "Bundler",
  }
}
```
