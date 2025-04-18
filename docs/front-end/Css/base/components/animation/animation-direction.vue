<template>
  <div>
    <p>
      animation-direction
      设置动画是应正向播放、反向播放还是在正向和反向之间交替播放
    </p>
    <!-- 为了不产生视觉错觉，可以逐个打开对比 -->
    <div class="div2-1">normal</div>
    <div class="div2-2">reverse</div>
    <div class="div2-3">alternate</div>
    <div class="div2-4">alternate-reverse</div>
  </div>
</template>

<style scoped>
.div2-1,
.div2-2,
.div2-3,
.div2-4 {
  width: 100px;
  height: 100px;
  margin: 10px 0;
  /* background-color: brown; */
}

p {
  background-color: burlywood;
}

[class|="div2"]:hover {
  animation-play-state: paused;
}

.div2-1 {
  animation: 2s ease-in 0s infinite normal both running slidein;
}

.div2-2 {
  animation: 2s ease-in 1s infinite reverse both running slidein;
}

.div2-3 {
  animation: 2s ease-in 1s infinite alternate both running slidein;
}

.div2-4 {
  animation: 2s ease-in 1s infinite alternate-reverse both running slidein;
}

@keyframes slidein {
  from {
    margin-left: 10%;
    background-color: brown;
  }
  to {
    margin-left: 80%;
    background-color: yellowgreen;
  }
}
</style>
