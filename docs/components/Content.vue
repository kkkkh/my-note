<script setup lang="ts">
interface Props {
  posts?: {url:string,title:string}[]
}
const { posts = [] } = defineProps<Props>()
import { withBase } from 'vitepress'
</script>
<template>
  <ul>
    <li v-for="post of posts">
      <a :href="withBase(post.url)">{{ post.title }}</a>
    </li>
  </ul>
</template>
