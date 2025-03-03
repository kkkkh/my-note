var cp = require("child_process");
// 4个方法，均会返回子进程对象
// 执行命令
cp.spawn("node", ["worker.js"]);
// 执行命令
// 可以指定timeout属性设置超时时间，一旦超时将会杀死
cp.exec("node worker.js", function (err, stdout, stderr) {
  // some code
});
// 执行文件
// 可以指定timeout属性设置超时时间，一旦超时将会杀死
// 如果js文件，首行加 #! /usr/bin/env node
cp.execFile("worker.js", function (err, stdout, stderr) {
  // some code
});
// 只需制定要执行的js文件模块
cp.fork("./worker.js");

// exec、execFile、fork后面3种方法都是spawn()的延伸应用
