// 手工映射 RESTful

var http = require("http");
var url = require("url");

var routes = { all: [] };
var strict = true;
var app = {};

app.use = function (path, action) {
  routes.all.push([pathRegexp(path), action]);
};
["get", "put", "delete", "post"].forEach(function (method) {
  routes[method] = [];
  app[method] = function (path, action) {
    routes[method].push([pathRegexp(path), action]);
  };
});

var pathRegexp = function (path) {
  var keys = [];
  path = path
    .concat(strict ? "" : "/? ")
    .replace(/\/\(/g, "(?:/")
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
      slash = slash || "";
      keys.push(key);
      return "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (format || "") + (capture || (format && "([^/.]+?)") || "([^/]+?)") + ")" + (optional || "") + (star ? "(/*)?" : "");
    })
    .replace(/([\/.])/g, "\\$1")
    .replace(/\*/g, "(.*)");
  return { keys: keys, regexp: new RegExp("^" + path + "$") };
};
function getUser(req, res) {
  var username = req.params.username; // TODO
  console.log(username);
  res.end(username);
}
// 增加用户
// app.post("/user/:username", addUser);
// // 删除用户
// app.delete("/user/:username", removeUser);
// // 修改用户
// app.put("/user/:username", updateUser);
// 查询用户
app.get("/user/:username", getUser);

var match = function (req, res, pathname, routes) {
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i]; // 正则匹配
    var reg = route[0].regexp;
    var keys = route[0].keys;
    var matched = reg.exec(pathname);
    if (matched) {
      // 抽取具体值
      var params = {};
      for (var i = 0, l = keys.length; i < l; i++) {
        var value = matched[i + 1];
        if (value) {
          params[keys[i]] = value;
        }
      }
      req.params = params;
      var action = route[1];
      action(req, res);
      return true;
    }
  }
  return false;
};
function handle404(req, res) {
  console.log("no page");
  res.end("no page");
}
function handle(req, res) {
  var pathname = url.parse(req.url).pathname; // 将请求方法变为小写
  var method = req.method.toLowerCase();
  console.log(routes);
  if (routes.hasOwnProperty(method)) {
    // 根据请求方法分发
    if (match(req, res, pathname, routes[method])) {
      return;
    } else {
      // 如果路径没有匹配成功，尝试让all()来处理
      if (match(req, res, pathname, routes.all)) {
        return;
      }
    }
  } else {
    // 直接让all()来处理
    if (match(req, res, pathname, routes.all)) {
      return;
    }
  } // 处理404请求
  handle404(req, res);
}

http.createServer(handle).listen(2002, "127.0.0.1");
