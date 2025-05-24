var foo = [];
foo[100] = 100;
foo["hello"] = "world";
foo["hello1"] = "world1";
for (var i in foo) {
  console.log("for in", foo[i]);
  //   100 和 world
}
//foo = [0,1,2,...100]
console.log(foo.length); // 长度是101
for (var i = 0; i < foo.length; i++) {
  console.log("for", i);
  //   1 - 100
}
foo.forEach((val) => {
  console.log("each", val);
  //   100
});
