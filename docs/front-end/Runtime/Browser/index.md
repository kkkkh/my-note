---
outline: deep
---
# 浏览器
## 浏览器引擎
- WebKit
  - WebKit是一个开源的Web浏览器引擎(Web browser engine)
  - 2013年4月3日，Google宣布它建立了WebKit中WebCore组件的分支—Blink，Blink用于新版Google Chrome与Opera。
- Chromium
  - Chromium 是 The Chromium Project 中的一个项目，Google Chrome 等许多网络浏览器都是基于此项目进行开发。
  - Google Chrome 浏览器是基于 Chromium 项目的子产品之一。
- chromium 与 webkit 关系
  - WebKit中WebCore组件被Chromium开源方案所采用，随着两边开发差异越来越大，苹果在WebKit的WebCore添加许多专有的代码（如Objective-C）Chromium用不到却要花时间去编译，反而拖累了Chromium开发及发展。Chromium的多进程架构（Multi-Process）难以合并入WebCore代码中，且苹果也不愿妥协采用，选择自行开发自己的WebKit2多进程架构。
  - 因此Chromium的开发者由于希望在浏览器的开发上拥有更大的自由度，同时避免与上游冲突，更可透过移除Chrome没有使用的组件而简化自己的程序库，所以决定开发WebKit的WebCore分支版本Blink，于2013年4月3日发布，被用于基于Chromium的网页浏览器，如Microsoft Edge与Google Chrome等。
  - 作为渲染引擎使用的WebKit，被使用在Safari及Google Chrome浏览器于Windows、OS X、iOS及Android平台（然而，Chrome仅仅使用WebCore，而JavaScript引擎及多工系统则自行开发）
- Trident/MSHTML引擎
  - Internet Explorer使用的Trident/MSHTML引擎
- 浏览器引擎前缀
  -webkit-（Chrome、Safari、新版 Opera 浏览器以及几乎所有 iOS 系统中的浏览器（包括 iOS 系统中的火狐浏览器）；简单的说，所有基于 WebKit 内核的浏览器）
  -moz-（火狐浏览器）
  -o-（旧版、WebKit 之前的 Opera 浏览器）
  -ms-（IE 浏览器和 Chromium 之前的 Edge 浏览器）
