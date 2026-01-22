---
title: 任务队列
date: 2025-06-03
---
# 任务队列 &I
## 实现核心思路
- addTask 添加任务
  - _getShortestLineIndex 获取最短的队列索引
  - return new Promise
    - 声明一个 runTask 来执行task
      - task.then中 调用上Promise的resolve，
      - 并且 执行_next，如果队列有值，则shift 执行，如果没有则，停止
    - 如果 当前队列没有执行，则runTask
    - 如果 当前队列正在执行，则将runTask 添加到队列中
- addTasks 添加多个任务 Array.map 调用addTask

<<< ./index.js

参考：[p-queue](https://github.com/sindresorhus/p-queue)
