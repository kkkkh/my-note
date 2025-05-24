<template>
  <div class="container">
    <p>animation-fill-mode 设置CSS动画在执行之前和之后如何将样式应用于其目标</p>
    <div class="div1-1">none</div>
    <div class="div1-2">backwards 向后</div>
    <div class="div1-3">forwards 向前</div>
    <div class="div1-4">both</div>
  </div>
</template>
<script setup>
</script>
<style scoped>

.container:hover > div {
  /*
    鼠标经过时，没有动画
    鼠标移出，动画恢复
  */
  animation-name: none;
}


.div1-1 {
  animation: 2s ease-in 1s 1 normal running;
}

.div1-2 {
  animation: 2s ease-in 1s 1 normal backwards running;
}

.div1-3 {
  animation: 2s ease-in 1s 1 normal forwards running;
}

.div1-4 {
  animation: 2s ease-in 1s 1 normal both running;
}
.div1-1,
.div1-2,
.div1-3,
.div1-4 {
  width: 100px;
  height: 100px;
  margin: 10px 0;
  background-color: gold;
  animation-name: slidein;
}

p {
  background-color: burlywood;
}



@keyframes slidein {
  from {
    margin-left: 10%;
    background-color: brown;
  }
  to {
    margin-left: 90%;
    background-color: yellowgreen;
  }
}
</style>
