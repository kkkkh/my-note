---
outline: deep
---
<script setup>
import Test from '@/components/Test.vue'
import Json from './componetns/Json.vue'
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
```js
var  a= {b:1}
a.b ||= 3
// a.b = 1
a.b = 0
a.b ||= 3
// a.b = 3
```
## 数据类型
### Number
#### 进制转化
- 10进制转为16进制
```js
var num = 65535
var str = num.toString(16)
console.log(str) //'ffff'
```
- 16进制转为10进制
```js
// parseInt()转为10进制，第2参数按照什么进制转10进制
var num = parseInt('0xffff',16)
var num = parseInt('ffff',16) 
console.log(num) // 65535
// or
Number('0xffff') // 65535
Number(0xffff) // 65535
// or
var str = (0xffff).toString(10);
console.log(str); //65535
```
- 2进制 与 10进制转化
```js
var num = 65535
var str = num.toString(2)
console.log(str) // '1111111111111111'
var num = parseInt('1111111111111111',2)
console.log(num) // '65535'
```
- 2进制 与 16进制相互转化
```js
// 2 转 16
// 都先转为10进制，再转为对应进制
const binary = "1101"; // 二进制字符串
const hex = parseInt(binary, 2).toString(16); // 解析为十进制并转换为十六进制
console.log(hex); // 输出: "d"
// 将二进制数据（ArrayBuffer 或 Uint8Array）转换为十六进制
function binaryToHex(buffer) {
  return Array.from(buffer) // 将 buffer 转为数组
    .map(byte => byte.toString(16).padStart(2, '0')) // 转换为十六进制，确保两位
    .join(''); // 合并为字符串
}
const binaryData = new Uint8Array([0b10101010, 0b11110000, 0b11001100]); // 示例二进制数据
console.log(binaryToHex(binaryData)); // 输出: "aaf0cc"
// 使用 BigInt 处理超大二进制字符串
const longBinary = "1010101010101010101010101010101010101010";
const hex = BigInt(`0b${longBinary}`).toString(16);
console.log(hex); // 输出: "aaaaaaa"
```
```js
// 16 转 2
// 都先转为10进制，再转为对应进制
const hex = "1f"; // 示例十六进制字符串
const binary = parseInt(hex, 16).toString(2); // 转为二进制字符串
console.log(binary); // 输出: "11111"
// 保证输出固定长度的二进制字符串
const hex = "1f"; // 示例十六进制字符串
const binary = parseInt(hex, 16).toString(2).padStart(hex.length * 4, '0');
console.log(binary); // 输出: "00011111"
// 将多个十六进制字符逐一转换为二进制
function hexToBinary(hex) {
  return hex
    .split('') // 将字符串拆分成单个字符
    .map(char => parseInt(char, 16).toString(2).padStart(4, '0')) // 每个字符转为二进制并补齐 4 位
    .join(''); // 合并为完整二进制字符串
}
const hexString = "1fa9";
console.log(hexToBinary(hexString)); // 输出: "0001111110101001"
// 使用 BigInt 处理长十六进制字符串
const longHex = "1fa9b3c4";
const binary = BigInt(`0x${longHex}`).toString(2); // 使用 BigInt 转换
console.log(binary); // 输出: "11111101010011011001111000100"
```
#### parseInt
- parseInt(string, radix) 解析一个字符串并返回指定基数的十进制整数
  - radix，可选，从 2 到 36 的整数，表示进制的基数。
  ```js
  parseInt("1010",10) // 1010
  parseInt("1010",2)  // 10
  ```
### BigInt
- BigInt 是一种内置对象，它提供了一种方法来表示大于 2^53 - 1 的整数。
- 这原本是 Javascript 中可以用 Number 表示的最大数字。BigInt 可以表示任意大的整数。
```js
const theBiggestInt = 9007199254740991n;
const alsoHuge = BigInt(9007199254740991);
// ↪ 9007199254740991n
const hugeString = BigInt("9007199254740991");
// ↪ 9007199254740991n
const hugeHex = BigInt("0x1fffffffffffff");
// ↪ 9007199254740991n
const hugeBin = BigInt(
  "0b11111111111111111111111111111111111111111111111111111",
);
// ↪ 9007199254740991n
```
- 以下操作符可以和 BigInt 一起使用： +、*、-、**、%。
- 除 >>> （无符号右移）之外的 位操作 也可以支持。
- 因为 BigInt 都是有符号的， >>> （无符号右移）不能用于 BigInt。
- 为了兼容 asm.js，BigInt 不支持单目 (+) 运算符。
```js
const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER);
// ↪ 9007199254740991n
const maxPlusOne = previousMaxSafe + 1n;
// ↪ 9007199254740992n
const theFuture = previousMaxSafe + 2n;
// ↪ 9007199254740993n, this works now!
const multi = previousMaxSafe * 2n;
// ↪ 18014398509481982n
const subtr = multi – 10n;
// ↪ 18014398509481972n
const mod = multi % 10n;
// ↪ 2n
const bigN = 2n ** 54n;
// ↪ 18014398509481984n
bigN * -1n
// ↪ –18014398509481984n
```
- 当使用 BigInt 时，带小数的运算会被取整。
```js
const expected = 4n / 2n;
// ↪ 2n
const rounded = 5n / 2n;
// ↪ 2n, not 2.5n
```
- 建议：
  - 由于在 Number 与 BigInt 之间进行转换会损失精度，
  - 因而建议仅在值可能大于 2^53 时使用 BigInt 类型，
  - 并且不在两种类型之间进行相互转换。
