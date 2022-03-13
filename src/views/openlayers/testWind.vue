<template>
  <div id="map" class="map"></div>
</template>

<script>
import { Map, View } from 'ol'
import { tianDiTuMapLayer, tianDiTuAnnotation } from './js/mapApi'
import { WindLayer } from 'ol-wind'
import gfs from './json/gfs'
export default {
  data() {
    return {
      map: null,
      windLayer: null,
    }
  },
  methods: {
    /**
     * @param {index} 想要初始化的地图类型的相关索引 支持：矢量图、影像图、地形图，分别对应 0 1 2
     * @param {key} 天地图 中申请的秘钥key
     * @param {*} centerPosition 中心点的经纬度坐标
     * @notice 参数不能为空
     */
    tiandituInit() {
      if (this.map == null) {
        this.map = new Map({
          layers: [tianDiTuMapLayer, tianDiTuAnnotation],
          target: 'map',
          view: new View({
            projection: 'EPSG:4326',
            center: [100, 25],
            zoom: 5,
            minZoom: 0,
            maxZoom: 18,
          }),
        })
      }
    },
    addWindLayer() {
      this.windLayer = new WindLayer(gfs, {
        forceRender: false,
        windOptions: {
          globalAlpha: 0.8,
          velocityScale: 1 / 20,
          paths: 1000,
          // eslint-disable-next-line no-unused-vars
          colorScale: (m) => {
            // console.log(m)
            return 'blue'
          },
          lineWidth: 3,
          generateParticleOption: false,
        },
        className: 'ol-layer',
        // map: map,
        // projection: 'EPSG:4326'
      })
      // this.map.removeLayer(windLayer);
      this.map.addLayer(this.windLayer)
    },
  },
  mounted() {
    this.tiandituInit()
    this.addWindLayer()
  },
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
