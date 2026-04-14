---
title: 【关于二进制】js 二进制进阶
date: 2026-04-04 10:00
tags:
  - front-end
  - js
---
# js 二进制进阶
## 进阶方向
- WebSocket.binaryType / RTCDataChannel 可以设为 "arraybuffer"
- protobuf.js 二进制协议编解码
- hls.js 
- pdf.js
- 加密/哈希/签名
- WebAssembly
- WebRTC

## WebAssembly(Wasm)
- 是什么
  - Web 平台上的一层新执行形态
  - 给浏览器增加了一种标准化的、可高效执行的二进制模块格式
  - 很多语言先编译成 .wasm 二进制模块，再由浏览器加载、编译、实例化，然后和 JavaScript 互相调用
- 做什么
  - 1. 让“更底层、更重计算”的代码跑进 Web
  - 2. 给 Web 提供一种更稳定的“编译目标”
- 实践
  - 内存共享
    - WebAssembly.Memory 是一个 resizable ArrayBuffer 或 SharedArrayBuffer
    - WebAssembly.Memory.buffer 返回里面那块底层 buffer
    - JS 和 Wasm 都可以创建或访问这块内存
  - 浏览器加载
    ```js
    const { instance } = await WebAssembly.instantiateStreaming(
      fetch('/app.wasm'),
      importObject
    )
    ```
- 项目
  - [Game of Life](https://rustwasm.github.io/docs/book/) 
  - [rust-snake-wasm](https://github.com/gustawdaniel/rust-snake-wasm)
  - [wasm-astar](https://github.com/jacobdeichert/wasm-astar)

## protobuf.js
- 是什么
  - “序列化结构化数据”的机制
  - 把你定义好的消息结构，
  - 编码成 protobuf 的二进制 wire format，
  - 或者从这个二进制格式解码回对象
  - 把 JS 对象 ⇄ protobuf 二进制消息
  - 解决消息体格式问题。（不是传输层变化）
- 具体实现
  - 1. 定义消息结构，.proto 文件，定义消息 schema（先定义数据如何组织，再生成或使用相应绑定来读写）
  ```proto
  message User {
    uint32 id = 1;
    string name = 2;
  }
  ```

  - 2、编码
  ```js
  const user = { id: 1, name: 'John' }
  const buffer = protobuf.encode(user)
  ```
  - 3、解码
  ```js
  const user = protobuf.decode(buffer)
  ```
  - 4、请求一个 protobuf 接口
  ```js
  const res = await fetch('/api/user', {
    headers: {
      Accept: 'application/protobuf'
    }
  })
  const bytes = new Uint8Array(await res.arrayBuffer())
  const user = User.decode(bytes)
  ```
### protobuf / json 对比
- protobuf 
  - 解决“消息怎么表示、怎么演进、怎么高效传输”的问题。
  - 在意 消息体大小、编解码效率、跨语言一致性、强 schema、长期演进兼容性 时，更合适的一套协议格式
  - 在某些约束下比 JSON 更合适
  - JSON 而是做到某个规模和要求后，代价越来越不划算，使用 protobuf 是优解
- json 
  - 人可以直接读，调试方便，日志友好，联调成本低，工程上更划算
- 消息体格式
  - json 太大太啰嗦，存在字段重复，其他类型都要转成为文本，整体是字符流，不是紧凑的二进制
  - protobuf 紧凑的二进制
- 严格 schema
  - JSON 本身没有强制 schema
- 长期演进兼容性
  - 新老客户端、新老服务端不会同时升级，存在.proto文件不一致，但是可以互相兼容
  - 主要靠字段号稳定、未知字段容忍、删除后 reserve、避免破坏性改动来做到这一点
- 多语言、多端之间要统一协议
### protobuf / json 消息格式对比
- json 字符流
  - 逻辑上是一串字符组成的文本 '{"name":"abc","age":18}'
  - 物理上传输时，仍然会被编码成字节流（UTF-8 字符编码）
- protobuf 紧凑的二进制
  - 按协议规则编码成更短、更机器友好的字节格式
  - int32 age = 1;，值如果是 18，
  - protobuf 不会传 "age" 这几个字符，
  - 也不会传 :、{、} 这些 JSON 语法字符，
  - 而是大致传成：字段号 1 + wire type，值 18 的编码结果
### wire format（protobuf binary wire format）
- 核心结构 [具体代码实现](../06-protobuf-encode-decode/index.md)
  - tag：字段号 field number(这是谁) + wire type(它的值长什么样)
  - payload：值本身(真实内容字节)
  - 必要时再加 length
- TLV
  - 这种 scheme 常被叫做 TLV（Tag-Length-Value）
  - Tag：字段号 + wire type
  - Length：有些类型会显式带长度
  -Value：真正的值
- 解析
  - 把语义定义放在线下 schema，线上只发最紧凑的编码
  - 接收方只要知道 schema（.proto），就能按 wire format 把字节流还原成结构化消息

### 其他
- 场景
  - 1. 高频、小包、大量消息
  - 2. 服务间内部通信，微服务之间，人类阅读重要性降低
  - 3. 多端多语言统一协议，吃一套数据定义
  - 4、内部 RPC / gRPC
- 项目
  - [connect-es](https://github.com/connectrpc/connect-es)