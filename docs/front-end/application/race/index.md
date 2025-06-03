---
outline: deep
title: 竞态问题
date: 2025-05-01
---
# race竞态问题 &I
- 处理思路：
  - 1、让最后一次生效，之前失效：vue watch（主要）
  - 2、继发请求，按照发送的顺序执行： Promise 链和队列
## vue watch
- 代码示例：
  ```js
  let finalData
  watch(obj, async () => {
    // 发送并等待网络请求
    const res = await fetch('/path/to/request')
    // 将请求结果赋值给 data
    finalData = res
  })
  ```
- 问题：
  - 第一次请求 A：假设我们第一次修改 obj 对象的某个字段值，这会导致回调函数执行，同时发送了第一次请求 A。
  - 第二次请求 B：随着时间的推移，在请求 A 的结果返回之前，我们对 obj 对象的某个字段值进行了第二次修改，这会导致发送第二次请求 B。
  - 此时请求 A 和请求 B 都在进行中，那么哪一个请求会先返回结果呢？
  - 结果：我们不确定，如果请求 B 先于请求 A 返回结果，就会导致最终 finalData 中存储的是 A 请求的结果
- 解决思路：
  - 让最后一次生效，前一次失效
  - 请求 B 的结果应该被视为“最新”的，而请求 A 已经“过期”了，其产生的结果应被视为无效。
- 代码实现：
  - watch 函数的回调函数接收第三个参数 onInvalidate，使用 onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行；
    ```js
    watch(obj, async (newValue, oldValue, onInvalidate) => {
      // 定义一个标志，代表当前副作用函数是否过期，默认为 false，代表没有过期
      let expired = false
      // 调用 onInvalidate() 函数注册一个过期回调
      onInvalidate(() => {
        // 当过期时，将 expired 设置为 true
        expired = true
      })
      // 发送网络请求
      const res = await fetch('/path/to/request')

      // 只有当该副作用函数的执行没有过期时，才会执行后续操作。
      if (!expired) {
        finalData = res
      }
    })
    ```
  - 在 watch 内部每次检测到变更后，在副作用函数重新执行之前，先检查是否存在过期回调，如果存在，则执行过期回调函数（通过 onInvalidate 函数注册的过期回调）；
    ```js
    function watch(source, cb, options = {}) {
      let getter
      if (typeof source === 'function') {
        getter = source
      } else {
        getter = () => traverse(source)
      }
      let oldValue, newValue
      // cleanup 用来存储用户注册的过期回调
      let cleanup
      // 定义 onInvalidate 函数
      function onInvalidate(fn) {
        // 将过期回调存储到 cleanup 中
        cleanup = fn
      }

      const job = () => {
        newValue = effectFn()
        // 在调用回调函数 cb 之前，先调用过期回调
        if (cleanup) {
          cleanup()
        }
        // 将 onInvalidate 作为回调函数的第三个参数，以便用户使用
        cb(newValue, oldValue, onInvalidate)
        oldValue = newValue
      }

      const effectFn = effect(
        // 执行 getter
        () => getter(),
        {
          lazy: true,
           scheduler: () => {
            if (options.flush === 'post') {
              const p = Promise.resolve()
              p.then(job)
            } else {
              job()
            }
          }
        }
      )

      if (options.immediate) {
        job()
      } else {
        oldValue = effectFn()
      }
    }
    ```
- 参考：
  - [onwatchercleanup](https://cn.vuejs.org/api/reactivity-core.html#onwatchercleanup)
## AbortController
- 使用 AbortController 控制请求的取消，让前一次请求失效
- watch 示例只是使用了expired 控制，可以在此基础上，使用 AbortController 控制请求的取消
  ```js
  if (controller) {
      controller.abort();
  }
  controller = new AbortController();
  const signal = controller.signal;
  const response = await fetch(url, { signal });
  ```

