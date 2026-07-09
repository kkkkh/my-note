<script setup lang="ts">
import { computed } from 'vue'
import TagTreeNode from './TagTreeNode.vue'

interface Post {
  tags?: string[]
}

interface TagNode {
  name: string
  count: number
  children: TagNode[]
}

const { posts = [] } = defineProps<{
  posts?: Post[]
}>()

function buildTagTree(list: Post[]): TagNode[] {
  type MutableNode = { name: string; count: number; children: Map<string, MutableNode> }
  const root = new Map<string, MutableNode>()

  for (const { tags } of list) {
    let level = root
    for (const tag of tags ?? []) {
      if (!level.has(tag)) {
        level.set(tag, { name: tag, count: 0, children: new Map() })
      }
      const node = level.get(tag)!
      node.count += 1
      level = node.children
    }
  }

  const toArray = (m: Map<string, MutableNode>): TagNode[] =>
    [...m.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .map(n => ({
        name: n.name,
        count: n.count,
        children: toArray(n.children),
      }))

  return toArray(root)
}

const tree = computed(() => buildTagTree(posts))
</script>

<template>
  <ul v-if="tree.length" class="tag-tree tag-tree--root">
    <TagTreeNode :nodes="tree" />
  </ul>
</template>

<style scoped lang="scss">
.tag-tree--root {
  list-style: none;
  margin: 0 0 16px;
  padding: 10px 12px;
  background: #f5f5f5;
}
</style>
