var cp = require("child_process");
var child1 = cp.fork("child.js");
var child2 = cp.fork("child.js");

// Open up the server object and send the handle
var server = require("net").createServer();
server.on("connection", function (socket) {
  socket.end("handled by parent\n");
});
server.listen(1337, function () {
  console.log("child send");
  child1.send("server1", server);
  child2.send("server2", server);
  server.close();
});
