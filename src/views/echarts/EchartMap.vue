<template>
  <div class="map-container" id="myEchart" ref="myEchart"></div>
</template>

<script>
import $ from 'jquery'
import * as echarts from 'echarts'
// import '@/../node_modules/echarts/map/js/china.js' // 引入中国地图数据
import { geoCoordMap, dataList } from './mock'

export default {
  name: 'StationMap',
  data() {
    return { myEchart: '' }
  },
  mounted() {
    this.initEcharts()
    // this.setData()
  },
  methods: {
    initEcharts() {
      this.myEchart = echarts.init(this.$refs.myEchart)
      const url =
        'http://172.16.15.227:22704/geoserver/cors/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cors:cors_triangle_cal_area&maxFeatures=50&outputFormat=application%2Fjson'
      echarts.registerMap('myJson', require('./json/map.json'))
      let option = {
        tooltip: {
          formatter: function (params, ticket, callback) {
            return params.seriesName + '<br />' + params.name + '：' + params.value
          }, //数据格式化
        },
        visualMap: {
          min: 0,
          max: 1500,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], //取值范围的文字
          inRange: {
            color: ['#e0ffff', '#006edd'], //取值范围的颜色
          },
          show: true, //图注
        },
        // geo: {
        //   map: 'china',
        //   roam: true, //不开启缩放和平移
        //   zoom: 1.23, //视角缩放比例
        //   label: {
        //     normal: {
        //       show: true,
        //       fontSize: '10',
        //       color: 'rgba(0,0,0,0.7)',
        //     },
        //   },
        //   itemStyle: {
        //     normal: {
        //       borderColor: 'rgba(0, 0, 0, 0.2)',
        //     },
        //     emphasis: {
        //       areaColor: '#F3B329', //鼠标选择区域颜色
        //       shadowOffsetX: 0,
        //       shadowOffsetY: 0,
        //       shadowBlur: 20,
        //       borderWidth: 0,
        //       shadowColor: 'rgba(0, 0, 0, 0.5)',
        //     },
        //   },
        // },
        series: [
          {
            type: 'map',
            map: 'china',
            roam: true,
            zoom: 1.23,
            center: [105, 36],
            // geoIndex: 1,
            // aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            data: dataList,
            label: {
              normal: {
                show: true,
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff',
                },
              },
            },
            itemStyle: {
              normal: {
                areaColor: '#0d0059',
                borderColor: '#389dff',
                borderWidth: 0.5,
              },
              emphasis: {
                areaColor: '#17008d',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 5,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      this.myEchart.setOption(option)
      this.myEchart.on('click', function (params) {
        alert(params.name)
      })
    },
    initEcharts1() {
      var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples'

      var chartDom = document.getElementById('myEchart')
      var myChart = echarts.init(chartDom)
      var option

      myChart.showLoading()
      $.get(ROOT_PATH + '/data/asset/geo/USA.json', function (usaJson) {
        myChart.hideLoading()
        echarts.registerMap('USA', usaJson, {
          Alaska: {
            // 把阿拉斯加移到美国主大陆左下方
            left: -131,
            top: 25,
            width: 15,
          },
          Hawaii: {
            left: -110,
            top: 28,
            width: 5,
          },
          'Puerto Rico': {
            // 波多黎各
            left: -76,
            top: 26,
            width: 2,
          },
        })
        option = {
          title: {
            text: 'USA Population Estimates (2012)',
            subtext: 'Data from www.census.gov',
            sublink: 'http://www.census.gov/popest/data/datasets.html',
            left: 'right',
          },
          tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
              const value = (params.value + '').split('.')
              const valueStr = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              return params.seriesName + '<br/>' + params.name + ': ' + valueStr
            },
          },
          visualMap: {
            left: 'right',
            min: 500000,
            max: 38000000,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026',
              ],
            },
            text: ['High', 'Low'],
            calculable: true,
          },
          toolbox: {
            show: true,
            //orient: 'vertical',
            left: 'left',
            top: 'top',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          series: [
            {
              name: 'china',
              type: 'map',
              roam: true,
              map: 'china',
              emphasis: {
                label: {
                  show: true,
                },
              },
              data: [
                { name: 'Alabama', value: 4822023 },
                { name: 'Alaska', value: 731449 },
                { name: 'Arizona', value: 6553255 },
                { name: 'Arkansas', value: 2949131 },
                { name: 'California', value: 38041430 },
                { name: 'Colorado', value: 5187582 },
                { name: 'Connecticut', value: 3590347 },
                { name: 'Delaware', value: 917092 },
                { name: 'District of Columbia', value: 632323 },
                { name: 'Florida', value: 19317568 },
                { name: 'Georgia', value: 9919945 },
                { name: 'Hawaii', value: 1392313 },
                { name: 'Idaho', value: 1595728 },
                { name: 'Illinois', value: 12875255 },
                { name: 'Indiana', value: 6537334 },
                { name: 'Iowa', value: 3074186 },
                { name: 'Kansas', value: 2885905 },
                { name: 'Kentucky', value: 4380415 },
                { name: 'Louisiana', value: 4601893 },
                { name: 'Maine', value: 1329192 },
                { name: 'Maryland', value: 5884563 },
                { name: 'Massachusetts', value: 6646144 },
                { name: 'Michigan', value: 9883360 },
                { name: 'Minnesota', value: 5379139 },
                { name: 'Mississippi', value: 2984926 },
                { name: 'Missouri', value: 6021988 },
                { name: 'Montana', value: 1005141 },
                { name: 'Nebraska', value: 1855525 },
                { name: 'Nevada', value: 2758931 },
                { name: 'New Hampshire', value: 1320718 },
                { name: 'New Jersey', value: 8864590 },
                { name: 'New Mexico', value: 2085538 },
                { name: 'New York', value: 19570261 },
                { name: 'North Carolina', value: 9752073 },
                { name: 'North Dakota', value: 699628 },
                { name: 'Ohio', value: 11544225 },
                { name: 'Oklahoma', value: 3814820 },
                { name: 'Oregon', value: 3899353 },
                { name: 'Pennsylvania', value: 12763536 },
                { name: 'Rhode Island', value: 1050292 },
                { name: 'South Carolina', value: 4723723 },
                { name: 'South Dakota', value: 833354 },
                { name: 'Tennessee', value: 6456243 },
                { name: 'Texas', value: 26059203 },
                { name: 'Utah', value: 2855287 },
                { name: 'Vermont', value: 626011 },
                { name: 'Virginia', value: 8185867 },
                { name: 'Washington', value: 6897012 },
                { name: 'West Virginia', value: 1855413 },
                { name: 'Wisconsin', value: 5726398 },
                { name: 'Wyoming', value: 576412 },
                { name: 'Puerto Rico', value: 3667084 },
              ],
            },
          ],
        }
        myChart.setOption(option)
      })

      option && myChart.setOption(option)
    },
    setData() {
      var dataValue = this.dealWithData()
      var data1 = dataValue.splice(0, 6)
      var option = {
        series: [
          {
            type: 'map',
            map: 'china',
            roam: false,
            zoom: 1.23,
            center: [105, 36],
            // geoIndex: 1,
            // aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                areaColor: '#0d0059',
                borderColor: '#389dff',
                borderWidth: 0.5,
              },
              emphasis: {
                areaColor: '#17008d',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 5,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
          {
            name: '',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: dataValue,
            //   symbolSize: function(val) {
            //     return val[2] / 10;
            //   },
            symbol: 'circle',
            symbolSize: 8,
            hoverSymbolSize: 10,
            tooltip: {
              formatter(value) {
                return value.data.name + '<br/>' + '设备数：' + '22'
              },
              show: true,
            },
            encode: {
              value: 2,
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
            itemStyle: {
              color: '#0efacc',
            },
            emphasis: {
              label: {
                show: false,
              },
            },
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: data1,
            symbolSize: 15,
            tooltip: {
              show: false,
            },
            encode: {
              value: 2,
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              color: '#0efacc',
              period: 9,
              scale: 5,
            },
            hoverAnimation: true,
            label: {
              formatter: '{b}',
              position: 'right',
              show: true,
            },
            itemStyle: {
              color: '#0efacc',
              shadowBlur: 2,
              shadowColor: '#333',
            },
            zlevel: 1,
          },
        ],
      }
      this.myEchart.setOption(option)
    },
    dealWithData() {
      var geoCoordMap = {
        海门: [121.15, 31.89],
        鄂尔多斯: [109.781327, 39.608266],
        招远: [120.38, 37.35],
        舟山: [122.207216, 29.985295],
        齐齐哈尔: [123.97, 47.33],
        盐城: [120.13, 33.38],
        赤峰: [118.87, 42.28],
        青岛: [120.33, 36.07],
        乳山: [121.52, 36.89],
        金昌: [102.188043, 38.520089],
        泉州: [118.58, 24.93],
        莱西: [120.53, 36.86],
        日照: [119.46, 35.42],
        胶南: [119.97, 35.88],
        南通: [121.05, 32.08],
        拉萨: [91.11, 29.97],
        云浮: [112.02, 22.93],
        梅州: [116.1, 24.55],
        文登: [122.05, 37.2],
        上海: [121.48, 31.22],
        攀枝花: [101.718637, 26.582347],
        威海: [122.1, 37.5],
        承德: [117.93, 40.97],
        厦门: [118.1, 24.46],
        汕尾: [115.375279, 22.786211],
        潮州: [116.63, 23.68],
        丹东: [124.37, 40.13],
        太仓: [121.1, 31.45],
        曲靖: [103.79, 25.51],
        烟台: [121.39, 37.52],
        福州: [119.3, 26.08],
        瓦房店: [121.979603, 39.627114],
        即墨: [120.45, 36.38],
        抚顺: [123.97, 41.97],
        玉溪: [102.52, 24.35],
        张家口: [114.87, 40.82],
        阳泉: [113.57, 37.85],
        莱州: [119.942327, 37.177017],
        湖州: [120.1, 30.86],
        汕头: [116.69, 23.39],
        昆山: [120.95, 31.39],
        宁波: [121.56, 29.86],
        湛江: [110.359377, 21.270708],
        揭阳: [116.35, 23.55],
        荣成: [122.41, 37.16],
        连云港: [119.16, 34.59],
        葫芦岛: [120.836932, 40.711052],
        常熟: [120.74, 31.64],
        东莞: [113.75, 23.04],
        河源: [114.68, 23.73],
        淮安: [119.15, 33.5],
        泰州: [119.9, 32.49],
        南宁: [108.33, 22.84],
        营口: [122.18, 40.65],
        惠州: [114.4, 23.09],
        江阴: [120.26, 31.91],
        蓬莱: [120.75, 37.8],
        韶关: [113.62, 24.84],
        嘉峪关: [98.289152, 39.77313],
        广州: [113.23, 23.16],
        延安: [109.47, 36.6],
        太原: [112.53, 37.87],
        清远: [113.01, 23.7],
        中山: [113.38, 22.52],
        昆明: [102.73, 25.04],
        寿光: [118.73, 36.86],
        盘锦: [122.070714, 41.119997],
        长治: [113.08, 36.18],
        深圳: [114.07, 22.62],
        珠海: [113.52, 22.3],
        宿迁: [118.3, 33.96],
        咸阳: [108.72, 34.36],
        铜川: [109.11, 35.09],
        平度: [119.97, 36.77],
        佛山: [113.11, 23.05],
        海口: [110.35, 20.02],
        江门: [113.06, 22.61],
        章丘: [117.53, 36.72],
        肇庆: [112.44, 23.05],
        大连: [121.62, 38.92],
        临汾: [111.5, 36.08],
        吴江: [120.63, 31.16],
        石嘴山: [106.39, 39.04],
        沈阳: [123.38, 41.8],
        苏州: [120.62, 31.32],
        茂名: [110.88, 21.68],
        嘉兴: [120.76, 30.77],
        长春: [125.35, 43.88],
        胶州: [120.03336, 36.264622],
        银川: [106.27, 38.47],
        张家港: [120.555821, 31.875428],
        三门峡: [111.19, 34.76],
        锦州: [121.15, 41.13],
        南昌: [115.89, 28.68],
        柳州: [109.4, 24.33],
        三亚: [109.511909, 18.252847],
        自贡: [104.778442, 29.33903],
        吉林: [126.57, 43.87],
        阳江: [111.95, 21.85],
        泸州: [105.39, 28.91],
        西宁: [101.74, 36.56],
        宜宾: [104.56, 29.77],
        呼和浩特: [111.65, 40.82],
        成都: [104.06, 30.67],
        大同: [113.3, 40.12],
        镇江: [119.44, 32.2],
        桂林: [110.28, 25.29],
        张家界: [110.479191, 29.117096],
        宜兴: [119.82, 31.36],
        北海: [109.12, 21.49],
        西安: [108.95, 34.27],
        金坛: [119.56, 31.74],
        东营: [118.49, 37.46],
        牡丹江: [129.58, 44.6],
        遵义: [106.9, 27.7],
        绍兴: [120.58, 30.01],
        扬州: [119.42, 32.39],
        常州: [119.95, 31.79],
        潍坊: [119.1, 36.62],
        重庆: [106.54, 29.59],
        台州: [121.420757, 28.656386],
        南京: [118.78, 32.04],
        滨州: [118.03, 37.36],
        贵阳: [106.71, 26.57],
        无锡: [120.29, 31.59],
        本溪: [123.73, 41.3],
        克拉玛依: [84.77, 45.59],
        渭南: [109.5, 34.52],
        马鞍山: [118.48, 31.56],
        宝鸡: [107.15, 34.38],
        焦作: [113.21, 35.24],
        句容: [119.16, 31.95],
        北京: [116.46, 39.92],
        徐州: [117.2, 34.26],
        衡水: [115.72, 37.72],
        包头: [110, 40.58],
        绵阳: [104.73, 31.48],
        乌鲁木齐: [87.68, 43.77],
        枣庄: [117.57, 34.86],
        杭州: [120.19, 30.26],
        淄博: [118.05, 36.78],
        鞍山: [122.85, 41.12],
        溧阳: [119.48, 31.43],
        库尔勒: [86.06, 41.68],
        安阳: [114.35, 36.1],
        开封: [114.35, 34.79],
        济南: [117, 36.65],
        德阳: [104.37, 31.13],
        温州: [120.65, 28.01],
        九江: [115.97, 29.71],
        邯郸: [114.47, 36.6],
        临安: [119.72, 30.23],
        兰州: [103.73, 36.03],
        沧州: [116.83, 38.33],
        临沂: [118.35, 35.05],
        南充: [106.110698, 30.837793],
        天津: [117.2, 39.13],
        富阳: [119.95, 30.07],
        泰安: [117.13, 36.18],
        诸暨: [120.23, 29.71],
        郑州: [113.65, 34.76],
        哈尔滨: [126.63, 45.75],
        聊城: [115.97, 36.45],
        芜湖: [118.38, 31.33],
        唐山: [118.02, 39.63],
        平顶山: [113.29, 33.75],
        邢台: [114.48, 37.05],
        德州: [116.29, 37.45],
        济宁: [116.59, 35.38],
        荆州: [112.239741, 30.335165],
        宜昌: [111.3, 30.7],
        义乌: [120.06, 29.32],
        丽水: [119.92, 28.45],
        洛阳: [112.44, 34.7],
        秦皇岛: [119.57, 39.95],
        株洲: [113.16, 27.83],
        石家庄: [114.48, 38.03],
        莱芜: [117.67, 36.19],
        常德: [111.69, 29.05],
        保定: [115.48, 38.85],
        湘潭: [112.91, 27.87],
        金华: [119.64, 29.12],
        岳阳: [113.09, 29.37],
        长沙: [113, 28.21],
        衢州: [118.88, 28.97],
        廊坊: [116.7, 39.53],
        菏泽: [115.480656, 35.23375],
        合肥: [117.27, 31.86],
        武汉: [114.31, 30.52],
        大庆: [125.03, 46.58],
      }
      var data = []
      for (var key in geoCoordMap) {
        data.push({ name: key, value: geoCoordMap[key] })
      }
      return data
    },
  },
}
</script>

<style scoped lang="less">
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
