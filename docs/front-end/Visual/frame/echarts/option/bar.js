export const getOption = (xAxisData = [], seriesData = [], labelData = []) => {
  // 设置默认信息 、 无数据展示
  const graphic =
        xAxisData.length === 0
          ? [
              {
                type: 'text',
                left: '40%',
                top: '28%',
                z: 1000,
                style: {
                  text: '暂无数据',
                  textAlign: 'center',
                  fill: '#bcd2ff', // 设置文本颜色
                  fontSize: 18,
                },
              },
            ]
          : []
  return {
    graphic,
    title: {
    },
    tooltip: {
      trigger: 'axis',
    },
    calculable: true,
    grid: {
      top: '10%',
      bottom: '130px',
      left: '0',
      right: '10%',
    },
    xAxis: [
      // x轴
      {
        type: 'category',
        data: xAxisData,
        height: 100,
          axisLine: {
          show: true,
          lineStyle: {
            color: '#bcd2ff',
          },
        },
        axisTick: {
          // 刻度
          show: false,
        },
        axisLabel: {
          color: '#bcd2ff',
          interval: 0, // 显示所有标签
          rotate: -45,
          fontSize: 18,
          /*
            x轴 label 超出范围...展示
            设置下边三个属性：width、overflow、ellipsis
            grid.bottom 控制label的展示区域的大小
          */
          lineHeight: 130,
          width: 130, // 标签宽度
          overflow: 'truncate', // 超出显示省略号
          ellipsis: '...', // 省略号
        },
      },
    ],
    yAxis: [
      // y轴
      {
        type: 'value',
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
          show: false,
        },
        splitLine: {
          show: false,
        },
        max: Math.max(...seriesData) * 1.1, // 设置y轴顶部的空间
      },
    ],
    series: [
      {
        type: 'bar',
        data: seriesData,
        label: {
          // 柱状图中间位置展示label
          show: true,
          position: 'inside',
          color: '#bcd2ff',
          formatter: (params) => {
            return labelData[params.dataIndex]
          },
        },
        markPoint: {
          // 柱状图顶部位置展示label
          symbol: 'image://', // 设置为image://，默认背景没有图案和背景
          symbolSize: 10,
          label: {
            color: '#bcd2ff',
            show: true,
            position: 'top',
            formatter: '{c}', // 显示数值
            fontSize: 18,
          },
          data: seriesData.map((item, index) => ({
            value: item,
            coord: [index, item], // 展示位置，x轴和y轴的值
          })),
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
            global: false, // 缺省为 false
          },
        },
      },
    ],
  }
}
