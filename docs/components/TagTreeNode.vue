<script setup lang="ts">
import TagTreeNode from './TagTreeNode.vue'

interface TagNode {
  name: string
  count: number
  children: TagNode[]
}

defineProps<{
  nodes: TagNode[]
}>()
</script>

<template>
  <li v-for="node in nodes" :key="node.name" class="tag-tree-node">
    <span class="tag-tree-label">
      <span class="tag-tree-name">{{ node.name }}</span>
      <span class="tag-tree-count">{{ node.count }}</span>
    </span>
    <ul v-if="node.children.length" class="tag-tree">
      <TagTreeNode :nodes="node.children" />
    </ul>
  </li>
</template>

<style scoped lang="scss">
.tag-tree {
  list-style: none;
  margin: 4px 0 0;
  padding-left: 1.1em;
  border-left: 1px solid #ddd;
}

.tag-tree-node {
  margin: 2px 0;
}

.tag-tree-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: #57564f;
}

.tag-tree-name {
  font-weight: 500;
}

.tag-tree-count {
  display: inline-block;
  min-width: 16px;
  padding: 0 5px;
  height: 16px;
  line-height: 16px;
  font-size: 11px;
  color: #fff;
  background: #7a7a73;
  border-radius: 8px;
  text-align: center;
}
</style>
