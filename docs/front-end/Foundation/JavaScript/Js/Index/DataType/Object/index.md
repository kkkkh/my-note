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
