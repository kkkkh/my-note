---
title: electron 实践 - 内嵌 webview
date: 2026-03-15
tags:
  - front-end
  - OtherEnd
  - electron
---
# electron 实践 - 内嵌 webview

- new BrowserWindow 配置开启

<<< @/submodule/play-electron/src/main/index.ts#main-BrowserWindow{10}

- vite 配置：webiew 非自定义元素

<<< @/submodule/play-electron/electron.vite.config.ts#vite-webview{5}

- vue组件中 `<webview>`元素配置，src 配置外部链接，preload 同时注入

<<< @/submodule/play-electron/src/renderer/src/components/Webview.vue#webviewRef{5,7}

- 外部链接中 `http://.../files/index.html` 调用electron主进程

<<< @/submodule/play-electron/src/renderer/src/files/index.html#ipcRenderer{3 js}