- 参考：
  - [浏览器引擎前缀](https://developer.mozilla.org/zh-CN/docs/Glossary/Vendor_Prefix)
  - [Webkit CSS 扩展](https://developer.mozilla.org/zh-CN/docs/Web/CSS/WebKit_Extensions)
  - [WebKit](https://zh.wikipedia.org/wiki/WebKit)
  - [Chromium](https://zh.wikipedia.org/wiki/Chromium)
## 沙箱
- 沙箱（Sandbox）
  - 是一种安全机制，用于将运行的程序或代码隔离在一个受限制的环境中，防止它们对系统或其他程序造成破坏。
  - 类比理解：沙箱类似于一个儿童游乐场，用围栏隔离开，孩子们只能在围栏内玩，防止他们跑出去或对外界造成影响。
  - 核心作用：提供一个安全的“隔离区”，测试代码、运行不可信程序，避免影响整个系统。
- 前端沙箱
  - 浏览器的沙箱：
    - 浏览器会对网页运行的脚本进行沙箱化处理，限制其访问用户文件系统或执行恶意操作。
    - 例如，浏览器的 iframe 标签运行的内容就是沙箱化的，可以通过 sandbox 属性进一步限制功能，如禁止脚本执行、禁止弹出窗口等。
  - Web 应用中的沙箱：
    - JavaScript 沙箱：用于运行不受信任的第三方代码，比如在广告、插件或用户上传的脚本时，避免代码直接访问全局作用域。
    - CSP（Content Security Policy）：现代浏览器通过 CSP 实现沙箱，规定哪些资源可以加载和执行。
  - 前端框架的沙箱：
    - 像微前端框架（如 Qiankun）利用沙箱机制，实现多个前端应用在同一页面下的独立运行，互不干扰。
- 待读
  - [30分钟搞懂JS沙箱隔离](https://juejin.cn/post/7410347763898597388)
## 浏览器渲染
### 浏览器渲染过程
- 浏览器渲染过程的线程组成是多线程的，各自线程完成各自归属任务
- 执行时：多线程的，渲染进程和主线程可以同时并行
- 但是又有影响和依赖：
  - 因为JavaScript 执行可能会导致页面的布局或样式发生变化，进而触发 重排（reflow） 或 重绘（repaint），这会影响渲染的过程
  - 这种重排操作会导致渲染线程必须等待 JavaScript 执行完毕之后才能继续更新页面
  - 如果JavaScript 执行占用主线程的资源，一直没有结束，或者 频繁操作DOM，都会阻塞页面的渲染更新，造成卡顿
  - 因为主线程是单线程的，而渲染线程和主线程的工作需要进行同步操作
### 多线程
  - 主线程（UI 线程）：负责执行 JavaScript、处理用户交互、更新页面内容（渲染）、管理任务队列。这就是我们通常所说的单线程，尤其是在处理 JavaScript 执行时。
  - 渲染线程：负责页面的绘制、布局和渲染。包括 CSS 解析、HTML DOM 渲染、布局计算等。
  - 网络线程：负责处理 HTTP 请求和加载资源，例如从服务器获取页面、CSS、图片、JavaScript 等资源。
  - JavaScript 引擎线程：用来执行 JavaScript 代码的线程。它是单线程的，因为 JavaScript 的执行模型是单线程的。
  - 后台线程：浏览器可以使用后台线程来执行某些任务，如图片解码、Web Workers（Web 工作线程）等。
### js执行单线程
- JavaScript 引擎通常被认为是主线程的一部分
  - 解析和编译 JavaScript 代码：将 JavaScript 源代码转化为可以被计算机执行的机器码（编译过程）。
  - 执行 JavaScript 代码：通过解释执行的方式运行 JavaScript 代码，更新页面的状态、修改 DOM 或执行其他业务逻辑。
- 由于 JavaScript 是单线程的，JavaScript 代码的执行会阻塞其他任务（如渲染、页面更新等）直到当前任务执行完成。
### 渲染线程
- CSS 加载
  - CSS 的加载和渲染通常会在 HTML 被解析时触发。浏览器会尽早加载并解析所有的样式表文件（link 标签或 @import）。
  - 如果页面有 外部 CSS 文件，它们通常会 阻塞页面渲染，直到 CSS 完全加载和解析完成。这是因为浏览器需要知道所有样式才能正确地布局页面。
  - 内联 CSS（嵌入在页面内的 style 标签）会立即被处理，不会造成阻塞
- 重排与重绘：
  - 重排（Reflow）：指浏览器重新计算页面布局（元素的位置和尺寸等），通常是因为 DOM 或 CSS 样式的变化引起的。
    - 改变窗口大小
    - 改变字体大小
    - 添加或删除 DOM 元素
    - 读取某些布局属性（如 offsetWidth、offsetHeight）
  - 重绘（Repaint）：指浏览器重新绘制页面的视觉内容，但不涉及元素的布局计算，通常是因为颜色、背景等样式的变化。
### 主线程
- JS 加载
  - 同步加载：如果 script 标签在页面顶部（head）并且没有设置 async 或 defer，它会 阻塞页面渲染，直到脚本加载和执行完成。
  - 异步加载：如果使用 async 或 defer 属性，JavaScript 脚本可以在不阻塞页面渲染的情况下加载：
    - async：让脚本异步加载并立即执行（会阻塞 HTML 解析，但不阻塞后续的脚本）。
    - defer：让脚本延迟执行，直到 HTML 完全解析完成（这可以避免阻塞页面渲染）。
  - 加载顺序（css 和 js）
  - 如果 JavaScript 在 CSS 之前加载并执行，可能会导致页面样式未正确应用，或者在某些情况下 JavaScript 脚本会修改 DOM，导致页面重排或重绘。
  - 一些前端开发者会将 CSS 文件放在 head 中，并将 JavaScript 文件放在 body 底部（或者使用 async 和 defer 属性），以确保样式先加载，然后再加载和执行 JavaScript，避免渲染阻塞。
### 优化
- 如何优化 JavaScript 执行与页面渲染的配合
  - 异步执行：使用 Web API（如 setTimeout、setInterval、requestAnimationFrame）和 Web Workers 来将一些不需要立即执行的任务移到主线程之外，以避免长时间阻塞主线程。
  - 减少 DOM 操作：每次对 DOM 的修改都会触发浏览器的重排（reflow）和重绘（repaint），过多的操作会影响性能。尽量批量处理 DOM 更新。
  - 懒加载：对于不必要立即加载的资源，使用懒加载技术，延迟加载资源来提升页面的响应速度。
### 事件循环
- 事件循环
  - 事件循环是浏览器处理异步任务的机制，它确保了 JavaScript 代码的执行顺序和响应性。
  - 事件循环是一种持续运行的机制，它负责监听调用栈（Call Stack）和任务队列，并在适当的时候将任务从任务队列移动到调用栈中执行
  - 简单来说，事件循环就像一个调度员，负责协调同步和异步任务的执行
- 事件循环的步骤
  - 执行调用栈中的任务
  - 当调用栈为空时，从任务队列中取出第一个任务，将其添加到调用栈中执行
  - 重复以上步骤
#### 调用栈（Call Stack）：
- 调用栈是一个 LIFO（后进先出）的结构，用于存储当前正在执行的任务
- 当 JavaScript 引擎遇到一个函数调用时，会将该函数添加到调用栈的顶部。
- 当函数执行完成后，JavaScript 引擎会将该函数从调用栈中移除。
#### 任务队列（Task Queue）：
- 任务队列是一个 FIFO（先进先出）的结构，用于存储待执行的异步任务
- 常见的异步任务包括 setTimeout、setInterval、Promise 回调、DOM 事件处理等
- 当异步任务完成后，其回调函数会被添加到任务队列中。
#### 宏任务 &I
- setTimeout/setInterval
- I/O 操作 (例如文件读取、网络请求)
- UI 渲染
- 用户交互事件 (例如 click, scroll)
- 网络请求
## 浏览器白屏 &I
### FCP
- 首次内容绘制 (FCP, First Contentful Paint):（用户从看到白屏到看到页面上出现第一个元素的时间）
  - 浏览器首次渲染任何文本、图像、非空白 Canvas 或 SVG 的时间点
  - 这是用户第一次在屏幕上看到内容的时间，是衡量白屏时间的重要指标
  - 首次有意义的绘制时间控制在 1.8 秒或更短的时间
### LCP
- 最大内容绘制 (LCP, Largest Contentful Paint):（相对于用户首次导航到网页的时间）
  - 视口中最大的可见元素完成渲染的时间点。
  - LCP 提供了页面主要内容加载速度的感知。
  - 网站应尽量将 Largest Contentful Paint 控制在 2.5 秒或更短的时间内
- 首次有效绘制 (FMP, First Meaningful Paint):（这些指标很复杂、难以解释，并且经常出错，无法确定网页的主要内容何时加载完毕。）
  - 页面主要内容对用户可见并可交互的时间点。
  - 这个指标比较主观，难以自动测量，但更贴近用户感知的“可用”时间。
### TTFB
- Time to First Byte
- 浏览器接收到服务器响应的第一个字节的时间。
- TTFB 受网络延迟和服务器响应速度的影响，是优化白屏时间的基础。
- 大多数网站应力求 TTFB 不超过 0.8 秒
- 请求阶段的总和
  - 重定向时间
  - Service Worker 启动时间（如果适用）
  - DNS 查找
  - 连接和 TLS 协商
  - 请求，直到响应的第一个字节到达
### CLS
- Cumulative Layout Shift
- CLS 用于衡量在网页的整个生命周期内发生的每一次意外布局偏移的布局偏移得分的最高累计分数。
- 网站应尽力使 CLS 得分不高于 0.1。
- 布局偏移得分 = 影响百分比 * 距离百分比
### INP
- Interaction to Next Paint
- 通过观察用户访问网页期间发生的所有点击、点按和键盘互动的延迟时间，评估网页对用户互动的总体响应情况。
- INP 低于或等于 200 毫秒表示网页响应速度良好。
### 其他
- DCL(DOM Content Loaded)：指标衡量的是浏览器解析 HTML 文档并构建 DOM (Document Object Model) 树所需的时间。
- onDomReady/DOMContentLoaded：当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件就会被触发。
- onLoad：当整个页面及所有依赖资源（例如图片、CSS 文件、JavaScript 文件）都完全加载完成之后，load 事件就会被触发。
- 这些api对于性能优化，有时候并不符合用户预期，仅做了解
### web-vitals
  ```js
  // web-vitals
  import {onFCP,onLCP,onTTFB,onCLS} from 'web-vitals';
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
  onCLS(console.log);
  ```
- 参考：
  - [以用户为中心的效果指标](https://web.dev/articles/user-centric-performance-metrics?hl=zh-cn)
  - [FCP](https://web.dev/articles/fcp?hl=zh-cn)
  - [LCP](https://web.dev/articles/lcp?hl=zh-cn)
  - [TTFB](https://web.dev/articles/ttfb?hl=zh-cn)
  - [CLS](https://web.dev/articles/cls?hl=zh-cn)
  - [INP](https://web.dev/articles/inp?hl=zh-cn)
  - [web-vitals](https://github.com/GoogleChrome/web-vitals)
  - [CrUX（Chrome 用户体验报告）](https://developer.chrome.com/docs/crux?hl=zh-cn)
## V8
### array的底层怎么实现

- 1. 动态数组
  - JavaScript 数组是一种动态数组，这意味着它们的大小可以根据需要自动调整.
  - 动态数组通常在内存中分配一块连续的空间，用于存储数组元素。
  - 当数组元素数量超过当前分配的空间时，需要重新分配更大的空间，并将原有元素复制到新的空间中。这个过程可能会导致性能损耗。
- 2. 连续内存 vs. 非连续内存
  - 连续内存: 在某些情况下，如果数组中的元素类型相同（例如，都是数字），JavaScript 引擎可能会尝试使用连续的内存空间来存储数组元素。这样做可以提高访问效率，因为可以通过简单的地址计算来访问数组中的任何元素.
  - 非连续内存: 如果数组中的元素类型不同（例如，同时包含数字、字符串和对象），或者由于其他原因无法使用连续内存，JavaScript 引擎可能会使用非连续的内存空间来存储数组元素。在这种情况下，数组实际上是一个存储指针（或引用）的数组，每个指针指向一个实际的元素。

- 3. 稀疏数组
  - JavaScript 数组可以是稀疏的，这意味着数组中的元素不一定是连续的。例如，可以创建一个长度为 10 的数组，但只在索引 0 和 9 的位置存储元素。
  - 稀疏数组的实现通常使用哈希表或其他数据结构来存储实际存在的元素，而不是为所有可能的索引都分配内存空间.
  - 当访问稀疏数组中不存在的元素时，会返回 undefined

- 4. V8 引擎的实现
  - V8 是 Chrome 和 Node.js 使用的 JavaScript 引擎。V8 引擎对数组的实现进行了一些优化： 
  - 快数组 (Fast Arrays): 当数组只包含特定类型的元素（如 SMI，即 Small Integer）时，V8 会使用快数组。快数组使用连续的内存空间存储元素，访问效率很高.
  - 慢数组 (Slow Arrays): 当数组包含多种类型的元素，或者数组变得稀疏时，V8 会将数组转换为慢数组。慢数组使用哈希表存储元素，访问效率相对较低.
  - 转换: V8 引擎会根据数组的使用情况，在快数组和慢数组之间进行动态转换。

```js
// 连续内存 (快数组)
const arr1 = [1, 2, 3, 4, 5]; // 引擎可能会使用连续的内存空间存储这些数字
// 非连续内存 (慢数组)
const arr2 = [1, 'hello', { name: 'Alice' }]; // 引擎可能会使用非连续的内存空间存储这些不同类型的元素
// 稀疏数组
const arr3 = [];
arr3[0] = 1;
arr3[9] = 10; // 引擎可能会使用哈希表存储这些元素
console.log(arr3[5]); // 输出: undefined
```
### Array.prototype.sort()怎么实现的
- 实现
  - 取决于js引擎的实现
- 实现算法：
  - 快速排序 (Quick Sort): 一种高效的排序算法，但不是稳定的
  - 归并排序 (Merge Sort): 一种稳定的排序算法，但通常比快速排序慢。
  - 插入排序 (Insertion Sort): 对于小数组或基本有序的数组，插入排序可能比快速排序或归并排序更快。
  - Timsort: 一种混合排序算法，结合了归并排序和插入排序的优点。
- 稳定性
  - 定义: 排序算法的稳定性是指，如果数组中存在多个具有相同值的元素，排序后这些元素的相对顺序是否保持不变。
  - 不稳定的排序算法: 可能会改变相同值元素的相对顺序。
  - 稳定的排序算法: 始终保持相同值元素的相对顺序。
- Array.prototype.sort() 的稳定性在不同的 JavaScript 引擎中可能不同：
  - 早期版本:
    - 早期版本的 JavaScript 引擎（如 V8 引擎在 Chrome 70 之前）通常使用不稳定的快速排序算法。
    - 这意味着在这些引擎中，Array.prototype.sort() 是不稳定的。
  - 较新版本:
    - 较新版本的 JavaScript 引擎（如 V8 引擎在 Chrome 70 之后、Mozilla Firefox）通常使用稳定的 Timsort 或归并排序算法。
    - 这意味着在这些引擎中，Array.prototype.sort() 是稳定的。
- 为什么快速排序不稳定？
  - 交换操作: 快速排序通过不断地将数组划分为较小的子数组，并交换元素来实现排序。在划分过程中，可能会将相同值的元素的相对位置发生改变。
  - 示例: 考虑以下数组：`[2, 1, 2, 3]`
  - 假设选择第一个元素 2 作为基准值。在划分过程中，可能会将第二个 2 交换到第一个 2 的前面，从而改变它们的相对顺序。
- 如何稳定
  - 使用稳定的排序算法: 如果 JavaScript 引擎使用不稳定的排序算法，可以自己实现一个稳定的排序算法（如归并排序）。
  - 添加辅助信息: 可以为数组中的每个元素添加一个唯一的索引，然后在排序时，如果两个元素的值相同，则根据它们的索引进行排序。
  ```js
  // 使用归并排序实现稳定排序
  function stableSort(arr, compareFn) {
    if (arr.length <= 1) {
      return arr.slice(); // 返回数组的副本
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const sortedLeft = stableSort(left, compareFn);
    const sortedRight = stableSort(right, compareFn);

    return merge(sortedLeft, sortedRight, compareFn);
  }

  function merge(left, right, compareFn) {
    const result = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (compareFn(left[i], right[j]) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
  // 示例用法
  const arr = [
    { value: 2, index: 0 },
    { value: 1, index: 1 },
    { value: 2, index: 2 },
    { value: 3, index: 3 },
  ];
  const sortedArr = stableSort(arr, (a, b) => a.value - b.value);
  console.log(sortedArr);
  // 输出:
  // [
  //   { value: 1, index: 1 },
  //   { value: 2, index: 0 },
  //   { value: 2, index: 2 },
  //   { value: 3, index: 3 }
  // ]
  ```
