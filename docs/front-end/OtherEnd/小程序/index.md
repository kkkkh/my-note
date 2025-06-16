---
outline: deep
---

# 小程序
## 设计思路 &I
1、类原生体验
- 预加载：提前加载小程序的部分资源，减少启动时间。
- 双线程架构：使用独立的渲染线程和逻辑线程，避免 UI 阻塞。
- 组件化：提供丰富的原生组件，简化开发，优化性能。
2、受限的运行环境
- 为了保证安全性和稳定性，小程序运行在受限的沙箱环境中，无法直接访问设备底层 API
- 小程序只能使用平台提供的 API，不能执行任意代码
3、双线程架构
- 渲染层：解析 WXML 和 WXSS，渲染 UI 界面。
- 逻辑层：运行 JavaScript 代码，处理业务逻辑。
- Bridge：渲染层和逻辑层通过 Bridge 进行通信。
4、生命周期管理
- 应用生命周期：onLaunch、onShow、onHide、onError。
- 页面生命周期：onLoad、onShow、onReady、onHide、onUnload。

#### 旧的参考文档：
- https://www.cnblogs.com/cokolxvd/p/11535134.html
- https://www.jianshu.com/p/87fd129b9fda
- https://developers.weixin.qq.com/community/develop/doc/000a447b4f86608d7848d77f956806
- https://zhuanlan.zhihu.com/p/76013314
- https://juejin.cn/post/6844903933370974215
- https://www.cnblogs.com/ifannie/p/11477254.html
- https://blog.csdn.net/impossible1994727/article/details/100888131
