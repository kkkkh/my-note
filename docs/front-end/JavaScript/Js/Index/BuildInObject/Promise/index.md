### Promise &I
#### Promise

源码分析


<img src="./components/Promise/promise.drawio.svg" alt="promise" v-viewer/>

<!-- <ImgView :images="['./components/Promise/promise.drawio.svg']" /> -->

<<< ./components/Promise/index.vue

<Test :is="Promise" />

- [Promise A+ 规范](https://promisesaplus.com/)
- [Promise v8 源码实现](https://chromium.googlesource.com/v8/v8/+/3.29.45/src/promise.js?autodive=0/) 比较旧
#### Promise.resolve() / Promise.reject()
```js
// 返回一个Promsie对象
function syncMethod(x) {
  return x * 2;
}
const promiseMethod = (x) => Promise.resolve(syncMethod(x));
promiseMethod(5)
  .then(result => {
    console.log(result); // 输出: 10
  });
```
#### Promise.all
- 报错处理
```js
const promise1 = Promise.resolve(1);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  throw new Error("3")
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error)=>{
  console.log(error)
});
//  Error: 3
```
```js
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve, reject) => {
  throw new Error("2")
});
const promise3 = new Promise((resolve, reject) => {
  throw new Error("3")
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error)=>{
  console.log(error)
});
//  Error: 2
```
```js
const promise1 = Promise.resolve(1);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(()=>{
    // reject(3)
    throw new Error("3")
  },1000)
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error)=>{
  console.log(error)
});
//  then 和 catch 都不会被触发
// setTimeout中的Error无法被捕获到，可使用reject报错处理
```
#### 对比
- Promise.all()
  - 返回一个兑现值数组，有reject，则catch
- Promise.allSettled()
  - 所有输入的 Promise 完成，不管resolve还是reject
- Promise.any()
  - 返回第一个兑现的 Promise
  - 没有 Promise 被兑现，使用 AggregateError 进行拒绝
- Promise.race()
  - 第一个异步任务完成时，不管resolve还是reject

- 参考：[Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
