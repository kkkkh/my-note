---
title: 编辑器（文本标注引擎）实现思路
date: 2026-01-22
---
<script setup>
  import {annotated} from "./base.js"
  import ResRender from "@/components/Render.vue"
  console.log(ResRender)
  const res = annotated('aaa bbb ccc ddd',new Set(['aaa', 'bbb']))
  console.log(res)
</script>

# 实现思路
## 基础场景

- 最初的需求就是 遇到 aaa bbb ccc aaa，第一个aaa高亮，后边的不再高亮
- 使用正则只能实现，满足的是最后一个高亮
- 不使用正则，一次 scan + Set 去重，就可以简单实现
- 专业的做法是：tokenizer → annotate → render（专业级）
  - 分词（tokenize）
  - 标注（annotate）
  - 渲染（render）
- 基础实现

<<< ./base.js

<ResRender :res="res" />

### 需求复杂
- 1、不止是单词高亮，词汇（词组）高亮
- 2、单词与词组混合
- 3、词组与词组混合
- 升级到了 => 文本标注引擎
#### 词汇高亮
