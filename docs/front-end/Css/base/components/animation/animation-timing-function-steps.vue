<template>
  <div style="margin: 10px 0;">
    <div class="out">
      <div class="jump-start">jump-start</div>
      <div class="start">start</div>
    </div>
    <div class="mark">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="out">
      <div class="jump-end">jump-end</div>
      <div class="end">end</div>
    </div>
    <div class="mark">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="out">
      <div class="jump-none">jump-none</div>
    </div>
    <div class="mark">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="out">
      <div class="jump-both">jump-both</div>
    </div>
    <div class="mark">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="out">
      <div class="step-start">step-start</div>
      <div class="step-end">step-end</div>
    </div>
    <div class="mark">
      <div></div>
    </div>
  </div>
</template>

<style  scoped>
.out div {
  width: 0px;
  height: 30px;
  border: 1px solid black;
  background-color: aquamarine;
  animation: 10s ease-in 0s infinite normal running widthChange;
  white-space: nowrap;
}
@keyframes widthChange {
  from {
    background-color: aquamarine;
    width: 0;
  }
  to {
    width: 100%;
    background-color: blueviolet;
  }
}
/* 0%、20%、40%、60%、80%、100%（5份）*/
/* 20%(开始)、40%、60%、80%、100%(结束) */
.out .jump-start {
  animation-timing-function: steps(5, jump-start);
}
/* 0%、20%、40%、60%、80%、100%（5份）*/
/* 0%(开始)、20%、40%、60%、80%(结束) */
.out .jump-end {
  animation-timing-function: steps(5, jump-end);
}
/* 0%、25%、50%、75%、100%（4份）*/
/* 0%(开始)、25%、50%、75%、100%（结束) */
.out .jump-none {
  animation-timing-function: steps(5, jump-none);
}
/* 0%、16.66%、33.33%、50%、76.66%、83.33%、100%（6份）*/
/* 16.66%(开始)、33.33%、50%、76.66%、83.33%（结束) */
.out .jump-both {
  animation-timing-function: steps(5, jump-both);
}
/* 等同于 jump-start*/
.out .start {
  animation-timing-function: steps(5, start);
}
/* 等同于 jump-end*/
.out .end {
  animation-timing-function: steps(5, end);
}
/* 等同于 steps(1, jump-start) */
.out .step-start {
  animation-timing-function: step-start;
}
/* 等同于 steps(1, jump-end) */
.out .step-end {
  animation-timing-function: step-end;
}
.mark {
  width: 100%;
  display: flex;
}
.mark div {
  flex: 1 1 0%;
  border-top: 1px solid red;
  border-right: 1px solid red;
  height: 10px;
}
</style>
