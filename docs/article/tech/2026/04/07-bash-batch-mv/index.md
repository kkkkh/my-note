---
title: bash 批量修改脚本
date: 2026-04-07 10:00
tags:
  - linux
  - command
---
# bash 批量修改脚本
## 文件结构改变

- 旧：2026-01-01-js-stream/index.md
- 新：2026/01/01-js-stream/index.md

<<< ./bash.sh

- `${var#pattern}`：从左往右删除最短匹配
- `${var##pattern}`：从左往右删除最长匹配
- `${var%pattern}`：从右往左删除最短匹配
- `${var%%pattern}`：从右往左删除最长匹配