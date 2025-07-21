export const getOption = (xAxisData = [], seriesData = [], labelData = []) => {
  return {
    title: {
    },
    tooltip: {
      trigger: 'axis',
    },
    calculable: true,
    grid: {
      top: '20%',
      bottom: '50px',
      left: '5%',
      right: '5%',
    },
    xAxis: [
      // x轴
      {
        type: 'category',
        data: xAxisData,
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
          fontSize: 10,
          /*
            x轴 label 超出范围...展示
            设置下边三个属性：width、overflow、ellipsis
            grid.bottom 控制label的展示区域的大小
          */
          width: 50, // 标签宽度
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
          symbol: 'image://', // 设置为image://，默认背景没有图案和北京
          symbolSize: 10,
          label: {
            color: '#bcd2ff',
            show: true,
            position: 'top',
            formatter: '{c}', // 显示数值
          },
          data: seriesData.map((item, index) => ({
            value: item,
            coord: [index, item], // 展示位置，x轴和y轴的值
          })),
        },
        itemStyle: {
          borderRadius: [12, 12, 0, 0],
        },
      },
    ],
  }
}
