# NodeJs
## doc
### URL
#### fileURLToPath
此函数确保百分比编码字符的正确解码以及跨平台有效的绝对路径字符串。
```js
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
new URL('file:///C:/path/').pathname;      // Incorrect: /C:/path/
fileURLToPath('file:///C:/path/');         // Correct:   C:\path\ (Windows)
new URL('file://nas/foo.txt').pathname;    // Incorrect: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correct:   \\nas\foo.txt (Windows)
new URL('file:///你好.txt').pathname;      // Incorrect: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correct:   /你好.txt (POSIX)
new URL('file:///hello world').pathname;   // Incorrect: /hello%20world
fileURLToPath('file:///hello world');      // Correct:   /hello world (POSIX)
```
```js
new URL('./preload.js',import.meta.url).href   // file:///D:/WorkSpace/****/preload.js
import.meta.resolve('./preload.js')            // file:///D:/WorkSpace/****/preload.js
fileURLToPath(new URL('./preload.js',import.meta.url).href)  // D:\WorkSpace\****\preload.js
import.meta.resolve('./preload.js')                          // D:\WorkSpace\****\preload.js
```
参考：https://nodejs.org/docs/latest/api/url.html
### fs
#### existsSync / exists
文件以及路径是否存在，一般在读取、删除、创建时做判断处理
```js
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('The path exists.');
```
#### readFileAsync / readFile / promises.readFile
```js
const fs = require('fs');
// 同步
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('File content:', data);
} catch (err) {
  console.error('Error reading file:', err);
}
// 异步
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
  }
});
// 异步
try {
  const data = await fs.promises.readFile('example.txt', 'utf8');
  console.log('File content:', data);
} catch (err) {
  console.error('Error:', err);
}
```
#### wirteFileAsync / wirteFile / promises.wirteFile 
同上 readFile
```js
export function writeFileAsync(content: string | Buffer, outputFilePath: string): Promise<void> {
  return fs.promises.writeFile(outputFilePath, content)
}
```
```js
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });
  // Abort the request before the promise settles.
  controller.abort();
  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```
#### realpath / realpathSync / promises.realpath / realpath.native
- 通过解析 .、.. 和符号链接异步地计算规范路径名。
- fs.realpath.native
  - 使用的是操作系统的原生 API（如 Windows 上的 Win32 API 或 Unix 系统调用）来解析路径。
  - 性能更高，特别是在处理符号链接（symlinks）时。
```js
const tempPath = app.getPath('temp');
const resolvedPath = fs.realpathSync(tempPath);
console.log(resolvedPath); // 将输出长文件名路径
```
### path
#### path.isAbsolute()
确定 path 是否为绝对路径
```js
// 在 POSIX 上：
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
// 在 Windows 上：
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
