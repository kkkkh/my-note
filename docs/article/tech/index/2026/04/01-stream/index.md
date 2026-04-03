---
title: stream 实践
date: 2026-04-01 14:48
tags:
  - front-end
  - nodejs
---
# stream 实践
## stream 实现方式
- fs.createReadStream node老牌写法
- stream/web 较新的 Web Streams 风格写法


> Web Streams 不是 Node.js 发明的，而是 Web 平台后来补上的一套标准流 API；
> Node.js 为了和 Web 平台更一致，也为了适配 fetch / Response / Request 这些越来越通用的接口，所以增加了对 Web Streams 的支持。
## contentType 设置

- contentType 设置 与是否使用 stream 没有直接关系
- 真正决定是不是流的是后边的**发送方式**
```js
const readStream = fs.createReadStream(filePath)
readStream.pipe(res)
```
- contentType 设置 getContentTypeByExt（根据扩展名设置真实 contentType）
  - 更准确
  - 浏览器/客户端更容易正确处理
  - 某些文件可直接预览
- contentType 设置 application/octet-stream
  - 主要用于下载
  - 不需要浏览器预览
  - 不在乎客户端准确识别文件类型

## Content-Length / chunked

- 已知总长度：带 Content-Length
- 未知总长度或边生成边发送：HTTP/1.1 里常见为 Transfer-Encoding: chunked（传输时采用的编码方式：分块发送）

## 误区解释

- 流 ≠ chunked
- 流 ≠ 不知道长度
- 流 是传输方式
- 流 设置Content-Length，会禁用默认 chunked 编码，主要用于方便计算进度
- 流 没有设置Content-Length，底层会自动使用 chunked 传输
- chunked：消息体不是靠预先给总长度来定界，而是拆成一个个块发，最后用一个 0 长度块结束
- 接收端有Content-Length方便计算进度，只有 chunked，一边接收，一边累计已收到多少字节
- 如果同时 设置了 Content-Length 和 chunked
  - 消息边界解析不一致，到底结束在哪里不知道
  - 协议层要强制让消息边界只有一种权威来源
  - chunked可配合，单独一个 header：X-File-Size: 104857600

## Content-Length / chunked 底层流的区别

- HTTP 如何界定消息结束
  - Content-Length: 104857600
    - 底层 TCP 连接上可以一段一段地发：第一次发 8KB、第二次发 64KB
    - 每一段 TCP 包多大，不重要；HTTP 不需要在消息体内部额外再写“块大小标记”
  - Transfer-Encoding: chunked
    - 用 chunked 作为消息边界定义机制
    - 靠每块长度 + 终止块定界（HTTP 语义应用层协议行为）
    - 但每一段前面都要额外写一个块大小标记（16 进制字符串 + \r\n），最后还要一个长度为0的块来标记消息结束

## Content-Length / chunked 场景

- Content-Length 固定大小文件下载
- chunked 的设计初衷，就是解决“内容长度事先不知道，但我又不想等全部生成完再发”的问题
  - 比如：动态生成内容，大小事先算不出来
  - 想尽快把首批数据发给客户端
  - 需要在 HTTP/1.1 持久连接下清楚表达结束

## http2

- chunked 不能用于 HTTP/2
- HTTP/2 自己有 DATA frames 来表达内容边界
- HTTP/2 中 Content-Length 变得冗余一些，因为长度可以从帧层推断
