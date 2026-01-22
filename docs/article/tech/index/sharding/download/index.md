---
outline: deep
title: 大文件分片存储、分片下载
date: 2025-04-29
---
# 大文件分片存储、流式存储
## 大文件分片存储（后端返回大字符串）
- 1、后端将`多个``大字符串`传给前端
- 2、前端（nodejs）将这些大字符串进行分别存储
- 3、几种写入方式对比
    - writeFileSync 同步写入，阻塞主线程
    - writeFile 异步写入，仍然可能阻塞线程
        - 如果有大量的并发异步写入操作，可能会导致线程池资源耗尽。当线程池中的所有线程都在忙于执行 I/O 操作时，新的异步写入请求将不得不等待，从而导致阻塞。
        - 大量小文件的写入： 即使使用异步 API，如果需要写入大量的小文件，仍然会产生大量的 I/O 操作，从而增加线程池的压力，导致阻塞。
        - 磁盘 I/O 瓶颈： 即使使用异步 API，最终数据仍然需要写入磁盘。如果磁盘 I/O 速度较慢，或者磁盘负载过高，仍然会成为性能瓶颈，导致阻塞。
    - createWriteStream 写入流 （流式写入可以减少内存占用，并提高写入效率）
        - 使用 async/await 或 Promise： 可以使用 async/await 或 Promise 来异步地处理流的完成事件(就是将并发改为继发,async/await控制)
        ```js
        const fs = require('fs');
        const stream = require('stream');
        const { pipeline } = require('stream/promises'); // 引入 stream.pipeline

        const largeString = '********'; // 假设这是一个很大的 字符串
        const filePath = 'output.lab';

        async function writeFileAsync(data, filePath) {
        const stringStream = stream.Readable.from(data); // 将字符串转换为可读流
        const fileStream = fs.createWriteStream(filePath); // 创建可写流

        try {
            await pipeline(stringStream, fileStream); // 使用 stream.pipeline 异步地将可读流管道到可写流
            console.log('Finished writing to file');
        } catch (err) {
            console.error('Pipeline failed.', err);
        }
        }
        writeFileAsync(largeString, filePath);
        ```
        - 监听 drain 事件： 当 fs.WriteStream 的内部缓冲区排空，会触发 drain 事件。可以监听 drain 事件，并在 drain 事件触发后继续写入数据，从而避免阻塞线程。（控制写入速度）
        - drain 事件的关键点：
            - Backpressure (背压)： 当写入速度超过读取速度时，就会出现背压。fs.WriteStream 使用缓冲区来缓解背压，但当缓冲区满时，write() 方法会返回 false，表示无法再写入更多的数据。
            - 暂停和恢复： 当 write() 方法返回 false 时，通常需要暂停可读流的读取，以避免继续向缓冲区写入数据。当缓冲区排空时，drain 事件会触发，此时可以恢复可读流的读取，继续写入数据。
            - drain 事件的意义： drain 事件表示 fs.WriteStream 已经处理完缓冲区中的数据，可以接收更多的数据了。
        ```js
        const fs = require('fs');
        const stream = require('stream');

        const largeString = '****'; // 假设这是一个很大的 字符串
        const filePath = 'output.lab';

        const stringStream = stream.Readable.from(largeString); // 将字符串转换为可读流
        const fileStream = fs.createWriteStream(filePath); // 创建可写流

        let canWrite = true; // 标记是否可以写入数据

        stringStream.on('data', (chunk) => {
            if (!canWrite) {
                // 如果缓冲区已满，暂停可读流
                stringStream.pause();
            }

            canWrite = fileStream.write(chunk); // 尝试写入数据

            if (!canWrite) {
                console.log('Backpressure!');
            }
        });

        fileStream.on('drain', () => {
            // 当缓冲区排空时，恢复可读流
            console.log('Drain!');
            canWrite = true;
            stringStream.resume();
        });

        stringStream.on('end', () => {
            // 当可读流读取完毕时，关闭可写流
            fileStream.end();
        });

        fileStream.on('finish', () => {
            console.log('Finished writing to file');
        });

        fileStream.on('error', (err) => {
            console.error('Error writing to file:', err);
        });
        ```
