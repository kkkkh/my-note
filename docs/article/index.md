---
outline: deep
---

<script setup>
import { data as recordsPosts } from './records/index.data.mts'
import { data as techPosts } from './tech/index.data.mts'
import Content from '@/components/Content.vue'
</script>

<div class="article-main">
  <main>
    <h1>技术</h1>
    <Content :posts="techPosts" />
  </main>
  <main>
    <h1>随笔</h1>
    <Content :posts="recordsPosts" />
  </main>
  <!-- <main></main> -->
</div>

<style lang="scss">
.article-main{
  display:flex;
  justify-content: space-between;
  main{
    flex:1
  }
}
</style>
