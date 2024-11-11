## Bom
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
