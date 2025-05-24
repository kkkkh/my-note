var tls = require('tls');
var fs = require('fs');
// 创建私钥
// $ openssl genrsa -out client.key 1024
// 生成CSR
// $ openssl req -new -key client.key -out client.csr
// 生成签名证书
// $ openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in client.csr -out client.crt
var options = {
  key: fs.readFileSync('./keys/client.key'),
  cert: fs.readFileSync('./keys/client.crt'),
  ca: [fs.readFileSync('./keys/ca.crt')]
};

var stream = tls.connect(8000, options, function () {
  console.log('client connected', stream.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(stream);
});

stream.setEncoding('utf8');
stream.on('data', function (data) {
  console.log(data);
});
stream.on('end', function () {
  server.close();
});
