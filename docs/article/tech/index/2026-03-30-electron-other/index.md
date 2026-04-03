---
title: electron 实践 - 日志
date: 2026-03-30
tags:
  - front-end
  - OtherEnd
  - electron
---
# electron 实践 - 日志
## electron-log

- level

| 级别            | 含义       |
| ------------- | -------- |
| error         | 严重错误     |
| warn          | 警告       |
| info          | 普通重要信息   |
| verbose/debug | 更详细调试信息  |
| silly         | 最啰嗦，几乎全打 |

- electron-log 在主进程默认会把日志写到这些位置：
  - Windows：`%USERPROFILE%\AppData\Roaming\{app name}\logs\main.log`
  - macOS：`~/Library/Logs/{app name}/main.log`
  - Linux：`~/.config/{app name}/logs/main.log`

- 轮转
  - main.log 写满
  - 旧的变成 main.old.log
  - 新的继续写 main.log
