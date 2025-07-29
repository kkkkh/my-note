### Number
#### 进制转化
小窍门：16进制是一个字符串，10进制是一个数字
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
小窍门：2进制也是一个字符串
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
#### BigInt
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
### toLocaleString &I
toLocaleString(locales, options) 方法返回这个数字特定于语言环境的表示字符串
```js
const number = 3500;
console.log(number.toLocaleString()); // "3,500"，如果区域设置为美国英语
```
参考：[toLocaleString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)
