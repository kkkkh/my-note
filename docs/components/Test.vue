<template>
  <div>
    <component ref="component" :is="props.is" />
    <div class="test-btn">
      <Button @click="handleClick" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { Component } from 'vue'
import Button from './Button.vue'

const props = defineProps<{
  is: Component | string
}>()

const component = ref<any>(null)
const handleClick = () => {
  component.value?.test?.()
}
</script>
<style scoped>
.test-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
