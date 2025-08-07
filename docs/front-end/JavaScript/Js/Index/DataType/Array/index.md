### Array
#### from
Array.from() 静态方法从可迭代或类数组对象创建一个新的浅拷贝的数组实例。
```js
console.log(Array.from("foo"));
// Expected output: Array ["f", "o", "o"]

console.log(Array.from([1, 2, 3], (x) => x + x));
// Expected output: Array [2, 4, 6]

// 初始化一个长度为5的数组，值为索引
console.log(Array.from({length: 5}, (_, i) => i));
// Expected output: Array [0, 1, 2, 3, 4]

// 另外一种方法
new Array(5).fill(0).map((_, i) => i);
// Expected output: Array [0, 1, 2, 3, 4]
```
```js
// 序列生成器函数（通常称为“range”，例如 Clojure、PHP 等）
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
// 生成的数字范围 0..4
range(0, 4, 1);
// [0, 1, 2, 3, 4]
// 生成的数字范围 1..10，步长为 2
range(1, 10, 2);
// [1, 3, 5, 7, 9]
// 使用 Array.from 生成字母表，并将其序列排序
range("A".charCodeAt(0), "Z".charCodeAt(0), 1).map((x) =>
  String.fromCharCode(x),
);
// ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
```
参考：
- [Array.from()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
#### push pop shift unshift
- unshift() 加到开头，返回长度
- push() 加到末尾，返回长度

- shift() 头部删除，并返回该元素的值。
- pop() 末尾删除，并返回该元素的值。

- 队列：先进先出（push到末尾，shift从头部删除，但是不推荐使用shift）
- 栈：先进后出 （push到末尾，pop从末尾删除）
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
