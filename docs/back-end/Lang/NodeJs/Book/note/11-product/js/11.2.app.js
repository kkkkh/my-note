var fs = require("fs");
var path = require("path");
var pidfile = path.join(__dirname, "run/app.pid");
fs.writeFileSync(pidfile, process.pid);

process.on("SIGTERM", function () {
  if (fs.existsSync(pidfile)) {
    fs.unlinkSync(pidfile);
  }
  process.exit(0);
});
