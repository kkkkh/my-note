var http = require("http");
var url = require("url");

function handle500(req, res) {
  console.log("node page");
}

function handle(req, res) {
  var pathname = url.parse(req.url).pathname;
  var paths = pathname.split("/");
  var controller = paths[1] || "index";
  var action = paths[2] || "index";
  var args = paths.slice(3);
  var module;
  try {
    // require的缓存机制使得只有第一次是阻塞的
    module = require("./controllers/" + controller);
  } catch (ex) {
    handle500(req, res);
    return;
  }
  var method = module[action];
  if (method) {
    method.apply(null, [req, res].concat(args));
  } else {
    handle500(req, res);
  }
}
http.createServer(handle).listen(2001, "127.0.0.1");
