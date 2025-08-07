var http = require("http");
var fs = require("fs");
var crypto = require("crypto");

const filename = "./img/1.jpg";

var handle = function (req, res) {
  fs.stat(filename, function (err, stat) {
    var lastModified = stat.mtime.toUTCString();
    console.log("lastModified", lastModified);
    console.log("if-modified-since", req.headers["if-modified-since"]);
    // 如果服务器端没有新的版本，只需响应一个304状态码，客户端就使用本地版本
    if (lastModified === req.headers["if-modified-since"]) {
      res.writeHead(304, "Not Modified");
      res.end();
    } else {
      fs.readFile(filename, function (err, file) {
        // 本地文件的最后修改时间
        res.setHeader("Last-Modified", lastModified);
        res.writeHead(200, "Ok");
        res.end(file);
      });
    }
  });
};

// http 1.0
// lastModified / if-modified-since

// var lastModified = stat.mtime.toUTCString();
// res.setHeader("Last-Modified", lastModified);

// var lastModified = stat.mtime.toUTCString();
// if (lastModified === req.headers["if-modified-since"]) {}

// 时间戳问题：
// 1、文件的时间戳改动但内容并不一定改动。
// 2、时间戳只能精确到秒级别，更新频繁的内容将无法生效。

// 解决：不依赖时间戳 ->etag

var getHash = function (str) {
  var shasum = crypto.createHash("sha1");
  return shasum.update(str).digest("base64");
};
var handle = function (req, res) {
  fs.readFile(filename, function (err, file) {
    var hash = getHash(file);
    var noneMatch = req.headers["if-none-match"];
    if (hash === noneMatch) {
      res.writeHead(304, "Not Modified");
      res.end();
    } else {
      //   res.setHeader("Cache-Control", "max-age=" + 10 * 365 * 24 * 60 * 60 * 1000);
      res.setHeader("ETag", hash);
      res.writeHead(200, "Ok");
      res.end(file);
    }
  });
};
// http 1.1
// If-None-Match/ETag
// ETag 由服务器端生成，服务器端可以决定它的生成规则。如果根据文件内容生成散列值

// var hash = getHash(file);
// var noneMatch = req.headers["if-none-match"];
// if (hash === noneMatch) {
// }
// res.setHeader("ETag", hash);

// 问题：
// 但是它依然会发起一个HTTP请求，使得客户端依然会花一定时间来等待响应 => 连条件请求都不用发起

var handle = function (req, res) {
  fs.readFile(filename, function (err, file) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
    res.setHeader("Expires", expires.toUTCString());
    res.writeHead(200, "Ok");
    res.end(file);
  });
};

// http 1.0
// expires 强制缓存
// 问题
// Expires的缺陷在于浏览器与服务器之间的时间可能不一致，这可能会带来一些问题，比如文件提前过期，或者到期后并没有被删除

var handle = function (req, res) {
  fs.readFile(filename, function (err, file) {
    res.setHeader("Cache-Control", "max-age=" + 10 * 365 * 24 * 60 * 60 * 1000);
    res.writeHead(200, "Ok");
    res.end(file);
  });
};

// http1.1
// Cache-Control设置了max-age 协商缓存
// 时间不同步带来的不一致性问题，倒计时的方式计算过期时间即可
// Cache-Control:max-age/Expires两个同时存在
// max-age会覆盖Expires

// 测试问题
// 设置了，浏览器刷新，依旧200
// 因为在req headers 中默认Cache-Control: no-cache
// 设置请求头，可以使用缓存

http.createServer(handle).listen(1340, "127.0.0.1");

// basic认证;
// 摘要访问认证;
