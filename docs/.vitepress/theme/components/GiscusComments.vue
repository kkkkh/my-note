<script setup lang="ts">
import Giscus from '@giscus/vue';
import { useData } from 'vitepress'

const { isDark, frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.comment !== false" style="margin-top: 32px;">
    <Giscus
      id="comments"
      repo="kkkkh/my-note"
      repoId="R_kgDOMcawfQ"
      category="Announcements"
      categoryId="DIC_kwDOMcawfc4C3zhP"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>