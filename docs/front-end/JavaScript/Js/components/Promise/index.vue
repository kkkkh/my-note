<template>
</template>
<script setup>
class MyPromise {
  constructor(executor) {
    this.state = 'pending'; // 初始状态为 pending
    this.value = undefined; // 初始值为 undefined
    this.reason = undefined; // 初始原因为 undefined
    this.onFulfilledCallbacks = []; // 成功回调函数队列
    this.onRejectedCallbacks = []; // 失败回调函数队列
    debugger
    const resolve = (value) => {
      debugger
      if (this.state === 'pending') {
        this.state = 'fulfilled'; // 状态变为 fulfilled
        this.value = value; // 存储成功结果
        this.onFulfilledCallbacks.forEach(fn => fn(value)); // 执行所有成功回调函数
      }
    };
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'; // 状态变为 rejected
        this.reason = reason; // 存储失败原因
        this.onRejectedCallbacks.forEach(fn => fn(reason)); // 执行所有失败回调函数
      }
    };
    try {
      executor(resolve, reject); // 立即执行 executor 函数
    } catch (error) {
      reject(error); // 如果 executor 函数抛出异常，则将 Promise 状态变为 rejected
    }
  }

  then (onFulfilled, onRejected) {
    debugger
    // 处理 onFulfilled 和 onRejected 为函数的情况
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    const promise2 = new MyPromise((resolve, reject) => {
      debugger
      if (this.state === 'fulfilled') {
        // 异步执行 onFulfilled
        setTimeout(() => {
          try {
            debugger
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject); // 处理 onFulfilled 的返回值
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === 'rejected') {
        // 异步执行 onRejected
        setTimeout(() => {
          try {
            debugger
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject); // 处理 onRejected 的返回值
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === 'pending') {
        // 如果状态为 pending，则将回调函数添加到队列中
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              debugger
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject); // 处理 onFulfilled 的返回值
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              debugger
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject); // 处理 onRejected 的返回值
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  catch (onRejected) {
    debugger
    return this.then(null, onRejected);
  }
}

function resolvePromise (promise2, x, resolve, reject) {
  if (promise2 === x) {
    // 防止循环引用
    return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }
  let called; // 避免多次调用 resolve 或 reject
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // x 是一个对象或函数
    try {
      const then = x.then; // 获取 x 的 then 方法
      if (typeof then === 'function') {
        // x 是一个 Promise 对象
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject); // 递归解析 Promise
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // x 不是一个 Promise 对象，直接 resolve
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // x 是一个原始值，直接 resolve
    resolve(x);
  }
}

const test = () => {
  new MyPromise((resolve, reject) => {
    debugger
    resolve(1)
  }).then(res => {
    debugger
    console.log(res)
  }).catch(err => {
    debugger
    console.log(err)
  })
}

defineExpose({
  test
})
</script>
<style lang="scss" scoped></style>
