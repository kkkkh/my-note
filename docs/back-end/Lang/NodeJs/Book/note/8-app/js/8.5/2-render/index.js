var http = require("http");

var complie = function (str) {
  var tpl = str.replace(/<%=([\s\S]+?)%>/g, function (match, code) {
    console.log("match", match);
    console.log("code", code);
    return "' + obj." + code + "+ '";
  });
  tpl = "var tpl = '" + tpl + "'\nreturn tpl; ";
  return new Function("obj, escape", tpl);
};
const escapeStr = `var escape = function (html) {
  return String(html)
    .replace(/&(?!\w+;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  // IE下不支持&apos;（单引号）转义
};`;

var complie = function (str) {
  // 模板技术呢，就是替换特殊标签的技术
  var tpl = str
    .replace(/\n/g, "\\n")
    // 将换行符替换
    .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
      // 转义
      return "' + escape(" + code + ") + '";
    })
    .replace(/<%-([\s\S]+?)%>/g, function (match, code) {
      // 正常输出
      return "' + " + code + "+ '";
    })
    .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
      return "' + " + code + "+ '";
    });
  tpl = "tpl = '" + tpl + "'";
  tpl = escapeStr + 'var tpl = ""; \nwith (obj) {' + tpl + "}\nreturn tpl; ";
  console.log(tpl);
  return new Function("obj", "escape", tpl);
};

var tpl = "Hello <%=username%>.  and  <%=age%>";
var complied = complie(tpl);
var render = function (complied, data) {
  return complied(data);
};

http
  .createServer(function (req, res) {
    res.render = function (complied, data) {
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.writeHead(200); // 实际渲染
      var html = render(complied, data);
      res.end(html);
    };
    res.render(complied, { username: "<script>alert('I am XSS.')</script>", age: "1" });
  })
  .listen(2103, "127.0.0.1");
