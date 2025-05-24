var net = require("net");
var server = net.createServer(function (socket) {
  // Nagle算法：要求缓冲区的数据达到一定数量或者一定时间后才将其发出
  // 去掉Nagle算法
  socket.setNoDelay(true);
  socket.on("data", function (data) {
    console.log(data.toString());
    socket.write("欢迎光临《深入浅出Node.js》3");
  });
  socket.on("end", function () {
    console.log("连接断开");
  });
  socket.write("欢迎光临《深入浅出Node.js》1\n");
});
server.listen(8124, function () {
  console.log("server bound");
});

// 服务器事件
server.on("connection", function (socket) {
  // 新的连接
  socket.write("《深入浅出Node.js》2\n");
  console.log("connection event");
});
