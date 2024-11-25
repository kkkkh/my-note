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
