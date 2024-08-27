---
outline: deep
---

## Js

### String
#### fromCharCode()/fromCodePoint()
- String.fromCodePoint(num1)
  - 使用指定的`码位序列`创建的字符串
  - num1 -> Unicode 码位 -> 一个介于 0 和 0x10FFFF（1114111）（包括两者）之间的整数，表示一个 Unicode 码位
  ```js
  console.log(String.fromCodePoint(9731, 9733, 9842, 0x2f804)); //"☃★♲你"
  console.log(String.fromCharCode(9731, 9733, 9842, 0x2f804)); // "☃★♲ "
  ```
  ```js
  // 相同,10进制和16进制都相同
  console.log(String.fromCodePoint(0x10FFFF)); // '  '
  console.log(String.fromCodePoint(1114111)); // '  '
  ```
- UTF-16
  - 在 UTF-16 中，每个字符串索引是一个取值范围为 0 到 65535 的码元
  - 较高的Unicode 码位，由一对 16 位代理伪字符表示
  - fromCodePoint() 可能返回一个字符串，其在 UTF-16 码元中的 length 大于传递的参数个数
  ```js
  console.log(String.fromCodePoint(1114111).length); // 2
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


#### codePointAt()/charCodeAt()/charAt()
- codePointAt(index) 给定 index 处字符的码位值
```js
const icons = '☃★♲';
console.log(icons.codePointAt(1)); 
// 返回★的码位值
// Expected output: "9733"
```
- charCodeAt(index) 给定索引index处的 UTF-16 码元
- charAt() 返回一个由给定索引处的单个 UTF-16 码元构成的新字符串。
```js
const sentence = 'The quick brown fox jumps over the lazy dog.';
const index = 4;
console.log(
  `Character code ${sentence.charCodeAt(index)} is equal to ${sentence.charAt(
    index,
  )}`,
);
// Expected output: "Character code 113 is equal to q"
```
参考：
- [codePointAt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
- [charCodeAt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
- [charAt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)


### event
#### keydown/keyup
- <s>keypress</s><font color=red>(已弃用)</font> 当按下产生字符或符号值的键时，将触发 keypress 事件
- keyup 事件在按键被松开时触发
- keydown 事件在按键被松开时触发
- 扫描枪触发就是 input事件 + keydown Enter事件
```js
// 按回车键时
document.getElementById("app").addEventListener('keydown',(e)=>{
  console.log(e.code) //Enter
  console.log(e.key)//Enter
  // e.keyCode弃用
  console.log(e.keyCode)//13 
})
```
参考：
- [keyup_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keyup_event)
- [KeyboardEven](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent)
- [vue2 按键修饰符](https://v2.cn.vuejs.org/v2/guide/events.html#%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)


