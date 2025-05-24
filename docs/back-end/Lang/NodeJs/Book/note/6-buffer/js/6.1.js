const { Buffer } = require("buffer");
var buffer = Buffer.allocUnsafe(100);
buffer[10] = -100;
buffer[11] = 300;
buffer[12] = 3.14;
buffer[13] = 10;
console.log(buffer[9]); //0
console.log(buffer[10]); //156
console.log(buffer[11]); //44
console.log(buffer[12]); //3
console.log(buffer[13]); //10
// 给元素的赋值如果小于0， 就将该值逐次加256， 直到得到一个0到255之间的整数。
// 如果得到的数值大于255， 就逐次减256， 直到得到0~255区间内的数值。
//如果是小数， 舍弃小数部分， 只保留整数部分。

// 前端使用buffer
// const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer; // 创建一个包含 ASCII 码序列的 ArrayBuffer
// console.log(buffer); // 打印 ArrayBuffer 对象
