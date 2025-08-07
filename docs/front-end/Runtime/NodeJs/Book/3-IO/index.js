// 加入两个nextTick()的回调函数
process.nextTick(function () {
  console.log("nextTick延迟执行1");
});
process.nextTick(function () {
  console.log("nextTick延迟执行2");
});
// 加入两个setImmediate()的回调函数
setImmediate(function () {
  console.log("setImmediate延迟执行1");
  // 进入下次循环
  process.nextTick(function () {
    console.log("强势插入");
  });
});
setImmediate(function () {
  console.log("setImmediate延迟执行2");
});
console.log("正常执行");

// 当第一个setImmediate()的回调函数执行后， 并没有立即执行第二个，
// 而是进入了下一轮循环， 再次按process.nextTick()优先、 setImmediate()次后的顺序执行。
// 之所以这样设计， 是为了保证每轮循环能够较快地执行结束， 防止CPU占用过多而阻塞后续I/O调用的情况。
