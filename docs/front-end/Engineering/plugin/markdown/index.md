---
outline: deep
---
## markdown 常用
- 删除线（Strikethrough）	\~~The world is flat.~~
## vitepress
### 几种引入代码的方式
1 导入代码片段（推荐）
```markdown
<<< ./index.js#snippet
```
```js
// #region snippet
export function foo (value) {
  ...
}
// #endregion snippet
```
2 引入整个文件
```js
// 导入markdown，整合markdown很有用
`<!--@include: ./****.md-->`
// 导入代码片段不适用
`<!--@include: ./***.js-->`
```
3 使用vue引入（暂不推荐）
```js
// index.js
export function foo (value) {
  ...
}
```
```markdown
<!-- markdown -->
<script setup>
import {foo} from "./index.js"
</script>
<!-- 不是代码片段 -->
<pre><code class="language-javascript">{{ foo.toString() }}</code></pre>
<!-- 代码不高亮 -->
\`\`\`bash-vue
{{ foo }}
\`\`\`
```
参考：[导入代码片段](https://vitepress.dev/zh/guide/markdown#import-code-snippets)


### 动态引入
[vite markdown config](https://vitepress.dev/zh/reference/site-config#markdown)
[Import code snippets as dynamic path  #3334](https://github.com/vuejs/vitepress/issues/3334)
[MarkdownOptions](https://github.com/vuejs/vitepress/blob/main/src/node/markdown/markdown.ts)
场景：
- 动态加载.md文件
解决思路：
- 1、对`<!--@include: (.*?)-->`进行重写覆盖
```js
// vite.config.js
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'vite-plugin-md-include',
      transform(src, id) {
        if (id.endsWith('.md')) {
          return src.replace(/<!--@include: (.*?)-->/g, (match, p1) => {
            const filePath = path.resolve(path.dirname(id), p1.trim());
            if (fs.existsSync(filePath)) {
              return fs.readFileSync(filePath, 'utf-8');
            } else {
              console.warn(`File not found: ${filePath}`);
              return ''; // 如果文件不存在，返回空字符串
            }
          });
        }
      }
    }
  ]
});
```
- 2、动态加载数据，markdown-it解析，vue渲染
- github markdown
```markdown
<!-- 动态加载 github markdown 数据 -->
<script setup>
import { ref, onMounted } from 'vue';
import markdownit from 'markdown-it'
const md = markdownit()
const markdownContent = ref('');
onMounted(async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/nzakas/understandinges6/master/manuscript/00-Introduction.md');
    if (response.ok) {
      const value = await response.text();
      markdownContent.value = md.render(value);
    } else {
      console.error('Failed to fetch markdown file');
    }
  } catch (error) {
    console.error('Error fetching markdown file:', error);
  }
});
</script>
<div v-html="markdownContent"></div>
```
- 本地 markdown
```js
// index.data.js
// 动态加载 本地 markdown 数据
import fs from 'node:fs'
import markdownit from 'markdown-it'
const md = markdownit()
// 在这里可以给 markdownit 添加代码高亮
export default {
  watch: ['./md/*.md'],
  load(watchedFiles) {
    return watchedFiles.sort((pre,next)=>{
      return pre.match(/(\d+)、/)[1] - next.match(/(\d+)、/)[1]
    }).map((file) => {
      return  md.render(fs.readFileSync(file, 'utf-8'))
    })
  }
}
```
```markdown
<!--
1、解析出来的markdown 文档与vitepress基本一致
2、代码片段没有高亮 :可以尝试添加高亮组件
-->
<script setup>
  import { data } from './index.data.js'
</script>

<div v-for="item in data" v-html="item"></div>
```
- 3、动态加载数据，marked解析，vue渲染

```js
import fs from 'node:fs'
export default {
  watch: ['./md/*.md'],
  load(watchedFiles) {
    return watchedFiles.sort((pre,next)=>{
      return pre.match(/(\d+)、/)[1] - next.match(/(\d+)、/)[1]
    }).map((file) => {
      return  fs.readFileSync(file, 'utf-8')
    })
  }
}
```
```markdown
<!-- 
1、marked 解析出来的markdown文档 与vitepress不一致，蓝色文字，theme需要调整
2、增加代码高亮，代码可以高亮，拷贝插件无法显示
3、改在md中解析md，CopyButtonPlugin在nodejs报错，找不到document
 -->
<script setup>
  import { data } from './dp.data.js'
  import hljs from 'highlight.js';
  import { Marked } from "marked";
  import { markedHighlight } from "marked-highlight";
  import CopyButtonPlugin from "highlightjs-copy"
  import javascript from 'highlight.js/lib/languages/javascript';
  import hljsVuePlugin from "@highlightjs/vue-plugin";
  const copyPlugin = new CopyButtonPlugin({
    hook: (text, el) => {
      if (el.dataset.copyright) {
        return `${text}\n\n${el.dataset.copyright}`;
      }
      if (el.dataset.highlight) {
        el.style.filter = "saturate(5)";
      }
      if (el.dataset.replace) {
        return text
          .replace("{{name}}", "Alexander Graham Bell")
          .replace("{{dog}}", "Platypus");
      }
      return text;
    },
  })
  hljs.addPlugin(copyPlugin);
  hljs.highlightAll()
  const highlightjs = hljsVuePlugin.component

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        const val = hljs.highlight(code, { language }).value;
        return val
      }
    })
  );

  const dataHtml = data.map(item=> marked.parse(item))
</script>
<span>1 highlightjs</span>
<highlightjs language="js" code="console.log('Hello World');"></highlightjs>
<span>2 code class="hljs language-js"</span>
<pre><code class="hljs language-js">console.log('Hello world!');</code></pre>
<span>3 code class="hljs language-javascript"</span>
<pre><code class="hljs language-javascript">console.log('Hello world!');</code></pre>

<div v-for="val in dataHtml">
  <code class="hljs-html" v-html="val"></code>
</div>
```

- 4、动态生成文件名称

<<< @/back-end/Lang/NodeJs/Script/include/index.data.js#nodejs-scriprt-include

### vite press 增加标签
- https://github.com/Charles7c/charles7c.github.io
- https://github.com/clark-cui/vitepress-blog-zaun
