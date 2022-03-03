<template>
  <div>
    <a class="skiplink" href="#map">Go to map</a>
    <div id="map" class="map" tabindex="0"></div>
  </div>
</template>

<script>
import { Map, View, Overlay, TileLayer, OSM } from './mapModule'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Point, MultiLineString, LineString, Polygon } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import typhoonData from './typhoon.json'
import { Style, Circle, Fill, Stroke, Text, Icon } from 'ol/style'
import { featureObj } from './feature'
export default {
  data() {
    return {
      map: null,
      lastSolar: null,
      lastZoomPoint: null,
    }
  },
  mounted() {
    this.initMap()
    // this.drawTyphoonPath()
    this.drawTyphoonPathInterval()
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [15611315, 2500873],
          zoom: 6,
        }),
      })
      this.designHoverOnMap()
    },

    // 注册时间
    designHoverOnMap() {
      this.map.on('pointermove', e => {
        let pixel = e.pixel
        let feature = this.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
          return feature
        })
        if (feature) {
          if (feature.get('type') === 'typhoonPoint') {
            featureObj.typhoonPointHover.apply(this, [feature])
          }
        } else {
          this.setPointStyle(this.lastZoomPoint, 4)
          this.map.getTargetElement().style.cursor = ''
        }
      })
    },
    // 设置点击样式
    setPointStyle(feature, radius) {
      if (feature) {
        feature
          .getStyle()
          .getImage()
          .setRadius(radius)
        feature.changed()
      }
    },
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
            image: new Circle({
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
    drawTyphoonPathInterval() {
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
              image: new Circle({
                fill: new Fill({ color: this.judeColorByWindLevel(points[index].strong) }),
                radius: 4,
              }),
            })
          )
          featurePoint.set('type', 'typhoonPoint')
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
    drawSolar(point) {
      const radiusArr = point.radius7.split('|').map(item => parseFloat(item))
      var Configs = {
        CIRCLE_CENTER_X: parseFloat(point.lng),
        CIRCLE_CENTER_Y: parseFloat(point.lat),
        CIRCLE_R: {
          SE: radiusArr[0] / 100,
          NE: radiusArr[1] / 100,
          NW: radiusArr[2] / 100,
          SW: radiusArr[3] / 100,
        },
      }
      const positions = []
      const _interval = 6
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
      let feature = new Feature({ geometry: new Polygon([positions]) })
      return feature
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

<style>
.map {
  width: 100%;
  height: 100vh;
}
a.skiplink {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
a.skiplink:focus {
  clip: auto;
  height: auto;
  width: auto;
  background-color: #fff;
  padding: 0.3em;
}
#map:focus {
  outline: #4a74a8 solid 0.15em;
}
</style>
