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
import { Point } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import typhoonData from './typhoon.json'
import { Style, Circle, Fill, Stroke, Text, Icon } from 'ol/style'
export default {
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.initMap()
    this.drawTyphoonPath()
  },
  methods: {
    initMap() {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      })
    },
    drawTyphoonPath() {
      const points = typhoonData.points
      let features = []
      points.forEach(item => {
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
      })
      // 矢量图层
      let layer = new VectorLayer()
      // 矢量数据源
      let source = new VectorSource()
      source.addFeatures(features)
      layer.setSource(source)
      this.map.addLayer(layer)
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
