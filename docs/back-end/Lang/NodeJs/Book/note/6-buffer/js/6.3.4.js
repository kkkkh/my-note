const { Buffer } = require("buffer");
var fs = require("fs");
var chunks = [];
var size = 0;
var res = fs.createReadStream("test.md", { highWaterMark: 11 });
res.on("data", function (chunk) {
  //  用一个数组来存储接收到的所有Buffer片段
  chunks.push(chunk);
  //  并记录下所有片段的总长度
  size += chunk.length;
});
res.on("end", function () {
  var buf = Buffer.concat(chunks, size);
  var str = buf.toString("utf-8");
  //   var str = iconv.decode(buf, "utf8");
  console.log(str);
});
