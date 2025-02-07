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
<!--@include: ./index.js-->
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
