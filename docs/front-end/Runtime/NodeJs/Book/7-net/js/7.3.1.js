var http = require("http");

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    // 会先调用write()发送数据，后调用end()
    // res.write("Hello World\n");
    res.end("Hello World\n");
  })
  .listen(1337, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1337/");
