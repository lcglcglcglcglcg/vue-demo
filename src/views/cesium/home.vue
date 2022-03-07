<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
// import TrailMaterial from "@/libs/PolylineTrailMaterialProperty"
var viewer, camera, handler
export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      viewer = new Cesium.Viewer('cesiumContainer', {})
      // var layer = viewer.imageryLayers.addImageryProvider(
      //   new Cesium.UrlTemplateImageryProvider({
      //     url: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      //   })
      // )
      //  初始化场景位置
      viewer.scene.camera.flyTo({
        // 初始化相机经纬度
        destination: new Cesium.Cartesian3.fromDegrees(121.54035, 38.92146, 500 * 1000),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-25.0), //从上往下看为-90
          roll: 0,
        },
      })

      Cesium.Math.setRandomNumberSeed(0)

      var promise = Cesium.GeoJsonDataSource.load(require('./libs/中华人民共和国.json'))
      promise.then((datasource) => {
        viewer.dataSources.add(datasource)
        var entities = datasource.entities.values
        // var colorHash = {}
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i]
          var name = entity.name //geojson里面必须得有一个name属性，entity.name对应
          var color = colorHash[name] //可以使两个同名要素使用同一种颜色。。。
          if (!color) {
            // color = Cesium.Color.fromRandom({
            //   alpha: 1.0,
            // })
            color = Cesium.Color.BLACK.withAlpha(0.2)
            // color = Cesium.Color.fromCssColorString("rgba(254, 129, 6, 0.75)")
            colorHash[name] = color
          }
          entity.polygon.material = color
          entity.polygon.outline = false
          entity.polygon.extrudedHeight = Math.floor(Math.random() * 40000 + 20000) //20000~60000的随机数，单位是米
          // viewer.zoomTo(promise)
        }
      })

      viewer.flyTo(promise)

      // 鼠标左键点击
      // handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      // handler.setInputAction((e) => {
      //   var pick = viewer.scene.pick(e.position)
      //   console.log(e, pick)
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction((e) => {
        var pick = viewer.scene.pick(e.position)
        if (Cesium.defined(pick) && pick.id) {
          var feature = pick.id
          viewer.entities.removeById('select_grid')
          viewer.entities.removeById(`line_${feature.id}`)
          let positions = feature.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions
          viewer.entities.add({
            id: 'select_grid',
            polygon: {
              hierarchy: positions,
              material: this.getColorRamp('rgba(0, 255, 255,1)', 'rgba(255,0,0,0.3)'),
              height: 499,
            },
          })
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      handler.setInputAction((movement) => {
        var pickFeature = viewer.scene.pick(movement.endPosition) && viewer.scene.pick(movement.endPosition).id
        if (Cesium.defined(pickFeature) && this.preLineId !== pickFeature.id) {
          this.preLineId && viewer.entities.removeById(`line_${this.preLineId}`)
          this.preLineId = pickFeature.id
          viewer.entities.add({
            id: 'line_' + pickFeature.id,
            name: 'line_' + pickFeature.name,
            polyline: {
              positions: pickFeature.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions,
              width: 8,
              material: new Cesium.PolylineTrailMaterialProperty({
                // 尾迹线材质
                color: Cesium.Color.AQUA,
                trailLength: 0.9,
                period: 1,
              }),
            },
          })
        } else {
          this.preLineId && viewer.entities.removeById(`line_${this.preLineId}`)
          this.preLineId = null
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      this.addBillboard()
      this.addPolyline()
      this.addPolygon()
    },
    addBillboard() {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(121.54035, 38.92146, 50),
        billboard: {
          image: require('./icon/blueCamera.png'), // default: undefined
          // show: true, // default
          // pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
          // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
          // horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
          // verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
          // scale: 2.0, // default: 1.0
          // color: Cesium.Color.LIME, // default: WHITE
          // rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
          // alignedAxis: Cesium.Cartesian3.ZERO, // default
          // width: 100, // default: undefined
          // height: 25, // default: undefined
        },
      })
    },
    addPolyline() {
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            121.534575, 38.926131, 121.537579, 38.92543, 121.541784, 38.924578, 121.543973, 38.924144, 121.545947,
            38.923944,
          ]),
          width: 4,
          material: Cesium.Color.DARKORANGE.withAlpha(0.3),
          // clampToGround: true,
          // show: true,
        },
      })
      viewer.entities.add({
        // name:entity.name,
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            121.534575, 38.926131, 121.537579, 38.92543, 121.541784, 38.924578, 121.543973, 38.924144, 121.545947,
            38.923944,
          ]),
          width: 4, // 线的宽度，像素为单位

          material: new Cesium.PolylineTrailMaterialProperty({
            // 尾迹线材质
            color: Cesium.Color.GOLD,
            trailLength: 0.4,
            period: 3.0,
          }),
          // clampToGround: true,
          // show: true,
        },
      })
    },
    addPolygon() {
      viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            121.534575, 38.926131, 121.537579, 38.92543, 121.541784, 38.924578, 121.543973, 38.924144, 121.545947,
            38.923944,
          ]),
          extrudedHeight: 100,
          material: Cesium.Color.GOLD,
          // closeTop: false,
          // closeBottom: false,
        },
      })
    },
    getColorRamp(rampColor, centerColor) {
      var ramp = document.createElement('canvas')
      ramp.width = 50
      ramp.height = 50
      var ctx = ramp.getContext('2d')

      var grd = ctx.createRadialGradient(25, 25, 0, 25, 25, 50)
      grd.addColorStop(0, centerColor) // "rgba(255,255,255,0)"
      grd.addColorStop(1, rampColor)

      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 50, 50)

      // return ramp;

      return new Cesium.ImageMaterialProperty({
        image: ramp,
        transparent: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
