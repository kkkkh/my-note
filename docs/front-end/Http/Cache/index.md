---
outline: deep
---
# Cache
## 强制缓存
- Expires http1.0
  - 格式：绝对日期/时间 `Expires: Tue, 18 Jul 2017 16:07:23 GMT`
  - 优先级低于 Cache-Control
- Cache-Control http1.1
  - 格式：相对时间（时间段 秒） `Cache-Control:max-age=30`
  - max-age=30 缓存 30 秒，响应报文的创建时刻开始计算
  - no-store 不允许缓存（秒杀）
  - must-revalidate（如果缓存不过期就可以继续使用，但过期了如果还想用就必须去服务器验证）
  - no-cache（相当于 max-age=0,must-revalidate）资源可以被缓存，使用前必须要去服务器验证是否过期，是否有新版本
## 协商缓存
- aLst-modified 1.0
  - 服务端响应时：Last-modified 文件的最后修改时间
  - 客户端发送时：if-Modified-Since：Last-modified 的值
  - 与进行对比，如果已经过期，返回新的；否则304
  - If-Unmodified-Since
- ETag 资源的一个唯一标识 1.1
  - 解决修改时间无法准确区分文件变化的问题
  - 精确地识别资源的变动情况（1 秒内多次修改、文件更新但内容不变）
  - 强 Etag：在字节级别必须完全相符
  - 弱 Etag：前有个“W/”标记，只要求资源在语义上没有变化，但内部可能会有部分发生了改变
  - 客户端发送时：if-none-match：Etag的值
  - If-Match
## 操作抓包
- 操作：清空缓存并硬性重新加载
  - 状态码：200 OK
  - 请求头：没有与缓存相关的请求头
  - 响应头：
    - cache-control:max-age=600
    - expires:Fri, 28 Mar 2025 07:30:31 GMT
    - last-modified:Fri, 28 Mar 2025 06:49:26 GMT
    - etag:W/"67e64676-688"
- 立即操作：刷新/f5
  - 状态码：200 OK （来自磁盘缓存）
  - 请求头：显示的是预配标头
  - 响应头:
    - cache-control:max-age=600
    - expires:Fri, 28 Mar 2025 07:30:31 GMT
    - last-modified:Fri, 28 Mar 2025 06:49:26 GMT
    - etag:W/"67e64676-688"
  - 因为cache-control:max-age=600缓存时10分钟，没有过期直接使用缓存
- 操作：浏览器勾选 `停用缓存`
  - 状态码：200 OK
  - 请求头:
    - cache-control:no-cache
  - 响应头
    - cache-control:max-age=600
    - expires:Fri, 28 Mar 2025 09:33:36 GMT（超10分钟之后刷新，时间更新） / Fri, 28 Mar 2025 07:30:31 GMT（10分钟之内更新，时间不变）
    - last-modified:Fri, 28 Mar 2025 06:49:26 GMT
    - etag:W/"67e64676-688"
- 操作：超10分钟 刷新
  - 状态码：304 Not Modified
  - 请求头:
    - if-modified-since:Fri, 28 Mar 2025 06:49:26 GMT（来自last-modified）
    - if-none-match:W/"67e64676-688"（来自etag）
  - 响应头:
    - cache-control:max-age=600
    - expires:Fri, 28 Mar 2025 07:30:31 GMT
    - etag:W/"67e64676-688"


