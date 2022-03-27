<template>
  <div class="map-container">
    <div class="myEchart" ref="myEchart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/lib/component/markLine'
import chinaMap from './json/china.json' // 引入中国地图数据
import { geoCoord } from './mock'
export default {
  data() {
    return { myEchart: '' }
  },
  mounted() {
    this.myEchart = echarts.init(this.$refs.myEchart)
    echarts.registerMap('china', { geoJSON: chinaMap })
    const option = {
      dataRange: {
        min: 0,
        max: 100,
        calculable: true,
        color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
        textStyle: {
          color: '#fff',
        },
      },
      series: [
        {
          name: '全国',
          type: 'map',
          roam: true,
          hoverable: false,
          mapType: 'china',
          itemStyle: {
            normal: {
              borderColor: 'rgba(100,149,237,1)',
              borderWidth: 0.5,
              areaStyle: {
                color: '#1b1b1b',
              },
            },
          },
          data: [],
          markLine: {
            smooth: true,
            symbol: ['none', 'circle'],
            symbolSize: 1,
            itemStyle: {
              normal: {
                color: '#fff',
                borderWidth: 1,
                borderColor: 'rgba(30,144,255,0.5)',
              },
            },
            data: [],
          },
          markPoint: {
            symbol: 'emptyCircle',
            symbolSize: function (v) {
              return 10 + v / 10
            },
            effect: {
              show: true,
              shadowBlur: 0,
            },
            itemStyle: {
              normal: {
                label: { show: false },
              },
              emphasis: {
                label: { position: 'top' },
              },
            },
            data: [
              { name: '上海', value: 95 },
              { name: '广州', value: 90 },
              { name: '大连', value: 80 },
              { name: '南宁', value: 70 },
              { name: '南昌', value: 60 },
              { name: '拉萨', value: 50 },
              { name: '长春', value: 40 },
              { name: '包头', value: 30 },
              { name: '重庆', value: 20 },
              { name: '常州', value: 10 },
            ],
          },
        },
        {
          name: '北京 Top10',
          type: 'map',
          mapType: 'china',
          data: [],
          // markLine: {
          //   smooth: true,
          //   effect: {
          //     show: true,
          //     scaleSize: 1,
          //     period: 30,
          //     color: '#fff',
          //     shadowBlur: 10
          //   },
          //   itemStyle: {
          //     normal: {
          //       label: { show: false },
          //       borderWidth: 1,
          //       lineStyle: {
          //         type: 'solid',
          //         shadowBlur: 10
          //       }
          //     }
          //   },
          //   data: [
          //     [{ name: '上海' }, { name: '北京', value: 95 }],
          //     [{ name: '广州' }, { name: '北京', value: 90 }],
          //     [{ name: '大连' }, { name: '北京', value: 80 }],
          //     [{ name: '南宁' }, { name: '北京', value: 70 }],
          //     [{ name: '南昌' }, { name: '北京', value: 60 }],
          //     [{ name: '拉萨' }, { name: '北京', value: 50 }],
          //     [{ name: '长春' }, { name: '北京', value: 40 }],
          //     [{ name: '包头' }, { name: '北京', value: 30 }],
          //     [{ name: '重庆' }, { name: '北京', value: 20 }],
          //     [{ name: '常州' }, { name: '北京', value: 10 }]
          //   ]
          // },
          // markPoint: {
          //   symbol: 'emptyCircle',
          //   symbolSize: function (v) {
          //     return 0.1
          //   },
          //   effect: {
          //     show: false,
          //     shadowBlur: 0
          //   },
          //   itemStyle: {
          //     normal: {
          //       label: {
          //         show: true,
          //         position: 'top',
          //         textStyle: {
          //           fontSize: 14
          //         }
          //       }
          //     },
          //     emphasis: {
          //       label: { show: false }
          //     }
          //   },
          //   data: [
          //     { name: '上海', value: 95 },
          //     { name: '广州', value: 90 },
          //     { name: '大连', value: 80 },
          //     { name: '南宁', value: 70 },
          //     { name: '南昌', value: 60 },
          //     { name: '拉萨', value: 50 },
          //     { name: '长春', value: 40 },
          //     { name: '包头', value: 30 },
          //     { name: '重庆', value: 20 },
          //     { name: '常州', value: 10 }
          //   ]
          // }
        },
      ],
    }
    this.myEchart.setOption(option)
  },
  methods: {
    dealWithData() {
      var data = []
      for (var key in geoCoord) {
        data.push({ name: key, coord: geoCoord[key] })
      }
      console.log(data, 'data')
      return data
    },
  },
}
</script>

<style scoped lang="less">
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  .myEchart {
    width: 50%;
    height: 100%;
    padding-top: 80px;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
