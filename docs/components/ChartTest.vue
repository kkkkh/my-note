<template>
  <div ref="chart" width="100%" height="300px" style="width: 100%; height: 300px;" />
</template>
<script setup>
import { onMounted } from 'vue'
import echarts from '@/utils/echarts'

const {initOption,testOption,mouseoverHandle} = defineProps({
  initOption:{type:Object,},
  testOption:{type:Object,},
  mouseoverHandle:{type: Function}
})

onMounted(() => {
  init()
})
const { init: chartInit, test: chartTest, chart } = echarts(mouseoverHandle)

const init = () => {
  chartInit(chart.value, initOption)
}

const test = () => {
  chartTest(testOption)
}
defineExpose({
  test
})

</script>
