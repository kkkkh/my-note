---
title: 【关于流】下载文件-流的控制
date: 2026-04-02 11:00
tags:
  - front-end
  - nodejs
---
# 【关于流】下载文件-流的控制
## fetch response => webstream => writer
### 手动控制
#### 解压流程
- 1. 文件完整性校验
  - 至少要校验：文件大小、hash（sha256/md5 更推荐 sha256）
  - 否则解压失败时你不一定知道是：网络坏了、文件没写完、包本身坏了
- 2. 解压目标目录切换策略
  - 不要边解压边覆盖当前运行目录，最好：解压到 staging 目录、校验通过后再切换版本目录 / 替换软链接 / 更新 manifest
- 3. 解压失败回滚
  - 更新流程里，回滚比成功更重要。
#### 重构方向
- 第 1 层：纯下载函数
  - 创建目录
  - 下载到 xxx.part
  - 统计进度
  - 等待真正写完
  - 返回最终文件路径
- 第 2 层：完整性校验函数
  - 校验 hash
  - 校验文件大小
  - 校验格式是否可解压
- 第 3 层：更新流程调度
  - 下载
  - 校验
  - 备份
  - 解压
  - 切换版本
  - 通知前端
### 手动控制重构
### web stream 控制
- 优点
  - 代码更“现代 Web Stream”
  - 少手写读循环
  - 背压由 pipeTo 体系自动处理
  - 结构更干净
- 缺点
  - Debug 没有手写 while 那么直接
  - 进度要额外插 TransformStream
  - 在某些 Node/Electron 环境里，类型和桥接细节略烦
### node stream 控制
- 优点
  - 很符合 Node 下载器习惯
  - pipeline 自带更成熟的错误传播
  - 中间插 Transform 做进度很自然
  - 比 Web pipeTo 更容易 debug
  - 比手写 while + writer.write + drain 更省心
- 缺点
  - 需要把 Web Stream 转成 Node Stream
  - 依赖 Node 对 Readable.fromWeb 的支持
  - 如果你整个系统强绑定 Web Stream 风格，会有一点“跨世界”


## http response => node stream => writer

相当于[node stream 控制](#node-stream-控制)简化版雏形

## readable stream => writer


## pipe / pipeline
### pipe() 更偏“连接流”
- 从 readable 读
- 向 writable 写
- 背压控制
- end 时关闭目标流
- 自己要处理的
  - readStream.on('error', ...)
  - res.on('error', ...)
  - 什么时候结束
  - 什么时候销毁
  - 中途失败要不要清理
  
### pipeline() 更偏“工程级托管” (流处理)
- pipeline() 除了包含 pipe() 的传输逻辑，还更强调：
- 1. 错误传播统一：哪个流出错，都能统一收口。
- 2. 自动销毁：中途失败时，相关流会被更规范地销毁，而不是散落着自己处理。
- 3. 完成回调 / Promise 化：你可以明确知道整条链路什么时候真正成功，什么时候失败。
- 4. 多段流组合：比如：source -> gzip -> encrypt -> file 这种链式处理时，pipeline() 更适合。

> readStream.pipe(res) 相当于：我只是在把数据流接过去
>
> await pipeline(readStream, res) 相当于：我不仅把流接过去，还希望 Node 帮我把整条链路的成功/失败都收好
>


## 背压
- 本质：上下游处理速度不匹配时，系统向上游施加的限流/减速机制
- 如果上游一直猛给数据，而下游来不及处理，就会出现：
  - 内存缓冲区越来越大
  - 数据堆积
  - 最后可能爆内存或变得很卡
- 所以就需要一个机制告诉上游：
  - 你先别读那么快，等我消化一下。
- 这个“下游顶不住，于是反过来约束上游”的过程，就是背压。