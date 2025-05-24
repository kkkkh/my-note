var fs = require("fs");
// 为了重新乱码的问题
// highWaterMark设置11
// 将文件可读流的每次读取的Buffer长度限制为11
var rs = fs.createReadStream("test.md", { highWaterMark: 11 });
var data = "";
rs.on("data", function (chunk) {
  console.log(chunk);
  // chunk被切割了，一个汉字三个字节，无法重新组成完整汉字
  // <Buffer e5 ba 8a e5 89 8d e6 98 8e e6 9c>
  // <Buffer 88 e5 85 89 ef bc 8c e7 96 91 e6>
  data += chunk;
  // data = data.toString() + chunk.toString()
  // 导致乱码了
});
rs.on("end", function () {
  console.log(data);
});
// 6.3.3 使用setEncoding解决乱码
