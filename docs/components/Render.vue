<template>
  <span v-html="resMd" lang="js">
  </span>
</template>
<script lang="ts" setup>
import {computed } from "vue"
import markdownit from 'markdown-it'
import hljs from 'highlight.js'
// import { createHighlighter  } from 'shiki'
import 'highlight.js/styles/atom-one-dark.css'
const props = defineProps<{
  res: any
}>()

// Actual default values
const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// async function createMarkdownItWithShiki(theme = 'github-light') {
//   // 异步创建 Shiki 实例
//   const highlighter = await createHighlighter({
//     themes: [theme],
//     langs: [] // 空数组表示按需加载语言
//   })

//   const md = new markdownit({
//     highlight(code, lang) {
//       try {
//         // 交给 Shiki 渲染 HTML
//         return highlighter.codeToHtml(code, {
//           lang: lang || '',
//           theme
//         })
//       } catch (e) {
//         // fallback: 普通转义
//         return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`
//       }
//     }
//   })

//   return md
// }

// createMarkdownItWithShiki('github-dark')

function escapeFence(str) {
  return str.replace(/```/g, '``\\`')
}

const resMd = computed(()=>{
  if(Array.isArray(props.res)){
    const code = props.res
      ?.map(item => escapeFence(JSON.stringify(item)))
      .join('\n')
    const jscode = [
      '```js',
      code ?? '',
      '```'
    ].join('\n')
    return md.render(jscode)
  }else{
    return md.render(props.res)
  }
})
</script>
