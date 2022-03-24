<template>
  <div>
    <div id="map" class="map">
      <div class="tools">
        <a-button type="primary" @click="beginCalDistance('Polygon')">开始测距(划面)</a-button>
        <!-- <a-button type="primary" @click="beginCalDistance('LineString')">开始测距(划线)</a-button> -->
        <a-button type="primary" @click="cancleCalDistance">取消测距</a-button>
        <a-button type="primary" @click="getHumidity">相对湿度绘制</a-button>
        <a-button type="primary" @click="webglRenderHumidity">webgl渲染大数据</a-button>
        <!-- <a-button type="primary" @click="refreshWebgl">刷新 webgl 数据</a-button>
        <a-button type="primary" @click="timeSliceRefresh">时间切片刷新</a-button> -->
      </div>
      <div class="sliderBox">
        <div class="playBtn" :class="isPlay ? 'stop' : 'play'" @click="playStep"></div>
        <a-slider
          class="slider"
          :tipFormatter="formatTooltip"
          :marks="marks"
          :step="step"
          v-model="playVal"
          @change="sliderChange"
        />
      </div>
    </div>
    <Popup ref="Popup" :info="pointInfo" :commonInfo="commonInfo" />
  </div>
</template>

<script>
import { Map, View, Overlay, TileLayer, OSM } from './mapModule'
import { Vector as VectorLayer, Image as ImageLayer, WebGLPoints as WebGLPointsLayer } from 'ol/layer'
import { WMTS, Vector as VectorSource, ImageStatic, Cluster } from 'ol/source'
import Feature from 'ol/Feature'
import { Point, MultiLineString, LineString, Polygon, Circle } from 'ol/geom'
import { fromCircle } from 'ol/geom/Polygon'
import { getTopLeft, getWidth } from 'ol/extent'
import { fromLonLat, get as getProjection } from 'ol/proj'
import { Style, Circle as CircleStyle, Fill, Stroke, Text, Icon } from 'ol/style'
import { Select, Draw } from 'ol/interaction'
import { getLength, getArea } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getVectorContext } from 'ol/render'

import typhoonData from './json/typhoon.json'
import radarData from './json/radarData.json'
import humidityData from './json/humidity.json'
import gfsData from './json/gfs.json'

import { featureObj } from './feature'
import ColorMaker from './js/colorMaker'

import Popup from './modules/Popup'

const prefix = 'http://lcglcglcg.gitee.io/image_bed'
// 定义变量
let helpTooltipElement, helpTooltip

