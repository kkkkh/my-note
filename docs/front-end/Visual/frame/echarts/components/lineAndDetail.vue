<template>
  <ChartTest ref="component" :init-option="initOption" :test-option="testOption" :defineEvents="defineEvents" />
</template>
<script setup>
import { getOption, mouseoverHandle,legendHandle } from '../option/lineAndDetail'
import { getRadomNumber } from '@/utils/echarts'
import ChartTest from '@/components/ChartTest.vue'
import Test from "@/utils/test"


const initOption = getOption(
  ['6-11', '6-12', '6-13', '6-14', '6-15'],
  Array.from({ length: 5 }).map((_val, index) => {
    const cur = getRadomNumber(1, 100)
    return {
      a: cur,
      b: index,
      data: Array.from({ length: 5 }).map(() => getRadomNumber(1, 100)),
    }
  }),
  50
)

const defineEvents = [
  {
    name: 'mouseover',
    handle: mouseoverHandle
  },
  {
    name:'legendselectchanged',
    handle: (...params)=> legendHandle(initOption,...params)
  }
]
const testOption = getOption(
  ['6-11', '6-12', '6-13', '6-14', '6-15'],
  Array.from({ length: 5 }).map((_val, index) => {
    const cur = getRadomNumber(1, 100)
    return {
      a: cur,
      b: index,
      data: Array.from({ length: 5 }).map(() => getRadomNumber(1, 100)),
    }
  }),
  50
)

const { component, test } = Test()
defineExpose({
  test
})

</script>
