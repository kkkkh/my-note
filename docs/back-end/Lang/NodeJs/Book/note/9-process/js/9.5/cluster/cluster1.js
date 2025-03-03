// cluster.js
var cluster = require("cluster");
var server = require("net").createServer();
server.listen(1337);

cluster.setupMaster({
  exec: "worker.js",
});
var cpus = require("os").cpus();
for (var i = 0; i < cpus.length; i++) {
  const worker = cluster.fork();
  console.log(worker);
  worker.process.send("server", server);
}
