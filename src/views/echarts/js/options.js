// 公共变量
const color = ['#fac858', '#91cc75', '#ee6666', '#666', '#3ba272']
const commonOption = {
  grid: {
    left: '5%',
    right: '5%',
    bottom: '15%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
  },
  toolbox: {
    feature: {
      // dataZoom: {
      //   yAxisIndex: 'none',
      // },
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      show: true,
      interval: 800,
      rotate: 30, // 文字旋转
    },
  },
}

const dataZoom = [
  {
    show: true,
    realtime: true,
    xAxisIndex: [0, 1],
  },
  {
    type: 'inside',
    realtime: true,
    xAxisIndex: [0, 1],
  },
]

const pieces = [
  { value: 0, color: '#FD0100', label: '0：未解出' },
  { value: 1, color: '#fff21a', label: '1：固定解' },
  { value: 2, color: '#fbcc00', label: '2：浮点解' },
  { value: 3, color: '#29a7e1', label: '3：差分解' },
  { value: 5, color: '#93CE07', label: '5：单点解' },
]

const visualMap = {
  // type: 'piecewise',
  // orient: 'horizontal',
  // left: 'center',
  // top: 10,
  // pieces,
  // outOfRange: { color: '#999' },

  min: 0,
  max: 300,
  left: 'right',
  top: 'bottom',
  text: ['高', '低'], //取值范围的文字
  inRange: {
    color: ['#e0ffff', '#006edd'], //取值范围的颜色
  },
  show: true, //图注
}

const yAxis = (str) => {
  if (str) {
    // 侧边增加单位
    return {
      type: 'value',
      name: str,
      nameLocation: 'center',
      nameGap: 30, //与轴线间距
      nameTextStyle: { color: '#ccc' },
    }
  } else {
    return { type: 'value' }
  }
}

const title = (str) => {
  if (str) {
    return { show: true, text: str, x: '80', y: '20' }
  } else {
    return { show: false }
  }
}

// demo option
export const DemoOption = {
  color,
  title: title('标题'),
  ...commonOption,
  dataZoom,
  yAxis: yAxis('速度（m/s）'),
  legend: {
    data: ['俯仰', '横滚', '高程'],
  },
  // visualMap,
  series: [
    {
      name: '俯仰',
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {},
    },
    {
      name: '横滚',
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {},
    },
    {
      name: '高程',
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {},
    },
  ],
}
