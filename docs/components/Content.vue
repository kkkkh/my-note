<script setup lang="ts">
interface Props {
  posts?: {url:string,title:string,date:{string:string,time:number},tags:string[]}[]
}
const { posts = [] } = defineProps<Props>()
import { withBase } from 'vitepress'

</script>
<template>
  <ul class="post">
    <li class="post-item" v-for="post of posts">
      <div class="post-title">
        <a :href="withBase(post.url)" class="post-title-link">{{ post.title }}</a>
      </div>
      <div class="post-sub">
        <div class="post-tags" v-if="post.tags.length > 0">
          <span v-for="tag of post.tags" :key="tag">{{ tag }}</span>
        </div>
          <span class="post-date">{{ post.date.string }}</span>
        </div>
    </li>
  </ul>
</template>


<style scoped lang="scss">
.post{
  padding-left:0;
}
.post-item {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  &:hover {
    background-color: #f0f0f0;
    .post-title-link {
      color: #494944;
    }
  }
  gap: 4px;
  padding: 10px;
}
.post-title-link {
  color: #57564F;
  // text-decoration: none;
}
.post-sub {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  span{
    display: block;
    background-color: #7A7A73;
    color: #fff;
    font-size: 10px;
    padding: 0 4px;
    height: 18px;
    line-height: 18px;
    &:hover {
      cursor: pointer;
      background-color: #57564F;
    }
  }
}
.post-date {
  line-height: 16px;
  color: #7a7a7a;
  font-size: 12px;
}
</style>
