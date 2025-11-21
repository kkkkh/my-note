# lottie
## 加载
```bash
npm install lottie-web
```
```js
import lottie from "lottie-web";

lottie.loadAnimation({
  container: document.getElementById("hero-animation"), // 绑定DOM容器
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "/animations/character.json", // AE 导出的 JSON 动画文件
});
```
