// parent.js
var cp = require("child_process");
// 通过fork()或者其他API，创建子进程之后，
// 为了实现父子进程之间的通信，父进程与子进程之间
// 将会创建IPC通道(Inter-Process Communication 进程间通信)
var n = cp.fork(__dirname + "/sub.js");
console.log("parent1");
n.on("message", function (m) {
  console.log("PARENT got message:", m);
});
console.log("parent2");
n.send({ hello: "world" });