export default {
  components: { Popup },
  data() {
    return {
      map: null,
      lastSolar: null,
      lastZoomPoint: null,
      overlay: null,
      pointInfo: {},
      commonInfo: {},
      marks: {},

      measureTooltipElement: null,
      measureTooltip: null,
      helpTooltipElement: null,
      helpTooltip: null,

      sketch: null,
      geom: null,
      draw: null,
      lineSource: null,
      coordinate: [],
      lineLayer: null, //线图层
      lineSource: null,

      step: 0,
      webglLayer: null,

      dealTimeArray: [],
      dealPathArray: [],

      isPlay: false,
      playVal: 0,
      timer: null,
    }
  },
  mounted() {
    this.initMap()
    // this.drawTyphoonPath()
    this.drawTyphoonPathInterval()
    this.designHoverOnMap()
    this.addOverlay()

    this.radarDataDeal()
    this.drawPicToMap(this, 0)

    // this.drawGrid()
  },
  methods: {
    initMap() {
      //线的图层
      this.lineSource = new VectorSource()
      this.lineLayer = new VectorLayer({
        source: this.lineSource,
      })
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.lineLayer,
        ],
        view: new View({
          // projection: 'EPSG:4326',
          center: fromLonLat([124.9829, 24.928]), // 地图中心经纬度
          // extent: [-180, -45, 180, 48],
          zoom: 5,
          maxZoom: 18,
          minZoom: 0,
        }),
      })
    },

    // 添加叠加层
    addOverlay() {
      // 创建一个overlay，绑定html元素container
      this.overlay = new Overlay({
        element: this.$refs.Popup.$el,
        autoPan: true,
        positioning: 'bottom-center',
      })
      this.overlay.setPosition(undefined)
      this.map.addOverlay(this.overlay)
    },

    // 注册事件
    designHoverOnMap() {
      this.map.on('pointermove', (e) => {
        let pixel = e.pixel
        let feature = this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          return feature
        })
        if (feature) {
          if (feature.get('typhoonPoint')) {
            featureObj['typhoonPointHover'].apply(this, [feature])
            let coordinates = feature.getGeometry().getCoordinates()
            this.pointInfo = feature.get('pointData')
            this.overlay.setPosition(coordinates)
          }
        } else {
          this.setPointStyle(this.lastZoomPoint, 4)
          this.overlay.setPosition(undefined)
          this.map.getTargetElement().style.cursor = ''
        }
      })
    },
    // 设置操作时点样式
    setPointStyle(feature, radius) {
      if (feature) {
        feature.getStyle().getImage().setRadius(radius)
        feature.changed()
      }
    },
    // 直接绘制台风路线
    drawTyphoonPath() {
      const points = typhoonData.points
      let features = []
      let positions = []
      points.forEach((item, i) => {
        let feature = new Feature({
          // 'fromLonLat' 球面投影转化平面
          geometry: new Point(fromLonLat([item.lng, item.lat])),
        })
        feature.setStyle(
          new Style({
            image: new CircleStyle({
              fill: new Fill({ color: this.judeColorByWindLevel(item.strong) }),
              radius: 4,
            }),
          })
        )
        features.push(feature)
        // 两点连线
        if (i != points.length - 1) {
          positions.push([
            fromLonLat([points[i].lng, points[i].lat]),
            fromLonLat([points[i + 1].lng, points[i + 1].lat]),
          ])
        }
      })
      console.log('positions: ', positions)
      let featureLine = new Feature({
        geometry: new MultiLineString(positions),
      })
      features.push(featureLine)
      // 矢量图层
      let layer = new VectorLayer()
      // 矢量数据源
      let source = new VectorSource()
      source.addFeatures(features)
      layer.setSource(source)
      this.map.addLayer(layer)
      this.map.getView().fit(source.getExtent(), this.map.getSize())
    },
    // 定时绘制台风路线
    drawTyphoonPathInterval() {
      this.commonInfo = { name: typhoonData.name, starttime: typhoonData.starttime }
      const points = typhoonData.points
      let index = 0
      let layer = new VectorLayer()
      let source = new VectorSource()
      layer.setSource(source)
      let interval = setInterval(() => {
        if (index == points.length) clearInterval(interval)
        else {
          // 增加点
          let featurePoint = new Feature({
            geometry: new Point(fromLonLat([points[index].lng, points[index].lat])),
          })
          featurePoint.setStyle(
            new Style({
              image: new CircleStyle({
                fill: new Fill({ color: this.judeColorByWindLevel(points[index].strong) }),
                radius: 4,
              }),
            })
          )
          featurePoint.set('typhoonPoint', true)
          featurePoint.set('pointData', points[index])
          let radius = 0
          layer.on('postrender', (e) => {
            if (radius >= 10) radius = 0
            let opacity = (10 - radius) * 0.1
            const ctx = getVectorContext(e)
            ctx.setStyle(
              new Style({
                image: new CircleStyle({
                  radius,
                  stroke: new Stroke({ color: `rgba(255,0,0,${opacity})` }),
                }),
              })
            )
            ctx.drawGeometry(featurePoint.getGeometry())
            radius += 0.2
            layer.changed()
          })
          source.addFeature(featurePoint)
          // 增加风圈
          if (points[index].radius7) {
            let featureSolar = this.drawSolar(points[index])
            if (this.lastSolar) source.removeFeature(this.lastSolar)
            this.lastSolar = featureSolar
            source.addFeature(featureSolar)
          }
          // 增加线
          if (index > 0) {
            let featureLine = new Feature({
              geometry: new LineString([
                fromLonLat([points[index - 1].lng, points[index - 1].lat]),
                fromLonLat([points[index].lng, points[index].lat]),
              ]),
            })
            source.addFeature(featureLine)
          }
          index++
        }
      }, 100)
      this.map.addLayer(layer)
    },
    // 绘制风圈
    drawSolar(point) {
      let position = fromLonLat([point.lng, point.lat])
      let feature = new Feature({
        geometry: new Circle(position),
        // geometry: fromCircle(new Circle(position, 10000)).transform('EPSG:3857', 'EPSG:4326'),
      })
      // 处理四个方向的数据
      let radiusArr = point.radius7.split('|').map((item) => {
        return parseFloat(item)
      })
      // 全部除以100 右下角开始
      let configs = {
        SE: radiusArr[0] * 1000,
        SW: radiusArr[1] * 1000,
        NW: radiusArr[2] * 1000,
        NE: radiusArr[3] * 1000,
      }
      // 实地距离：  R * P
      // 图上距离：  (P / 72) / 39.3701 = P / (72*39.3701)
      // 比例尺：  S =  P / (72*39.3701)  / R*P   = 1 /  R*72*32.3701
      // 假设屏幕距离为P，分辨率为R，则比例尺S为:
      let count = 1
      feature.setStyle(
        new Style({
          renderer(coordinates, state) {
            const ctx = state.context
            let [x, y] = coordinates[0]
            ctx.beginPath()

            for (let i in configs) {
              // 每次 加 0.5  绘制圆弧
              let ratio = 0.5 * count * Math.PI
              let distance = configs[i] / state.resolution
              ctx.arc(x, y, distance, ratio - 0.5 * Math.PI, ratio)
              // 如果绘制到 第二个圆弧了 绘制线段 连接 这两个圆弧
              count++
            }
            ctx.fillStyle = 'rgb(238, 160, 29, 0.5)'
            ctx.fill()
            ctx.closePath()

            count = 1
          },
        })
      )
      return feature
    },
    // 开始测距
    beginCalDistance(type) {
      //创建一个新的测距提示
      this.createMeasureTooltip()
      // this.createHelpTooltip()
      //调用绘图工具并传递类型为线，其他类型有Point,LineString,Polygon,Circle
      this.onAddInteraction(type)
    },
    // 绘图工具
    onAddInteraction(type) {
      let self = this
      //勾绘矢量图形的类
      this.draw = new Draw({
        //source代表勾绘的要素属于的数据集
        source: self.lineSource,
        //type 表示勾绘的要素包含的 geometry 类型
        type: type,
        style: new Style({
          fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
          stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.5)', lineDash: [10, 10], width: 2 }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({ color: 'rgba(0, 0, 0, 0.7)' }),
            fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
          }),
        }),
      })

      let listener
      //绘制开始时触发的事件
      this.draw.on('drawstart', function (evt) {
        self.sketch = evt.feature
        // 提示框的坐标
        var tooltipCoord = evt.coordinate
        //定义一个事件监听，监听几何要素的change事件
        listener = self.sketch.getGeometry().on('change', function (evt) {
          //获取绘制的几何对象
          self.geom = evt.target
          //定义一个输出对象，用于记录长度
          var output
          //判断交互类型是否为线
          if (self.geom instanceof Polygon) {
            output = self.formatArea(self.geom)
            tooltipCoord = self.geom.getInteriorPoint().getCoordinates()
            self.measureTooltipElement.innerHTML = output
            // output +
            // `<img class="deleteLine" id="deleteLine${lengthMeasureCount}" tempimgdata="${lengthMeasureCount}" src="${deleteLineArea}" style="width: 20px;padding-left: 5px;" />`
          } else if (self.geom instanceof LineString) {
            //输出多线段的长度
            output = self.formatLength(self.geom)
            //获取多线段的最后一个点的坐标
            tooltipCoord = self.geom.getLastCoordinate()
            //设置测量提示框的内标签为最终输出结果
            self.measureTooltipElement.innerHTML = output
          }
          self.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static draw_km'
          //设置测量提示框的位置坐标
          self.measureTooltip.setPosition(tooltipCoord)
        })
      })

      //绘制结束时触发的事件
      this.draw.on('drawend', function (e) {
        // 清空再生成坐标
        self.measureTooltipElement.className = 'tooltip tooltip-static distanceBox'
        self.sketch = null
        self.measureTooltipElement = null
        self.createMeasureTooltip()
        // 输出坐标信息
        const geometry = e.feature.getGeometry()
        let pointArr = geometry.getCoordinates()
        self.coordinate.push(pointArr)
        unByKey(listener)
        //移除交互
        // self.removeDraw()
      })

      //添加交互
      self.map.addInteraction(this.draw)
    },
    //删除交互
    removeDraw() {
      this.map.removeInteraction(this.draw)
    },
    // 创建一个帮助提示
    createHelpTooltip() {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
      }
      this.helpTooltipElement = document.createElement('div')
      this.helpTooltipElement.className = 'tooltip hidden distanceBoxHidden'
      this.helpTooltipElement.innerHTML = '请选择测距起点'
      this.helpTooltip = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
      })
      this.map.addOverlay(this.helpTooltip)
    },
    //创建一个新的测距提示
    createMeasureTooltip() {
      let self = this
      //如果已经存在帮助提示框则移除
      if (self.measureTooltipElement) {
        self.measureTooltipElement.parentNode.removeChild(self.measureTooltipElement)
      }
      //创建帮助提示要素的div
      self.measureTooltipElement = document.createElement('div')
      //设置帮助提示要素的样式
      self.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
      //创建一个帮助提示的覆盖标注
      self.measureTooltip = new Overlay({
        element: self.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
      })
      //将帮助提示的覆盖标注添加到地图中
      self.map.addOverlay(self.measureTooltip)
    },
    /*输出格式几何图形的结果*/
    formatArea(polygon) {
      let area = getArea(polygon)
      let output = ''
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
      }
      return output
    },
    // 测量距离
    formatLength(line) {
      //计算平面距离
      var length = getLength(line)
      //定义输出变量
      var output
      //如果长度大于1000，则使用km单位，否则使用m单位
      if (length > 1000) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
      }
      return output
    },
    // 取消测距
    cancleCalDistance() {
      let self = this
      this.map.removeInteraction(this.draw)
      this.lineSource.clear()
      let layerArr = this.map.getOverlays()
      console.log('layerArr: ', layerArr)
      var deleteOverlayArr = []
      layerArr.forEach((item) => {
        if (item.values_.element.className === 'ol-tooltip ol-tooltip-static draw_km') {
          deleteOverlayArr.push(item)
        }
      })
      deleteOverlayArr.forEach((item) => {
        self.map.removeOverlay(item)
      })
    },

    judeColorByWindLevel(level) {
      let colors = {
        热带风暴: 'red',
        热带低压: 'blue',
        强热带风暴: 'green',
        台风: 'orange',
        强台风: 'yellow',
        超强台风: 'salmon',
      }
      return colors[level]
    },

    // https://github.com/zmannnnn/openlayers  封装例子

    // 根据 约定的 类型的索引 判别 底图 与 注记图 需要渲染的layer类型
    JudgeBaseAndNoteByType(index) {
      let map = [
        ['vec', 'cva'],
        ['ter', 'cta'],
        ['img', 'cia'],
      ]
      return map[index]
    },

    // 雷达数据处理
    radarDataDeal() {
      let image = new ImageLayer()
      this.imageLayer = image
      this.map.addLayer(image)

      let value = radarData.value
      let pathArray = []
      let timeArray = []
      for (let i = value.length - 1; i >= 0; i--) {
        let timeLength = value[i].time.length
        for (let j = timeLength - 1; j >= 0; j--) {
          let curTime = value[i].time[j]
          let dealTime = curTime.slice(0, 2) + ':' + curTime.slice(2)
          timeArray.push(dealTime)
          pathArray.push(value[i].path[j])
        }
      }

      this.dealTimeArray = timeArray
      this.dealPathArray = pathArray
      const radarDataLength = (this.radarDataLength = timeArray.length)

      // step 每一个间隔的值 = 100 / radarDataLength
      const step = (this.step = Math.floor(100 / this.radarDataLength))
      let marks = {}
      for (let i = 0; i < radarDataLength; i++) {
        marks[i * step] = timeArray[i]
      }
      this.marks = marks
      this.max = (radarDataLength - 1) * step
    },

    // 格式化 显示的 字符串
    formatTooltip(value) {
      const index = value / this.step
      return this.formateDate(this.dealTimeArray[index])
    },

    formateDate(str) {
      let date = new Date()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month > 10 ? month : '0' + month
      day > 10 ? day : '0' + day
      return month + '-' + day + ' ' + str
    },

    // 雷达滑块 值 发生改变
    sliderChange(value) {
      const index = value / this.step
      // 图床6张图片
      this.drawPicToMap(this, index % 6)
    },

    //  把图片绘制到地图上去
    drawPicToMap({ imageLayer }, index) {
      let leftBottom = fromLonLat([100, 12])
      let rightTop = fromLonLat([120, 22])
      let extent = leftBottom.concat(rightTop)
      let url = `${prefix}/images/openlayer/image${index}.png`
      let source = new ImageStatic({
        crossOrigin: null,
        imageExtent: extent,
        url,
      })
      imageLayer.setSource(source)
      imageLayer.changed()
    },

    // 相对湿度绘制
    getHumidity() {
      let humidity = humidityData.data
      const length = humidity.length
      const features = new Array(length)
      for (let i = 0; i < length; i++) {
        const coordinates = fromLonLat([humidity[i].x, humidity[i].y])
        features[i] = new Feature({
          geometry: new Point(coordinates),
        })
        features[i].set('value', humidity[i].v)
      }
      const source = new VectorSource({
        features: features,
      })

      // 设置集群数据
      const clusterSource = new Cluster({
        distance: 50, // 聚集一起的距离
        source: source,
      })
      // let _this = this;
      const styleCache = {}
      const clusters = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          let curVal = feature.get('features')[0].get('value')
          let color = this.getHumidityColor(parseInt(curVal))
          let style = styleCache[curVal]
          if (!style) {
            style = new Style({
              image: new CircleStyle({
                radius: 15,
                stroke: new Stroke({
                  color: '#fff',
                }),
                fill: new Fill({
                  color,
                }),
              }),
              // image: new Icon({
              //   anchor: [0.5, 0.65],
              //   src: '/image/logo.png',
              //   size: [50, 30],
              // }),
              text: new Text({
                text: curVal + '%',
                fill: new Fill({
                  color: '#fff',
                }),
              }),
            })
            styleCache[curVal] = style
          }
          return style
        },
      })
      this.map.addLayer(clusters)
    },

    // 相对湿度的颜色控制
    // value 是一个 number
    getHumidityColor(value) {
      let arr = [
        { min: 0, max: 10, color: '#f05b72' },
        { min: 10, max: 20, color: '#905a3d' },
        { min: 20, max: 30, color: '#87843b' },
        { min: 30, max: 40, color: '#224b8f' },
        { min: 40, max: 50, color: '#f15b6c' },
        { min: 50, max: 60, color: '#8f4b2e' },
        { min: 60, max: 70, color: '#726930' },
        { min: 70, max: 80, color: '#003a6c' },
        { min: 80, max: 90, color: '#f8aba6' },
        { min: 90, max: 100, color: '#87481f' },
      ]
      for (let i = 0; i < 10; i++) {
        if (value > arr[i].min && value <= arr[i].max) {
          return arr[i].color
        }
      }
      return '#000'
    },

    // webglRenderHumidity
    // 多数据时候渲染更快
    webglRenderHumidity() {
      const style = {
        symbol: {
          symbolType: 'image',
          src: 'image/logo.png',
          size: [18, 28],
          rotateWithView: false,
        },
      }
      let data = humidityData.data
      const len = data.length
      const source = new VectorSource()
      let features = []
      for (let i = 0; i < len; i++) {
        const coords = fromLonLat([data[i].x, data[i].y])
        features.push(new Feature({ geometry: new Point(coords) }))
      }
      source.addFeatures(features)
      const layer = new WebGLPointsLayer({
        source,
        style,
        disableHitDetection: false,
      })
      this.map.addLayer(layer)
    },

    // refresh webgl
    refreshWebgl() {
      // 用来表示偏移量
      let count = 1
      const style = {
        symbol: {
          symbolType: 'image',
          src: 'image/logo.png',
          size: [18, 28],
          rotateWithView: false,
        },
      }
      setInterval(() => {
        let data = humidityData.data
        const len = data.length
        const source = new VectorSource()
        let features = []
        console.log(count)
        for (let i = 0; i < len; i++) {
          const coords = fromLonLat([parseFloat(data[i].x) + count * 0.2, parseFloat(data[i].y) + count * 0.2])
          features.push(new Feature(new Point(coords)))
        }
        source.addFeatures(features)
        const layer = new WebGLPointsLayer({
          source,
          style,
          disableHitDetection: false, //将此设置为true会稍微提高性能,但会阻止在图层上进行所有命中检测,需要交互的话,设置false
        })
        if (this.webglLayer !== null) {
          this.map.removeLayer(this.webglLayer)
          this.webglLayer.dispose()
        }
        this.webglLayer = layer
        this.webglLayer.changed()

        this.map.addLayer(layer)
        count++
      }, 1000)
    },

    // time slice 时间切片 刷新
    timeSliceRefresh() {
      // 这个索引 用于判断 当前切的部分 是第几个部分
      let index = 0
      let features = []
      //  当前 进行处理的数据
      let curData = humidityData.data
      let length = curData.length
      let _this = this
      let count = 1
      // 标志  标志 当前数据 是否已经处理完了
      let flag = false
      const style = {
        symbol: {
          symbolType: 'image',
          src: 'image/logo.png',
          size: [18, 28],
          rotateWithView: false,
        },
      }
      function init() {
        const source = new VectorSource()
        const layer = new WebGLPointsLayer({
          style,
          disableHitDetection: true,
        })
        return { source, layer }
      }
      function refresh() {
        console.log('切片中')
        for (let i = index * 50; i < (index + 1) * 50; i++) {
          if (i == length) {
            flag = true
            break
          }
          const coords = fromLonLat([parseFloat(curData[i].x) + count * 0.2, parseFloat(curData[i].y) + count * 0.2])
          features.push(new Feature(new Point(coords)))
        }
        index++
        if (flag) {
          console.log('数据处理已经完成，开始渲染。。。')
          if (_this.webglLayer !== null) {
            _this.map.removeLayer(_this.webglLayer)
            _this.webglLayer.dispose()
          }
          let { source, layer } = init()
          source.addFeatures(features)
          layer.setSource(source)
          _this.webglLayer = layer
          _this.map.addLayer(layer)
          _this.webglLayer.changed()
          curData = humidityData.data
          features.length = 0
          flag = false
          index = 0
          count++
        }
        requestAnimationFrame(refresh)
      }
      requestAnimationFrame(refresh)
    },

    // 绘制栅格图像
    drawGrid() {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let { nx, ny } = gfsData[0].header
      let data = gfsData[0].data
      canvas.width = nx
      canvas.height = ny
      let colorMaker = new ColorMaker({
        values: [0, 3, 5, 10, 15, 20, 30],
        colors: [
          [98, 113, 184],
          [61, 110, 163],
          [77, 142, 124],
          [162, 135, 64],
          [151, 75, 145],
          [95, 100, 160],
          [91, 136, 161],
        ],
      })
      //  传进数据 只绘制一次
      console.time('fillRect绘制')
      // let imgData = ctx.createImageData(nx, ny);
      // for (let i = 0; i < ny; i++) {
      //   for (let j = 0; j < nx; j++) {
      //     let dataIndex = i * nx + j;
      //     let curColors = colorMaker.makeColor(data[dataIndex]);
      //     imgData.data[dataIndex * 4 + 0] = curColors[0];
      //     imgData.data[dataIndex * 4 + 1] = curColors[1];
      //     imgData.data[dataIndex * 4 + 2] = curColors[2];
      //     imgData.data[dataIndex * 4 + 3] = 255;
      //   }
      // }
      // ctx.putImageData(imgData, 0, 0);
      // 720 * 361 10倍  nx  ny
      for (let i = 0; i < ny; i++) {
        for (let j = 0; j < nx; j++) {
          //  makecolor =>>  '111,111,111'
          ctx.fillStyle = `rgb(${colorMaker.makeColor(data[i * nx + j])})`
          // 一次的绘制操作
          ctx.fillRect(j, i, 1, 1)
        }
      }
      // console.log(canvas.toDataURL())
      console.timeEnd('fillRect绘制')
    },

    // 播放
    playStep() {
      this.isPlay = !this.isPlay
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.isPlay) {
          this.playVal += this.step
          const arr = Object.keys(this.marks)
          const last = arr[arr.length - 1]
          this.sliderChange(this.playVal)
          if (this.playVal == last) {
            this.isPlay = false
            this.playVal = 0
            this.sliderChange(this.playVal)
          }
        }
      }, 1000)
    },
  },
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100vh;
  position: relative;
  .tools {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 99;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 200px;
    button {
      width: 100%;
      margin: 5px 0;
    }
  }
  .sliderBox {
    position: absolute;
    bottom: 50px;
    // left: 50%;
    z-index: 99;
    margin: 0 auto;
    display: flex;
    align-items: center;
    .playBtn {
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }
    .play {
      background: url(./image/playBtn.png) center center no-repeat;
    }
    .stop {
      background: url(./image/stopBtn.png) center center no-repeat;
    }
    .slider {
      width: 900px;
    }
  }
}
</style>
