---
outline: deep
---
# 技术文章

<script setup>
import { data as posts } from './index.data.mts'
import Content from '@/components/Content.vue'
</script>

<Content :posts="posts" />
