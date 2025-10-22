const svgActive = `
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="12">
    <path d="M2 6 H28" stroke="#ff0000" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round" fill="none"/>
  </svg>`;

const svgInactive = `
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="12">
    <path d="M2 6 H28" stroke="#ccc" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round" fill="none"/>
  </svg>`;

const iconActive = `image://data:image/svg+xml;utf8,${encodeURIComponent(svgActive)}`;
const iconInactive = `image://data:image/svg+xml;utf8,${encodeURIComponent(svgInactive)}`;

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
      data: [...lineData.map((item )=> `${item.a}-${item.b}`),{
        name: '标准',
        icon: iconActive,

      }],
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
            name: '标准',
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


export const mouseoverHandle = (params, echartInstance) => {
  if (params.componentType === 'series' && params.seriesType === 'line') {
    const table = document.createElement('table')
    //  这里也可以使用vue组件，可使用vue extend 实现
    table.innerHTML = `
    <thead>
      <tr>
        <th>name</th>
        <th>value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${params.name}</td>
        <td>${params.seriesName}</td>
      </tr>
    </tbody>
    `
    echartInstance.setOption({
      tooltip: {
        show: true,
        hideDelay: 500,
        confine: true, // 是否限制在图表区域内
        // alwaysShowContent: true,
        // triggerOn: 'click',
        // trigger: 'item',
        enterable: true, // 是否可进入tooltip
        formatter: () => {
          return table
        },
        borderColor: '#f0f0f0',
      },
    })
  } else if (params.componentType === 'markLine') {
    echartInstance.setOption({
      tooltip: {
        show: false,
        hideDelay: 0,
      },
    })
  }
}


export const legendHandle = (option, params,echartInstance)=>{
  const selected = params.selected;
  const newLegendData = option.legend.data.map((item) => {
    if (item.name === '标准') {
      // 根据选中状态切换icon
      item.icon = selected[item.name] ? iconActive : iconInactive;
    }
    return item;
  });
  // option.legend.data = newLegendData;
  echartInstance.setOption({legend:{data:newLegendData}});
}
