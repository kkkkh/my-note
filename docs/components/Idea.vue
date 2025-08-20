<template>
  <span :style="{ color: color, backgroundColor: backgroundColor }">
    <slot />
  </span>
</template>

<script setup>
const {color = "#EFE4D2",backgroundColor = "#254D70"} = defineProps({
  color: String,
  backgroundColor: String
})
</script>
