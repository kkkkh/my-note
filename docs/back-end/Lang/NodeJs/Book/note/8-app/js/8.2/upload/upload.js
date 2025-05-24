var formidable = require("formidable");
var http = require("http");

var hasBody = function (req) {
  return "transfer-encoding" in req.headers || "content-length" in req.headers;
};
var mime = function (req) {
  var str = req.headers["content-type"] || "";
  return str.split("; ")[0];
};
function handle(req, res) {
  res.end("ok");
}

http
  .createServer(function (req, res) {
    if (hasBody(req)) {
      console.log("hasBody");
      if (mime(req) === "multipart/form-data") {
        var form = new formidable.IncomingForm();
        // console.log("req", req);
        form.parse(req, function (err, fields, files) {
          console.log("fields", fields); //非文件字段
          console.log("files", files); //文件字段
          req.body = fields;
          req.files = files;
          handle(req, res);
        });
      }
    } else {
      console.log("noBody");
      handle(req, res);
    }
  })
  .listen(1341, "127.0.0.1");

//   测试数据
// {a:123,b:file}
// console.log("fields", fields); //{a:123}
// console.log("files", files); //{b:file...}
