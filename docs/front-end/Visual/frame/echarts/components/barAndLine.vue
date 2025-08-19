<template>
  <ChartTest ref="component" :init-option="initOption" :test-option="testOption" />
</template>
<script setup>
import { getOption } from '../option/barAndLine'
import { getRadomNumber } from '@/utils/echarts'
import ChartTest from '@/components/ChartTest.vue'
import Test from "@/utils/test"

const getOptionData = () => getOption(
  ['6-10', '6-11', '6-12', '6-13', '6-14', '6-15', '6-16', '6-17', '6-18', '6-19',],
  Array.from({length:10}).map(()=>getRadomNumber(1, 100)),
  ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
  [1, 3, 3, 4, 54, 65, 6, 5, 6, 7, 8]
)
const initOption = getOptionData()

const testOption = getOptionData()

const {component, test} = Test()
defineExpose({
  test
})

</script>
