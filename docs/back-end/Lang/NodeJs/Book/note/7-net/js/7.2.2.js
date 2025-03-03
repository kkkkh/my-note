var dgram = require("dgram");
var { Buffer } = require("buffer");

var message = Buffer.from("深入浅出Node.js");

var client = dgram.createSocket("udp4");
// socket.send(buf, offset, length, port, address, [callback])
client.send(message, 0, message.length, 41234, "localhost", function (err, bytes) {
  client.close();
});
