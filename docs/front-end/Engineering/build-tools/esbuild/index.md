---
outline: deep
---
# esbuild 
## 常用命令
```bash
esbuild `find src \\( -name '*.js' \\)` --platform=node --format=cjs --outdir=dist --minify
esbuild src/app.js --platform=node --format=cjs --outdir=dist --bundle --minify --packages=external
esbuild src/app.js --platform=node --format=cjs --outdir=dist --bundle --minify-whitespace
```
- --bundle
  - 对src/*js`分别打包`，打包结果不捆绑为一个文件
  - 打包结果捆绑为一个文件，app.js中以来导入，会递归内联到导出文件
- --outdir=dist 导出到dist文件夹
- --platform=node/browser 输出平台
- --format=cjs/esm/iife
```js
// cjs
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
// index.js
var test_exports = {};
__export(test_exports, {
  default: () => test_default
});
module.exports = __toCommonJS(test_exports);
// b.js
console.log("b.js");
var b_default = {};
// a.js
console.log(b_default);
console.log("a.js");
var a_default = {};
// index.js
console.log(a_default);
var test_default = {};
```
```js
// esm
// b.js
console.log("b.js");
var b_default = {};
// a.js
console.log(b_default);
console.log("a.js");
var a_default = {};
// index.js
console.log(a_default);
var test_default = {};
export {
  test_default as default
};
```
```js
// iife
(() => {
  // b.js
  console.log("b.js");
  var b_default = {};
  // a.js
  console.log(b_default);
  console.log("a.js");
  var a_default = {};
  // index.js
  console.log(a_default);
  var test_default = {};
})();
```
- --packages=bundle/external bundle绑定依赖包，external排除依赖包
- --minify 压缩代码
```bash
echo 'fn = obj => { return obj.x }' | esbuild --minify
# fn=n=>n.x;
```
- --minify-whitespace /--minify-identifiers /--minify-syntax
```bash
echo 'fn = obj => { return obj.x }' | esbuild --minify-whitespace
# fn=obj=>{return obj.x};
echo 'fn = obj => { return obj.x }' | esbuild --minify-identifiers
# fn = (n) => {
#   return n.x;
# };
echo 'fn = obj => { return obj.x }' | esbuild --minify-syntax
# fn = (obj) => obj.x;
```

- 参考：[esbuild api](https://esbuild.github.io/api/#overview)
