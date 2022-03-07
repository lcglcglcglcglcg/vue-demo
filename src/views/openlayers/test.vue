<template>
  <div>
    <div id="map" class="map" tabindex="0">
      <div class="tools">
        <a-button type="primary" @click="beginCalDistance">开始测距</a-button>
        <a-button type="primary" style="margin-left:10px;" @click="cancleCalDistance">取消测距</a-button>
      </div>
    </div>
    <Popup ref="Popup" :info="pointInfo" :commonInfo="commonInfo" />
  </div>
</template>

<script>
import { Map, View, Overlay, TileLayer, OSM } from './mapModule'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Point, MultiLineString, LineString, Polygon, Circle } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import { Style, Circle as CircleStyle, Fill, Stroke, Text, Icon } from 'ol/style'
import { Select, Draw } from 'ol/interaction'
import { getLength, getArea } from 'ol/sphere'
import { unByKey } from 'ol/Observable'

import typhoonData from './typhoon.json'
import { featureObj } from './feature'

import Popup from './modules/Popup'
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

      measureTooltipElement: null,
      measureTooltip: null,
      sketch: null,
      geom: null,
      draw: null,
      lineSource: null,
      coordinate: [],
      lineLayer: null, //线图层
      lineSource: null,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      //线的图层
      this.lineSource = new VectorSource({ wrapX: false })
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
          center: [15611315, 2500873],
          zoom: 5,
        }),
      })
      // this.drawTyphoonPath()
      this.drawTyphoonPathInterval()
      this.designHoverOnMap()
      this.addOverlay()
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
      this.map.on('pointermove', e => {
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
        feature
          .getStyle()
          .getImage()
          .setRadius(radius)
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
      })
      // 处理四个方向的数据
      let radiusArr = point.radius7.split('|').map(item => {
        return parseFloat(item)
      })
      // 全部除以100 右下角开始
      let configs = {
        SE: radiusArr[0] * 1000,
        SW: radiusArr[1] * 1000,
        NW: radiusArr[2] * 1000,
        NE: radiusArr[3] * 1000,
      }
      //       实地距离：  R * P
      // 图上距离：  (P / 72) / 39.3701 = P / (72*39.3701)
      // 比例尺：  S =  P / (72*39.3701)  / R*P   = 1 /  R*72*32.3701
      // 假设屏幕距离为P，分辨率为R，则比例尺S为:
      let count = 1
      console.log(this.map.getView().getResolution())
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
    beginCalDistance() {
      //调用绘图工具并传递类型为线，其他类型有Point,LineString,Polygon,Circle
      this.onAddInteraction('Polygon')
      //创建一个新的测距提示
      this.createMeasureTooltip()
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
      this.draw.on('drawstart', function(evt) {
        self.sketch = evt.feature
        // 提示框的坐标
        var tooltipCoord = evt.coordinate
        //定义一个事件监听，监听几何要素的change事件
        listener = self.sketch.getGeometry().on('change', function(evt) {
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
      this.draw.on('drawend', function(e) {
        //输出坐标信息
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
      var deleteOverlayArr = []
      layerArr.forEach(item => {
        if (item.values_.element.className === 'ol-tooltip ol-tooltip-static draw_km') {
          deleteOverlayArr.push(item)
        }
      })
      deleteOverlayArr.forEach(item => {
        self.map.removeOverlay(item)
      })
    },

    judeColorByWindLevel(level) {
      let colors = {
        热带低压: 'green',
        热带风暴: 'blue',
        强热带风暴: 'yellow',
        台风: 'orange',
        强台风: 'purple',
        超强台风: 'red',
      }
      return colors[level]
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
    right: 0;
    top: 10px;
    z-index: 99;
  }
}
</style>
