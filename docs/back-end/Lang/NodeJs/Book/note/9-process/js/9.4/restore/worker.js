// worker.js
var http = require("http");
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("handled by child, pid is " + process.pid + "\n");
  console.log("throw err");
  throw new Error("throw exception");
});

var worker;
process.on("message", function (m, tcp) {
  if (m === "server") {
    worker = tcp;
    worker.on("connection", function (socket) {
      server.emit("connection", socket);
    });
  }
});

// process.on("uncaughtException", function () {
//   // 停止接收新的连接
//   worker.close(function () {
//     // 所有已有连接断开后，退出进程
//     process.exit(1);
//   });
// });

process.on("uncaughtException", function (err) {
  process.send({ act: "suicide" });
  // 停止接收新的连接
  worker.close(function () {
    // 所有已有连接断开后，退出进程
    console.log("close");
    process.exit(1);
  });
  // 避免长链接，超时强制退出
  // 5秒后退出进程
  setTimeout(function () {
    console.log("exit");
    process.exit(1);
  }, 5000);
});
