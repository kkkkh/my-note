<template>
  <div class="container">
    <div ref="divContainer" class="container-div"></div>
    <svg
      ref="svgContainer"
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    ></svg>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const divContainer = ref(null)
const svgContainer = ref(null)

onMounted(() => {
  // 创建 SVG rect 元素
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('width', 100)
  rect.setAttribute('height', 100)
  rect.setAttribute('fill', '#000')
  svgContainer.value.appendChild(rect)

  // 创建 HTML div 元素
  const ele = document.createElementNS('http://www.w3.org/1999/xhtml', 'div')
  ele.setAttribute('class', 'div')
  divContainer.value.append(ele)
})
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  align-items: center;
}
.container-div {
  width: 100px;
  height: 100px;
  background-color: aqua;
  margin-right: 10px;
}
</style>