### String
#### fromCodePoint() / fromCharCode()
- String.fromCodePoint(num1)
  - 使用指定的`码位序列`创建的字符串
  - num1 -> Unicode 码位 -> 一个介于 0 和 0x10FFFF（1114111）（包括两者）之间的整数，表示一个 Unicode 码位
  ```js
  String.fromCodePoint(9731, 9733, 9842, 0x2f804); //"☃★♲你"
  String.fromCharCode(9731, 9733, 9842, 0x2f804); // "☃★♲ "
  ```
  ```js
  // 相同,10进制和16进制都相同
  String.fromCodePoint(0x10FFFF); // '  '
  String.fromCodePoint(1114111); // '  '
  ```
- UTF-16
  - 在 UTF-16 中，每个字符串索引是一个取值范围为 0 到 65535 的码元
  - 较高的Unicode 码位，由一对 16 位代理伪字符表示
  - fromCodePoint() 可能返回一个字符串，其在 UTF-16 码元中的 length 大于传递的参数个数
    ```js
    String.fromCodePoint(1114111).length; // 2
    ```
- String.fromCharCode()
  - 指定的 UTF-16 码元序列创建的字符串
    ```js
    // 在 0 到 65535这个范围，返回值相同
    String.fromCharCode(189, 43, 190, 61) //'½+¾='
    String.fromCodePoint(189, 43, 190, 61) //'½+¾='
    ```
  - 无法通过指定其码位来返回补充字符(（即码位 0x010000 至 0x10FFFF）)，使用 UTF-16 代理对来返回补充字符
    ```js
    // 代理只传一个部分，则返回16位编码单元
    String.fromCharCode(55362) // \uD842
    String.fromCharCode(57271); // \uDFB7
    // 相同
    String.fromCharCode(0xD87E,0xDC04) // '你'
    String.fromCodePoint(0x2f804) // '你'
    ```
- UTF-16 字符、Unicode 码位和字素簇
  - UTF-16 编码中，每个码元都是 16 位长
  - 最多有 2^16 个或 65536 个可能的字符可表示为单个 UTF-16 码元
  - 该字符集称为基本多语言平面（BMP）
  - 整个 Unicode 字符集比 65536 大得多
  - 额外的字符以代理对（surrogate pair）的形式存储在 UTF-16 中，代理对是一对 16 位码元，表示一个单个字符
  - 配对的两个部分必须介于 0xD800 和 0xDFFF 之间，并且这些码元不用于编码单码元字符
  - 更准确地说，前导代理，也称为高位代理，其值在 0xD800 和 0xDBFF 之间（含），而后尾代理，也称为低位代理，其值在 0xDC00 和 0xDFFF 之间（含）
  - 除了 Unicode 字符之外，还有某些 Unicode 字符序列应视为一个视觉单元，被称为字素簇（grapheme cluster）。
  - 最常见的情况是 emoji：许多具有多种变体的 emoji 实际上是由多个 emoji 组成的，通常由 \<ZWJ>（U+200D）字符连接。

总结：
- 1、UTF-16 字符，2^16 或 65536 个，在这个范围内，fromCharCode 与 fromCodePoint 相同
- 2、大于这个范围，如何办？额外的字符以代理对（surrogate pair）的形式存储在 UTF-16 中
- 3、整个 Unicode 字符集比 65536 大得多，Unicode 码位，范围是 0 和 0x10FFFF（1114111）
- 4、在大于这个范围，使用String.fromCharCode(0xD87E,0xDC04)与String.fromCodePoint(0x2f804)相同，
- 5、但是每次fromCharCode使用补充码位时都需要额外的步骤来计算或查找代理对值，使用 String.fromCodePoint() 更方便

参考：
- [fromCharCode](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)
- [fromCodePoint](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint)
- [UTF-16 字符、Unicode 码位和字素簇](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_%E5%AD%97%E7%AC%A6%E3%80%81unicode_%E7%A0%81%E4%BD%8D%E5%92%8C%E5%AD%97%E7%B4%A0%E7%B0%87)


#### codePointAt() / charCodeAt() / charAt()
- codePointAt(index) 给定 index 处字符的码位值
  ```js
  const icons = '☃★♲';
  icons.codePointAt(1); 
  // 返回★的码位值
  // "9733"
  '𠮷'.codePointAt(0) // 134071
  ```
- charCodeAt(index) 给定索引index处的 UTF-16 码元
  ```js
  // 1
  const sentence = 'The quick brown fox jumps over the lazy dog.';
  const index = 4;

    `Character code ${sentence.charCodeAt(index)} is equal to ${sentence.charAt(
      index,
    )}`,
  );
  // "Character code 113 is equal to q"
  // 2
  "ABC".charCodeAt(0); //65
  // 如果索引处的字符是超出UTF-16码元，则返回代理对（代理码点）对应的Unicode编码
  '𠮷'.charCodeAt(0)  // 55362
  '𠮷'.charCodeAt(1)  // 57271
  ```
- charAt() 返回一个由给定索引处的单个 UTF-16 码元构成的新字符串。
  ```js
  '1234'.charAt(1) //2
  // 如果索引处的字符是超出UTF-16码元，则返回代理对(代理码点)
  '𠮷'.charAt(0) //'\uD842'
  '𠮷'.charAt(1) //'\uDFB7'
  '𠮷'.length // 2
  ```
