---
title: 【关于二进制】protobuf varint 编解码原理
date: 2026-04-06 14:00
tags:
  - front-end
  - js
---
# protobuf varint 编解码原理
## 编码原理分析
- 定义消息结构
```proto
message Test1 {
  int32 a = 1;
}
```
- 设置值
```js
a = 150
```
- 序列化后得到 3 个字节：
```
08 96 01
```
### 08
- 为什么 08 表示 Tag："字段 a = 1号字段，类型是 varint（int32）"
  - 公式：(field_number << 3) | wire_type
  - field_number = 1
  - int32 在线上对应的 wire type 是 0
  - (1 << 3) | 0 => 8 | 0 => 08
### 96 01
- varint 字节
  - varint = variable-width integer，可变长度整数
  - 小整数少占字节，大整数多占字节。
  - `[1 bit continuation][7 bit payload]`
  - 最高位 MSB：是否还有下一字节，低 7 位：真正的数据
  - MSB = 1 → 后面还有字节
  - MSB = 0 → 这是最后一个字节
- 为什么 96 01 表示 Value："值 150"
  - 150 二进制 => 10010110
  - varint 按 7 位一组
  - 1 | 0010110
  - 第 1 组（低 7 位）：0010110
  - 第 2 组（更高位）：0000001
  - varint 输出时是低位组先写，高位组后写
  - 0000001 | 0010110
  - 先处理低位组 0010110,continuation bit 要设成 1 => 10010110 => 96(16进制)
  - 再处理高位组 0000001,continuation bit 要设成 0 => 00000001 => 01(16进制)
  - => 96 01
  
> varint 正向编码，本质就是：每次取低 7 位；如果后面还有剩余，就把最高位置 1；最后一组最高位置 0。

<<< ./index.ts#encodeVarint

## Tag 公式 (field_number << 3) | wire_type
- 为什么是3位？
  - tag 的低 3 位专门留给 wire type，剩下的高位留给 field number
  - wire type 一共只需要少量取值，而要表示这些取值，3 个 bit 就够了
  - 3 bit => 000 ~ 111 =>  0 ~ 7 => 8种取值
  - wire type 主要
    ```js
    0 = VARINT
    1 = I64
    2 = LEN
    3 = SGROUP（旧）
    4 = EGROUP（旧）
    5 = I32
    ```
  - 最大也就到 5，所以 3 位足够装下 wire type
  - protobuf 想让编码尽量紧凑，把它们塞进一个数里
- 为什么不是 <<2 或 <<4
  - <<2 => 0 ~ 3 不够
  - <<4 => 0 ~ 15 浪费

> 它本质上就是“位打包”，常见的二进制技巧：把多个小字段塞进一个整数的不同 bit 区域里。

<<< ./index.ts#encodeTag

<<< ./index.ts#decodeTag

## 解码原理分析
### 96 01 => 150
- 96 = 10010110
- 01 = 00000001
- 10010110 MSB = 1  → 后面还有
- 00000001 MSB = 0  → 这是最后一个
- 去掉每个字节的最高位
  - 10010110  -> 0010110 第一个字节装的是 低 7 位
  - 00000001  -> 0000001 第二个字节装的是 更高的 7 位
- 高位在左，低位在右
  - 0000001 0010110
  - 00000010010110 => 150
### 工程方式理解
- 结果 = 第1组 + (第2组 << 7) + (第3组 << 14) + ...
- 第1组：0010110
- 第2组：0000001
- 结果 = 0010110 + (0000001 << 7) => 150

<<< ./index.ts#decodeVarint

## 编码与解码的本质：位权变化
- 编码：把值按照权重分配到不同位置
- 解码：把原本被拆开的低位块、高位块，放回它们原来的权重位置。


> 为什么很多编码都喜欢“拆位、移位”，因为二进制世界里，位权是最自然的表达方式。
>
> 操作本质：把不同权重的二进制位拆开、搬运、再放回去
>
> 真正不会丢值的根本原因：这是可逆变换

## 参考资料
- [protobuf](https://protobuf.dev/)
- 通用
  - [protobufjs](https://github.com/protobufjs/protobuf.js)
  - [protobuf-es](https://github.com/bufbuild/protobuf-es)
- 生成
  - [protobuf-javascript](https://github.com/protocolbuffers/protobuf-javascript)
  - [protobuf-ts](https://github.com/timostamm/protobuf-ts)