---
outline: deep
---
# front-end
<script setup>
import { data as posts } from './index.data.mts'

import Content from '@/components/Content.vue'
</script>

<Content :posts="posts" />
