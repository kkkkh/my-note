<template>
  <div style="margin: 10px 0">
    <div class="container">
        replace
        <div id="replace" class="target"></div>
    </div>
    <div class="container">
      add
      <div id="add" class="target"></div>
    </div>
    <div class="container">
      accumulate
      <div id="accumulate" class="target"></div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 200px;
  height: 200px;
  background: cyan;
  display: inline-block;
  text-align: center;
  margin: 10px;
}

.target {
  width: 20px;
  height: 50px;
  background: green;
  border-radius: 10px;
  margin: 20px 0;
}

@keyframes slide {

  20%,
  40% {
    transform: translateX(100px);
    background: yellow;
  }

  80%,
  100% {
    transform: translateX(150px);
    background: orange;
  }
}

.target {
  transform: translateX(30px) rotate(45deg);
  animation: slide 5s linear infinite;
}

.target:hover {
  animation-play-state: paused;
}

#replace {
  /* 将原属性替换到 */
  animation-composition: replace;
}

#add {
  /* 保持原属性状态，再叠加 */
  animation-composition: add;
}

#accumulate {
  /* 将原属性和新属性，计算总值 */
  animation-composition: accumulate;
}
</style>
