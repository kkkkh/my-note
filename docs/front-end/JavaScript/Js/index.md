---
outline: deep
---
<script setup>
import Test from '@/components/Test.vue'
const jsModules = import.meta.glob('@/front-end/JavaScript/Js/components/*/index.vue',{
  eager:true,
  import:'default'
})
const modules = Object.fromEntries(Object.entries(jsModules).map(([key,value])=>{
  return [value.name,value]
}))
</script>

# Js
[JavaScript 参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
## 表达式与操作符
### 变量声明
#### var / let / const &I
- 暂时性死区（Temporal Dead Zone，TDZ）
  - 使用 let 和 const 声明的变量，从代码块的开始到声明语句之间的区域。
  - 在这个区域内，访问这些变量会抛出 ReferenceError 。
- 变量提升：
  - 是指变量的声明会提升到所在作用域的顶部。
  - let a=1：`let a` 会被提升到当前作用域的顶部，不会初始化为undefined，此时访问啊变量，触发暂时性死区（VM401:1 Uncaught ReferenceError: b is not defined），`=1`赋值不会提升
  - var a=1：`var a`变量声明会被提升到作用域顶部，会被初始化为 undefined，`=1`赋值不会提升

| 特性           | var                                      | let                                             | const                                           |
|--------------|------------------------------------------|-------------------------------------------------|-------------------------------------------------|
| 作用域         | 函数作用域或全局作用域                   | 块级作用域                                      | 块级作用域                                      |
| 提升（Hoisting） | 变量声明会被提升，会初始化，但赋值不会提升 | 变量声明会被提升，但不会初始化，存在 TDZ，赋值不会 | 变量声明会被提升，但不会初始化，存在 TDZ，赋值不会 |
| 重复声明       | 允许在同一作用域内重复声明               | 不允许在同一作用域内重复声明                    | 不允许在同一作用域内重复声明                    |
| 值是否可变     | 可变                                     | 可变                                            | 不可变                                          |

```js
for (var i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 300) //输出10次，全部输出10
}
// let声明会将变量绑定到块级作用域，虽然每次循环也会给变量加1，但每次循环都会创建一个新的绑定，也就是说每次执行setTimeout回调时，都是使用自己的i变量。
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 300) //输出10次，依次为0、1、2、…、9
}
```
### 作用域 / 作用域链  &I
- 作用域 Scope
  - 指在程序中定义变量的区域，它决定了变量的可访问性和生命周期
  - 简单来说，作用域就是一个变量可以被访问和使用的范围。
- 作用域类型 :
  - 全局作用域（Global Scope）： 在函数外部声明的变量拥有全局作用域。全局变量可以在代码的任何地方被访问
  - 函数作用域（Function Scope）： 在函数内部声明的变量拥有函数作用域。函数变量只能在该函数内部被访问
  - 块级作用域（Block Scope）： 使用 let 和 const 关键字声明的变量拥有块级作用域；块级变量只能在声明它们的代码块（通常是 if 语句、循环或一对花括号 {}）内部被访问
- 作用域链（Scope Chain）
  - 当在 JavaScript 中访问一个变量时，解释器会按照一定的顺序搜索该变量。这个搜索顺序就形成了作用域链 .
  - 当前作用域： 首先，解释器会查找当前作用域中是否存在该变量。
  - 外部作用域： 如果在当前作用域中找不到该变量，解释器会继续查找外部（父级）作用域。
  - 逐级向上： 这个过程会一直持续到全局作用域。
  - 未找到： 如果在全局作用域中仍然找不到该变量，且代码运行在非严格模式下，该变量会被隐式地声明为全局变量。如果在严格模式下，会抛出一个 ReferenceError 错误。
- 销毁：
  - 当函数执行完毕后，其执行上下文会从调用栈中弹出，函数作用域也会被销毁。
  - 这意味着函数内部声明的变量将不再存在于内存中，变得不可访问。
### 闭包  &I
- 闭包：
  - 闭包是指函数可以访问并记住其词法作用域（定义时所在的作用域），即使在其外部执行（myClosure调用）.
  - 当一个函数形成闭包时，即使外部函数已经执行完毕，其作用域中的某些变量仍然可以被闭包函数访问。
  - 这是因为闭包函数保持了对外部函数作用域的引用，防止垃圾回收器回收这些变量。
  - 内存泄漏：如果闭包函数一直被引用，那么其引用的外部作用域中的变量将永远无法被回收，这可能导致内存泄漏。
  ```js
  // 在这个例子中，innerFunction 是一个闭包，它可以访问 outerFunction 作用域中的 outerVariable 变量。
  // 即使 outerFunction 已经执行完毕，outerVariable 仍然存在于内存中，因为 myClosure（即 innerFunction）保持了对 outerFunction 作用域的引用。
  function outerFunction() {
    let outerVariable = '外部变量';

    function innerFunction() {
      console.log(outerVariable); // 访问外部函数的变量
    }

    return innerFunction; // 返回内部函数，形成闭包
  }
  const myClosure = outerFunction(); // 调用 outerFunction，返回 innerFunction
  myClosure(); // 调用 innerFunction，仍然可以访问 outerVariable

  myClosure = null; // 解除 myClosure 对 innerFunction 的引用
  // 此时，垃圾回收器可以回收 innerFunction 和 outerFunction 作用域中的变量
  ```
- 闭包使用场景：
  - 创建私有变量和方法
  - 函数柯里化（Currying）
  - 模块化
### 操作符
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators

#### 逻辑或赋值
||=
```js
var  a= {b:1}
a.b ||= 3
// a.b = 1
a.b = 0
a.b ||= 3
// a.b = 3
```
#### 小数精度问题
- 问题：为何 `0.1 + 0.2 !== 0.3`
- 分析：
  - 计算机用二进制存储数据。
  - 整数用二进制没有误差，如 `9` 表示为 `1001` 。<br>
  - 而有的小数无法用二进制表示，如 `0.2` 用二进制表示就是 `1.10011001100...`
  - 所以，累加小数时会出现误差。
  - 这不仅仅是 JS ，所有的计算机语言都这样。
## 数据类型

<!--@include: ./Index/DataType/Number/index.md-->

<!--@include: ./Index/DataType/String/index.md-->

<!--@include: ./Index/DataType/Object/index.md-->

<!--@include: ./Index/DataType/RegExp/index.md-->

<!--@include: ./Index/DataType/Function/index.md-->

<!--@include: ./Index/DataType/index.md-->

<!--@include: ./Index/DataType/Math/index.md-->

<!--@include: ./Index/DataType/Error/index.md-->

### Map
```js
const map1 = new Map();
map1.set('bar', 'foo');
console.log(map1.get('bar')); //"foo"
console.log(map1.get('baz')); //undefined
```
### Set
```js
const set1 = new Set([1, 2, 3, 4, 5]);
console.log(set1.has(1)); // true
console.log(set1.has(5)); // true
console.log(set1.has(6)); // true
```
## 内置对象

<!--@include: ./Index/BuildInObject/Promise/index.md-->

<!--@include: ./Index/BuildInObject/Json/index.md-->

<!--@include: ./Index/BuildInObject/Intl/index.md-->

<!--@include: ./Index/BuildInObject/Generator/index.md-->




