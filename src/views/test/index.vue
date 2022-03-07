<template>
  <div class="hello">
    <div id="map" class="map" tabindex="0"></div>
    <TyphoonInfo ref="typhoonInfo" :closeInfo="this.closeInfo" :typhoonData="this.typhoonData" />
  </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Point, MultiLineString, LineString, Polygon } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import { Fill, Circle, Style } from 'ol/style'
import featureObj from './js/feature'
import TyphoonInfo from './typhoonInfo.vue'
import Overlay from 'ol/Overlay'
import typhoonData1 from './js/typhoon.json'
export default {
  name: 'HelloWorld',
  data() {
    return {
      map: null,
      lastShowSolar: null,
      lastZoomPoint: null,
      typhoonData: {},
      tfInfoOverlay: null,
    }
  },
  components: {
    TyphoonInfo,
  },
  methods: {
    // 画出台风路径
    drawTyphoonPath: async function() {
      let points = typhoonData1.points
      let features = []

      let positions = []
      for (let i = 0; i < points.length; i++) {
        let position = [points[i].lng, points[i].lat]
        let featurePoint = new Feature({
          geometry: new Point(fromLonLat(position)),
        })
        featurePoint.setStyle(
          new Style({
            image: new Circle({
              fill: new Fill({
                color: this.judgeColorByWindLevel(points[i].strong),
              }),
              radius: 4,
            }),
          })
        )
        featurePoint.set('typhoonPoint', true)
        if (i != points.length - 1) {
          let nextPosition = [points[i + 1].lng, points[i + 1].lat]
          positions.push([fromLonLat(position), fromLonLat(nextPosition)])
        }
        features.push(featurePoint)
      }
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
    },
    // 画出台风路径 interval版
    drawTyphoonPathInterval: async function() {
      let points = typhoonData1.points
      let index = 0
      let layer = new VectorLayer()
      let source = new VectorSource()
      layer.setSource(source)
      let intervalLogo = setInterval(() => {
        if (index == points.length) {
          clearInterval(intervalLogo)
          return
        }
        let position = [points[index].lng, points[index].lat]
        // 点 的 数据源设置
        let featurePoint = new Feature({
          geometry: new Point(fromLonLat(position)),
        })
        featurePoint.setStyle(
          new Style({
            image: new Circle({
              fill: new Fill({
                color: this.judgeColorByWindLevel(points[index].strong),
              }),
              radius: 4,
            }),
          })
        )
        featurePoint.set('typhoonPoint', true)
        featurePoint.set('typhoonData', points[index])
        // 写到这里的时候 预期的结果 应该是 如果有 全部都绘制了  、 没有清除  上一个被绘制的目标点
        if (points[index].radius7.length != 0 || points[index].radius7 != null) {
          let featureSolar = this.drawSolar(points[index])
          let lastShowSolar = this.lastShowSolar
          if (lastShowSolar != null) {
            source.removeFeature(lastShowSolar)
          }
          this.lastShowSolar = featureSolar
          source.addFeature(featureSolar)
        }

        source.addFeature(featurePoint)

        if (index > 0) {
          let lastPosition = [points[index - 1].lng, points[index - 1].lat]
          let featureLine = new Feature({
            geometry: new LineString([fromLonLat(position), fromLonLat(lastPosition)]),
          })
          source.addFeature(featureLine)
        }
        // 需要一个出口
        index++
      }, 100)
      this.map.addLayer(layer)
    },

    // 注册一个 hover 事件
    designHoverOnMap: function() {
      let _this = this
      this.map.on('pointermove', function(ev) {
        let pixel = ev.pixel
        let feature = _this.map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature
        })
        if (feature) {
          let execName = featureObj.typeJudge(feature) + 'Hover'
          featureObj[execName].apply(_this, [feature])
        } else {
          _this.clearPointZoomStyle()
          _this.closeInfo()
          _this.map.getTargetElement().style.cursor = ''
        }
      })
    },

    // 注册一个click事件
    designClickOnMap: function() {
      let _this = this
      this.map.on('click', function(ev) {
        let pixel = ev.pixel
        let feature = _this.map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature
        })
        if (feature) {
          let execName = featureObj.typeJudge(feature) + 'Click'
          featureObj[execName].apply(_this, [feature])
        } else {
          console.log('no feature')
        }
      })
    },

    // clearPoint Zoom Style
    clearPointZoomStyle: function() {
      let _this = this
      if (_this.lastZoomPoint != null) {
        _this.lastZoomPoint
          .getStyle()
          .getImage()
          .setRadius(4)
        _this.lastZoomPoint.changed()
      }
    },

    // 关闭窗口显示
    closeInfo: function() {
      this.tfInfoOverlay.setPosition(undefined)
    },

    /**
     * 设置overlay position
     * @param {Array} position 经纬度数组
     */
    setOverlayPosition: function(position) {
      let transferPosition = fromLonLat(position)
      this.tfInfoOverlay.setPosition(transferPosition)
    },

    // drawSolar 绘制风圈
    /**
     * 应该是明确的只让他返回 一个 feature
     */
    drawSolar: function(points) {
      let radiusArr = points.radius7.split('|').map(item => {
        return parseFloat(item)
      })
      var Configs = {
        CIRCLE_CENTER_X: parseFloat(points.lng),
        CIRCLE_CENTER_Y: parseFloat(points.lat),
        CIRCLE_R: {
          SE: radiusArr[0] / 100,
          NE: radiusArr[1] / 100,
          NW: radiusArr[2] / 100,
          SW: radiusArr[3] / 100,
        },
      }
      let positions = []
      var _interval = 6
      for (var i = 0; i < 360 / _interval; i++) {
        var _r = 0
        var _ang = i * _interval
        if (_ang > 0 && _ang <= 90) {
          _r = Configs.CIRCLE_R.NE
        } else if (_ang > 90 && _ang <= 180) {
          _r = Configs.CIRCLE_R.NW
        } else if (_ang > 180 && _ang <= 270) {
          _r = Configs.CIRCLE_R.SW
        } else {
          _r = Configs.CIRCLE_R.SE
        }

        var x = Configs.CIRCLE_CENTER_X + _r * Math.cos((_ang * 3.14) / 180)
        var y = Configs.CIRCLE_CENTER_Y + _r * Math.sin((_ang * 3.14) / 180)
        positions.push(fromLonLat([x, y]))
      }
      let feature = new Feature({
        geometry: new Polygon([positions]),
      })
      feature.set('typhoonSolar', true)
      return feature
    },

    /**
     * 根据台风等级判断颜色
     * @param {String} windlevel 台风等级描述
     * @return {String} map[windlevel] color Name
     */
    judgeColorByWindLevel: function(windlevel) {
      let map = {
        热带风暴: 'red',
        热带低压: 'blue',
        强热带风暴: 'green',
        台风: 'orange',
        强台风: 'yellow',
        超强台风: 'salmon',
      }

      return map[windlevel]
    },

    // addOverlay
    addOverlay: function() {
      var popup = new Overlay({
        element: this.$refs.typhoonInfo.$el,
        autoPan: true,
      })
      popup.setPosition(undefined)
      this.tfInfoOverlay = popup
      this.map.addOverlay(popup)
    },
  },
  created() {},
  mounted() {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: [15611315, 2500873],
        zoom: 2,
      }),
    })
    // this.drawTyphoonPath();
    this.drawTyphoonPathInterval()
    this.designHoverOnMap()
    // this.designClickOnMap()
    this.addOverlay()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  width: 100%;
  height: 100vh;
}
#map:focus {
  outline: #4a74a8 solid 0.15em;
}
</style>
