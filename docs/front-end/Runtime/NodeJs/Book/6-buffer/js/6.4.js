var http = require("http");
var { Buffer } = require("buffer");
var helloworld = "";
for (var i = 0; i < 1024 * 10; i++) {
  helloworld += "a";
}
helloworld = Buffer.from(helloworld);
http
  .createServer(function (req, res) {
    res.writeHead(200);
    res.end(helloworld);
  })
  .listen(8001);
