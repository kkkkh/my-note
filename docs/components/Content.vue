<script setup lang="ts">
interface Props {
  posts?: {url:string,title:string,date:{string:string,time:number}}[]
}
const { posts = [] } = defineProps<Props>()
import { withBase } from 'vitepress'
</script>
<template>
  <ul>
    <li v-for="post of posts">
      <a :href="withBase(post.url)">{{ post.title }}</a> 
      <span class="date">{{ post.date.string }}</span>
    </li>
  </ul>
</template>


<style scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.date {
  color: #7a7a7a;
  font-size: 14px;
}
</style>
