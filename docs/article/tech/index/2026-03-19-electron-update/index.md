---
title: electron 实践 - 更新
date: 2026-03-19
tags:
  - front-end
  - OtherEnd
  - electron
---
# electron 实践 - 更新
## electron 增量更新
### 自定义更新-硬替换实现
- 实现思路
  - 打包
    - electron-builder.config.js 中 asar 设置为false
    - npm run build && electron-builder --win 文件打包到到win-unpacked/resources/app
    - 对 win-unpacked/resources 进行压缩 `{version}.zip`
    - 对 setup.exe 进行压缩 `{version}-setup.zip`
  - 更新
