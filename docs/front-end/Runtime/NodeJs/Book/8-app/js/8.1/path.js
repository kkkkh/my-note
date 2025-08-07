var http = require("http");
var path = require("path");
var url = require("url");
var fs = require("fs");

http
  .createServer(function (req, res) {
    // 路径解析
    // 静态文件服务器
    // 查看图片
    console.log(req.url);
    var pathname = url.parse(req.url).pathname;
    fs.readFile(path.join(__dirname, pathname), function (err, file) {
      if (err) {
        res.writeHead(404);
        res.end("找不到相关文件。- -");
        return;
      }
      res.writeHead(200);
      console.log(file); // buffer
      res.end(file);
    });
  })
  .listen(1337, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1337/");
