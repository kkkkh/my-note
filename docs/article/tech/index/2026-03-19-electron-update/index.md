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
  - 打包 build（将build文件，压缩zip）
    - electron-builder.config.js 中 asar 设置为false
    - npm run build && electron-builder --win 文件打包到到win-unpacked/resources/app
    - 对 win-unpacked/resources 进行压缩 `{version}.zip`
    - 对 setup.exe 进行压缩 `{version}-setup.zip`
  - 更新 update（下载最新安装包zip）
    - 获取更新信息：最新版本号
    - 最新版本号 对比 当前版本号，
    - 如果不相同，流下载最新安装包（下载前检查是否已下载），保存到增量版本目录
  - 安装 install（安装）
    - 对zip安装包进行解压，解压到待安装目录
    - 执行update.exe进程，将当前resource目录压缩到历史版本目录
    - 将待安装目录，移动到当前的resource
    - 重新启动程序
