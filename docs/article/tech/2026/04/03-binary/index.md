---
title: js 二进制相关知识
date: 2026-04-03 10:00
tags:
  - front-end
  - js
---
# js 二进制相关知识

## buffer

- ArrayBuffer 纯粹的原始二进制内存(裸内存块)，只负责存储
- Uint8Array / Uint16Array / DataView  操作内存的视图，站在 ArrayBuffer 之上的读取/写入方式
  - Uint8Array 每 1 个字节一个无符号整数
  - Uint16Array 每 2 个字节一个无符号整数
  - DataView 允许你按任意偏移、任意类型去读写底层内存
- Buffer 是 nodehjs中 Uint8Array 子类，一种增强实现

  
> Node 先自己搞出了一套 Buffer
> 
> 后来 web平台标准化 ArrayBuffer，Uint8Array...等
> 
> Node 为了和 web 平台更一致，也增加了对 ArrayBuffer，Uint8Array...等的支持


## Blob / File (字节数据对象层)

- Blob 
  - 一段二进制数据的高层封装对象  
  - 一个不可变的二进制数据包
- File 带文件元数据的 Blob

### Blob

- 浏览器里的一个二进制大对象（Binary Large Object）
- 里面装的是一段原始数据
- 这段数据可以是文本、图片、音频、视频、任意 bytes
- 它有 type（MIME 类型）
- 它本身是不可变的

> Blob 我现在手里有一坨二进制内容，
> 
> 我希望把它当作一个完整对象来传递、切片、读取、下载。

### File

- 带名字的
- 带修改时间的
- 可读取内容的
- 看起来像文件的二进制对象

### URL.createObjectURL() / revokeObjectURL()

- 把内存里的 Blob/File，映射成一个浏览器可消费的临时 URL。

```js
const url = URL.createObjectURL(blob)
img.src = url
a.href = url
```
### FileReader 
- 历史上很重要，现在已经没有那么核心了
- 以前
  - readAsText / readAsArrayBuffer /readAsDataURL
    ```js
    const input = document.querySelector('#file') as HTMLInputElement
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) return

      const reader = new FileReader()

      reader.onload = () => {
        console.log('文本内容：', reader.result) // string
      }

      reader.onerror = () => {
        console.error('读取失败：', reader.error)
      }

      reader.readAsText(file, 'utf-8')
    })
    ```
- 现在
  - blob.text() /  blob.arrayBuffer() / blob.stream()
    ```js
    const file = input.files?.[0]
    if (!file) return

    const text = await file.text()
    console.log(text)
    ```
- FileReader 仍然有价值的场景
  - readAsDataURL() / URL.createObjectURL()
    - readAsDataURL() 本地图片显示，是把文件内容真的读出来，再转成一个很长的 data: base64 字符串
    - URL.createObjectURL() 生成一个浏览器内部可访问的临时 URL
  - FileReader.readAsText(blob, encoding) / Blob.text()
    - Blob.text() 总是按 UTF-8 解释
    - FileReader.readAsText(blob, encoding) 可以指定编码

## TextEncoder / TextDecoder

- 字节世界与文本世界的转换

```js
new TextEncoder().encode('hello')      // Uint8Array
new TextDecoder().decode(uint8Array)   // string
```

## Response / Request / fetch
```js
// 底层数据源是一份，外层可以按不同抽象层读取。
const res = await fetch(url)
const ab = await res.arrayBuffer() // 裸字节内存
const blob = await res.blob() // 数据包对象
const text = await res.text() // 文本
const stream = res.body // 流
```

## atob / btoa 与 Base64

- Base64 不是二进制本体，而是“用文本表示二进制”的一种编码形式。

## 总结
- 内存线 ArrayBuffer -> TypedArray / DataView 字节在内存里怎么存在、怎么读写
- 对象分装线 Blob / File 怎么把一段字节包装成浏览器方便处理的对象
- 流动线 ReadableStream -> TransformStream -> WritableStream 数据不一次性全到，而是边读边处理边写

## 进阶（操作二进制视图）
- WebSocket.binaryType / RTCDataChannel 可以设为 "arraybuffer"
- protobuf.js 二进制协议编解码
- hls.js 
- pdf.js
- 加密/哈希/签名
- WebAssembly
- WebRTC

### WebAssembly(Wasm)
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

### protobuf.js
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
#### protobuf / json 对比
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
#### protobuf / json 消息格式对比
- json 字符流
  - 逻辑上是一串字符组成的文本 '{"name":"abc","age":18}'
  - 物理上传输时，仍然会被编码成字节流（UTF-8 字符编码）
- protobuf 紧凑的二进制
  - 按协议规则编码成更短、更机器友好的字节格式
  - int32 age = 1;，值如果是 18，
  - protobuf 不会传 "age" 这几个字符，
  - 也不会传 :、{、} 这些 JSON 语法字符，
  - 而是大致传成：字段号 1 + wire type，值 18 的编码结果
#### wire format（protobuf binary wire format）
- 核心结构 [具体代码实现](../05-protobufencode-decode/index.md)
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

#### 其他
- 场景
  - 1. 高频、小包、大量消息
  - 2. 服务间内部通信，微服务之间，人类阅读重要性降低
  - 3. 多端多语言统一协议，吃一套数据定义
  - 4、内部 RPC / gRPC
- 项目
  - [connect-es](https://github.com/connectrpc/connect-es)