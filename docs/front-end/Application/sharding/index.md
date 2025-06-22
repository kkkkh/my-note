---
outline: deep
title: 大文件分片上传、断点续传
date: 2025-04-01
---
# 大文件分片上传、断点续传 &I
## 实现思路
### 整体流程
- 获取文件元数据
- 文件分片
- 计算分片 Hash 与 文件 Hash
- 检查文件是否已经上传过
- 查询需要上传的文件分片
- 构建上传参数
- 上传实际需要上传的分片
- 待全部分片上传完成后校验分片
- 合并分片
### 局部思路
- 秒传: 文件已存在, 直接给前端返回文件 url
  - 记录文件的 hash 与元数据到数据库中
  - 上传文件前先计算 hash 和获取文件元数据请求接口进行比对
  - 若比对成功则说明文件已存在, 直接返回前端文件 url
- 断点续传: 上传过程意外中断, 下次上传时不需要从头上传整个文件
  - 前端将文件分片上传, 后端接收分片然后进行合并
  - 上传分片前先请求接口查询需要上传的分片即实现断点续传
- 上传
  - 实现了基于文件真实上传进度的进度条
  - 实现了可控制 Promise 并发数量的 PromisePool
  - 实现了基于 WebWorker 的 WorkerPool / ThreadPool
## 大文件分片上传
### 基本原理
- 1、将上传的file 先slice分片；
- 2、对每个分片进行MD5 hash；
  - 为什么要对分片进行MD5 hash：数据完整性
  - 因为文件在传输写入过程中可能会出现错误，导致最终合成的文件可能和原文件不一样，所以要对比一下前端计算的MD5和后端计算的MD5是不是一样，保证上传数据的一致性。
- 3、异步promise 分片 和 计算Hash；
- 4、hash计算：CRC32的十六进制表示只有8位(MD5有32位), 且 CPU 对计算 CRC32 有硬件加速, 速度会比计算 MD5 快得多；
### 进一步优化点
- 1、改变 hash空间：web worker中计算；
- 2、改进 hash计算方法：spark-md5 => CRC32 => hash-wasm、MerkleTree 默克尔树：树根 hash 作为 文件的 hash
- 3、减少hash内容：采样分片内容进行hash可以作为折中方案：将file分片10份 -> 每份采样1kb -> 合并采样数据 -> 直接浏览器hash
### 代码测试
js-spark-md5 示例代码
```js
document.getElementById('file').addEventListener('change', function () {
    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = this.files[0],
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();
    fileReader.onload = function (e) {
        console.log('read chunk nr', currentChunk + 1, 'of', chunks);
        spark.append(e.target.result);                   // Append array buffer
        currentChunk++;
        if (currentChunk < chunks) {
            loadNext();
        } else {
            console.log('finished loading');
            // 得到 hash
            console.info('computed hash', spark.end());  // Compute hash
        }
    };
    fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
    };
    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        // 分片 然后读取
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    loadNext();
});
```
<<< ./index.html#article-file-asyncSharding

### 测试结果
- SparkMD5：
  - 2GB，每片1MB，分2048片，default: 6264.6611328125 ms；
  - 2GB，每片10MB，分205片，default: 1776.876953125 ms；

参考：
- [SparkMD5](https://github.com/satazor/js-spark-md5)
- [大文件分片上传](https://www.brandhuang.com/article/1736061378620)
- [超详细的大文件分片上传⏫实战与优化⚡(前端部分)](https://juejin.cn/post/7353106546827624463?searchId=20250208112448BC0C65E591ACA66E6702) 增加了worker hash计算

