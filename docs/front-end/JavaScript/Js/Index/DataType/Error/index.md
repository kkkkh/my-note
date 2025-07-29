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
