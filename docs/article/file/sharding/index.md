# 大文件分片上传
## 基本原理
- 1、将上传的file 先slice分片；
- 2、对每个分片进行MD5 hash；
  - 为什么要对分片进行MD5 hash：数据完整性
  - 因为文件在传输写入过程中可能会出现错误，导致最终合成的文件可能和原文件不一样，所以要对比一下前端计算的MD5和后端计算的MD5是不是一样，保证上传数据的一致性。
- 3、计算分片 Hash 同步耗时；改用异步promise来完成；
- 4、hash计算：CRC32的十六进制表示只有8位(MD5有32位), 且 CPU 对计算 CRC32 有硬件加速, 速度会比计算 MD5 快得多；
## 进一步优化点：
- 1、改变 hash空间：web worker中计算；
- 2、改进 hash计算方法：spark-md5 => CRC32 => hash-wasm、MerkleTree 默克尔树：树根 hash 作为 文件的 hash
- 3、减少hash内容：采样分片内容进行hash可以作为折中方案：将file分片10份 -> 每份采样1kb -> 合并采样数据 -> 直接浏览器hash
## 代码测试
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
同步写法

<<< ./index.html#article-file-syncSharding

异步写法

<<< ./index.html#article-file-asyncSharding

参考：
- [SparkMD5](https://github.com/satazor/js-spark-md5)
- [大文件分片上传](https://www.brandhuang.com/article/1736061378620)
- [超详细的大文件分片上传⏫实战与优化⚡(前端部分)](https://juejin.cn/post/7353106546827624463?searchId=20250208112448BC0C65E591ACA66E6702) 增加了worker hash计算

