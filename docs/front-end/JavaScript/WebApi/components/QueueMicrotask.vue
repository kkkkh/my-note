<template>
  <div>
  </div>
</template>
<script lang="ts" setup>
const test = () => {
  console.log('1')
  queueMicrotask(() => {
    console.log('3')
    queueMicrotask(() => {
      console.log('3-1')
    })
  })
  Promise.resolve().then(() => {
    console.log('4')
    setTimeout(() => {
      console.log('6')
    }, 0)
  }).then(() => {
    console.log('4-1')
  })
  setTimeout(() => {
    console.log('5')
  }, 0);
  console.log('2')
}
defineExpose({
  test
})
</script>
