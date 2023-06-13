<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import { Map, View, Overlay, TileLayer, OSM } from './mapModule'
import { fromLonLat, get as getProjection } from 'ol/proj'
import { ScaleLine, FullScreen, Attribution, OverviewMap, defaults as defaultControls } from 'ol/control'
import autofit from 'autofit.js'
let map
export default {
  data() {
    return {}
  },
  methods: {
    initMap() {
      console.log('initMap')
      map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          // projection: 'EPSG:4326',
          center: fromLonLat([124.9829, 24.928]), // 地图中心经纬度
          // extent: [-180, -45, 180, 48],
          zoom: 5,
          maxZoom: 18,
          minZoom: 0,
        }),
        controls: defaultControls({ attribution: true }).extend([
          new Attribution(),
          new FullScreen(),
          new ScaleLine({ units: 'metric' }),
        ]),
      })
    },
  },
  mounted() {
    this.initMap()
    autofit.init(
      {
        renderDom: '#app',
        resize: true,
      },
      false
    ) // 可关闭控制台运行提示输出
  },
}
</script>

<style lang="less" scoped>
#map {
  width: 1920px;
  height: 929px;
}
</style>