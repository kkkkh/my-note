var http = require("http");

var serialize = function (name, val, opt) {
  var pairs = [name + "=" + encodeURIComponent(val)];
  opt = opt || {};
  if (opt.maxAge) pairs.push("Max-Age=" + opt.maxAge);
  if (opt.domain) pairs.push("Domain=" + opt.domain);
  if (opt.path) pairs.push("Path=" + opt.path);
  if (opt.expires) pairs.push("Expires=" + opt.expires.toUTCString());
  if (opt.httpOnly) pairs.push("HttpOnly");
  if (opt.secure) pairs.push("Secure");
  return pairs.join("; ");
};

var handle = function (req, res) {
  if (!req.cookies.isVisit) {
    res.setHeader("Set-Cookie", serialize("isVisit", "1", { path: "/admin", domain: "jxjx.com", secure: true }));
    res.writeHead(200);
    res.end("欢迎第一次来到动物园");
  } else {
    res.writeHead(200);
    res.end("动物园再次欢迎你");
  }
};
var parseCookie = function (cookie) {
  var cookies = {};
  if (!cookie) {
    return cookies;
  }
  var list = cookie.split("; ");
  for (var i = 0; i < list.length; i++) {
    var pair = list[i].split("=");
    cookies[pair[0].trim()] = pair[1];
  }
  return cookies;
};
http
  .createServer(function (req, res) {
    console.log(req.headers.cookie);
    req.cookies = parseCookie(req.headers.cookie);
    res.setHeader("Content-type", "text/html; charset=utf-8");
    handle(req, res);
  })
  .listen(1338, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1338/");

// cookie问题
// 1、体积：体积过大
// 2、安全：数据前后端进行修改，被篡改和伪造