参考：
- [codePointAt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
- [charCodeAt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
- [charAt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)

#### toLowerCase() / toUpperCase()
- toLowerCase() 大写转小写
```js
const str = 'ABC';
console.log(str.toLowerCase());
// abc
```
- toUpperCase() 小写转大写
```js
const str = 'abc';
console.log(str.toUpperCase());
// ABC
```

#### localeCompare()
- localeCompare
- 字符串比较：参考字符串在排序顺序中是在给定字符串之前、之后还是与之相同
```js
console.log("a".localeCompare("c"));
// -1
console.log("check".localeCompare("against"));
// 1
console.log("check".localeCompare("checl"));
// -1
```
参考：[Intl.Collator.prototype.compare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare)

#### replace() / replaceAll()
- replaceAll()与 replace() 不同，该方法将替换所有匹配的字符串，而不仅仅是第一个。
- 如果字符串不是静态已知的，那么这特别有用，因为调用 RegExp() 构造函数而不转义特殊字符可能会意外地改变它的语义。
- 关键点不同
```js
// replace 替换 ha.*er，只能替换一个，使用 reg /g，想全部替换，结果贪婪
function unsafeRedactName(text, name) {
  return text.replace(new RegExp(name, "g"), "[REDACTED]");
}
// replaceAll 替换 ha.*er，不适用正则，全部更换
function safeRedactName(text, name) {
  return text.replaceAll(name, "[REDACTED]");
}
const report =
  "A hacker called ha.*er used special characters in their name to breach the system.";
console.log(unsafeRedactName(report, "ha.*er")); // "A [REDACTED]s in their name to breach the system."
console.log(safeRedactName(report, "ha.*er")); // "A hacker called [REDACTED] used special characters in their name to breach the system."
```
- 全部情况查看
```js
function unsafeRedactName1(text, name) {
  return text.replace(name, "[REDACTED]");
}
function unsafeRedactName2(text, name) {
  return text.replace(new RegExp(name, "g"), "[REDACTED]");
}
function safeRedactName1(text, name) {
  return text.replaceAll(name, "[REDACTED]");
}
function safeRedactName2(text, name) {
  return text.replaceAll(new RegExp(name, "g"), "[REDACTED]");
}
const report =
  "A hacker called ha.*er used special characters in their name to breach the system. ha.*er";
console.log("1-1", unsafeRedactName1(report, "ha.*er"));
console.log("1-2", unsafeRedactName1(report, /ha\.\*er/g));
console.log("1-3", unsafeRedactName2(report, "ha.*er"));
console.log("1-4", unsafeRedactName2(report, "ha\\.\\*er"));
// "1-1" "A hacker called [REDACTED] used special characters in their name to breach the system. ha.*er"
// "1-2" "A hacker called [REDACTED] used special characters in their name to breach the system. [REDACTED]"
// "1-3" "A [REDACTED]"
// "1-4" "A hacker called [REDACTED] used special characters in their name to breach the system. [REDACTED]"
console.log("2-1", safeRedactName1(report, "ha.*er"));
console.log("2-2", safeRedactName1(report, /ha\.\*er/g));
console.log("2-3", safeRedactName2(report, "ha.*er"));
console.log("2-4", safeRedactName2(report, "ha\\.\\*er"));
// "2-1" "A hacker called [REDACTED] used special characters in their name to breach the system. [REDACTED]"
// "2-2" "A hacker called [REDACTED] used special characters in their name to breach the system. [REDACTED]"
// "2-3" "A [REDACTED]"
// "2-4" "A hacker called [REDACTED] used special characters in their name to breach the system. [REDACTED]"
```
#### at() 
```js
const myString = "Every green bus drives fast.";
// 使用 length 属性和 charAt() 方法
const lengthWay = myString.charAt(myString.length - 2);
console.log(lengthWay); // 't'
// 使用 slice() 方法
const sliceWay = myString.slice(-2, -1);
console.log(sliceWay); // 't'
// 使用 at() 方法
const atWay = myString.at(-2);
console.log(atWay); // 't'
```
#### substring / substr 已弃用 / slice
- 从 indexStart 开始提取字符，直到（但不包括）indexEnd。
- 如果省略了 indexEnd，则 substring() 提取字符直到字符串的末尾。
- 如果 indexStart 等于 indexEnd，则 substring() 返回一个空字符串。
- 如果 indexStart 大于 indexEnd，则 substring() 的效果就像交换了这两个参数一样；
  ```js
  // Expected output: "zilla"
  const anyString = "Mozilla";
  console.log(anyString.substring(0, 1)); // 'M'
  console.log(anyString.substring(1, 0)); // 'M'
  console.log(anyString.substring(0, 6)); // 'Mozill'
  console.log(anyString.substring(4)); // 'lla'
  console.log(anyString.substring(4, 7)); // 'lla'
  console.log(anyString.substring(7, 4)); // 'lla'
  console.log(anyString.substring(0, 7)); // 'Mozilla'
  console.log(anyString.substring(0, 10)); // 'Mozilla'
  ```
- 对比 substr
  - substr() 方法的两个参数是 start 和 length，而 substring() 方法的参数是 start 和 end。
  - substr() 的 start 索引为负数，它将循环到字符串的末尾，而 substring() 会将其限制为 0
  - 在 substr() 中，如果长度为负数，将被视为零；而在 substring() 中，如果 end 小于 start ，则会交换这两个索引。
  - substr() 被认为是 ECMAScript 中的遗留特性，因此如果可能的话最好避免使用它
- 对比 slice
  - slice() indexStart 大于 indexEnd，返回一个空字符串。
    ```js
    const text = "Mozilla";
    console.log(text.substring(5, 2)); // "zil"
    console.log(text.slice(5, 2)); // ""
    ```
  - 如果两个参数中的任何一个或两个都是负数或 NaN，substring() 方法将把它们视为 0。
    ```js
    const text = "Mozilla";
    console.log(text.substring(-5, 2)); // "Mo"
    console.log(text.substring(-5, -2)); // ""
    ```
  - slice() 方法也将 NaN 参数视为 0，但当给定负值时，它会从字符串的末尾开始反向计数以找到索引。
  - 更准确的说是：max(indexStart + str.length, 0) 计算负数
    ```js
    const text = "Mozilla";
    console.log(text.slice(-5, 2)); // ""
    console.log(text.slice(-5, -2)); // "zil"
    ```
#### padStart
```js
var res = "abc".padStart(10); // "       abc"
console.log(res);
var res = "abc".padStart(10, "foo"); // "foofoofabc"
console.log(res);
var res = "abc".padStart(6, "123465"); // "123abc"
console.log(res);
var res = "abc".padStart(8, "0"); // "00000abc"
console.log(res);
var res = "abc".padStart(1); // "abc"
console.log(res);
```
### Object
#### Object.fromEntries() / Object.entries()（逆操作）
- object.fromEntries() 将一个数组/Map转为一个对象
  ```js
  const entries = new Map([
    ['foo', 'bar'],
    ['baz', 42],
  ]);
  // or
  const entries = [
    ['foo', 'bar'],
    ['baz', 42],
  ];
  const obj = Object.fromEntries(entries);
  console.log(obj);
  // Object { foo: "bar", baz: 42 }
  ```
- Object.entries() 对象转为二维数组
  ```js
  const object1 = {
    a: 'somestring',
    b: 42,
  };
  console.log(Object.entries(object1))
  // Array [Array ["a", "somestring"], Array ["b", 42]]
  for (const [key, value] of Object.entries(object1)) {
    console.log(`${key}: ${value}`);
  }
  // "a: somestring"
  // "b: 42"
  ```
#### Object.assign()
```js
const obj1={a:{b:1}}
const obj2={a:{c:2}}
//从顶层合并，下边层级的会被替换掉
Object.assign(obj1,obj2)
console.log(obj1)
// {a:{c:2}}
// 从下边层级合并，则都会加上
Object.assign(obj1.a,obj2.a)
console.log(obj1)
// {a: {b: 1, c: 2}}
```
#### Object.prototype.hasOwnProperty/Object.hasOwn()
- 替代 Object.prototype.hasOwnProperty()，
  - Object.hasOwn()适用于使用 Object.create(null) 创建的对象，以及重写了继承的 hasOwnProperty() 方法的对象。
  - 尽管可以通过在外部对象上调用 Object.prototype.hasOwnProperty() 解决这些问题，但是 Object.hasOwn() 更加直观。
- Object.hasOwn()
```js
const foo = Object.create(null);
foo.prop = "exists";
if (Object.hasOwn(foo, "prop")) {
  console.log(foo.prop); //true——无论对象是如何创建的，它都可以运行。
}
```
```js
const foo = {
  hasOwnProperty() {
    return false;
  },
  bar: "The dragons be out of office",
};
if (Object.hasOwn(foo, "bar")) {
  console.log(foo.bar); //true——重新实现 hasOwnProperty() 不会影响 Object
}
```
- Object.prototype.hasOwnProperty
```js
const example = {};
example.prop = "exists";
// `hasOwnProperty` 仅对直接属性返回 true：
example.hasOwnProperty("prop"); // 返回 true
example.hasOwnProperty("toString"); // 返回 false
example.hasOwnProperty("hasOwnProperty"); // 返回 false
// 对于直接或继承的属性，`in` 运算符将返回 true：
"prop" in example; // 返回 true
"toString" in example; // 返回 true
"hasOwnProperty" in example; // 返回 true
```
```js
const foo = Object.create(null);
foo.prop = "exists";
foo.hasOwnProperty("prop"); // Uncaught TypeError: foo.hasOwnProperty is not a function
```
```js
// 重写了hasOwnProperty
const foo = {
  hasOwnProperty() {
    return false;
  },
  bar: "Here be dragons",
};
foo.hasOwnProperty("bar"); // 该重新实现始终返回 false
```
参考：
- [hasOwn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
- [hasOwnProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
#### Object.create()
以一个现有对象作为原型，创建一个新对象
```js
o = {};
// 等价于：
o = Object.create(Object.prototype);
o = { __proto__: Object.prototype };
```
```js
o = Object.create(null);
// 等价于：
o = { __proto__: null };
```
```js
function Constructor() {}
o = new Constructor();
// 等价于：
o = Object.create(Constructor.prototype);
```
参考：
- [setPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)
- [create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
#### Object.is()
```js
console.log(Object.is('1', 1));
// Expected output: false
console.log(Object.is(NaN, NaN));
// Expected output: true
console.log(Object.is(-0, 0));
// Expected output: false
const obj = {};
console.log(Object.is(obj, {}));
// Expected output: false
console.log(Object.is(obj, obj));
// Expected output: true
```
- Object.is() 确定两个值是否为相同值。如果以下其中一项成立，则两个值相同：
  - 都是 undefined
  - 都是 null
  - 都是 true 或者都是 false
  - 都是长度相同、字符相同、顺序相同的字符串
  - 都是相同的对象（意味着两个值都引用了内存中的同一对象）
  - 都是 BigInt 且具有相同的数值
  - 都是 symbol 且引用相同的 symbol 值
  - 都是数字且
    - 都是 +0
    - 都是 -0
    - 都是 NaN
  - 都有相同的值，非零且都不是 NaN
- === 运算符（和 == 运算符）
  - 将数值 -0 和 +0 视为相等，
  - 但是会将 NaN 视为彼此不相等。
#### Object.freeze()
- 阻止其扩展然后将所有现有属性的描述符的 configurable 特性更改为 false
- 将同时把 writable 特性更改为 false
- 任何这样的尝试都将失败，可能是静默失败，也可能抛出一个 TypeError 异常（通常情况下，在严格模式中抛出）
```js
const obj = {
  prop: 42,
};
Object.freeze(obj);
obj.prop = 33;
// Throws an error in strict mode
console.log(obj.prop); //42
```
- 浅冻结：如果这些属性的值本身是对象，这些对象不会被冻结
```js
const employee = {
  name: "Mayank",
  designation: "Developer",
  address: {
    street: "Rohini",
    city: "Delhi",
  },
};
Object.freeze(employee);
employee.name = "Dummy"; // 在非严格模式下静默失败
employee.address.city = "Noida"; // 可以修改子对象的属性
console.log(employee.address.city); // "Noida"
```
- 深冻结
```js
function deepFreeze(object) {
  // 获取对象的属性名
  const propNames = Reflect.ownKeys(object);
  // 冻结自身前先冻结属性
  for (const name of propNames) {
    const value = object[name];

    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const obj2 = {
  internal: {
    a: null,
  },
};
deepFreeze(obj2);
obj2.internal.a = "anotherValue"; // 非严格模式下会静默失败
obj2.internal.a; // null
```
#### toString
Object.prototype.toString.call
```js
var res1 = Object.prototype.toString.call([]); //  "[object Array]"
console.log(res1);
var res1 = Object.prototype.toString.call({}); //  "[object Object]"
console.log(res1);
var res1 = Object.prototype.toString.call("ssss"); //  "[object String]"
console.log(res1);
var res1 = Object.prototype.toString.call(111); //  "[object Number]"
console.log(res1);
var res1 = Object.prototype.toString.call(false); //  "[object Boolean]"
console.log(res1);
var res1 = Object.prototype.toString.call(undefined); //  "[object Undefined]"
console.log(res1);
var res1 = Object.prototype.toString.call(null); //  "[object Null]"
console.log(res1);
```
### RegExp
#### 特殊字符
```js
/\d/  // \d 范围大 也包含中文全角0-9
/\D/ // 匹配一个非数字字符。等价于 [^0-9]。
/[0-9]/ // 0-9 范围小
/\w/ // A-Za-z0-9_
/\W/ //	匹配一个非单字字符 等价于 [^A-Za-z0-9_]。
/[\u4e00-\u9fa5]/ //汉字
/\s/ // 匹配一个空白字符，包括空格、制表符、换页符和换行符 等价于 
/[\f\n\r\t\v\u0020\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/ //与上同
/\S/ // 匹配一个非空白字符
/\f/ // 匹配一个换页符 (U+000C)
/\r/ // 匹配一个回车符 (U+000D)
/\n/ // 换行符匹配 (U+000A)
/./ // （小数点）默认匹配除换行符之外的任何单个字符。
// 在 Unix 和 Linux 系统（包括 macOS）中，换行符用 \n（LF，Line Feed）表示。
// 在 Windows 系统中，换行符用 \r\n（CR+LF，Carriage Return + Line Feed）表示。
// 早期的 Mac OS（例如，Mac OS 9）使用 \r（CR，Carriage Return）表示换行。
// 以\n为主流
// 数量
/\d?/ // 0次 或 1次
/\d*/ // 0次 或 多次
/\d+/ // 1次 或 多次
/{n}/ // n 是一个正整数，匹配了前面一个字符刚好出现了 n 次。 
```
#### 匹配规则
```js
// 匹配 "x" 或 "y" 任意一个字符。
/x|y/
/green|red/ // 在 "green apple" 里匹配 "green"，且在 "red apple" 里匹配 "red" 。
// 匹配任何一个包含的字符
/[xyz]/
/[a-c]/ // [abc]相同
// 一个否定的或被补充的字符集
/[^xyz]/
/[^a-c]/
// 捕获组
/(x)/ // 捕获组会带来性能损失。如果不需要收回匹配的子字符串，请选择非捕获括号，下边的例子
// \n 非捕获括号
/apple(\,)orange\1/.exec("apple,orange,cherry,peach") // 其中 \1 引用了 之前使用第 n 个 () 捕获的 => 'apple, orange,'
// (?<Name>x) 具名捕获组：匹配"x"并将其存储在返回的匹配项的 groups 属性中，
/-(?<customName>\w)/ // 匹配“web-doc” 中的“d”
'web-doc'.match(/-(?<customName>\w)/).groups //{customName: "d"}
// (?:x) 非捕获组：匹配 “x”，但不记得匹配。不能从结果数组的元素中收回匹配的子字符串
/(a)(?:b)(c)/.exec("abc") // ['abc', 'a', 'c', index: 0, input: 'abc', groups: undefined]
/((x)yz)(abc)/.exec("xyzabc") // 嵌套捕获组，先由外到内，再由左到右 => ['xyzabc', 'xyz', 'x', 'abc', index: 0, input: 'xyzabc', groups: undefined]
```
参考：[Groups and ranges](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences)
#### RegExp
  ```js
  // 1
  var re = /ab+c/;
  // 构造函数创建的正则表达式会被编译
  // 构造函数 可以动态生成正则
  var re = new RegExp("ab+c");
  // 2
  var re = /[a-z]\s/i
  var re = new RegExp("[a-z]\\s", "i")
  ```
#### RegExp涉及的api
  - RegExp 的 exec 和 test 方法
  - String 的 match、matchAll、replace、replaceAll、search 和 split
#### exec
```js
const regex1 = RegExp('foo(?<rGroup>[^foo]*)', 'dg');
const str1 = 'table foooof, football, foosball';
let array1;
console.log("regex1.lastIndex",regex1.lastIndex)
while ((array1 = regex1.exec(str1)) !== null) {
	console.log("array1",array1)
	console.log("array1.input",array1.input) // 匹配到的字符串和所有被记住的子字符串。
	console.log("array1.groups",array1.groups) // 一个命名捕获组对象，其键是名称，值是捕获组。
	console.log("array1.index",array1.index) //	在输入的字符串中匹配到的以 0 开始的索引值。
	console.log("array1.indices",array1.indices) // 此属性仅在设置了 d 标志位时存在。它是一个数组，其中每一个元素表示一个子字符串的边界。
  console.log("------------------------")
	console.log("regex1",regex1)
	console.log("regex1.source",regex1.source) // 模式字面文本
  console.log("regex1.lastIndex",regex1.lastIndex) // 开始下一个匹配的起始索引值。这个属性只有在使用 g 参数时可用在
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~")
}
/*
> "regex1.lastIndex" 0
> "array1" Array ["foo", ""]
> "array1.input" "table foooof, football, foosball"
> "array1.groups" Object { rGroup: "" }
> "array1.index" 6
> "array1.indices" Array [Array [6, 9], Array [9, 9]]
> "------------------------"
> "regex1" /foo(?<rGroup>[^foo]*)/dg
> "regex1.source" "foo(?<rGroup>[^foo]*)"
> "regex1.lastIndex" 9
> "~~~~~~~~~~~~~~~~~~~~~~~~"
> "array1" Array ["football, ", "tball, "]
> "array1.input" "table foooof, football, foosball"
> "array1.groups" Object { rGroup: "tball, " }
> "array1.index" 14
> "array1.indices" Array [Array [14, 24], Array [17, 24]]
> "------------------------"
> "regex1" /foo(?<rGroup>[^foo]*)/dg
> "regex1.source" "foo(?<rGroup>[^foo]*)"
> "regex1.lastIndex" 24
> "~~~~~~~~~~~~~~~~~~~~~~~~"
> "array1" Array ["foosball", "sball"]
> "array1.input" "table foooof, football, foosball"
> "array1.groups" Object { rGroup: "sball" }
> "array1.index" 24
> "array1.indices" Array [Array [24, 32], Array [27, 32]]
> "------------------------"
> "regex1" /foo(?<rGroup>[^foo]*)/dg
> "regex1.source" "foo(?<rGroup>[^foo]*)"
> "regex1.lastIndex" 32
> "~~~~~~~~~~~~~~~~~~~~~~~~"
*/
```
- 如果你只是为了判断是否匹配，请使用 `RegExp.prototype.test()` 方法代替。
- 如果你只是为了找出所有匹配正则表达式的字符串而又不关心捕获组，请使用 `String.prototype.match()` 方法代替。
- 此外，`String.prototype.matchAll()` 允许你对匹配项进行迭代，这有助于简化匹配字符串的多个部分（带有匹配组）。
- 如果你只是为了查找在字符串中匹配的索引，请使用 `String.prototype.search()` 方法代替。
#### matchAll / match
matchAll(regexp)
- 如果 regexp 是一个正则表达式，那么它必须设置了全局（g）标志，否则会抛出 TypeError 异常。
- 返回值：一个匹配结果的可迭代迭代器对象（它不可重新开始）。每个匹配结果都是一个数组，其形状与 RegExp.prototype.exec() 的返回值相同。
```js
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';
console.log(str.matchAll(regexp))
const array = [...str.matchAll(regexp)];
console.log(array[0]);
console.log(array[1]);
// > [object RegExp String Iterator]
// > Array ["test1", "e", "st1", "1"]
// > Array ["test2", "e", "st2", "2"]
```
与 exec 比对
- matchAll() 方法，则可以避免使用 while 循环和带有 g 标志的 exec
- matchAll 内部做了一个 regexp 的复制，lastIndex 在字符串扫描后不会改变（不像 regexp.exec()）
```js
const regexp = /foo[a-z]*/g;
const str = "table football, foosball";
let match;
while ((match = regexp.exec(str)) !== null) {
  console.log(
    `找到 ${match[0]} 起始位置=${match.index} 结束位置=${regexp.lastIndex}。`,
  );
}
// 找到 football 起始位置=6 结束位置=14。
// 找到 foosball 起始位置=16 结束位置=24。
```
```js
const regexp = /foo[a-z]*/g;
const str = "table football, foosball";
const matches = str.matchAll(regexp);
for (const match of matches) {
  console.log(
    `找到 ${match[0]} 起始位置=${match.index} 结束位置=${
      match.index + match[0].length
    }.`,
  );
}
// 找到 football 起始位置=6 结束位置=14.
// 找到 foosball 起始位置=16 结束位置=24.
// 匹配迭代器在 for...of 迭代后用尽
// 再次调用 matchAll 以创建新的迭代器
Array.from(str.matchAll(regexp), (m) => m[0]);
// [ "football", "foosball" ]
```
与 match 比对
- 比 String.prototype.match() 更好的捕获组获取方式
- 当使用全局 g 标志调用 match() 方法时，捕获组会被忽略
```js
const regexp = /t(e)(st(\d?))/g;
const str = "test1test2";
str.match(regexp); // ['test1', 'test2']
```
```js
const array = [...str.matchAll(regexp)];
array[0];
// ['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', length: 4]
array[1];
// ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', length: 4]
```
#### 修饰符
| 标志 | 描述                                                                |
|------|-------------------------------------------------------------------|
| g    | 全局搜索。                                                           |
| i    | 不区分大小写搜索。                                                   |
| m    | 多行搜索。                                                           |
| s    | 允许 . 匹配换行符。                                                  |
| u    | 使用 unicode 码的模式进行匹配。                                      |
| y    | 执行“粘性 (sticky)”搜索，匹配从目标字符串的当前位置开始。             |
| d    | 表示正则表达式匹配的结果应该包含每个捕获组子字符串开始和结束的索引。 |

##### -y
- RegExp.prototype.sticky
- sticky 属性反映了搜索是否具有粘性（仅从正则表达式的 lastIndex 属性表示的索引处搜索）
- 如果一个表达式同时指定了 sticky 和 global，其将会忽略 global 标志。
```js
const str1 = 'table football';
const regex1 = new RegExp('foo', 'y');
regex1.lastIndex = 6;
console.log(regex1.sticky); // true
console.log(regex1.test(str1));// true
console.log(regex1.lastIndex);// 9
console.log(regex1.test(str1));// false
```
- 当使用带有 y 标识的匹配模式时，^ 断言总是会匹配输入的开始位置或者（如果是多行模式）每一行的开始位置。
```js
var regex = /^foo/y;
regex.lastIndex = 2;
regex.test("..foo"); // false - 索引 2 不是字符串的开始
var regex2 = /^foo/my; // m 多行搜索
regex2.lastIndex = 2;
regex2.test("..foo"); // false - 索引 2 不是字符串或行的开始
regex2.lastIndex = 2;
regex2.test(".\nfoo"); // true - 索引 2 是行的开始
```
#### 案例
- 示例：[String replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  ```js
  // 1
  // *?懒惰查找 默认是贪婪查找
  // $1 代表正则中第一个()
  // [^$] 代表非$的字符 反向字符集
  // $$t 插入一个 "$"
  const reg = /placeholder="([^$]*?)"/
  const str = `placeholder="请输入信息"`
  const res = str.replace(reg,`:placeholder="$$t('N:$1')"`)
  console.log(res)
  // :placeholder="$t('N:请输入信息')"
  const reg = /label="([^$]*?)"/
  const str = `label="重置"`
  const res = str.replace(reg,`:label="$$t('F:$1')"`)
  console.log(res)
  ```
  ```js
  //2 字符串通过“换行”截取为 => 数据组
  const strings= "111\n222"
  const arr = strings.split(/\r?\n+/).filter((val) => val !== '').map((item) => item.trim())
  ```
  ```js
  // 3 贪婪
  var str = "bbbaaccaa";
  var reg1 = /.*aa/;
  console.log(reg1.exec(str)); // bbbaaccaa
  // 增加?，非贪婪
  var reg2 = /.*?aa/;
  console.log(reg2.exec(str)); // bbbaa 只找最前面
  /**
   * exec每次只查询一次, 
   * g在上一次基础上继续往下查找
   */
  var reg3 = /.*?aa/g;
  console.log(reg3.exec(str)); // bbbaa
  console.log(reg3.exec(str)); // ccaa 只找最前面
  ```
  ```js
  // 4
  /**
   * 获取标签、key:
   * <el-input v-model="form.type"></el-input>
   * input、type
   */
  const reg = /<([\w-]+)\n?\s*[\w"'=]*\n?\s*v-model=["']\w*[Ff]orm\.(\w+)/g
  ```
  ```js
  // 路径中获取文件名
  const path = "/*/**/01.text"
  const res = path.match(/\/([^\/]+)$/)[1]
  ```
- 常用正则
  ```js
  // 邮箱
  /^[A-Za-z0-9\u4E00-\u9FA5]+(\.[A-Za-z0-9\u4E00-\u9FA5]+)+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
  // 手机号
  const reg = /^1[3456789]\d{9}$/
  // 数字要求：最大13位，小数最大4位
  const regNumber = /^([1-9]\d{0,12}(\.\d{1,4})?|0\.\d{1,4})$/
  // 数字要求：最大9位，小数最大2位（排除0）
  const regNumber =  /^([1-9]\d{0,8}(\.\d{1,2})?|0\.0[1-9]|0\.[1-9]\d{0,1})$/
  ```
- 参考：
  - [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions#special-line-feed)
  - [learn-regex-zh](https://github.com/cdoco/learn-regex-zh)
  - [learn-regex](https://github.com/ziishaned/learn-regex/blob/master/translations/README-cn.md)
  - [common-regex](https://github.com/cdoco/common-regex)
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
### Array
#### at()
```js
// 数组及数组元素
const colors = ["red", "green", "blue"];
// 使用长度属性
const lengthWay = colors[colors.length - 2];
console.log(lengthWay); // 输出：'green'
// 使用 slice() 方法。注意会返回一个数组
const sliceWay = colors.slice(-2, -1);
console.log(sliceWay[0]); // 输出：'green'
// 使用 at() 方法
const atWay = colors.at(-2);
console.log(atWay); // 输出：'green'
```
#### flatMap
- 调用 map() 方法后再调用深度为 1 的 flat() 
```js
const arr1 = [1, 2, 1];
const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));
console.log(result);
// Expected output: Array [1, 2, 2, 1]
```
#### flat
```js
const arr1 = [0, 1, 2, [3, 4]];
console.log(arr1.flat());
// expected output: Array [0, 1, 2, 3, 4]
const arr2 = [0, 1, [2, [3, [4, 5]]]];
console.log(arr2.flat());
// expected output: Array [0, 1, 2, Array [3, Array [4, 5]]]
console.log(arr2.flat(2));
// expected output: Array [0, 1, 2, 3, Array [4, 5]]
console.log(arr2.flat(Infinity));
// expected output: Array [0, 1, 2, 3, 4, 5]
```
#### splice
最大的问题是会改变原数组
- splice(start, deleteCount, item1, item2, /* …, */ itemN) 
- start 
  - 负索引从数组末尾开始计算——如果 -buffer.length <= start < 0，使用 start + array.length。
  - 如果 start < -array.length，使用 0。
  - 如果 start >= array.length，则不会删除任何元素，但是该方法会表现为添加元素的函数，添加所提供的那些元素。
- deleteCount 可选
  - 一个整数，表示数组中要从 start 开始删除的元素数量。
  - 如果省略了 deleteCount，或者其值大于或等于由 start 指定的位置到数组末尾的元素数量，那么从 start 到数组末尾的所有元素将被删除。
  - 如果你想要传递任何 itemN 参数，则应向 deleteCount 传递 Infinity 值，以删除 start 之后的所有元素，
- 返回值
  - 一个包含了删除的元素的数组。
```js
// 增加元素
const myFish = ["angel", "clown", "mandarin", "sturgeon"];
const removed = myFish.splice(2, 0, "drum");
// myFish 是 ["angel", "clown", "drum", "mandarin", "sturgeon"]
// removed 是 []，没有移除的元素
```
```js
// 刪除元素
const myFish = ["angel", "clown", "drum", "mandarin", "sturgeon"];
const removed = myFish.splice(3, 1);
// myFish 是 ["angel", "clown", "drum", "sturgeon"]
// removed 是 ["mandarin"]
```
```js
// 替換元素
const myFish = ["angel", "clown", "drum", "sturgeon"];
const removed = myFish.splice(2, 1, "trumpet");

// myFish 是 ["angel", "clown", "trumpet", "sturgeon"]
// removed 是 ["drum"]
```
#### toSpliced
- 对splice完善
- 它返回一个新数组，而不是修改原始数组。此方法不会返回已删除的元素。
- 其他与splice基本相同
```js
const months = ["Jan", "Mar", "Apr", "May"];
// 在索引 1 处添加一个元素
const months2 = months.toSpliced(1, 0, "Feb");
console.log(months2); // ["Jan", "Feb", "Mar", "Apr", "May"]

// 从第 2 个索引开始删除两个元素
const months3 = months2.toSpliced(2, 2);
console.log(months3); // ["Jan", "Feb", "May"]

// 在索引 1 处用两个新元素替换一个元素
const months4 = months3.toSpliced(1, 1, "Feb", "Mar");
console.log(months4); // ["Jan", "Feb", "Mar", "May"]

// 原数组不会被修改
console.log(months); // ["Jan", "Mar", "Apr", "May"]

```
#### sort
```js
function compareFn(a, b) {
  // 升序
  if (a < b) {// < 0，a 在 b 前，如 [a, b]
    return -1;
  }
  if (a > b) {// > 0，a 在 b 后，如 [b, a]
    return 1;
  }
  // a 一定等于 b
  return 0; // === 0	保持 a 和 b 原来的顺序
}
```
要比较数字而非字符串，比较函数可以简单的用 a 减 b，如下的函数将会将数组升序排列（如果它不包含 Infinity 和 NaN）：
```js
// 升序排列
function compareNumbers(a, b) {
  return a - b;
}
```
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
### Error
#### AggregateError
AggregateError 代表了包装了多个错误对象的单个错误对象。当一个操作需要报告多个错误时，例如 Promise.any()，当传递给它的所有承诺都被拒绝时，就会抛出该错误。
```js
Promise.any([Promise.reject(new Error("some error1")),Promise.reject(new Error("some error2"))]).catch((e) => {
  console.log(e instanceof AggregateError); // true
  console.log(e.message); // "All Promises rejected"
  console.log(e.name); // "AggregateError"
  console.log(e.errors); // [ Error: "some error1",Error: "some error2" ]
});
```
```js
try {
  throw new AggregateError([new Error("some error1"),new Error("some error2")], "Hello");
} catch (e) {
  console.log(e instanceof AggregateError); // true
  console.log(e.message); // "Hello"
  console.log(e.name); // "AggregateError"
  console.log(e.errors); // [ Error: "some error1", Error: "some error2"  ]
}
```
#### ReferenceError
ReferenceError（引用错误）对象代表当一个不存在（或尚未初始化）的变量被引用时发生的错误
```js
try {
  let a = undefinedVariable;
} catch (e) {
  console.log(e instanceof ReferenceError); // true
  console.log(e.message); // "undefinedVariable is not defined"
  console.log(e.name); // "ReferenceError"
  console.log(e.fileName); // "Scratchpad/1"
  console.log(e.lineNumber); // 2
  console.log(e.columnNumber); // 6
  console.log(e.stack); // "@Scratchpad/2:2:7\n"
}

```
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
### Promise &I
- [Promise v8 源码实现](https://chromium.googlesource.com/v8/v8/+/3.29.45/src/promise.js?autodive=0/)
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
### JSON
#### 序列化和反序列化
- 序列化（Serialization）：
  - 将对象或数据结构（如 JavaScript 对象、数组）转换为 JSON 格式的字符串。
  - 这是为了使数据可以被传输（如通过网络）或存储（如写入文件）。
- 反序列化（Deserialization）：
  - 将 JSON 格式的字符串解析回 JavaScript 对象或数据结构。
  - 这是为了在应用程序中使用数据。
- 使用场景：
  - 网络通信、数据存储、配置文件、跨语言数据交换
#### JSON api
```js
const obj = { name: "Alice", age: 25 };
const jsonString = JSON.stringify(obj); // '{"name":"Alice","age":25}'
const jsonString = '{"name":"Alice","age":25}';
const obj = JSON.parse(jsonString); // { name: "Alice", age: 25 }
```
#### JSON.stringify /
- `JSON.stringify(value[, replacer [, space]])`
  - replacer 参数可以是一个函数或者一个数组。作为函数，它有两个参数，键（key）和值（value），它们都会被序列化。( 不能用 replacer 方法，从数组中移除值（values），如若返回 undefined 或者一个函数，将会被 null 取代。)
  - space 参数用来控制结果字符串里面的间距
- 序列化事项
  - 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
  - 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
  - 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
  - undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined 被单独转换时，会返回 undefined，如JSON.stringify(function(){}) or JSON.stringify(undefined).
  - 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
  - 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
  - Date 日期调用了 toJSON() 将其转换为了 string 字符串（同 Date.toISOString()），因此会被当做字符串处理。
  - NaN 和 Infinity 格式的数值及 null 都会被当做 null。
  - 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性。

<<< ./componetns/Json.vue

<Test :is="Json" />

