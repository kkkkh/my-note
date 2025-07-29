### Function
#### 箭头函数 / 普通函数 &I
- 普通函数： this 的值取决于函数被调用的方式，它可以是全局对象（在非严格模式下），也可以是调用该函数的对象，还可以通过 call、apply 或 bind 显式指定。
- 箭头函数：
  - 不绑定自己的 this。它会捕获其所在上下文的 this 值，并始终指向该值，且无法通过 call、apply 或 bind 改变
  - 箭头函数中的 this 是词法作用域的，即在定义时就确定了，而不是在运行时确定。
  - 不具备：arguments、new 、prototype
  ```js
  const person = {
    name: '张三',
    greet: function() {
      console.log('普通函数中的 this:', this.name); // this 指向 person 对象
      const innerFunction = function() {
        console.log('普通函数中的 this:', this.name); // this 指向 window 对象（非严格模式）或 undefined（严格模式）
      };
      innerFunction();
      const arrowFunction = () => {
        console.log('箭头函数中的 this:', this.name); // this 指向 person 对象，与 greet 函数的 this 相同
      };
      arrowFunction();
    }
  };
  person.greet();
  ```
#### throttle / debounce &I
- 节流(throttle)
  - 限制函数执行频率的技术
  - 在固定的时间间隔内最多执行一次
  - 无论事件触发的频率有多高，节流都会按照设定的时间间隔执行函数
  ```js
  function throttle(func, delay) {
    // 常规思路实现
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        func(...args);
        lastCall = now;
      }
    };
  }
  ```
  ```js
  function throttle(func, delay, options = {}) {
    let timeoutId;
    let lastExecTime = 0;
    let lastThis;
    let lastArgs;

    const { leading = true, trailing = true } = options;

    function invokeFunc(time) {
      timeoutId = null;
      lastExecTime = time; // 每次func.apply执行一次，就更新lastExecTime 至关重要
      func.apply(lastThis, lastArgs);
    }

    function throttled(...args) {
      const now = Date.now();
      if (!lastExecTime && leading === false) {
        lastExecTime = now;
      }
      // 剩余时间
      const remaining = delay - (now - lastExecTime);
      lastThis = this;
      lastArgs = args;
      // 临界考虑三种情况
      // 2、remaining = 0 达到临界点，即 now - lastExecTime = delay，会与定时器重合，有定时器，则取消定时器；再执行；
      // 3、remaining < 0 超出临界点，即 now - lastExecTime > delay，则直接执行
      // 特殊情况：remaining > delay 这个判断条件可以被视为一种防御性编程的措施，用于处理这些极端的、不常见的情况。
      if (remaining <= 0 || remaining > delay) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        lastExecTime = now; // 更新lastExecTime 至关重要
        func.apply(lastThis, lastArgs);
        // 1、还在节流时间内，即 now - lastExecTime < delay，并且没有定时器
      } else if (!timeoutId && trailing) {
        timeoutId = setTimeout(() => {
          invokeFunc(Date.now());
        }, remaining);
      }
    }

    throttled.cancel = () => {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastExecTime = 0;
    };

    return throttled;
  }
  ```
- 防抖（Debouncing）
  - 防抖是一种延迟函数执行的技术。
  - 它确保函数在一段时间内只执行一次，只有在停止触发事件后的一段时间后才执行 。
  - 如果在延迟时间内再次触发事件，则重新计时。
  ```js
  // 常规思路实现
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
          let that = this
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.call(that,...args);
      }, delay);
    };
  }
  ```
  ```js
  // underscorejs 实现
  import restArguments from './restArguments.js';
  import now from './now.js';
  export default function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous; // 当前时间 - 上一次时间
      // wait > passed 在一段时间内有触发，passed小于时间区间，再次创建新的setTimeout
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      // 满足
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        if (!timeout) args = context = null;
      }
    };
    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now(); // 这里是关键 每次执行会更新previous
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }
  ```
- 参考：
  - [underscorejs throttle](https://underscorejs.org/docs/modules/throttle.html)
  - [underscorejs debounce](https://underscorejs.org/docs/modules/debounce.html)
  - [loadsh throttle](https://github.com/lodash/lodash/blob/main/lodash.js#L10965)
  - [loadsh debounce](https://github.com/lodash/lodash/blob/main/lodash.js#L10372)
#### bind / call / apply
- bind() 方法创建一个新函数，
- 当调用该新函数时，它会调用原始函数并将其 this 关键字设置为给定的值，
- 同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。
  ```js
  "use strict"; // 防止 `this` 被封装到到包装对象中
  function log(...args) {
    console.log(this, ...args);
  }
  const boundLog = log.bind("this value", 1, 2);
  const boundLog2 = boundLog.bind("new this value", 3, 4);
  boundLog2(5, 6); // "this value", 1, 2, 3, 4, 5, 6
  ```
  ```js
  // call
  function Product(name, price) {
    this.name = name;
    this.price = price;
  }
  function Food(name, price) {
    Product.call(this, name, price);
    this.category = 'food';
  }
  console.log(new Food('cheese', 5).name);
  // Expected output: "cheese"
  ```
  ```js
  // apply
  const numbers = [5, 6, 2, 3, 7];
  const max = Math.max.apply(null, numbers);
  console.log(max);
  // Expected output: 7
  const min = Math.min.apply(null, numbers);
  console.log(min);
  // Expected output: 2
  ```
#### func?.(args)
- 判断是否是Function
  - func && typeof func === 'function' && func(args)
  - ES2020的新语法func?.(args)
#### arguments.callee()
- 调用当前执行的函数，匿名函数场景使用
- es5严格模式废弃
