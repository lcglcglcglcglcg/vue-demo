<template>
  <div id="map" class="map"></div>
</template>

<script>
import { Map, View } from 'ol'
import { tianDiTuMapLayer, tianDiTuAnnotation } from './js/mapApi'
import { WindLayer } from 'ol-wind'
import dat from 'dat.gui'
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
            return 'hotpink'
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
    addDat() {
      var gui = new dat.GUI()
      let f = gui.addFolder('粒子效果配置')
      let object = {
        // 透明度
        globalAlpha: 0.92,
        velocityScale: 1 / 20,
        paths: 5000,
        lineWidth: 3,
        frameRate: 20,
      }
      for (let i in object) {
        let minMax = this.minMaxMap(i)
        f.add(object, i)
          .min(minMax[0])
          .max(minMax[1])
          .name(`中文${i}`)
          .onFinishChange(() => {
            this.windLayer.setWindOptions(object)
          })
      }
    },
    minMaxMap: function (property) {
      let map = {
        globalAlpha: [0, 1],
        // 速度
        velocityScale: [0, 1],
        paths: [0, 7000],
        lineWidth: [0, 20],
        frameRate: [20, 100],
      }
      return map[property]
    },
  },
  mounted() {
    this.tiandituInit()
    this.addDat()
    this.addWindLayer()
  },
  beforeDestroy() {},
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
