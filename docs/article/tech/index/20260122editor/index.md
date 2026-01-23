---
title: 编辑器（文本标注引擎）实现思路
date: 2026-01-22
---
<script setup>
  import ResRender from "@/components/Render.vue"
  import {wordAnnotated,phraseAnnotated} from "./index.js"
  // 1
  const wordRes = wordAnnotated('aaa bbb ccc ddd',new Set(['aaa', 'bbb']))
  // // 2
  const phraseRes = phraseAnnotated('aaa bbb ccc ddd', [
    ['aaa'],
    ['aaa', 'bbb'],
    ['aaa', 'bbb', 'ccc'],
    // ['ccc','ddd'],
    ['ddd'],
  ])

</script>

# 实现思路
## 基础场景

- 最初的需求就是 遇到 aaa bbb ccc aaa，第一个aaa高亮，后边的不再高亮
- 使用正则
  - 满足的是最后一个高亮
  - 无法满足第一个aaa高亮
  - 主要是正则无法记录状态
- 不使用正则，一次 scan + Set 去重，就可以简单实现
- 专业的做法是：tokenizer → annotate → render（专业级）
  - 分词（tokenize）
  - 标注（annotate）
  - 渲染（render）
- 基础实现

<<< ./1word.js

<ResRender :res="wordRes" />

## 需求复杂
- 1、也考虑词汇（词组）高亮

<<< ./2phrase.js

<ResRender :res="phraseRes" />

- 2、词组与词组混合（混合交叉）
- 3、单词与词组混合（重叠）
- 升级到了 => 文本标注引擎
### 词汇高亮
