---
outline: deep
title: 函数顺序调用
date: 2025-07-04
---
# 函数顺序调用
## 需求场景
- 需要按照顺序调用多个函数，并且每个函数都需要等待前一个函数执行完成后再执行
- 如果前一个函数执行成功（返回 true），继续执行下一个函数，否则（返回 false），后续函数不再执行
- 并且同时支持同步和异步函数
## 实现方式

- 使用 for 循环，依次执行每个函数，使用 await 继发执行 (Unexpected `await` inside a loop.eslintno-await-in-loop )

<<< ./index.ts#for-await

- 使用 Promise.all 并发执行多个函数（无法控制每个函数的执行顺序）

<<< ./index.ts#promise-all

- 使用 reduce 处理 继发处理

<<< ./index.ts#reduce-await

- 使用生成器, yield 继发处理，while循环 (Unexpected `await` inside a loop.eslintno-await-in-loop)

<<< ./index.ts#generator-yield-while

- 使用生成器, yield 继发处理，递归函数

<<< ./index.ts#generator-yield-recursive
