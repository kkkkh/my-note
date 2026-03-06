<template>
   <div class="purple-box-info">
    <span>width: 400px;</span>
    <span>height: 200px;</span>
    <span>padding: 20px;</span>
    <span>margin: 50px 60px;</span>
    <span>background: purple;</span>
  </div>
  <div ref="box" class="purple-box"></div>
  <div v-for="(value, key) in rectInfo" :key="key">
    <p>{{ key }} : {{ value }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const box = ref(null)
const rectInfo = ref({})
const test = ()=>{
  if (box.value) {
    const rect = box.value.getBoundingClientRect()
    console.log(rect)
    // 只取非函数属性
    for (const key in rect) {
      if (typeof rect[key] !== 'function') {
        rectInfo.value[key] = rect[key]
      }
    }
  }
}
defineExpose({
  test
})
onMounted(() => {
  test()
})
</script>

<style scoped>
.purple-box {
  width: 400px;
  height: 200px;
  padding: 20px;
  margin: 50px 60px;
  background: purple;
}
.purple-box-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
