// 拼接示例
// 对于中文可能会出现乱码的情况
// 6.3.2.js为复现此情况
var fs = require("fs");
var rs = fs.createReadStream("test.md");
var data = "";
rs.on("data", function (chunk) {
  data += chunk;
  // data = data.toString() + chunk.toString()
});
rs.on("end", function () {
  console.log(data);
});
