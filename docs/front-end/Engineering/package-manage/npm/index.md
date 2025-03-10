---
outline: deep
---
# npm
## npm command
### npm config
```bash
npm config registry https://registry.npmmirror.com
```
### npm tag
```bash
npm dist-tag ls vue
# alpha: 3.5.0-alpha.5
# beta: 3.5.0-beta.3
# csp: 1.0.28-csp
# latest: 3.5.12
# legacy: 2.7.16
# rc: 3.5.0-rc.1
# v2-latest: 2.7.16
npm install typescript@beta
npm install typescript@latest
npm publish # 自动打上latest的tag
npm publish --tags beta # 打的就是 beta 的 tag
```
### npm link 
```bash
# 包的目录
npm link
#  引入包的目录
npm link backageName
```
## package.json
### 版本
- 版本对比：
  - 1.0.0 主版本号.次版本号.补丁版本号
  - 主版本 >=1
    - ~1.1.2 匹配范围：>=1.1.2 <1.2.0（1.1.x）
    - ^1.1.2 匹配范围：>=1.1.2 <2.0.0（1.x.x）
    - `行为不一致`
  - 主版本 = 0
    - ^0.1.2 匹配范围：>=0.1.2 <0.2.0（1.1.x）
    - ~0.1.2 匹配范围：>=0.1.2 <0.2.0（1.1.x）
    - `行为一致`
  - 参考：[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
- 同时安装不同版本
  ```bash
  npm install vue2@npm:vue@^2.6.14
  npm install vue3@npm:vue@^3.2.37
  ```
  ```bash
  pnpm add @antv/x6-v2@npm:@antv/x6@^2.18.1 -D
  # 别名 @antv/x6-v2
  # 连接 @npm
  # 找对应包 @antv/x6@^2.18.1
  ```
  ```json
  {
    "devDependencies":{
      "@antv/x6-v2": "npm:@antv/x6@^2.18.1",
    }
  }
  ```
- overrides 改变依赖关系
```json
{
  "overrides": {
    "@npm/foo": {
      ".": "1.0.0",
      "@npm/bar": "1.0.0"
    }
  }
}
```
参考：[overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides)
### sideEffects
问题：
- lib的
  - 根目录下没有.css,其他目录下有.css：a/xx.css b/xx.css
  - package.json中配置了如下，
  ```json
  {
    "sideEffects": [
      "*.css"
    ],
  }
  ```
- build之后，lib根目录下有xx.css，
- 项目引入lib下的xx.css，发现无法引入模块了，但是lib下确实存在xx.css
- 尝试给vite 配置，就可以了
  ```js
  {
    resolve: {
      alias: [
        {find: 'packageName', replacement: '/node_modules/packageName'}
      ],
    },
  }
  ```
- 初步分析：
  - 路径解析受到影响
- 修改sideEffects，打包，问题就没有出现了，解决
  ```json
  {
    "sideEffects": [
      "**/*.css"
    ],
  }
  ```
分析：
1、打包时的package.json和引入时的package.json是同一个
- 打包时：
  - `"sideEffects": ["*.css"]`根目录下的*.css是有副作用的，`"sideEffects": ["**/*.css"]`是其他目录下也是有副作用的；
  - 修改sideEffects是否真的影响打包结果的（测试结果：应该有，副作用会起作用）
- 引入时：
  - 是打包结果影响的呢（好像打包结果也差不多）？（测试结果：可能是，但是都有这个css文件，按道理说不会影响引用）
  - 还是修改了package.json的sideEffects配置，`"sideEffects": ["*.css"]`和`"sideEffects": ["**/*.css"]`，对路径解析分别有影响呢？（测试结果：不是，修改lib 的package.json不起作用）
- 再测试一次, 测试结果：
  - 打包时：sideEffects影响了输出结果
  - 引入时：路径解析受到影响，更改lib的package.json的sideEffects，不能解决路径问题
  - 但是（几个疑点）：
  - 1、通过pnpm link `本地`的打包结果，又不存在这个问题（之前的所有引用时npm发布的backage引用的）
  - 2、重新下载下来发布的包，放到本地引用，确实是有这个问题，这说明这两个包有不同的
- 进行详细对比结果
  - 1、发现 `"./*.css": "./*.cssc",` css多了一个c，真相大白，不是sideEffects影响的，误操作导致的
    ```json
    {
      "exports": {
        "./*.css": "./*.cssc",
      },
    }
    ```
  - 2、更改后，不存在路径解析不到的问题
  - `"sideEffects": ["*.css"]`根目录下的*.css是有副作用的，`"sideEffects": ["**/*.css"]`是其他目录下也是有副作用的；
  - 这里应该产生了影响，但其实都没有影响，副作用不会影响文件引用
- 引入时：
  - `"sideEffects": ["*.css"]`和`"sideEffects": ["**/*.css"]` 对路径解析分别有影响呢？
  - 这里不受影响
2、sideEffects到底什么用？详细分析一下
```js
// utils/a.js
export function a() {
  console.log('a');
}
```
```js
// utils/b.js
console.log('======== b.js ==========');
export function b() {
  console.log('b');
}
```
```js
// utils/index.js
export * from './a';
export * from './b';
```
```js
// app.js
import { a } from './utils';
a();
```
- 以上测试代码，b模块（模块的副作用：模块执行的时候除了导出成员，其他的如：`console.log('======== b.js ==========');`就是副作用）
- 进行tree shaking：
- appjs没有加载b模块，tree shaking只能移除没有用到的代码成员，`export ...`；
- 但是b.js中的副作用代码`console.log('======== b.js ==========');`被保留了；
```js
// output
([
  function(e, t, r) {
    'use strict';
    r.r(t),
      console.log('======== b.js =========='),
      console.log('a');
  },
])
```
- 当b模块被加载时，我们希望执行我们副作用代码；
- 因为整个模块没有被使用到，所以副作用代码也没有必要保留了；
- 没必要保留副作用代码`console.log('======== b.js ==========');`去除需要sideEffects；
- 注意：
  - 对全局有影响的副作用代码不能移除；
  - 只是对模块有影响的副作用代码就可以移除；
- `sideEffects:false` 代表所有代码都没有副作用，就会将有导出export，没有加载，这种情况中的，副作用代码去掉；
- 有些副作用是需要保留的：`"sideEffects": ["./src/**/*.css"]` 代表这些个.css是有副作用的，进行保留；
### bin
- `pnpm dev` 或者 `yarn start`
- 启动脚本运行前会先自动新建一个命令行环境，然后把当前目录下的node_modules/.bin加入系统环境变量中，
- 接着执行scripts配置节指定的脚本的内容，执行完成后再把node_modules/.bin从系统环境变量中删除。
- 所以，当前目录下的node_modules/.bin子目录里面的所有脚本，都可以直接用脚本名调用，不必加上路径
