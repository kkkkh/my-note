<template>
  <div ref="barChart" width="100%" height="300px" style="width: 100%; height: 300px;" />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getOption } from '../option/bar'


const barChart = ref(null)
const getRadomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


onMounted(() => {
  test()
})

const test = () => {
  const echartInstance = echarts.init(barChart.value, null, { renderer: 'svg' })
  const option = getOption(
    ['随机label111', '随机label222', '随机label333', '随机label444', '随机label555', '随机label666', '随机label777', '随机label888', '随机label999', '随机label1000'],
    [getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100)],
    ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'] // 柱状图上部位置展示label
  )
  echartInstance.setOption(option, true)
}
defineExpose({
  test
})

</script>
