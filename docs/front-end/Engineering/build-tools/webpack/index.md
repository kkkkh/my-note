---
outline: deep
---
# webpack
[学习 Webpack5 之路（优化篇）](https://juejin.cn/post/6996816316875161637)
## hash、chunkhash、contenthash
```js
{
  entry:{
      main: path.join(__dirname,'./main.js'),
      vendor: ['react', 'antd'] // vendor 数组则表示在构建过程中需要被提取到单独的 chunk 文件中的库
  },
  output:{
      path:path.join(__dirname,'./dist'),
      publicPath: '/dist/',
      filname: 'bundle.[chunkhash].js'
  }
}
```
webpack给我们提供了三种哈希值计算方式，分别是hash、chunkhash和contenthash
- hash：跟整个项目的构建相关，构建生成的文件hash值都是一样的，只要项目里有文件更改，整个项目构建的hash值都会更改。
- chunkhash：根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的hash值。
- contenthash：由文件内容产生的hash值，内容不同产生的contenthash值也不一样。

## experiments.outputModule
Webpack 打包输出 ES Module 格式还处于试验阶段，要打包输出 ES Module 格式，需要配置 experiments.outputModule 为 true。
```js
export default {
  experiments: {
    outputModule: true,
  },
  output: {
    filename: 'index.js',
    library: {
      type: 'module',
    },
  },
}
```
