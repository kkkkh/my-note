
---
outline: deep
---
# typescript-eslint
[文档](https://typescript-eslint.io/getting-started)
## 实践
- typescript-eslint 使用方法，这个配置试用ts的
```bash
# 1
npm install --save-dev eslint @eslint/js typescript typescript-eslint
```
```js
// 2
// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
```
```bash
# 3
npx eslint .
```
- 当我们遇到eslint的配置，也要支持ts时，并且使用的是"legacy" config setup
- 依赖这两个包
  - @typescript-eslint/parser 
  - [@typescript-eslint/eslint-plugin](https://typescript-eslint.io/packages/eslint-plugin/)
```js
{
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-plugin", // 2
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser" // 1
}
```
