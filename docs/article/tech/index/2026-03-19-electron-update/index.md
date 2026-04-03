---
title: electron 实践 - 更新
date: 2026-03-19
tags:
  - front-end
  - OtherEnd
  - electron
---
# electron 实践 - 更新
## 自定义更新-硬替换实现
### electron 增量更新
- 打包 build（将build文件，压缩zip）
  - electron-builder.config.js 中 asar 设置为false
  - npm run build && electron-builder --win 文件打包到到win-unpacked/resources/app
  - 对 win-unpacked/resources 进行压缩 `{version}.zip`
- 更新 update（下载最新安装包zip）
  - 获取更新信息：最新版本号
  - 最新版本号 对比 当前版本号，
  - 如果不相同，流下载最新安装包（下载前检查是否已下载），保存到增量版本目录（userData/incremental-files）
- 安装 install（安装）
  - 将程序下 update.exe 拷贝到 userData/ 目录下
  - 对增量 `{version}.zip` 安装包进行解压，解压到程序下待安装 /resourcesbak 目录
  - 执行 update.exe 进程，将当前resource目录压缩到历史版本目录
  - 删除程序下的 /resource目录，将待安装目录/resourcesbak => /resource
  - 重新启动程序
### electron 全量更新
- 打包 build
  - 对打包后 `{version}.exe` 进行压缩 `{version}-all.zip`
- 安装 install（安装）
  - 对 `{version}-all.zip` 安装包进行解压，解压到程序下待安装目录 userData/install/{version}-all.exe
  - 执行 `{version}-all.exe` 安装目录为 process.resourcesPath 目录下
