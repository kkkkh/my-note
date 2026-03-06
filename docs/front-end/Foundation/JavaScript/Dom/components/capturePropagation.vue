<template>
  <div ref="div1" @click="handleClick1" class="div1">
    div1
    <div ref="div2" @click="handleClick2" class="div2">
      div2
      <div ref="div3" @click="handleClick3" class="div3">Click div3</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// 获取元素引用
const div1 = ref(null)
const div2 = ref(null)
const div3 = ref(null)

const test = ()=>{
  div1.value.addEventListener(
    'click',
    (e) => {
      e.stopPropagation()
      debugger
    },
    true // 捕获阶段
  )
  // div2
  div2.value.addEventListener(
    'click',
    (e) => {
      e.stopPropagation()
      debugger
    },
    true
  )
  // div3
  div3.value.addEventListener(
    'click',
    (e) => {
      e.stopPropagation()
      debugger
    },
    true
  )
}
// 捕获阶段事件处理
onMounted(() => {
  // div1
  test()
})

// 冒泡阶段事件处理（可选，和原生一致）
function handleClick1(event) {
  debugger
  console.log('div1 clicked')
}
function handleClick2(event) {
  debugger
  // event.stopPropagation(); // 阻止事件从 div2 继续冒泡
}
function handleClick3(event) {
  debugger
  // event.stopPropagation(); // 阻止事件从 div3 继续冒泡
}
</script>
<style lang="scss" scoped>
div {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}
.div1 {
  width: 300px;
  height: 300px;
  background-color: rgb(24, 128, 67);

}
.div2 {
  width: 200px;
  height: 200px;
  background-color: rgb(17, 90, 48);
}
.div3 {
  width: 100px;
  height: 100px;
  background-color: rgb(12, 61, 32);
}
</style>
