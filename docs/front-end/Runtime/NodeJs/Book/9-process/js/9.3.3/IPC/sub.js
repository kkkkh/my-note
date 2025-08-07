// sub.js
console.log("sub1");
process.on("message", function (m) {
  console.log("CHILD got message:", m);
});
console.log("sub2");
process.send({ foo: "bar" });
