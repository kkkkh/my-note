const { Buffer } = require("buffer");
var showMem = function () {
  var mem = process.memoryUsage();
  var format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };
  console.log(
    "Process: heapTotal " +
      format(mem.heapTotal) +
      " heapUsed " +
      format(mem.heapUsed) +
      " rss " +
      format(mem.rss)
  );
  console.log("--------------------------------------------------------");
};
var useMem = function () {
  var size = 20 * 1024 * 1024;
  // allocUnsafe 可能包含旧数据，不初始化内存
  // alloc
  var buffer = Buffer.alloc(size);
  for (var i = 0; i < size; i++) {
    buffer[i] = 0;
  }
  return buffer;
};
var total = [];
for (var j = 0; j < 15; j++) {
  showMem();
  total.push(useMem());
}
showMem();
