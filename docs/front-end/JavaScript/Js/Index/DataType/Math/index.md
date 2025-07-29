### Math
#### Math.max() / Math.min()
- Math.max 给定数值中最大的数
  ```js
  console.log(Math.max(1, 3, 2));
  // 3
  console.log(Math.max(-1, -3, -2));
  // -1
  const array1 = [1, 3, 2];
  console.log(Math.max(...array1));
  // 3
  ```
#### Math.pow() / Math.hypot() / Math.sqrt()
- Math.pow(base,exponent) 函数返回基数（base）的指数（exponent）次幂，即 base^exponent。
- 形同：2**10 2的10次方（指数运算）
  ```js
  // 2的3次方
  console.log(Math.pow(2, 3));
  console.log(2**3);
  // 8
  console.log(Math.pow(4, 0.5));
  // 2
  console.log(Math.pow(7, -2));
  // 0.02040816326530612
  console.log(Math.pow(-7, 0.5));
  // NaN
  ```
- Math.hypot(x1,x2) 函数返回所有参数的平方和的平方根
  ```js
  console.log(Math.hypot(3, 4));
  // 3*3 + 4*4 平方根
  // 5
  console.log(Math.hypot(3, 4, 5));
  // 7.0710678118654755
  console.log(Math.hypot(-5));
  // 5
  ```
  - Math.sqrt(x) 平方根
  ```js
  console.log(Math.sqrt(25));
  // 5
  ```
#### Math.ceil() / Math.floor() / Math.round() / Math.trunc()
- Math.ceil(x) 向上取整
  ```js
  console.log(Math.ceil(1.2)) //2
  console.log(Math.ceil(-1.2)) //-1
  ```
- Math.floor(x) 向下取整
  ```js
  console.log(Math.floor(1.2)) //1
  console.log(Math.floor(-1.2)) //-2
  ```
- Math.round() 四舍五入后最接近的整数
  ```js
  console.log(Math.round(1.5)) //2
  console.log(Math.round(1.2)) //1
  console.log(Math.round(-1.6)) //2
  console.log(Math.round(-1.5)) //1
  ```
- Math.trunc(x) 删除掉数字的小数部分和小数点，不管参数是正数还是负数
  ```js
  Math.trunc(1.2); // 1
  Math.trunc(1.8); // 1
  Math.trunc(-1.2); // -1
  Math.trunc(-1.8); // -1
  ```
#### Math.random() / window.crypto.getRandomValues()
- Math.random() 伪随机数在范围从0 到小于1（从 0（包括 0）往上，但是不包括 1（排除 1））
  - 得到一个两数之间的随机数 
  - `Math.random() * (max - min) + min;`
    ```js
    // 这个值不小于 min（有可能等于），并且小于（不等于）max。
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    console.log(getRandomArbitrary(1, 10));
    ```
  - 得到一个两数之间的随机整数 
  - `minCeiled = Math.ceil(min);`
  - `maxFloored = Math.floor(max);`
  - `Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)`
    ```js
    function getRandomInt(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 不包含最大值，包含最小值
    }
    console.log(getRandomInt(1, 10));
    ```

  - 得到一个两数之间的随机整数，包括两个数在内
  - `minCeiled = Math.ceil(min);`
  - `maxFloored = Math.floor(max);`
  - `Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)`
    ```js
    function getRandomIntInclusive(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 包含最小值和最大值
    }
    ```
- window.crypto.getRandomValues
  ```js
  var array = new Uint32Array(10);
  window.crypto.getRandomValues(array);
  console.log("Your lucky numbers:");
  for (var i = 0; i < array.length; i++) {
      console.log(array[i]);
  }
  //359997624, 1361574309, 688683877,.........
  ```
- 对比：
  - Math.random() 不能提供像密码一样安全的随机数字。
  - 使用 Web Crypto API 来代替，和更精确的window.crypto.getRandomValues() 方法。

- 参考：
  - [Math.random](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random#%E7%A4%BA%E4%BE%8B)
