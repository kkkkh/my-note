

var http = require("http");
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("handled by child, pid is " + process.pid + "\n");
});

process.on("message", function (m, tcp) {
  if (m.includes("server")) {
    console.log(m);
    tcp.on("connection", function (socket) {
      console.log(m);
      console.log("tcp connection");
      server.emit("connection", socket);
    });
  }
});
