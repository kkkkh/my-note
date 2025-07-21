<template>
  <div id="requestAnimationFrame" style="width: 100px; height: 100px; background-color: red;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  test()
})
let num  = 0
const test1 = () => {
  // 多次调用会多次执行 step 回调
  const element = document.getElementById("requestAnimationFrame");
  element.style.transform = `translateX(0px)`;
  let start, previousTimeStamp;
  let done = false;
  num ++
  function step(timestamp) {
    // 多调取的回调，timestamp是相同的
    // 后边计算的位置是相同的
    // 所以显示的element的位置和调取一次test是一样的
    if (start === undefined) {
      start = timestamp;
    }
    console.log(num)
    const elapsed = timestamp - start;
    // console.log(elapsed);
    if (previousTimeStamp !== timestamp) {
      // 这里使用 Math.min() 确保元素在恰好位于 200px 时停止运动
      const count = Math.min(0.1 * elapsed, 200);
      // console.log(count);
      element.style.transform = `translateX(${count}px)`;
      if (count === 200) done = true;
    }

    if (elapsed < 2000) {
      // 2 秒之后停止动画
      previousTimeStamp = timestamp;
      if (!done) {
        window.requestAnimationFrame(step);
      }
    }
  }
  window.requestAnimationFrame(step);
  // const myReq = window.requestAnimationFrame(step);
  // 取消操作使用的是最后一个 requestId
  // cancelAnimationFrame(myReq);
}

const test2 = () => {
  let count = 0
  const start = undefined
  const step = (timestamp)=>{
    if(start === undefined) start = timestamp
    if(timestamp - start < 1000){ // 每隔一秒执行一次 效果代码
      console.log(count++)
    }
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
  
}

const test = () => {
  test1()
  test2()
}
defineExpose({
  test
})
</script>
