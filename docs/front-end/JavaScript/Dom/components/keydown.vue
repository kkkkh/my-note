<template>
  <div>
    <input ref="inputRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const inputRef = ref(null)

function handleKeydown(e) {
  console.log(e.code)
  console.log(e.key)
  console.log(e.keyCode)
}

onMounted(() => {
  inputRef.value.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  inputRef.value.removeEventListener('keydown', handleKeydown)
})
</script>
