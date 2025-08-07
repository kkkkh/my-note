process.on('message', function (m, server) {
    if (m === 'server') {
        // 接收到消息后，在这里监听，是同一个描述符
        server.on('connection', function (socket) {
            socket.end('handled by child\n');
        });
    }
});


