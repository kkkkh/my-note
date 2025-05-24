var count = 0;
var net = require("net");
var client = net.connect({ port: 8124 }, function () {
  console.log("client connected");
  client.write("world! \r\n");
});
client.on("data", function (data) {
  count++;
  console.log("测试调用次数", count);
  // 有时候调1次
  // 有时候调2次
  // 更多时候是小数据包进行合并，发送1次
  console.log(data.toString());
  client.end();
});
client.on("end", function () {
  console.log("client disconnected");
});

client.on("connect", () => {
  console.log("client connect event");
});
