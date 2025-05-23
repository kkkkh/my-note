---
outline: deep
---
# rollup

## module
output
```js
export default {
  input: 'src/index.js',
  output: [
    {
      entryFileNames: '[name].js',
      dir: 'dist',
      format: 'es',
    },
    {
      entryFileNames: '[name].cjs',
      dir: 'dist',
      format: 'cjs',
    },
    {
      entryFileNames: '[name].browser.js',
      dir: 'dist',
      format: 'iife',
    },
  ],
}
```
preserveModules
```js
export default {
  input: 'src/index.js',
  output: {
    entryFileNames: '[name].js',
    dir: 'dist',
    format: 'es',
    preserveModules: true, //preserveModules 选项可以保留模块结构，不会将所有模块打包成一个文件
    preserveModulesRoot: 'src',
  },
}
```
