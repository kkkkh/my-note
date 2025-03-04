---
outline: deep
---
## Dom
[文档对象模型（DOM）](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
### Document
#### activeElement
Document 接口的 activeElement 只读属性返回 DOM 中当前拥有焦点的 Element。
```js
function onMouseUp(e) {
  const activeTextarea = document.activeElement;
  const selection = activeTextarea.value.substring(
    activeTextarea.selectionStart,
    activeTextarea.selectionEnd,
  );
  const outputElement = document.getElementById("output-element");
  const outputText = document.getElementById("output-text");
  outputElement.innerHTML = activeTextarea.id;
  outputText.innerHTML = selection;
}
const textarea1 = document.getElementById("ta-example-one");
const textarea2 = document.getElementById("ta-example-two");
textarea1.addEventListener("mouseup", onMouseUp, false);
textarea2.addEventListener("mouseup", onMouseUp, false);
```
### event
#### 事件捕获（capture）、事件冒泡（propagation）
- 父子关系：div1 -> div2 -> div3
- 事件捕获：由外向内，div1,div2,div3
- 事件冒泡：由内向外，div3,div2,div1
- addEventListener 第三个参数设置为true，事件在捕获阶段触发，打印顺序：1,2,3，反之则在冒泡阶段触发3,2,1
- 捕获阶段与冒泡阶段都可以设置e.stopPropagation()，阻止事件往下一层触发
```html
<div id="div1" onclick="handleClick1(event)">
  <div id="div2" onclick="handleClick2(event)">
    <div id="div3" onclick="handleClick3(event)">Click div3</div>
  </div>
</div>
<script>
  document.getElementById('div1').addEventListener('click',(e) => {
    e.stopPropagation()
    debugger
  }, true)
  document.getElementById('div2').addEventListener('click',(e) => {
    e.stopPropagation()
    debugger
  }, true)
  document.getElementById('div3').addEventListener('click',(e) => {
    e.stopPropagation()
    debugger 
  }, true)
  function handleClick1(event) {
    debugger
    console.log('div1 clicked')
  }
  function handleClick2(event) {
    debugger
    // event.stopPropagation(); // 阻止事件从 div2 继续冒泡
  }
  function handleClick3(event) {
    debugger
    // event.stopPropagation(); // 阻止事件从 div3 继续冒泡
  }
```
#### keydown/keyup
- ~~keypress~~<font color=red>(已弃用)</font> 当按下产生字符或符号值的键时，将触发 keypress 事件
- keyup 事件在按键被松开时触发
- keydown 事件在按键被松开时触发
- 扫描枪触发就是 input事件 + keydown Enter事件（生成的条形码中包含英文，输入法是英文状态下，才会触发keydown/keyup事件）

```js
// 按回车键时
document.getElementById("app").addEventListener('keydown',(e)=>{
  console.log(e.code) //Enter
  console.log(e.key)//Enter
  // e.keyCode弃用
  console.log(e.keyCode)//13 
})
```
参考：
- [keyup_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keyup_event)
- [KeyboardEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent)
- [vue2 按键修饰符](https://v2.cn.vuejs.org/v2/guide/events.html#%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)
#### contextmenu
contextmenu 事件会在用户尝试打开上下文菜单时触发。
该事件通常在鼠标点击右键或者按下键盘上的菜单键时被触发。
```js
// 自定义右键菜单
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  // 动态生成菜单
  const menu = document.createElement('div');
  menu.style.position = 'absolute';
  menu.style.top = `${event.clientY}px`;
  menu.style.left = `${event.clientX}px`;
  menu.style.background = 'white';
  menu.style.border = '1px solid #ccc';
  menu.style.padding = '5px';
  // 添加菜单选项
  menu.innerHTML = '<div>选项 1</div><div>选项 2</div>';
  document.body.appendChild(menu);
  // 点击其他地方时移除菜单
  document.addEventListener('click', () => menu.remove(), { once: true });
});
```
```js
// 用于保护页面内容（如图片）或限制右键行为：
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  alert('右键菜单已被禁用');
});
```
#### CustomEvent/dispatchEvent
```js
const input = document.getElementById("input");
input.addEventListener("input", function (e) {
  // write by zhangxinxu
  console.log("input chufa");
  console.log(e.detail); // 打印 {a:1}
});
const myEvent = new CustomEvent("input", {
  detail: { a: 1 },
});
input.dispatchEvent(myEvent); // 触发
```
```js
// bubbles 只读属性表明事件是否会沿 DOM 树向上冒泡。
activeElement.dispatchEvent(new Event('input', { bubbles: true }))
```
### navigator
#### navigator.clipboard
- writeText() 写入特定字符串到操作系统的剪切板，返回一个promise
  ```js
  var promise = navigator.clipboard.writeText(newClipText)
  ```
- readText 解析系统剪贴板的文本内容
  ```js
  navigator.clipboard.readText().then((clipText) => (document.getElementById("outbox").innerText = clipText));
  ```
- write(data) 写入图片等任意的数据到剪贴板，只支持png格式图片，jpg不支持
  - data 包含要写入剪贴板的数据的 ClipboardItem 对象数组。
  ```js
  function setClipboard(text) {
    const type = "text/plain";
    // 代码首先创建了一个新的 Blob 对象，
    const blob = new Blob([text], { type });
    // 创建一个新的 ClipboardItem 对象，并在其中放置 blob，以写入到剪贴板
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => {/* success */},
      () => {/* failure */},
    );
  }
  ```
- read() 从剪贴板粘贴图片等任意的数据
  ```js
  const destinationImage = document.querySelector("#destination");
  destinationImage.addEventListener("click", pasteImage);
  async function pasteImage() {
    try {
      const clipboardContents = await navigator.clipboard.read();
      for (const item of clipboardContents) {
        if (!item.types.includes("image/png")) {
          throw new Error("Clipboard does not contain PNG image data.");
        }
        const blob = await item.getType("image/png");
        destinationImage.src = URL.createObjectURL(blob);
      }
    } catch (error) {
      log(error.message);
    }
  }
  ```
参考：
- [navigator.clipboard](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard)
### Signal
#### AbortController
```js
const controller = new AbortController();
const signal = controller.signal;
const url = "video.mp4";
const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");
downloadBtn.addEventListener("click", fetchVideo);
abortBtn.addEventListener("click", () => {
  controller.abort();
  console.log("Download aborted");
});
function fetchVideo() {
  fetch(url, { signal })
    .then((response) => {
      console.log("Download complete", response);
    })
    .catch((err) => {
      console.error(`Download error: ${err.message}`);
    });
}
```
参考：
- [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/AbortController)
#### AbortSignal
AbortSignal 接口表示一个信号对象（signal object），它允许你通过 AbortController 对象与 DOM 请求（如 Fetch）进行通信并在需要时将其中止。
```js
// 中止超时的读取操作 AbortSignal.timeout()
const url = "video.mp4";
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const result = await res.blob();
  // …
} catch (err) {
  if (err.name === "TimeoutError") {
    console.error("Timeout: It took more than 5 seconds to get the result!");
  } else if (err.name === "AbortError") {
    console.error(
      "Fetch aborted by user action (browser stop button, closing tab, etc.",
    );
  } else if (err.name === "TypeError") {
    console.error("AbortSignal.timeout() method is not supported");
  } else {
    // A network error, or some other problem.
    console.error(`Error: type: ${err.name}, message: ${err.message}`);
  }
}
// 超时或显式中止 fetch
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const res = await fetch(url, { signal: controller.signal });
  const body = await res.json();
} catch (e) {
  if (e.name === "AbortError") {
    // Notify the user of abort.
    // Note this will never be a timeout error!
  } else {
    // A network error, or some other problem.
    console.log(`Type: ${e.name}, Message: ${e.message}`);
  }
} finally {
  clearTimeout(timeoutId);
}
```
### 通信
#### iframe
```html
<!-- index.html -->
<iframe src="child.html" id="myIframe"></iframe>
<script>
// 监听
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-iframe-origin.com') return; // 验证来源
  console.log('收到来自 iframe 的消息:', event.data);
});
// 发送
const iframe = document.getElementById('myIframe');
iframe.contentWindow.postMessage('Hello from parent', 'https://your-iframe-origin.com');
</script>
```
```js
// iframe.html
// 发送
window.parent.postMessage('Hello from iframe', 'https://your-parent-origin.com');
// 接受
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-parent-origin.com') return; // 验证来源
  console.log('收到父页面的消息:', event.data);
});
```
#### web Worker 
#### 专用 worker
```js
// index.html
const myWorker = new Worker("worker.js");
// first 代表 2 个 <input> 元素
first.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log("Message posted to worker");
};
myWorker.onmessage = (e) => {
  result.textContent = e.data;
  console.log("Message received from worker");
  // 终止 worker
  // myWorker.terminate();
};
// worker.js
onmessage = (e) => {
  // 接受消息
  console.log("Message received from main script");
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  console.log("Posting message back to main script");
  // 发送消息
  postMessage(workerResult);
};
```
#### SharedWorker
一个共享 worker 可以被多个脚本使用——即使这些脚本正在被不同的 window、iframe 或者 worker 访问
```js
// index1.html / index2.html
const myWorker = new SharedWorker("worker.js");
squareNumber.onchange = () => {
  // 发送消息
  myWorker.port.postMessage([squareNumber.value, squareNumber.value]);
  console.log("Message posted to worker");
};
// 接受消息
myWorker.port.onmessage = (e) => {
  result2.textContent = e.data;
  console.log("Message received from worker");
};
// woker.js
onconnect = (e) => {
  const port = e.ports[0];
  port.onmessage = (e) => {
    const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    port.postMessage(workerResult);
  };
};
```
参考：[Web_Workers_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
#### MessageChannel / MessagePort
不同的脚本直接通信，通过两端都有端口的双向频道（或管道）相互传递消息。
```js
// index.html
const input = document.getElementById("message-input");
const output = document.getElementById("message-output");
const button = document.querySelector("button");
const iframe = document.querySelector("iframe");
const channel = new MessageChannel();
const port1 = channel.port1;
// 等待 iframe 加载
iframe.addEventListener("load", onLoad);
function onLoad() {
  // 监听按钮点击
  button.addEventListener("click", onClick);
  // 在 port1 监听消息
  port1.onmessage = onMessage;
  // 把 port2 传给 iframe
  iframe.contentWindow.postMessage("init", "*", [channel.port2]);
}
// 当按钮点击时，在 port1 上发送一个消息
function onClick(e) {
  e.preventDefault();
  // 发送消息
  port1.postMessage(input.value);
}
// 处理 port1 收到的消息
function onMessage(e) {
  output.innerHTML = e.data;
  input.value = "";
}
```
```js
// iframe
const list = document.querySelector("ul");
let port2;
// 监听初始的端口传递消息
window.addEventListener("message", initPort);
// 设置传递过来的端口
function initPort(e) {
  port2 = e.ports[0];
  port2.onmessage = onMessage;
}
// 处理 port2 收到的消息
function onMessage(e) {
  const listItem = document.createElement("li");
  listItem.textContent = e.data;
  list.appendChild(listItem);
  // 发送消息
  port2.postMessage(`IFrame 收到的消息：“${e.data}”`);
}
```
### Base64
#### base64
- 概念
  - 以下字母表来表示基于 64 进制的数字，以及使用 = 作为填充字符：`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`
  - 一种常见的变体是“URL 安全的 Base64”，它省略了填充，并将 +/ 替换为 -_
  - [data URL](#data-url): 既没有路径段也没有查询参数，因此可以使用标准的 Base64 编码
  - 结构
    - 每个 Base64 位代表 6 位数据。
    - 字符串/二进制文件的三个 8 位字节（3×8 位 = 24 位）可以用四个 6 位 Base64 位（4×6 = 24 位）表示。
    - 这意味着字符串或文件的 Base64 版本通常比其原来的内容大大约三分之一（确切的大小增加取决于各种因素，如字符串的绝对长度、它除以 3 的长度余数，以及是否使用填充字符）。
- api
  - Window.btoa()（也在 worker 中可用）：从二进制数据字符串创建一个 Base64 编码的 ASCII 字符串（“btoa”应看作“从二进制到 ASCII”）
  - Window.atob()（也在 worker 中可用）：解码通过 Base64 编码的字符串数据（“atob”应看作“从 ASCII 到二进制”）
    ```js
    const encodedData = window.btoa("Hello, world");
    const decodedData = window.atob(encodedData);
    ```
  - 注意：字节到码位的对应关系只能可靠地适用于最高为 0x7f 的码位。此外，超过 0xff 的码位将导致 btoa 抛出错误，因为超过了 1 字节的最大值。
- Unicode 文本的用例
  ```js
  /**
   * 由于 btoa 将其输入字符串的码位解释为字节值，因此如果字符的码位超过 0xff，调用 btoa 将导致“Character Out Of Range”异常。
   * 对于需要编码任意 Unicode 文本的用例，需要首先将字符串转换为其 UTF-8 的组成字节，然后对这些字节进行编码。
   * 最简单的解决方案是使用 TextEncoder 和 TextDecoder 在 UTF-8 和字符串的单字节表示之间进行转换：
   */
  function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  }

  function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (byte) =>
      String.fromCodePoint(byte),
    ).join("");
    return btoa(binString);
  }
  bytesToBase64(new TextEncoder().encode("a Ā 𐀀 文 🦄")); // "YSDEgCDwkICAIOaWhyDwn6aE"
  new TextDecoder().decode(base64ToBytes("YSDEgCDwkICAIOaWhyDwn6aE")); // "a Ā 𐀀 文 🦄"
  ```
- Base64 数据 URL 的异步转换
  ```js
  // 为了获得更好的性能，可以通过 Web 平台内置的 FileReader 和 fetch API 进行基于 Base64 数据 URL 的异步转换：
  async function bytesToBase64DataUrl(bytes, type = "application/octet-stream") {
    return await new Promise((resolve, reject) => {
      const reader = Object.assign(new FileReader(), {
        onload: () => resolve(reader.result),
        onerror: () => reject(reader.error),
      });
      reader.readAsDataURL(new File([bytes], "", { type }));
    });
  }
  async function dataUrlToBytes(dataUrl) {
    const res = await fetch(dataUrl);
    return new Uint8Array(await res.arrayBuffer());
  }
  await bytesToBase64DataUrl(new Uint8Array([0, 1, 2])); // "data:application/octet-stream;base64,AAEC"
  await dataUrlToBytes("data:application/octet-stream;base64,AAEC"); // Uint8Array [0, 1, 2]
  ```
#### Data URL
- 即前缀为 data: 协议的 URL，其允许内容创建者向文档中嵌入小文件
- 由四个部分组成：`data:[<mediatype>][;base64],<data>`
  - 前缀（data:）
  - 指示数据类型的 MIME 类型
    - mediatype 是个 MIME 类型的字符串，例如 'image/jpeg' 表示 JPEG 图像文件
    - 如果被省略，则默认值为 text/plain;charset=US-ASCII
  - 如果非文本则为可选的 base64 标记
  - 数据本身
    - 如果数据包含 RFC 3986 中定义为`保留字符的字符`或包含`空格符`、`换行符`或者`其他非打印字符`，这些字符必须进行[百分号编码](#百分号编码url-编码)（又名“URL 编码”）
- 示例
  - `data:,Hello%2C%20World!`（简单的 text/plain 类型数据，注意逗号如何百分号编码为 %2C，空格字符如何编码为 %20。）
  - `data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D`（上一条示例的 base64 编码版本，window.btoa("Hello, World!") => 'SGVsbG8sIFdvcmxkIQ=='）
  - `data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E`（一个 HTML 文档源代码 `<h1>Hello, World</h1>`）
  - `data:text/html,%3Cscript%3Ealert%28%27hi%27%29%3B%3C%2Fscript%3E`（带有`<script>alert('hi');</script>` 的 HTML 文档，用于执行 JavaScript 警告。注意，需要闭合的 script 标签。）
#### 百分号编码（URL 编码）
- 百分号编码
  - 一种拥有 8 位字符编码的编码机制，其中的编码在 URL 的上下文中具有特定的含义。
  - 编码由英文字母替换组成：“%”后跟替换字符的 ASCII 的十六进制表示
  - 需要编码的特殊字符：`':'、'/'、'?'、'#'、'['，']'、'@'、'!'、'$'、'&'、"'"、'('、')'、'*'、'+'、','、';'、'='，以及 '%' 本身`
- 列表
  | 字符           | 编码   |
  |-------------- | -------------- |
  | ':'       | %3A      |
  | '/'       | %2F      |
  | '?'       | %3F      |
  | '#'       | %23      |
  | '['       | %5B      |
  | ']'       | %5D      |
  | '@'       | %40      |
  | '!'       | %21      |
  | '$'       | %24      |
  | '&'       | %26      |
  | "'"       | %27      |
  | '('       | %28      |
  | ')'       | %29      |
  | '*'       | %2A      |
  | '+'       | %2B      |
  | ','       | %2C      |
  | ';'       | %3B      |
  | '='       | %3D      |
  | '%'       | %25      |
  | ' '       | %20 或 + |
#### encodeURIComponent
```js
console.log(`?x=${encodeURIComponent("test?")}`);
console.log(`?x=${encodeURIComponent("шеллы")}`);
console.log(`?x=${encodeURIComponent("我和你")}`);
// ?x=test%3F
// index.html:14 ?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B
// index.html:16 ?x=%E6%88%91%E5%92%8C%E4%BD%A0
```
- 转义序列来编码 URI：过将特定字符的每个实例替换成代表字符的 UTF-8 编码的一个、两个、三个或四个转义序列来编码 URI
- 不转义的字符： A-Z a-z 0-9 - _ . ! ~ * ' ( )

- 模拟实现（chartgpt）
  ```js
  function encodeURIComponent(str) {
      let encodedStr = "";
      for (let i = 0; i < str.length; i++) {
          let code = str.charCodeAt(i);
          if (
          code === 0x2D || // -
          code === 0x2E || // .
          code === 0x5F || // _
          code === 0x7E || // ~
          (code >= 0x30 && code <= 0x39) || // 0-9
          (code >= 0x41 && code <= 0x5A) || // A-Z
          (code >= 0x61 && code <= 0x7A)    // a-z
          ) {
          encodedStr += str.charAt(i);
          } else {
          let hexCode = code.toString(16).toUpperCase();
          if (hexCode.length < 2) {
              hexCode = "0" + hexCode;
          }
          encodedStr += "%" + hexCode;
          }
      }
      return encodedStr;
  }
  // 或者
  // 思路，charCodeAt对应Unicode编码，转为16进制，加"%"
  // 真正思路较复杂，有一个、两个、三个或四个转义序列不同处理
  function customEncodeURIComponent(str) {
      const replacer = function(character) {
          const hex = character.charCodeAt(0).toString(16);
          const prefix = hex.length === 1 ? '0' : '';
          return '%' + prefix + hex.toUpperCase();
      };
      // 非字母数字字符以及部分特殊字符需要被编码
      return str.replace(/[^a-zA-Z0-9\-_.!~*'()]/g, replacer);
  }
  ```
### JSON
#### 序列化和反序列化
- 序列化（Serialization）：
  - 将对象或数据结构（如 JavaScript 对象、数组）转换为 JSON 格式的字符串。
  - 这是为了使数据可以被传输（如通过网络）或存储（如写入文件）。
- 反序列化（Deserialization）：
  - 将 JSON 格式的字符串解析回 JavaScript 对象或数据结构。
  - 这是为了在应用程序中使用数据。
- 使用场景：
  - 网络通信、数据存储、配置文件、跨语言数据交换
#### JSON api
```js
const obj = { name: "Alice", age: 25 };
const jsonString = JSON.stringify(obj); // '{"name":"Alice","age":25}'
const jsonString = '{"name":"Alice","age":25}';
const obj = JSON.parse(jsonString); // { name: "Alice", age: 25 }
```
### Element
#### Element
- Element.tagName 等同于 Element.nodeName
  ```js
  var span = document.getElementById("born");
  alert(span.tagName); // SPAN
  ```
#### HTMLInputElement
- selectionStart
  - 一个表示选择文本的开始索引的数字。
  - 当没有选择时，它返回当前文本输入光标位置的偏移量。
- selectionEnd
  - 一个表示选择文本的结束索引的数字。
  - 当没有选择时，它返回当前文本输入光标位置后面的字符的偏移量。
- setSelectionRange() 设定当前选中文本的起始和结束位置。
#### Element.getBoundingClientRect()
![alt text](getBoundingClientRect-1.png)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body{margin:0,padding:0}
      div {
        width: 400px;
        height: 200px;
        padding: 20px;
        margin: 50px 60px;
        background: purple;
      }
    </style>
  </head>
  <body>
    <div></div>
    <script>
      let elem = document.querySelector('div');
      let rect = elem.getBoundingClientRect();
      for (var key in rect) {
        if(typeof rect[key] !== 'function') {
          let para = document.createElement('p');
          para.textContent  = `${ key } : ${ rect[key] }`;
          document.body.appendChild(para);
          /*
          x :60
          y : 50
          width : 440
          height : 240
          top : 50
          right : 500
          bottom : 290
          left : 60
          */
        }
      }
    </script>
  </body>
</html>
```
