---
outline: deep
title: 大屏方案
date: 2025-07-29
---
# 大屏方案 &I

## vw、vh 方案

1、按照设计稿的尺寸，将px按比例计算转为vw和vh，sass转换公式

<<< @/submodule/play/packages/vue3/src/assets/styles/bigScreen.scss

2、 vite配置sass.additionalData，全局使用

<<< @/submodule/play/packages/vue3/vite.config.bigScreen.js

3、vue中直接使用

<<< @/submodule/play/packages/vue3/src/components/BigScreen/Index.vue

参考：
- [一次搞懂数据大屏适配方案 (vw vh、rem、scale)](https://juejin.cn/post/7163932925955112996?searchId=202507221002590876F10B9AA440B4C673)
