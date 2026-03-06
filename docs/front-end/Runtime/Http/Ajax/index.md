---
outline: deep
---
## Ajax
### URL Query

### Content-Type
- Content-Type: application/x-www-form-urlencoded
  - 浏览器原生表单默认格式
  ```html
  <form action="/api/user" method="POST" enctype="application/x-www-form-urlencoded">
    <input type="text" name="name" value="张三" />
    <input type="number" name="age" value="30" />
    <button type="submit">提交</button>
  </form>
  ```
  - axios 也可以传递
  ```js
  const axios = require('axios');
  const qs = require('qs'); // npm install qs
  const data = { name: '张三', age: 30 };
  const params = new URLSearchParams();
  for (const key in data) {
    params.append(key, data[key]);
  }
  const paramsData = qs.stringify(data) || params.toString()
  axios.post('http://localhost:3000/api/user', paramsData , {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(res => console.log(res.data));
  ```
  - 数据浏览器显示位置：
    - Form Data 👉 x-www-form-urlencoded 的请求体会显示在这里！
    - 示例：name=张三&age=30
    - curl抓包 --data-raw 'workOrderCode=3S11071609&a=1'
- Content-Type: application/json 现代前后端接口的主流选择
- Content-Type: multipart/form-data 表单含文件时的标准格式
- Content-Type: application/octet-stream 上传下载流

- 对比 Query / x-www-form-urlencoded
  - URL Query（路径中传参）
  - x-www-form-urlencoded（请求体传参），参数放在 请求体（body） 中，而不是 URL
- 流对比
  - Content-Type: application/octet-stream 👉 后端说：“我返回的是文件流。”
  - responseType: 'blob' 👉 前端说：“我要以二进制方式接收。”
### cors
- [cors](https://www.ruanyifeng.com/blog/2016/04/cors.html)
### MIME
- [MIME](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/MIME_types)
- [MIME 所有类型](https://www.iana.org/assignments/media-types/media-types.xhtml)
- [MIME 常用类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/MIME_types/Common_types)
### CSP
- [CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
