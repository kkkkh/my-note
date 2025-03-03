var child = require('child_process').fork('child.js');

// Open up the server object and send the handle
var server = require('net').createServer();
server.on('connection', function (socket) {
    socket.end('handled by parent\n');
});
server.listen(1337, function () {
    // 向子进程发送消息
    child.send('server', server);
});

// 测试代码
// $ curl "http://127.0.0.1:1337/"
// handled by parent
// $ curl "http://127.0.0.1:1337/"
// handled by child
// $ curl "http://127.0.0.1:1337/"
// handled by child
// $ curl "http://127.0.0.1:1337/"
// handled by parent