export function getOption(timeData = [], lineData = [], standardUph = null) {
  const graphic =
    timeData.length === 0
      ? [
          {
            type: 'text',
            left: 'center',
            top: '50%',
            z: 1000,
            style: {
              text: '暂无数据',
              textAlign: 'center',
              fill: '#323232', // 设置文本颜色
              fontSize: 14,
            },
          },
        ]
      : []

  return {
    graphic,
    // title: {
    //   text: title,
    // },
    legend: {
      // data: ['inputting', 'outting', '理论UPH'],
      textStyle: {
        color: '#323232',
        fontSize: 14,
      },
    },
    toolbox: {
      show: false,
    },
    calculable: true,
    grid: {
      top: '5%',
      bottom: '30px',
      left: '5%',
      right: '5%',
    },
    xAxis: [
      {
        type: 'category',
        data: timeData,

        axisLine: {
          show: true,
          lineStyle: {
            color: '#323232',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#323232',
          fontSize: 14,
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
            color: '#323232',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#323232',
          show: true,
          fontSize: 14,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      // 多条折线图
      ...lineData.map((item, index) => {
        return {
          name: `${item.a}-${item.b}`,
          type: 'line',
          data: item.data,
          // triggerLineEvent: true,
          smooth: true,
          symbolSize: 10,
          // showSymbol: false,
          // symbol: 'none',
        }
      }),
      // 单独增加一条参考线
      standardUph
        ? {
            name: 'F:标准UPH',
            type: 'line',
            itemStyle: {
              color: 'red',
            },
            markLine: {
              data: [
                {
                  // 设置高度
                  yAxis: standardUph,
                  // 只显示线
                  symbol: 'none',
                },
              ],
              symbol: 'none',
              distance: 40,
              lineStyle: {
                color: 'red',
              },
              label: {
                position: 'end',
                color: 'red',
              },
            },
          }
        : null,
    ],
  }
}
