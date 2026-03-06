<style scoped>
@keyframes widthChange {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}
.item {
  width: 0px;
  height: 30px;
  border: 1px solid black;
  background-color: aquamarine;
  animation: 10s ease-in 1s infinite normal running widthChange;
  white-space: nowrap;
}
.ease {
  animation-timing-function: ease;
}

.easein {
  animation-timing-function: ease-in;
}

.easeout {
  animation-timing-function: ease-out;
}

.easeinout {
  animation-timing-function: ease-in-out;
}

.linear {
  animation-timing-function: linear;
}

.cb {
  animation-timing-function: cubic-bezier(0.2, -2, 0.8, 2);
}


</style>
<template>
  <div class="container">
    <div class="item ease">ease</div>
    <div class="item easein">easein</div>
    <div class="item easeout">easeout</div>
    <div class="item easeinout">easeinout</div>
    <div class="item linear">linear</div>
    <div class="item cb">cb</div>
  </div>
</template>
