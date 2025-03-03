---
outline: deep
---
# NodeJs
## 学习资料
- [新手入门](https://cnodejs.org/getstart)
## 文档
### node 命令行
```bash
# 执行 esm 脚本
node --input-type=module index.js
node index.mjs
```
### 全局变量
__dirname：当前Node运行环境所在目录的绝对路径。 
__filename：当前运行的脚本的绝对路径 （包含文件名） 
global：其表示Node所在的全局环境，类似于浏览器中的window对象。
process：其指向Node内置的process模块，允许开发者使用此对象操作当前进程。
console：其指向Node内置的console模块，提供命令行环境中的标准输入、标准输出功能，比如console.log ("electron") ;
#### Process
process 对象提供有关当前 Node.js 进程的信息并对其进行控制。
`process.cwd()` 方法返回 Node.js 进程的当前工作目录。
`process.env` 属性返回一个包含用户环境的对象
`process.platform` 返回一个字符串，用于标识当前运行 Node.js 的操作系统平台。
  - 'aix' IBM AIX 操作系统。常用于大型企业和工业领域，运行在 IBM 的 Power 系列服务器上。
  - 'darwin' macOS 操作系统。苹果公司开发的 Unix 系统，用于 Mac 系列设备。
  - 'freebsd' FreeBSD 操作系统。一个开源的类 Unix 系统，广泛用于网络服务器和存储系统。
  - 'linux' Linux 操作系统。一个开源操作系统，广泛用于服务器、嵌入式设备和个人电脑。
  - 'openbsd'OpenBSD 操作系统。一个以安全性为核心的类 Unix 操作系统，适用于防火墙和高安全性场景。
  - 'sunos'SunOS 操作系统。Solaris 的前身，曾由 Sun Microsystems 开发，用于企业级硬件系统。
  - 'win32 'Windows 操作系统。微软开发的操作系统，包括 32 位和 64 位版本，但始终标记为 'win32'。
### module
一旦一个模块被导入到运行环境中，就会被缓存。
当再次尝试导入这个模块时，就会读取缓存中的内容，而不会重新加载一遍这个模块的代码。
### url
#### fileURLToPath
此函数确保百分比编码字符的正确解码以及跨平台有效的绝对路径字符串。
主要用于转为path，在需要加载path的地方做转换，例如 `webPreferences{preload:'path'}`
```js
// esm 写法
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
// esm 写法
new URL('./preload.js',import.meta.url).href   // file:///D:/WorkSpace/****/preload.js
import.meta.resolve('./preload.js')            // file:///D:/WorkSpace/****/preload.js
fileURLToPath(new URL('./preload.js',import.meta.url).href)  // D:\WorkSpace\****\preload.js
fileURLToPath(import.meta.resolve('./preload.js'))           // D:\WorkSpace\****\preload.js
```
#### format
```js
// commonjs 写法
let URL = require('url')
// 第一个参数 WHATWG URL
// WHATWG URL (Web Hypertext Application Technology Working Group URL) 指的是 WHATWG 组织制定的 URL 标准，它定义了 URL 的解析、构造、规范化等操作。 这个标准的目标是使不同的浏览器和 JavaScript 环境对 URL 的处理方式保持一致，并提供一套清晰的 API 供开发者使用。
URL.format({
  pathname: path.join(__dirname, 'index.html'),
  protocol: 'file',
})
// file://d:\**\**\index.html
```
```js
// esm 写法
// 第一个参数是一个 url
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');
console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo
console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo
console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
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
// tempPath => C:\Users\ABCDE~1.FGH\AppData\Local\Temp
const resolvedPath = fs.realpathSync(tempPath);
console.log(resolvedPath); // 将输出长文件名路径
```
#### lstatSync / lstat
获取目标路径的详细文件信息 (文件状态)。
lstatSync() 不会跟随符号链接，而是返回符号链接本身的状态。
```js
const fs = require('fs');
const dirPath = './example'; // 替换为实际路径
try {
  const stats = fs.lstatSync(dirPath);
  if (stats.isFile()) {
    console.log(`${dirPath} 是一个文件`);
  } else if (stats.isDirectory()) {
    console.log(`${dirPath} 是一个目录`);
  } else if (stats.isSymbolicLink()) {
    console.log(`${dirPath} 是一个符号链接`);
  } else {
    console.log(`${dirPath} 是其他类型`);
  }
  console.log('文件大小 (字节):', stats.size);
  console.log('创建时间:', stats.birthtime);
  console.log('修改时间:', stats.mtime);
} catch (err) {
  console.error('无法读取路径:', err.message);
}
```
#### statSync
如果路径是符号链接，fs.statSync() 会返回符号链接指向目标的状态
```js
const linkPath = './symlink'; // 假设是符号链接
const stats = fs.statSync(linkPath); // 获取目标的信息
console.log(stats.isSymbolicLink()); // false, 这里指向的目标不是符号链接
const lstats = fs.lstatSync(linkPath); // 获取符号链接本身的信息
console.log(lstats.isSymbolicLink()); // true, 符号链接本身
```
#### mkdir
创建文件夹
```js
import { mkdir } from 'node:fs/promises';
try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```
#### rmdir rm unlink
rmdir 删除目录
rm 删除文件和目录
unlink 删除
- 如果路径引用符号链接，则删除该链接不会影响该链接引用的文件或目录。
- 如果该路径引用的文件路径不是符号链接，则该文件将被删除。
```js
  const stats = fs.lstatSync(dirPath)
  if (stats.isDirectory()) {
    return fs.promises.rm(dirPath, { recursive: true })
  }
  // 
  return fs.promises.unlink(dirPath)
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
### zlib
```js
import fs from 'node:fs'
import zlib from 'node:zlib'
/**
 * 解压文件
 * @param stream 文件流
 * @param outputFilePath 文件写入路径
 */
export function unzipFile(
  src: NodeJS.ReadableStream | string,
  dest: NodeJS.WritableStream | string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const readStream = typeof src === 'string' ? fs.createReadStream(src) : src
      const writeStream = typeof dest === 'string' ? fs.createWriteStream(dest) : dest
      //  创建一个解压流，用于处理 .gz 格式文件
      const gunzip = zlib.createGunzip()
      // 数据从 readStream 读入，经过 gunzip 解压后，写入 writeStream
      readStream.pipe(gunzip).pipe(writeStream)
      writeStream.on('finish', () => {
        resolve()
      })
      writeStream.on('error', (e) => {
        reject(new Error('Failed when write file', { cause: e }))
      })
    } catch (e) {
      reject(new Error('Unzip Failed', { cause: e }))
    }
  })
}
```
## 示例
```ts
/**
 * 读取文件内容
 *
 * @param filePath 目标文件路径
 * @returns
 */
export function readFileAsync(filePath: string): Promise<string> {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found')
  }

  return fs.promises.readFile(filePath, { encoding: 'utf8' })
}

/**
 * 写入文件
 *
 * @param content 文件内容
 * @param outputFilePath 文件写入路径
 */
export function writeFileAsync(content: string | Buffer, outputFilePath: string): Promise<void> {
  return fs.promises.writeFile(outputFilePath, content)
}

/**
 * 删除目录下的文件
 *
 * @param dirPath
 * @returns
 */
export async function removeFileOrDir(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) {
    return void 0
  }

  const stats = fs.lstatSync(dirPath)

  if (stats.isDirectory()) {
    return fs.promises.rm(dirPath, { recursive: true })
  }

  return fs.promises.unlink(dirPath)
}

/**
 * 创建目录
 *
 * @param folderPath 目录路径
 */
export async function createDirectory(folderPath: string): Promise<void> {
  if (fs.existsSync(folderPath)) {
    const stats = fs.lstatSync(folderPath)

    if (stats.isDirectory()) {
      return
    }

    throw new Error('Path exists but is not a directory')
  }

  // 创建文件夹
  await fs.promises.mkdir(folderPath, { recursive: true })
}
```
