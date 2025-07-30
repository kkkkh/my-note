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
#### JSON.stringify / JSON.parse
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

<<< @/front-end/JavaScript/Js/components/JSON/index.vue

<Test :is="modules['Json']" />

```js
// 可以在stringify层处理
var res  =JSON.parse(
  JSON.stringify(
    {a:1,b:{a:2,c:{a:3}}},
    (key,value)=>{if(key === 'a'){return 4}else{return value}})
  )
// {"a":4,"b":{"a":4,"c":{"a":4}}}
// 也可以在parse层处理
var res  =JSON.parse(
  JSON.stringify({a:1,b:{a:2,c:{a:3}}})
  ,(key,value)=>{if(key === 'a'){return 5}else{return value}})
// {"a":5,"b":{"a":5,"c":{"a":5}}}
```
