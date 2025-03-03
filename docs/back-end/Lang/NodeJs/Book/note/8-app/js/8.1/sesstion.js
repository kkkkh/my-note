var http = require("http");
var crypto = require("crypto");

var sessions = {};
var key = "session_id";
var EXPIRES = 20 * 60 * 1000;
var secret = "0987654321";
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
var generate = function () {
  var session = {};
  session.id = new Date().getTime() + Math.random() + "";
  session.cookie = { expire: new Date().getTime() + EXPIRES };
  sessions[session.id] = session;
  console.log("sessions generate", sessions);
  return session;
};
var handle = function (req, res) {
  if (!req.session.isVisit) {
    req.session.isVisit = true;
    res.writeHead(200);
    res.end("欢迎第一次来到动物园");
  } else {
    res.writeHead(200);
    res.end("动物园再次欢迎你");
  }
};

// 将值通过私钥签名，由．分割原值和签名
var sign = function (val, secret) {
  return val + "." + crypto.createHmac("sha256", secret).update(val).digest("base64").replace(/\=+$/, "");
};

// 取出口令部分进行签名，对比用户提交的值
var unsign = function (val, secret) {
  var str = val.slice(0, val.lastIndexOf("."));
  console.log("unsign str", str);
  console.log("unsign sign", sign(str, secret));
  return sign(str, secret) == decodeURIComponent(val) ? str : false;
};

http
  .createServer(function (req, res) {
    res.setHeader("Content-type", "text/html; charset=utf-8");
    req.cookies = parseCookie(req.headers.cookie);
    var signId = req.cookies && req.cookies[key];
    console.log("key", key);
    console.log("req.cookies", req.cookies);
    console.log("id", signId);
    console.log("req.session", req.session);
    if (!signId) {
      req.session = generate();
      // 通过上边打印，发现req.session是临时存储的
    } else {
      console.log("signId", signId);
      const id = unsign(signId, secret);
      console.log("unsign id", id);
      console.log("sessions", sessions);
      var session = sessions[id];
      console.log("session", session);
      if (session) {
        if (session.cookie.expire > new Date().getTime()) {
          // 更新超时时间
          console.log("更新超时时间");
          session.cookie.expire = new Date().getTime() + EXPIRES;
          req.session = session;
        } else {
          // 超时了，删除旧的数据，并重新生成
          delete sessions[id];
          req.session = generate();
        }
      } else {
        // 如果session过期或口令不对，重新生成session
        req.session = generate();
      }
    }
    var writeHead = res.writeHead;
    res.writeHead = function () {
      var cookies = res.getHeader("Set-Cookie");
      // response.getHeader(name)
      // 获取 res.getHeader("Set-Cookie");
      console.log(req.session.id);
      var val = sign(req.session.id, secret);
      var session = serialize(key, val, { path: "/admin" });
      //   cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
      cookies = Array.isArray(cookies) ? cookies.concat(session) : session;
      console.log("cookies", cookies);
      console.log("session2", session);
      res.setHeader("Set-Cookie", cookies);
      return writeHead.apply(this, arguments);
    };
    handle(req, res);
  })
  .listen(1339, "127.0.0.1");

// 口令在客户端，存在被盗用的问题
// 口令随机算法，被命中
// -> 让口令更安全
