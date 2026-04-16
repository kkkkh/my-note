---
title: nodejs 开发环境集成
date: 2025-07-04 12:00
tags:
  - front-end
  - nodejs
---
# nodejs 开发环境集成
## 开发工具支持
- nodemon / ts-node-dev 支持
- ts-node 不支持 package.json 的 type:module
  
### 参考
- [ts-node](https://typestrong.org/ts-node/docs/) 
- [nodemon](https://github.com/remy/nodemon)
- [ts-node-dev](https://github.com/wclr/ts-node-dev)
## 命令执行
### npm-run-all
- 串行执行
```bash
npm run clean
  && npm run build:css
  && npm run build:js
  && npm run build:html
```
- npm-run-all 简化
```bash
npm-run-all clean build:*
```
-并行执行
```bash
npm-run-all --parallel clean build:*
```
### concurrently & wait-on
- 并行执行
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm run dev2\" \"pnpm run dev1\""
  }
}
```
- 实现串行执行
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm run dev1\" \"wait-on http://localhost:3000 && pnpm run dev2\""
  }
}
```
### 参考
- [concurrently](https://www.npmjs.com/package/concurrently) 并行启动多个命令行
- [npm-run-all](https://www.npmjs.com/package/npm-run-all) 串行/并行执行多个命令
- [wait-on](https://www.npmjs.com/package/wait-on) 等待多个进程启动


## 压缩 / 解压
### 压缩文件

### 解压文件

### 参考
- [archiver](https://www.npmjs.com/package/archiver)  &nbsp; [archiver文档](https://www.archiverjs.com/docs/quickstart)压缩文件
- [extract-zip](https://www.npmjs.com/package/extract-zip) 解压文件