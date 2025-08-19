export function getOption(timeData = [], inputQuantity = [], realTimeUph = [], standardUph = []) {
  return {
    title: {
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      // 顶部小色块
      textStyle: {
        color: '#bcd2ff',
        fontSize: 18,
      },
    },
    toolbox: {
      show: false,
    },
    calculable: true,
    grid: {
      top: '10%',
      bottom: '30px',
      left: '64px',
      right: '5%',
    },
    xAxis: [
      {
        type: 'category',
        data: timeData,

        axisLine: {
          show: true,
          lineStyle: {
            color: '#bcd2ff',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#bcd2ff',
          fontSize: 18,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#bcd2ff',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#bcd2ff',
          show: true,
          fontSize: 18,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#1D4988',
          },
        },
      },
    ],
    series: [
      {
        name: 'F:投入',
        type: 'bar',
        data: inputQuantity,
        barWidth: 10,
        label: {
          show: true,
          color: '#bcd2ff',
          position: 'top',
          fontSize: 14,
        },
        itemStyle: {
          borderRadius: [10, 10, 10, 10],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(2, 201, 213, 1)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(1, 164, 251, 1)', // 100% 处的颜色
              },
            ],
          },
        },
        barGap: '200%',
      },
      {
        name: 'F:产出',
        type: 'bar',
        data: realTimeUph,
        // yAxisIndex: 1, 如果设置，则这里的数据，与上一数据的不在同一维度
        barWidth: 10,
        label: {
          show: true,
          color: '#bcd2ff',
          position: 'top',
          fontSize: 14,
        },
        itemStyle: {
          borderRadius: [10, 10, 10, 10],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(249, 182, 74, 1)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(248, 100, 0, 1)', // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        name: 'F:理论UPH',
        type: 'line',
        data: standardUph,
        lineStyle: {
          color: '#49FFED',
          width: 2,
        },
        itemStyle: {
          color: '#49FFED',
        },
        smooth: true,
        symbol: 'none',
      },
    ],
  }
}
