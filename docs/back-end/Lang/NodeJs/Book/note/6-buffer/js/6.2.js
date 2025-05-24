// buffer/字符串 转换
const { Buffer } = require("buffer");
// new Buffer(str, [encoding]);
// 创建1
const buf = Buffer.from("aaa", "UTF-8");
console.log(buf);

// 转换1
const str1 = buf.toString("UTF-8");
console.log(str1);

// 写入
buf.write("b", 0);
console.log(buf);
//  buf.toString([encoding], [start], [end])
// 转换2

const str2 = buf.toString("UTF-8");
console.log(str2);

// 创建2
const buf1 = Buffer.from("aaa", "base64");
console.log(buf1);
