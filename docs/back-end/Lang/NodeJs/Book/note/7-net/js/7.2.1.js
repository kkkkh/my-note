var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  console.log(
    "server got: " + msg + " from " + rinfo.address + ":" + rinfo.port
  );
});
// 绑定完成后触发
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

server.bind(41234);
