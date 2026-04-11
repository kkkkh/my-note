---
title: 【关于二进制】js 二进制相关知识
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