- 4、对比完，无论使用哪种都会有阻塞的情况（使用stream）
- 5、如何存储
    - stream写入
    - 控制并发：需要使用队列或 Promise 来控制并发写入操作的数量，避免线程池资源耗尽
    - 单文件分片：将大str截取为小段的str，进行读取、写入（控制的是单次写入量）
    - 下面是`一个`将大str 分片、使用队列、stream 写入（无法保证顺序）
    ```js
    const fs = require('fs');
    const stream = require('stream');
    const largeString = '********'; // 假设这是一个很大的 字符串
    const filePath = 'output.lab';
    const maxConcurrentWrites = 10; // 限制并发写入操作的数量

    let writing = 0;
    let queue = [];

    function writeFileChunk(chunk, callback) {
        writing++;
        const writeStream = fs.createWriteStream(filePath, { flags: 'a' }); // 使用 append 模式
        writeStream.write(chunk, (err) => {
            writing--;
            writeStream.close();
            if (err) {
            console.error('Error writing chunk:', err);
            }
            callback(err);
            processQueue(); // 写入完成后处理队列中的下一个任务
        });
    }

    function processQueue() {
        if (writing < maxConcurrentWrites && queue.length > 0) {
            const { chunk, callback } = queue.shift();
            writeFileChunk(chunk, callback);
        }
    }

    // 将 largeString 分成多个 chunk
    const chunkSize = 1024 * 50; // 50KB per chunk
    let offset = 0;

    while (offset < largeString.length) {
        const chunk = largeString.substring(offset, offset + chunkSize);
        const callback = (err) => {
            if (err) {
            console.error('Error writing chunk:', err);
            }
        };

        // 将写入任务添加到队列中
        queue.push({ chunk, callback });
        offset += chunkSize;

        // 启动处理队列
        processQueue();
    }
    ```
- 总结：
    - 存储单个文件
        - 分片控制单次存储量
        - 保证顺序、不能并发处理、要改为继发存储(存完一块、存下一块)
        - 背压处理
    - 存储多个文件
        - 可以队列处理，并发处理，控制最大并行量
        - 单个文件依照如上，处理
        - 处理完一个文件，再添加下一个文件的存储
## 大文件流式存储（后端返回流stream）
- 对于知道Content-Length的流 （待进一步研究）
    - 可以等待全部接受完毕，写入文件
    - 也可以边接受写入
- 对于不知道的长度：Transfer-Encoding:chunked 分成块逐个发送，分块写入文件
- nodejs https.get / fetch
    ```js
    import https from 'node:https';
    import fs from 'node:fs';
    const file = fs.createWriteStream('archive.zip');
    https.get('https://localhost:3000/getLabFile', (res) => {
        console.log(res.statusCode);
        console.log(res.headers);
        // res.pipe(file)，它会自动将 res (一个可读流) 管道到 file (一个可写流)。
        // pipe 方法会自动处理背压，简化了代码。
        res.pipe(file); 
        // 监听 'end' 事件，在下载完成后触发
        file.on('finish', () => {
            file.close();
            console.log('Download Completed');
        });
    }).on('error', (err) => {
        console.error('Error during download:', err);
    });
    ```
    ```js

    function processFileStream(response: Response, destDir: string, tempFile: string) {
        return new Promise<void>((resolve, reject) => {
            const uniqueTempPath = `${Date.now()}${Math.random().toString(16).slice(2)}${tempFile}`

            try {
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true })
                }
                const fileStream = fs.createWriteStream(uniqueTempPath)
                // fetch 返回一个 Response 对象，你需要使用 response.body 获取响应体（一个 ReadableStream）。
                // response.body.getReader() 获取一个 ReadableStreamReader
                const reader = response.body?.getReader()

                const push = () => {
                    reader
                    ?.read() // 逐块读取数据
                    .then(({ done, value }) => {
                        if (done) {
                        fileStream.end()
                        console.log('fileStream.end()')
                        extractFile(uniqueTempPath, destDir, resolve, reject)
                        reader?.releaseLock()

                        return
                        }
                        const canContinue = fileStream.write(Buffer.from(value))
                        // 还需要手动处理背压 (backpressure)，即当 fileStream.write() 返回 false 时，暂停读取，并在 drain 事件触发时恢复读取。
                        if (canContinue) {
                            push()
                        } else {
                            fileStream.once('drain', push)
                        }
                    })
                    .catch((error) => {
                        console.error('Error reading file:', error)
                        // reject(new Error('Error reading file', { cause: error }))
                        reject(new Error('Error reading file'))
                    })
                }

                push()
                fileStream.on('error', () => {
                    void removeFileOrDir(uniqueTempPath)
                })
            } catch (error) {
            void removeFileOrDir(uniqueTempPath)
            // showMessageBox('error', 'File stream processing error', error)
            reject(new Error(JSON.stringify(error)))
            }
        })
    }
    const response = await fetch('http://localhost:3000/getLabFile');
    const filesPath = path.resolve(__dirname, './files');
    processFileStream(response, filesPath, `temp.zip`);
    ```
- 对于多文件的处理思路
    - 知道长度：FormData 传递，multiparty接受处理res（复杂）
    - 不知道长度：Transfer-Encoding，构建元数据处理，知道文件名、文件流（复杂，需要构建元数据）
    - 直接将多文件，zip压缩，传输压缩文件

- 拓展
  - [Streams_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)
  - [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)
  - https://devv.ai/zh/search/erb5t1uqj1fk


