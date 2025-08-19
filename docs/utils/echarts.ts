import * as echarts from 'echarts'
import { ref } from 'vue'

export const getRadomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function Chart(mouseoverHandle: () => void) {
  let echartInstance: echarts.ECharts | null = null
  const chart = ref(null)

  const init = (chart: HTMLElement, option: any) => {
    echartInstance = echarts.init(chart, null, { renderer: 'svg' })
    echartInstance.setOption(option, true)
    if (mouseoverHandle) {
      this.echartInstance.on('mouseover', mouseoverHandle)
    }
  }

  const test = (option: any) => {
    echartInstance.clear()
    echartInstance.setOption(option, true)
  }

  return {
    echartInstance,
    init,
    test,
    chart,
  }
}
export default Chart
