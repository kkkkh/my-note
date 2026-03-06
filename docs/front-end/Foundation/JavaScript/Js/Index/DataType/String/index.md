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
