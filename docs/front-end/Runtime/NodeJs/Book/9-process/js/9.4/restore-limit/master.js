var fork = require("child_process").fork;
var cpus = require("os").cpus();
var server = require("net").createServer();
server.listen(1337);

// 重启次数
var limit = 10;
// 时间单位
var during = 1000;
var restart = [];

var isTooFrequently = function () {
  // 记录重启时间
  var time = Date.now();
  var length = restart.push(time);
  if (length > limit) {
    // 取出最后10个记录
    restart = restart.slice(limit * -1);
  }
  // 最后一次重启到前10次重启之间的时间间隔
  console.log(restart.length);
  console.log("endTime", restart[restart.length - 1]);
  console.log("strtTime", restart[0]);
  console.log("time", restart[restart.length - 1] - restart[0]);
  return restart.length >= limit && restart[restart.length - 1] - restart[0] < during;
};

var workers = {};
var createWorker = function () {
  // 检查是否太过频繁
  if (isTooFrequently()) {
    console.log("giveup");
    // 触发giveup事件后，不再重启
    process.emit("giveup", restart.length, during);
    return;
  }
  var worker = fork(__dirname + "/worker.js");
  worker.on("exit", function () {
    console.log("Worker " + worker.pid + " exited.");
    delete workers[worker.pid];
  });
  // 重新启动新的进程
  worker.on("message", function (message) {
    if (message.act === "suicide") {
      createWorker();
    }
  });
  // 句柄转发
  worker.send("server", server);
  workers[worker.pid] = worker;
  console.log("Create worker. pid: " + worker.pid);
};

for (var i = 0; i < cpus.length; i++) {
  createWorker();
}

// 进程自己退出时，让所有工作进程退出
process.on("exit", function () {
  for (var pid in workers) {
    workers[pid].kill();
  }
});
