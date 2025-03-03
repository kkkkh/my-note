var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var mime = require("mime");

http
  .createServer(function (req, res) {
    var pathname = path.join(__dirname, url.parse(req.url).pathname);
    res.sendfile = function (filepath) {
      console.log("filepath", filepath);
      // stat 获取文件状态
      fs.stat(filepath, function (err, stat) {
        var stream = fs.createReadStream(filepath); // 设置内容
        res.setHeader("Content-Type", mime.getType(filepath)); // 设置长度
        console.log(stat);
        console.log(stat.size);
        res.setHeader("Content-Length", stat.size); // 设置为附件
        // res.setHeader("Content-Disposition", 'inline; filename="' + path.basename(filepath) + '"');
        res.setHeader("Content-Disposition", 'attachment; filename="' + path.basename(filepath) + '"');
        res.writeHead(200);
        stream.pipe(res);
      });
    };
    res.sendfile(pathname);
  })
  .listen(2100, "127.0.0.1");
