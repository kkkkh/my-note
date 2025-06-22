<template>
  <div>
    <div
      v-for="n in 2"
      :key="n"
      class="box"
    ></div>
    <div>
      <div ref="example1" id="example1"></div>
      <div ref="example2" id="example2"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const example1 = ref(null)
const example2 = ref(null)

let io = null
let io2 = null

onMounted(() => {
  io = new IntersectionObserver((entries) => {
    console.log(1, entries)
  })
  io2 = new IntersectionObserver((entries) => {
    console.log(2, entries)
  })
  if (example1.value) io.observe(example1.value)
  if (example2.value) io2.observe(example2.value)
})

onBeforeUnmount(() => {
  if (io && example1.value) io.unobserve(example1.value)
  if (io2 && example2.value) io2.unobserve(example2.value)
  io && io.disconnect()
  io2 && io2.disconnect()
})
</script>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  margin: 10px;
  background-color: aqua;
}
#example1,
#example2 {
  width: 100px;
  height: 100px;
  margin: 10px;
  background-color: blueviolet;
}
</style>
