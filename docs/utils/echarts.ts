import * as echarts from 'echarts'
import { ref } from 'vue'

export const getRadomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

type DefineEventType  = {
  name: string,
  handle: (params: echarts.ECElementEvent, echartInstance: echarts.ECharts) => void
}
function Chart(defineEvents: DefineEventType[] = []) {
  let echartInstance: echarts.ECharts | null = null
  const chart = ref(null)

  const init = (chart: HTMLElement, option: any) => {
    echartInstance = echarts.init(chart, null, { renderer: 'svg' })
    echartInstance.setOption(option, true)

    if (defineEvents.length > 0 ) {
      for(const event of defineEvents) {
        echartInstance.on(event.name, (params:echarts.ECElementEvent)=>event.handle(params, echartInstance))
      }
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
