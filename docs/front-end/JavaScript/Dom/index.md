---
outline: deep
---
## Dom
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
- <s>keypress</s><font color=red>(已弃用)</font> 当按下产生字符或符号值的键时，将触发 keypress 事件
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

### base64
#### btoa / atob
```js
// 编码
const encodedData = window.btoa("Hello, world");
// 解码
const decodedData = window.atob(encodedData);
```
