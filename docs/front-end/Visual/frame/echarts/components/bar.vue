<template>
  <ChartTest ref="component" :init-option="initOption" :test-option="testOption" />
</template>
<script setup>
import { getOption } from '../option/bar'
import { getRadomNumber } from '@/utils/echarts'
import ChartTest from '@/components/ChartTest.vue'
import Test from "@/utils/test"

const initOption = getOption([],[],[])

const testOption = getOption(
    ['随机label11111111111', '随机label22222222222', '随机label33333333333', '随机label44444444444', 
    '随机label555', '随机label666', '随机label777', '随机label888', '随机label999', '随机label10000000000000'],
    [getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100), getRadomNumber(1, 100)],
    ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'] // 柱状图上部位置展示label
  )

const {component, test} = Test()

defineExpose({
  test
})
</script>
