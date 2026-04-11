---
title: 【关于流】fetch Response  / ajax Response / axios Response 对比
date: 2026-04-02 11:00
tags:
  - front-end
  - nodejs
---
# fetch Response / ajax Response / axios Response 对比
- fetch 是把响应体当成一个 Response 对象，然后你再决定把它读成 arrayBuffer / blob / text / json / stream
- ajax(XHR) 是你先设置 responseType，浏览器再按那个类型给你结果
- axios 也是先设置 responseType，最后主要从 response.data 里拿结果；在浏览器和 Node 里的可选类型还不完全一样。
## 对各种格式的支持
### fetch
```js
// 响应先是统一的，再按你需要拆成不同形态。
const res = await fetch(url)
const ab = await res.arrayBuffer()
const blob = await res.blob()
const text = await res.text()
const stream = res.body
```
### ajax
```js
// 响应先是统一的，再按你需要拆成不同形态。
const xhr = new XMLHttpRequest()
xhr.open('GET', url)
xhr.responseType = 'arraybuffer'
xhr.onload = () => {
  const ab = xhr.response
}
xhr.send()
```
### axios

```js
// Axios 也有 responseType 配置，官方文档列出的浏览器选项包括：
// 'arraybuffer', 'document', 'json', 'text', 'stream', 浏览器专属 'blob'
const res = await axios.get(url, {
  responseType: 'arraybuffer'
})
const ab = res.data
```
## blob 类型
- fetch
  - 在浏览器和 Node（v18增加） 里都支持 blob 类型
- axios 
  - responseType: 'blob' 官方只把浏览器列为支持环境
  - 在 Node 里，axios 的 responseType 配置无效，先arrayBuffer，再blob
  ```js
  import axios from 'axios'
  const res = await axios.get('https://example.com/file.pdf', {
    responseType: 'arraybuffer'
  })
  const blob = new Blob(
    [res.data],
    { type: res.headers['content-type'] ?? 'application/octet-stream' }
  )
  console.log(blob.size)
  console.log(blob.type)
  ```
## strem 的支持
- fetch response.body 支持 readableStream
- ajax XHR 有进度、有部分文本，但没有现代 Fetch/Streams 那种统一的响应体流对象。
  ```js
  // 下载过程中的事件通知 + 文本增量可见
  const xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/stream-text')
  xhr.responseType = 'text'

  let lastIndex = 0

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.LOADING) {
      const chunk = xhr.responseText.slice(lastIndex)
      lastIndex = xhr.responseText.length

      console.log('partial text chunk:', chunk)
    }

    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log('done')
    }
  }

  xhr.send()
  ```
  ```js
  const xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/file')
  xhr.responseType = 'arraybuffer'

  xhr.onload = () => {
    // 这里 arraybuffer 是完成后一次性交给你，中间过程你不知道。
    const ab = xhr.response
    console.log(ab.byteLength)
  }

  xhr.send()
  ```
- axios 的“流”在浏览器和 Node 不是一回事
  - node 中 response.data 是 Node 可读流
    ```js
    const response = await axios({
      method: "get",
      url: "https://bit.ly/2mTM3nY",
      responseType: "stream",
    });
    response.data.pipe(fs.createWriteStream("ada_lovelace.jpg"));
    ```
  - 浏览器中的流，本质上还是 XHR 世界
  - 如果想让 axios 更接近 fetch 的流，要用 fetch adapter（v1.7）同时与浏览器环境支持有关
    ```js
    import axios from 'axios'
    const fetchAxios = axios.create({
      adapter: 'fetch'
    })
    const res = await fetchAxios.get('/api/stream', {
      responseType: 'stream'
    })
    // 这里 data 的具体形态，依赖环境和 adapter 能力
    console.log(res.data)
    ```
## 总结
- 尽量使用 fetch 的流，因为它更现代、更统一、更可靠
- 如果浏览器使用了 axios，需要 adapter: 'fetch'，responseType: 'stream'才能真正流式消费
- 否则 axios/XHR 只能支持到下载进度