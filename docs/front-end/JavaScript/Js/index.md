---
outline: deep
---

## Js
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
  //
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
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
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
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
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
### RegExp

参考：[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions#special-line-feed)
- RegExp 涉及的api
  - RegExp 的 exec 和 test 方法
  - String 的 match、matchAll、replace、replaceAll、search 和 split

  - exec
  ```js

  ```
- 两种方式创建 
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
- 示例一：
  ```js
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
参考：
[String replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

#### 特殊字符
\r 回车
\n 换行符
- 在 Unix 和 Linux 系统（包括 macOS）中，换行符用 \n（LF，Line Feed）表示。
- 在 Windows 系统中，换行符用 \r\n（CR+LF，Carriage Return + Line Feed）表示。
- 早期的 Mac OS（例如，Mac OS 9）使用 \r（CR，Carriage Return）表示换行。
- 以\n为主流
```js
function queryCodeListTrim(strings) {
  return strings
    .split(/\r?\n+/)
    .filter((val) => val !== '')
    .map((item) => item.trim())
}
```
### Function
- 判断是否是Function
  - func && func(args)
  - ES2020的新语法func?.(args)
  - typeof func === 'function'
#### bind
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
#### call
```js
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
#### apply
```js
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);
console.log(max);
// Expected output: 7
const min = Math.min.apply(null, numbers);
console.log(min);
// Expected output: 2
```
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
#### Math.ceil() / Math.floor() / Math.round() 
- Math.ceil(x) 向上取整
  ```js
  console.log(Math.ceil(1.2)) //2
  ```
- Math.floor(x) 向下取整
  ```js
  console.log(Math.floor(1.2)) //1
  ```
- Math.round() 四舍五入后最接近的整数
  ```js
  console.log(Math.round(1.5)) //2
  console.log(Math.round(1.2)) //1
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
### Promise
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
### new URL(url, import.meta.url)
- 示例代码：
  ```js
  // 1
  const imgUrl = new URL('./img.png', import.meta.url).href
  document.getElementById('hero-img').src = imgUrl
  // 2支持动态
  function getImageUrl(name) {
    return new URL(`./dir/${name}.png`, import.meta.url).href
  }
  ```
- new URL(url, base)
  - url：一个表示绝对或相对 URL
  - base：一个表示基准 URL 的字符串，当 url 为相对 URL 时，它才会生效
  - new URL(`./dir/${name}.png`, import.meta.url)
- import.meta.url
  - import.meta.url 是一个 ESM 的原生功能，会暴露`当前模块的 URL`
  - 在一个项目中 console.log(import.meta.url) => `http://localhost:8000/xx/src/views/xx.vue?t=172196193xxxx` 相当于当前模块的路径所在，作为基准值，第一个参数再为一个相对路径
- import.meta.reslove()
  ```js
  // Approach 1
  console.log(await import("./lib/helper.js"));
  // Approach 2
  const helperPath = import.meta.resolve("./lib/helper.js");
  console.log(helperPath);
  console.log(await import(helperPath));
  ```
  ```js
  const helperPath = import.meta.resolve("./lib/helper.js");
  console.log(helperPath);
  // 相同
  const helperPath = new URL("./lib/helper.js", import.meta.url).href;
  console.log(helperPath);
  ```
- 参考：
  - [new URL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL)
  - [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)
  - [import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta) 元属性将特定上下文的元数据暴露给 JavaScript 模块，vite 在原生的基础上拓展了功能，例如 import.meta.env
- 在 esm 中路径解析，[参考 import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta)
  ```js
  // 之前（CommonJS）：
  const fs = require('fs/promises')
  const path = require('path')
  const filePath = path.join(__dirname, 'someFile.txt')
  fs.readFile(filePath, 'utf8').then(console.log)
  // 之后（ES 模块）：
  import fs from 'node:fs/promises'
  const fileURL = new URL('./someFile.txt', import.meta.url)
  fs.readFile(fileURL, 'utf8').then(console.log)
  ```


