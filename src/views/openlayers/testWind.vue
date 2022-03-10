<template>
  <div id="map" class="map"></div>
</template>

<script>
import { Map, View } from 'ol'
import { tianDiTuMapLayer, tianDiTuAnnotation } from './js/mapApi'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
export default {
  data() {
    return {
      map: null,
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
        // var projection = getProjection('EPSG:3857')
        // var projectionExtent = projection.getExtent()
        // var size = getWidth(projectionExtent) / 256
        // var resolutions = new Array(14)
        // var matrixIds = new Array(14)
        // for (var z = 0; z < 14; ++z) {
        //   resolutions[z] = size / Math.pow(2, z)
        //   matrixIds[z] = z
        // }
        let layer_Base = new TileLayer({
          opacity: 1,
          source: tianDiTuMapLayer,
        })
        let layer_Note = new TileLayer({
          opacity: 1,
          source: tianDiTuAnnotation,
        })

        this.map = new Map({
          layers: [layer_Base, layer_Note],
          target: 'map',
          view: new View({
            center: [15611315, 2500873],
            zoom: 5,
            minZoom: 4,
          }),
        })
      }
    },
  },
  mounted() {
    this.tiandituInit()
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
