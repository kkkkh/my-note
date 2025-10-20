const fastify = require('fastify')();
const fastifyMongodb = require('@fastify/mongodb');
const mongoose = require('mongoose');
// 注册 @fastify/mongodb 插件
fastify.register(fastifyMongodb, {
  url: 'mongodb://localhost:27017/mydb' // MongoDB 连接
});
// 获取 Fastify 注入的 MongoDB 连接
const db = fastify.mongo.client;
// 使用 Mongoose 连接这个 MongoDB 客户端
mongoose.connect(db.s.url, { useNewUrlParser: true, useUnifiedTopology: true });
// 定义 Mongoose 模型
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});
const Item = mongoose.model('Item', itemSchema);
// 路由：获取所有文档
fastify.get('/items', async (request, reply) => {
  try {
    const items = await Item.find(); // 使用 Mongoose 查询数据
    reply.send(items);
  } catch (err) {
    reply.status(500).send({ error: 'Failed to fetch items' });
  }
});
// 启动服务器
fastify.listen(3000, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server listening on http://localhost:3000');
});
