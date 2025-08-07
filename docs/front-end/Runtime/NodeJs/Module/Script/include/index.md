<script setup>
  /**
   * ./include/index.data.js
   * 这里多添加./include
   * 是因为include/index.md被Script./index.md引入
   * index.data.js是相对Script./index.md 而言的
   */
  import { data } from '@/front-end/Runtime/nodejs/Module/Script/include/index.data.js'
</script>

<div v-for="i in data">
{{i}}
</div>
