exports.index = function (req, res, ...arg) {
  console.log(arg);
  console.log("index");
  res.end("index");
};

exports.setting = function (req, res, ...arg) {
  console.log(arg);
  console.log("setting");
  res.end("setting");
};
