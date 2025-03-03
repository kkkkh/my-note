
// parent.js
var cp = require('child_process');
var child1 = cp.fork('child.js');
var child2 = cp.fork('child.js');

// Open up the server object and send the handle
var server = require('net').createServer();
server.on('connection', function (socket) {
    socket.end('handled by parent\n');
});
server.listen(1337, function () {
    child1.send('server', server);
    child2.send('server', server);
});

// 测试
// $ curl "http://127.0.0.1:1337/"
// handled by child, pid is 24673
// $ curl "http://127.0.0.1:1337/"
// handled by parent
// $ curl "http://127.0.0.1:1337/"
// handled by child, pid is 24672