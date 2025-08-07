var http = require("http");
var url = require("url");

http
  .createServer(function (req, res) {
    // 路径解析
    // 静态文件服务器
    // 查看图片
    res.redirect = function (url) {
      res.setHeader("Location", url);
      res.writeHead(302);
      res.end("Redirect to " + url);
    };
    console.log(req.url);
    if (url.parse(req.url).pathname === "/a") {
      res.redirect("/b");
    } else {
      res.end("over");
    }
  })
  .listen(2102, "127.0.0.1");
