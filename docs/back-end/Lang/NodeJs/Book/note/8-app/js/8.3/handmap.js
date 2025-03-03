var http = require("http");
var url = require("url");

var routes = [];
var strict = true;

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

var use = function (path, action) {
  routes.push([pathRegexp(path), action]);
};

exports.setting = function (req, res) {
  console.log("setting");
  res.end("setting");
  // TODO
};

// use("/user/setting", exports.setting);
// use("/setting/user", exports.setting); // 甚至
// use("/setting/user/jacksontian", exports.setting);
use("/profile/:username", function (req, res) {
  var username = req.params.username; // TODO
  console.log(username);
  res.end(username);
});

function handle404(req, res) {
  console.log("no page");
  res.end("no page");
}
function handle(req, res) {
  var pathname = url.parse(req.url).pathname;
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
      return;
    }
  } // 处理404请求
  handle404(req, res);
}

http.createServer(handle).listen(2000, "127.0.0.1");
