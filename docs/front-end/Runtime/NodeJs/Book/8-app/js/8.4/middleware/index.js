var http = require("http");
var url = require("url");

var routes = { all: [] };
var strict = false;
var app = {};
// querystring解析中间件
var querystring = function (req, res, next) {
  req.query = url.parse(req.url, true).query;
  next();
};
// cookie解析中间件
var cookie = function (req, res, next) {
  console.log("cookie");
  var cookie = req.headers.cookie;
  var cookies = {};
  if (cookie) {
    var list = cookie.split("; ");
    for (var i = 0; i < list.length; i++) {
      var pair = list[i].split("=");
      cookies[pair[0].trim()] = pair[1];
    }
  }
  req.cookies = cookies;
  next();
};
var session = function (req, res, next) {
  var id = req.cookies.sessionid;
  store.get(id, function (err, session) {
    if (err) {
      // 将异常通过next()传递
      return next(err);
    }
    req.session = session;
    next();
  });
};
var authorize = function (req, res, next) {
  next();
};

var pathRegexp = function (path) {
  var keys = [];
  path = path
    .concat(strict ? "" : "/?")
    .replace(/\/\(/g, "(?:/")
    .replace(
      /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g,
      function (_, slash, format, key, capture, optional, star) {
        // 将匹配到的键值保存起来
        keys.push(key);
        slash = slash || "";
        return (
          "" +
          (optional ? "" : slash) +
          "(?:" +
          (optional ? slash : "") +
          (format || "") +
          (capture || (format && "([^/.]+?)") || "([^/]+?)") +
          ")" +
          (optional || "") +
          (star ? "(/*)?" : "")
        );
      }
    )
    .replace(/([\/.])/g, "\\$1")
    .replace(/\*/g, "(.*)");
  return { keys: keys, regexp: new RegExp("^" + path + "$") };
};

app.use = function (path) {
  var handle;
  if (typeof path === "string") {
    handle = {
      // 第一个参数作为路径
      path: pathRegexp(path),
      // 其他的都是处理单元
      stack: Array.prototype.slice.call(arguments, 1),
    };
  } else {
    handle = {
      // 第一个参数作为路径
      path: pathRegexp("/user/*"),
      // 其他的都是处理单元
      stack: Array.prototype.slice.call(arguments, 0),
    };
  }
  routes.all.push(handle);
};

["get", "put", "delete", "post"].forEach(function (method) {
  routes[method] = [];
  app[method] = function (path) {
    routes[method].push({
      path: pathRegexp(path),
      stack: Array.prototype.slice.call(arguments, 1),
    });
  };
});

var match = function (pathname, routes) {
  var stacks = [];
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    // 正则匹配
    var reg = route.path.regexp;
    var matched = reg.exec(pathname);
    if (matched) {
      // 抽取具体值
      // 代码省略
      // 将中间件都保存起来
      stacks = stacks.concat(route.stack);
    }
  }
  return stacks;
};
var handle = function (req, res, stack) {
  var next = function (err) {
    if (err) {
      console.log("handle err", err);
      console.log("handle stack", stack);
      return handle500(err, req, res, stack);
    }
    // 从stack数组中取出中间件并执行
    var middleware = stack.shift();
    if (middleware) {
      // 传入next()函数自身，使中间件能够执行结束后递归
      try {
        middleware(req, res, next);
      } catch (e) {
        console.log("e", e);
        next(e);
      }
    }
  }; // 启动执行
  next();
};

var handle500 = function (err, req, res, stack) {
  // 选取异常处理中间件
  console.log("500");
  // stack = stack.filter(function (middleware) {
  //   return middleware.length === 4;
  // });
  console.log("500 stack", stack);
  var next = function () {
    // 从stack数组中取出中间件并执行
    var middleware = stack.shift();
    console.log("500 middleware", middleware);
    if (middleware) {
      // 传递异常对象
      middleware(err, req, res, next);
    }
  }; // 启动执行
  next();
};
var handle404 = function (req, res) {
  res.end("404");
};
const getUser = (err, req, res) => {
  if (err) {
    console.log("getUser err", err);
    return res.end("getUser err");
  }
  console.log("req.query", req.query);
  console.log("req.cookies", req.cookies);
  console.log("req.session", req.session);
  res.end("getUser");
};
const updateUser = (req, res) => {
  res.end("updateUser");
};

app.use(querystring);
app.use(cookie);
app.use(session);
app.get("/user/:username", getUser);
app.put("/user/:username", authorize, updateUser);

http
  .createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    // 将请求方法变为小写
    var method = req.method.toLowerCase();
    // 获取all()方法里的中间件

    var stacks = match(pathname, routes.all);

    if (routes.hasOwnProperty(method)) {
      // 根据请求方法分发，获取相关的中间件
      stacks = stacks.concat(match(pathname, routes[method]));
    }
    if (stacks.length) {
      handle(req, res, stacks);
    } else {
      // 处理404请求
      handle404(req, res);
    }
  })
  .listen(2100, "127.0.0.1");
