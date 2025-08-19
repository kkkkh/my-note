<template>
  <details :closed="closed">
    <summary class="">{{ title }}</summary>
    <slot></slot>
  </details>
</template>
<script lang="ts" setup>
const { title = '查看代码', closed = true } = defineProps<{ title?: string, closed?: boolean }>()
</script>
<style lang="scss" scoped>
summary {
  text-align: right;
  cursor: pointer;
  font-weight: bold;
  color: var(--vp-home-hero-name-color);
}
</style>
