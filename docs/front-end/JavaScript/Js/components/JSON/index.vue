<template>
  <div id="json"></div>
</template>
<script setup>
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined; // 返回 undefined 表示该属性将被忽略
  }
  return value;
}
const test1 = () => {
  var foo = { foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7 };
  var jsonString = JSON.stringify(foo, replacer);
  console.log(jsonString)
  const jsonString2 = JSON.stringify(foo, ['week', 'month']);
  console.log(jsonString2)
}
const test2 = () => {
  const foo1 = { foundation: {a:"1",b:2}, model: "box", week: 45, transport: "car", month: 7 ,a:1};
  const foo2 = { foundation: {a:1,b:2}, model: "box", week: 45, transport: "car", month: 7 ,a:1};
  // a 会被过滤
  const jsonString = JSON.stringify(foo1, replacer);
  // a 不会被过滤
  const jsonString2 = JSON.stringify(foo2, replacer);
  // 只保留第一层a
  const jsonString3 = JSON.stringify(foo1, ['week', 'month','a']);
  // 保留第一层a，和foundation 的 a
  const jsonString4 = JSON.stringify(foo2, ['week', 'month','foundation','a']);
  // 保留foundation层，foundation的属性不在保留内，所以不保存
  const jsonString5 = JSON.stringify(foo2, ['week', 'month','foundation']);
  console.log(jsonString)
  console.log(jsonString2)
  console.log(jsonString3)
  console.log(jsonString4)
  console.log(jsonString5)
}
const test3 = () => {
  const foo = [{a:1},{b:2},{c:{a:1,b:"2"}}]
  const jsonString = JSON.stringify(foo, ['b','c']);
  // space 2 参数用来控制结果字符串里面的间距
  const jsonString2 = JSON.stringify(foo, replacer, 2);
  console.log(jsonString)
  console.log(jsonString2)
}
const test = () => {
  console.log('test1')
  test1()
  console.log('test2')
  test2()
  console.log('test3')
  test3()
}
defineExpose({
  test
})
</script>
