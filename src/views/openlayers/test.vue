<template>
  <div class="earth">
    <div id="ol-container"></div>
  </div>
</template>

<script>
import 'ol/ol.css'
import proj from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'
import Style from 'ol/style/Style'
import WebGLPointsLayer from 'ol/layer/WebGLPoints'
import { Map, View, Overlay, TileLayer, OSM } from './mapModule'
let map
export default {
  name: 'Earth',
  mounted() {
    this.initMap()
    // this.test()
  },
  methods: {
    initMap() {
      map = new Map({
        target: 'ol-container',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          projection: 'EPSG:4326',
          center: [100, 20],
          zoom: 2,
        }),
      })
    },
    test() {
      let style = {
        symbol: {
          symbolType: 'image',
          size: 3,
          color: '#ff0000',
        },
      }
      let features = []
      for (let i = 0; i < 10000; i++) {
        let ran = Math.random() * 360
        let ran2 = Math.random() * 360
        let lon = -180 + ran
        let lat = -90 + ran2
        let feature = new Feature({
          geometry: new Point([lon, lat]),
        })
        features.push(feature)
      }
      let vectorSource = new VectorSource({
        features: features,
      })
      let layer = new WebGLPointsLayer({
        source: vectorSource,
        style: style,
      })
      map.addLayer(layer)
    },
  },
}
</script>

<style scoped>
.earth {
  width: 100%;
  height: 100%;
}

#ol-container {
  width: 100%;
  height: 100%;
}
</style>