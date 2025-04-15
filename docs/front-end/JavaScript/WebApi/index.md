---
outline: deep
---
## web API
### Promise 1
- [Promise v8 源码实现](https://chromium.googlesource.com/v8/v8/+/3.29.45/src/promise.js?autodive=0/)
#### Promise.all
- 报错处理
```js
const promise1 = Promise.resolve(1);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  throw new Error("3")
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error)=>{
  console.log(error)
});
//  Error: 3
```
```js
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve, reject) => {
  throw new Error("2")
});
const promise3 = new Promise((resolve, reject) => {
  throw new Error("3")
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error)=>{
  console.log(error)
});
//  Error: 2
```
```js
const promise1 = Promise.resolve(1);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(()=>{
    // reject(3)
    throw new Error("3")
  },1000)
});
Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
}).catch((error)=>{
  console.log(error)
});
//  then 和 catch 都不会被触发
// setTimeout中的Error无法被捕获到，可使用reject报错处理
```
#### 对比
- Promise.all()
  - 返回一个兑现值数组，有reject，则catch
- Promise.allSettled()
  - 所有输入的 Promise 完成，不管resolve还是reject
- Promise.any()
  - 返回第一个兑现的 Promise
  - 没有 Promise 被兑现，使用 AggregateError 进行拒绝
- Promise.race()
  - 第一个异步任务完成时，不管resolve还是reject

- 参考：[Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
### new URL(url, import.meta.url) 2
- 示例代码：
  ```js
  // 1
  const imgUrl = new URL('./img.png', import.meta.url).href
  document.getElementById('hero-img').src = imgUrl
  // 2支持动态
  function getImageUrl(name) {
    return new URL(`./dir/${name}.png`, import.meta.url).href
  }
  ```
- new URL(url, base)
  - url：一个表示绝对或相对 URL
  - base：一个表示基准 URL 的字符串，当 url 为相对 URL 时，它才会生效
  - new URL(`./dir/${name}.png`, import.meta.url)
- import.meta.url
  - import.meta.url 是一个 ESM 的原生功能，会暴露`当前模块的 URL`
  - 在一个项目中 console.log(import.meta.url) => `http://localhost:8000/xx/src/views/xx.vue?t=172196193xxxx` 相当于当前模块的路径所在，作为基准值，第一个参数再为一个相对路径
- import.meta.reslove()
  ```js
  // Approach 1
  console.log(await import("./lib/helper.js"));
  // Approach 2
  const helperPath = import.meta.resolve("./lib/helper.js");
  console.log(helperPath);
  console.log(await import(helperPath));
  ```
  ```js
  const helperPath = import.meta.resolve("./lib/helper.js");
  console.log(helperPath);
  // 相同
  const helperPath = new URL("./lib/helper.js", import.meta.url).href;
  console.log(helperPath);
  ```
- 参考：
  - [new URL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL)
  - [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)
  - [import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta) 元属性将特定上下文的元数据暴露给 JavaScript 模块，vite 在原生的基础上拓展了功能，例如 import.meta.env
- 在 esm 中路径解析，[参考 import.meta](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import.meta)
  ```js
  // 之前（CommonJS）：
  const fs = require('fs/promises')
  const path = require('path')
  const filePath = path.join(__dirname, 'someFile.txt')
  fs.readFile(filePath, 'utf8').then(console.log)
  // 之后（ES 模块）：
  import fs from 'node:fs/promises'
  const fileURL = new URL('./someFile.txt', import.meta.url)
  fs.readFile(fileURL, 'utf8').then(console.log)
  ```
### TextEncoder / TextDecoder 3
#### TextEncoder
- 接受码位流作为输入，并提供 UTF-8 字节流作为输出
- encode
  ```js
  // 1、TextEncoder utf-8
  const textEncoder = new TextEncoder();
  let encoded = textEncoder.encode("Ï");
  console.log(encoded);
  const textDecoder = new TextDecoder();
  const decoded = textDecoder.decode(encoded);
  console.log(decoded);
  // 2、TextEncoder 非utf-8，只能utf-8
  const textEncoder1 = new TextEncoder("windows-1251");
  // 并不生效
  const encoded1 = textEncoder1.encode("Привет, мир!");
  const encoded2 = textEncoder.encode("Привет, мир!");
  console.log(encoded1);
  console.log(encoded2);
  ```
  ```js
  // 当时不理解，为什么对base64解码的密钥的二进制字节流的处理
  // 1、超码位的情况，这种二进制字符串不会有（0-255）
  // 2、二进制字符处理是基于utf-16的，而 new TextEncoder().encode()是utf-8的实现不同
  // 以下是chartgpt 提供实现思路，增强版的与str2ab，结果与源码不一样，为什么不一样呢？因为无论如何实现都是基于，utf-16的实现，应该是这样
  function encodeStringToUtf8ByteArray(str) {
    const utf8Bytes = [];
    for (let i = 0; i < str.length; i++) {
      const codePoint = str.codePointAt(i);
      if (codePoint < 0x80) {
        utf8Bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        utf8Bytes.push((codePoint >> 6) | 0xc0);
        utf8Bytes.push((codePoint & 0x3f) | 0x80);
      } else if (codePoint < 0x10000) {
        utf8Bytes.push((codePoint >> 12) | 0xe0);
        utf8Bytes.push(((codePoint >> 6) & 0x3f) | 0x80);
        utf8Bytes.push((codePoint & 0x3f) | 0x80);
      } else {
        utf8Bytes.push((codePoint >> 18) | 0xf0);
        utf8Bytes.push(((codePoint >> 12) & 0x3f) | 0x80);
        utf8Bytes.push(((codePoint >> 6) & 0x3f) | 0x80);
        utf8Bytes.push((codePoint & 0x3f) | 0x80);
      }
    }
    return new Uint8Array(utf8Bytes);
  }
  encodeStringToUtf8ByteArray("𠮷") // [240, 160, 174, 183, 237, 190, 183]
  let str = "𠮷";
  // new TextEncoder().encode() 底层是基于utf-8的
  let uint8Array = = new TextEncoder().encode(str);
  console.log("𠮷 uint8Array", uint8Array);  // [240, 160, 174, 183]
  ```
- encodeInto
  - TextEncoder.encodeInto() 方法接受一个要编码的字符串和一个目标 Uint8Array，将生成的 UTF-8 编码的文本放入目标数组中，并返回一个指示编码进度的字典对象。
  - 这相比于旧的 encode() 方法性能更高——尤其是当目标缓冲区是 WASM 堆视图时。
#### TextDecoder
- 接口表示一个文本解码器，一个解码器只支持一种特定文本编码，例如 UTF-8、ISO-8859-2、KOI8-R、GBK，等等。
- 解码器将字节流作为输入，并提供码位流作为输出（从技术上说，字符串的每个字符对应的是 Unicode 码位，因此可以视作“码位流的表示”。）
- decode
  ```js
  // 3、TextDecoder utf-8
  let utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'
  let u8arr = new Uint8Array([240, 160, 174, 183]);
  let i8arr = new Int8Array([-16, -96, -82, -73]);
  let u16arr = new Uint16Array([41200, 47022]);
  let i16arr = new Int16Array([-24336, -18514]);
  let i32arr = new Int32Array([-1213292304]);
  console.log(utf8decoder.decode(u8arr));
  console.log(utf8decoder.decode(i8arr));
  console.log(utf8decoder.decode(u16arr));
  console.log(utf8decoder.decode(i16arr));
  console.log(utf8decoder.decode(i32arr));
  // 4、TextDecoder 非utf-8
  const win1251decoder = new TextDecoder("windows-1251");
  const bytes = new Uint8Array([207, 240, 232, 226, 229, 242, 44, 32, 236, 232, 240, 33]);
  console.log(win1251decoder.decode(bytes)); // Привет, мир!
  ```
### window 4
#### window.open
- [Window：open() 方法](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open#parameters)
#### window.getSelection
返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置。
```js
let selObj = window.getSelection();
var selectedText = selObj.toString();
```
- 插入光标的位置可通过 Selection 获取，这时它被标记为 Collapsed
- anchor 指向用户开始选择的地方，而 focus 指向用户结束选择的地方。
- anchor 就指向你按下鼠标键的地方，而 focus 就指向你松开鼠标键的地方。
- anchor 和 focus 的概念不能与选区的起始位置和终止位置混淆
Selection 对象所对应的是用户所选择的 ranges（区域），俗称拖蓝。默认情况下，该函数只针对一个区域，我们可以这样使用这个函数：
```js
var selObj = window.getSelection();
var range = selObj.getRangeAt(0);
```
参考：
- [Selection](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)
- [Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)
### localStorage / sessionStorage / cookie &I
- localStorage
  ```js
  localStorage.setItem("myCat", "Tom");
  let cat = localStorage.getItem("myCat");
  localStorage.removeItem("myCat");
  // 移除所有
  localStorage.clear();
  ```
- [cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie)
  - Expires（截止日期）
  - Max-Age（相对时间）（优先）
  - Domain/Path Cookie 所属的域名和路径
  - HttpOnly Cookie 只能通过浏览器 HTTP 协议传输，禁用 js document.cookie
  - SameSite=Strict Cookie 不能随着跳转链接跨站发送
  - SameSite=Lax 允许 GET/HEAD 等安全方法，但禁止 POST 跨站发送
  - Secure 仅能用 HTTPS 协议加密传输， HTTP 协议会禁止发送
  ```js
  const allCookies = document.cookie;
  document.cookie = "path=/mydir;domain=example.com";
  ```
- 区别：
  - localStorage：
    - 只保存在客户端，不会自动发送给服务器；
    - 存储在 localStorage 的数据可以长期保留；
    - 通常为5MB到10MB
    - 同步操作
  - sessionStorage：
    - 当页面被关闭时，存储在 sessionStorage 的数据会被清除。
  - cookie：
    - 用户与服务端数据传输；当浏览器关闭时，会话Cookie会被删除。
    - 持久Cookie：持久Cookie会保存在用户的硬盘上，直到过期时间到达或用户手动删除。
    - 可以通过设置Expires或Max-Age属性来指定过期时间。
    - 通常为4KB左右。
- token为什么要保存在localStorge，为什么不用cookie
  - 安全性问题：
    - Cookie 容易受到跨站请求伪造（CSRF）攻击。（通过设置 SameSite 属性来缓解 CSRF 攻击）
    - localStorage 最主要的风险是容易受到 XSS 攻击，HttpOnly Cookie 中可以防止客户端 JavaScript 访问 Token
  - 性能：
    - Cookie 会随着每次 HTTP 请求自动发送到服务器，这会增加请求的大小，降低性能。
  - 存储：
    - Cookie 的大小限制通常为 4KB，localStorage 提供的存储容量通常比 Cookie 大

- 参考：
  - [一个小框架：一个完整支持 unicode 的 cookie 读取/写入器](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie#%E4%B8%80%E4%B8%AA%E5%B0%8F%E6%A1%86%E6%9E%B6%EF%BC%9A%E4%B8%80%E4%B8%AA%E5%AE%8C%E6%95%B4%E6%94%AF%E6%8C%81_unicode_%E7%9A%84_cookie_%E8%AF%BB%E5%8F%96%E5%86%99%E5%85%A5%E5%99%A8) 通过定义一个和 Storage 对象部分一致的对象，简化cookie的操作
  - [Cookies and security](https://humanwhocodes.com/blog/2009/05/12/cookies-and-security/)
