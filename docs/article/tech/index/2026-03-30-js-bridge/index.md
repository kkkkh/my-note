---
title: JS Bridge 技术对比分析
date: 2026-03-30
tags:
  - front-end
  - js
  - electron
---
# JS Bridge 技术对比分析
## JS Bridge
让 JavaScript 运行环境调用宿主原生能力的一种桥接机制。
## 四类容易混淆的技术
- 浏览器唤起 App
  - 自定义协议/Universal Links/Android Intent
  - `<a href="steam://run/123">打开 Steam</a>`
  - steam://、vscode://、wechat://
- Electron 的桥接
  - Chromium renderer + preload 做桥 + contextBridge + IPC 完成受控调用
- 移动端 WebView 混合开发
  - WebView 本质上是“App 里的嵌入式网页渲染控件”，有浏览器内核能力，但不是一个完整浏览器产品
  - 安卓：WebView 和 addJavascriptInterface()，允许把 Java/Kotlin 对象暴露给 WebView 中的 JS。
  - ios：Apple 官方的 WKWebView 通过 WKScriptMessageHandler 让网页侧 JS 可以向原生发送消息。
- 桌面端 webwiew
  - Qt WebChannel：支持 C++/QML 与 HTML/JS 通信。
  - Microsoft WebView2：支持 web/native interop，并可把 host object 暴露给页面。
  - CEF：支持 JS binding 与进程间消息。
## electron 的优势
- 传统 WebView/CEF/Qt 路线里，JS 能做什么，往往取决于原生封了多少接口。
- Electron 则天然提供 Node.js 和 Electron 桌面 API 体系。
- 以前很多桥都需要开发者自己造；Electron 则内建了 preload、IPC、安全模型和桥接 API。
## 移动端 js bridge
- Capacitor
  - 原生 App + WebView + JS Bridge
- Tauri 2
  - 桌面宿主 + WebView + Rust command bridge（本来）
  - v2 增加支持移动端
