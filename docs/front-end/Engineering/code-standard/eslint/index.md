---
outline: deep
---
# eslint
## 基本概念
- 规则 rules
- 配置文件
- 可共享配置 extends
  - 指定一个或多个现成的规则集（配置文件）作为基础配置。plugins和rule的集成品
  - 以 eslint-config- 开头：eslint-config-myconfig
  - 如果是 npm 范围模块，则只需将模块以 @scope/eslint-config 命名或以此为前缀命名即可，如 @scope/eslint-config 和 @scope/eslint-config-myconfig。
  - 使用
  ```js
  {
    "extends": "eslint-config-myconfig"
    // or
    "extends": "myconfig"
    // or
    "extends": ["eslint:recommended", "plugin:react/recommended"]
  }
  ```
- 插件 plugins
  - plugin 定义自己的规则（自己可以配置）
  ```js
  {
    plugins: [
      'eslint-plugin-react'
    ],
    rules: {
      'react/jsx-boolean-value': 2
    }
  }
  ```
  - 创建一个插件[Yeoman 生成器](https://www.npmjs.com/package/generator-eslint)
- 解析器
- settings
  - 所有规则中共享的信息（全局）
...
### 插件
- [eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)
## 实践
### 基本操作
- 给项目初始化eslint
```bash
npm init @eslint/config@latest
# or
yarn create @eslint/config
# or
pnpm create @eslint/config@latest
```
```bash
eslint ./src/**/*.{js,jsx} #对文件进行检查校验
eslint . --no-cache # 清除缓存
```
```json
{
  "scripts": {
    "lint": "eslint ./src/**/*.{js,jsx}",
  },
}
```
### 安装
- 现在pnpm create @eslint/config@latest执行以后
```bash
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · react
√ Does your project use TypeScript? · javascript
√ Where does your code run? · browser
The config that you've selected requires the following dependencies:
eslint, globals, @eslint/js, eslint-plugin-react
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · pnpm
```
- 默认会安装"eslint": "^9.15.0",v9已经使用新的配置系统：
- `平面配置文件`
- 1、文件 .eslintrc.js/.eslintrc.json -> eslint.config.js
```js
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
```
- 2、原来的配置会有兼容的问题
- plugins
  ```js
  // .eslintrc.js
  module.exports = {
      // ...other config
      plugins: ["jsdoc"],
      rules: {
          "jsdoc/require-description": "error",
          "jsdoc/check-values": "error"
      }
      // ...other config
  };
  ```
  ```js
  // eslint.config.js
  import jsdoc from "eslint-plugin-jsdoc";
  export default [
      {
          files: ["**/*.js"],
          plugins: {
              jsdoc: jsdoc
          },
          rules: {
              "jsdoc/require-description": "error",
              "jsdoc/check-values": "error"
          }
      }
  ];
  ```
- 2、可共享配置
  - 你可能会发现有一个你依赖的可共享配置尚未更新为平面配置格式。
  - 在这种情况下，你可以使用 FlatCompat 工具将 eslintrc 格式转换为平面配置格式。
  - 首先，安装 @eslint/eslintrc 包：`npm install @eslint/eslintrc --save-dev`
  ```js
  import { FlatCompat } from "@eslint/eslintrc";
  import path from "path";
  import { fileURLToPath } from "url";
  // mimic CommonJS variables -- not needed if using CommonJS
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const compat = new FlatCompat({
      baseDirectory: __dirname
  });
  export default [
      // mimic ESLintRC-style extends
      ...compat.extends("eslint-config-my-config"),
  ];
  ```
  ```js
  /**
  解决eslint-plugin-react-hooks加载问题，
  eslint-plugin-react-hooks是react官网的eslint插件，并没有实现平面配置格式
  https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
  {
    "extends": [
      // ...
      "plugin:react-hooks/recommended"
    ]
  }
  */
  import globals from "globals";
  import pluginJs from "@eslint/js";
  import pluginReact from "eslint-plugin-react"; //https://github.com/jsx-eslint/eslint-plugin-react#configuration
  import { FlatCompat } from "@eslint/eslintrc";
  import path from "path";
  import { fileURLToPath } from "url";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const compat = new FlatCompat({
      baseDirectory: __dirname
  });

  /** @type {import('eslint').Linter.Config[]} */
  export default [
    {
      files: ["**/*.{js,mjs,cjs,jsx}"],
      rules: {
        "no-unused-vars": ["error", {"args": "none",}], // int.org/docs/latest/rules/no-unused-vars
        // 'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['evt'] }],
        'react/prop-types': ['error', { skipUndeclared: true }],
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
      },
    },
    ...compat.extends("plugin:react-hooks/recommended"),
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
  ];
  ```
- 参考：
  - https://eslint.org/blog/2022/08/new-config-system-part-2/
  - https://zh-hans.eslint.org/docs/latest/use/configure/migration-guide
  - [eslint/prettier/stylelint](https://www.yuque.com/qqqqqcy/original/conventions)
### rules
```js
module.exports = {
  root: true,
  extends: [''],
  settings: {
    'import/resolver': {
      'custom-alias': {
        alias: {
          '@': './src',
        },
      },
    },
  },
  rules: {
    'react/prop-types': ['error', { skipUndeclared: true }],
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    "no-unused-vars": ["error", {"args": "none",}], // int.org/docs/latest/rules/no-unused-vars
    // https://github.com/import-js/eslint-plugin-import/blob/v2.31.0/docs/rules/no-unresolved.md
    "import/no-unresolved": [0] // import tailwindcss from '@tailwindcss/vite' 报错
    "import/no-unresolved": [2, { caseSensitive: true }] // 严格 区分大小写
  },
}
```
### eslint 自定义插件

自定义插件eslint-plugin-lodash.js

<<< @/submodule/play/packages/eslint/plugin-eslint9/eslint-plugin-lodash.js

自定义插件的 eslint.config.js

<<< @/submodule/play/packages/eslint/plugin-eslint9/eslint.config.js

eslint-plugin-no-global-lodash 插件[实现参考](https://github.com/adalbertoteixeira/eslint-plugin-no-global-lodash/blob/master/lib/rules/no-global-lodash.js)

<<< ./js/no-global-lodash.js

參考：
- [generator-eslint](https://www.npmjs.com/package/generator-eslint)
- [eslint-plugin-no-global-lodash](https://www.npmjs.com/package/eslint-plugin-no-global-lodash)
- [eslint-plugin-lodash](https://www.npmjs.com/package/eslint-plugin-lodash)


根据 ESLint 的作用域分析规则，常见的作用域创建节点包括：
| 节点类型                  | 说明                                   |
|--------------------------|----------------------------------------|
| Program                  | 整个脚本或模块的顶层作用域             |
| FunctionDeclaration      | 函数声明，创建函数作用域               |
| FunctionExpression       | 函数字面量，创建函数作用域             |
| ArrowFunctionExpression  | 箭头函数，创建函数作用域               |
| ClassDeclaration         | 类声明，创建类的块级作用域             |
| ClassExpression          | 类表达式，同上                         |
| CatchClause              | try-catch 的 catch 子句，创建作用域     |
| BlockStatement           | ES6 及之后的块级作用域（let/const 所在块）|
| SwitchStatement          | switch 语句，创建块级作用域            |
| ForStatement             | for 循环语句，创建块级作用域           |
| ForInStatement           | for..in 循环，创建块级作用域           |
| ForOfStatement           | for..of 循环，创建块级作用域           |
