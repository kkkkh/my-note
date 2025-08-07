var fs = require("fs");
// 为了重新乱码的问题
// highWaterMark设置11
// 将文件可读流的每次读取的Buffer长度限制为11
var rs = fs.createReadStream("test.md", { highWaterMark: 11 });
// 设置编码
rs.setEncoding("utf8");
var data = "";
rs.on("data", function (chunk) {
  // 未设置编码是buffer对象
  // setEncoding设置编码后，
  // 1、收到字符串
  // data事件都通过该decoder对象进行Buffer到字符串的解码
  // data不再收到原始的Buffer，为字符串
  // 2、乱码问题被解决
  // 是decoder对象，来自于string_decoder模块StringDecoder的实例对象
  // “月”字的前两个字节被保留在StringDecoder实例内部。
  // 第二次write()时， 会将这2个剩余字节和后续11个字节组合在一起， 再次用3的整数倍字节进行转码。
  // 但是它也并非万能药，它目前只能处理UTF-8、Base64和UCS-2/UTF-16LE这3种编码
  console.log(chunk);
  //   窗前明
  // 月光，疑
  // 似地上霜
  // ，举头
  // 望明月，
  // 低头思故
  // 乡
  data += chunk;
});
rs.on("end", function () {
  console.log(data);
});
// 6.3.4为正确拼接方法
