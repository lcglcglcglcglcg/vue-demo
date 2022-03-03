<template>
  <div class="homePage">
    <Header />
    <div class="content">
      <div class="left-nav">
        <!-- 基准站信息 -->
        <div class="station">
          <dv-border-box-10>
            <div class="box-content">
              <div class="title">基准站点总数</div>
              <div class="station-num">
                <div class="num"><span>3</span></div>
                <div class="num"><span>1</span></div>
                <div class="num"><span>5</span></div>
                <div class="num"><span>4</span></div>
                <div class="num"><span>7</span></div>
              </div>
            </div>
          </dv-border-box-10>
        </div>
        <!-- 状态信息 -->
        <div class="status-info">
          <StatusInfo />
        </div>
        <!-- 状态监控 -->
        <div class="status-check">
          <StatusCheck />
        </div>
      </div>
      <div class="right-nav">
        <!-- 告警信息 -->
        <div class="warn-info">
          <WarnInfo />
        </div>
        <!-- 状态监控 -->
        <div class="work-info">
          <WorkInfo />
        </div>
      </div>
      <!-- 地图 -->
      <div id="cesiumContainer"></div>
    </div>
  </div>
</template>

<script>
import Header from './modules/Header.vue'
import StatusInfo from './modules/StatusInfo'
import StatusCheck from './modules/StatusCheck'
import WarnInfo from './modules/WarnInfo'
import WorkInfo from './modules/WorkInfo'

import { stationArr, border } from './mock'

var viewer, camera, handler
export default {
  name: 'Home',
  components: { Header, StatusInfo, StatusCheck, WarnInfo, WorkInfo },
  data() {
    return {
      stationArr: [],
      offset: { x: 0.8, y: 2 },
      scale: 200,
      extrudedHeight: 2000,
    }
  },
  methods: {
    init() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjg2NGQzNi1lNjcxLTRmMjQtODJmYy1jNjNkMzAwNGI4NGYiLCJpZCI6NzE1OTEsImlhdCI6MTYzNTMwNDAyNn0.THlmzI3Jd59Yp97NdOMLccdKsIUVnQKx_kzDdmJTg2A'
      viewer = new Cesium.Viewer('cesiumContainer', {
        baseLayerPicker: false, //是否显示图层选择控件
        // imageryProvider: geogle,
        animation: false, // 隐藏动画控件
        fullscreenButton: false, // 隐藏全屏按钮
        // vrButton: false, // 隐藏VR按钮，默认false
        geocoder: false, // 隐藏地名查找控件
        homeButton: false, // 隐藏Home按钮
        infoBox: false, // 隐藏点击要素之后显示的信息窗口
        sceneModePicker: false, // 隐藏场景模式选择控件
        // selectionIndicator: true, // 显示实体对象选择框，默认true
        timeline: false, // 隐藏时间线控件
        navigationHelpButton: false, // 隐藏帮助按钮
        scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
        shouldAnimate: true, // 开启动画自动播放
        sceneMode: 3, // 初始场景模式 1：2D 2：2D循环 3：3D，默认3
        // requestRenderMode: true, // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
        // // 如场景中的元素没有随仿真时间变化，请考虑将设置maximumRenderTimeChange为较高的值，例如Infinity
        // maximumRenderTimeChange: Infinity,
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      })

      // 隐藏版权信息
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
      viewer.scene.skyAtmosphere.show = false // 隐藏大气层

      // viewer.scene.skyBox.show = false
      // viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

      // viewer.imageryLayers.get(0).show = false //不显示底图
      // viewer.scene.globe.baseColor = Cesium.Color.WHITE.withAlpha(0.1) //设置地球颜色
      // viewer.clock.multiplier = 0.1 * 60 * 60

      var utc = Cesium.JulianDate.fromDate(new Date('2021/11/18 13:00:00')) //UTC
      viewer.clockViewModel.currentTime = utc //北京时间=UTC+8=GMT+8

      viewer.scene.globe.enableLighting = true

      viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(110.0, 22.0, 6000 * 1000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-80),
          roll: Cesium.Math.toRadians(0),
        },
      })

      let promise = Cesium.GeoJsonDataSource.load(require('./libs/中华人民共和国.json'), { clampToGround: true })
      promise.then((datasource) => {
        viewer.dataSources.add(datasource)
        var entities = datasource.entities.values
        var colorHash = {}
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i]
          entity.polygon.outlineWidth = 1
          // entity.polygon.outline = false
          entity.polygon.outlineColor = new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.BLUE,
          })
          entity.polygon.material = Cesium.Color.BLACK.withAlpha(0.6)
          entity.polyline = {
            positions: entity.polygon.hierarchy._value.positions,
            width: entity.polygon.outlineWidth,
            material: Cesium.Color.GRAY,
            // material: new Cesium.PolylineGlowMaterialProperty({
            //   glowPower: 0.2,
            //   color: Cesium.Color.BLUE,
            // }),
          }
          // viewer.zoomTo(promise)
        }
      })

      var boundArr = []
      border.forEach((item) => {
        item.forEach((ii) => {
          boundArr.push(ii)
        })
      })
      viewer.entities.add({
        name: 'Red line on terrain',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(boundArr),
          width: 5,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.WHITE,
          }),
          clampToGround: true,
        },
      })

      // viewer.dataSources.get(0).show = true
      // viewer.flyTo(promise)

      // viewer.imageryLayers._layers.forEach((layer) => {
      //   layer.alpha = 0.2 // 我们可以设置为0
      // })
      // viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1)

      this.addStationLayers()
    },
    // 增加图层
    addStationLayers() {
      this.stationArr = stationArr
      this.stationArr.map((item) => {
        this.addPolygon(item)
      })
    },
    addPolygon(info) {
      const box = this.addEntities(info)
      const box1 = this.addEntities(info)
      let label = {
        color: Cesium.Color.fromCssColorString('#fff'),
        font: 'normal 32px MicroSoft YaHei',
        showBackground: false,
        scale: 0.5,
        outlineWidth: 5,
      }
      box.label = Object.assign(label, {
        text: info.provice,
        verticalOrigin: Cesium.VerticalOrigin.TOP, //垂直方向以底部来计算标签的位置
        pixelOffset: new Cesium.Cartesian2(0, 10), //偏移量
      })
      box1.label = Object.assign(label, {
        text: info.num + '',
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
        pixelOffset: new Cesium.Cartesian2(0, -15), //偏移量
      })
    },
    addEntities(info) {
      return viewer.entities.add({
        name: 'Citizens Bank Park',
        position: Cesium.Cartesian3.fromDegrees(info.positionX, info.positionY, 0.0),
        box: {
          dimensions: new Cesium.Cartesian3(50000.0, 10000.0, 200000.0),
          material: Cesium.Color.YELLOW,
          // outline: true,
          // outlineColor: Cesium.Color.BLACK,
        },
      })
    },
  },
  mounted() {
    this.init()
  },
  destroyed() {
    // window.removeEventListener('resize', this.changeSize)
  },
  deactivated() {
    // window.removeEventListener('resize', this.changeSize)
  },
}
</script>

<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  background-color: rgba(17, 14, 22);
}
.homePage {
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
  .content {
    position: relative;
    height: calc(100vh - 70px);
    // background-color: #000;
    .left-nav {
      z-index: 99;
      width: 20%;
      height: 100%;
      position: absolute;
      left: 0%;
      top: 0%;
      min-width: 200px;
      padding: 20px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .station {
        height: 15%;
        min-height: 100px;
        .box-content {
          height: 100%;
          padding: 20px;
          .title {
            font-size: 18px;
          }
          .station-num {
            margin-top: 5px;
            height: 60%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .num {
              width: 15%;
              height: 100%;
              color: yellow;
              background-color: #0a2128;
              text-align: center;
              font-size: 20px;
              display: table;
              span {
                display: table-cell;
                height: 100%;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .status-info {
        height: 40%;
      }
      .status-check {
        height: 40%;
      }
    }
    .right-nav {
      z-index: 99;
      width: 20%;
      height: 100%;
      position: absolute;
      right: 0%;
      top: 0%;
      min-width: 200px;
      padding: 20px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .warn-info {
        height: 50%;
      }
      .work-info {
        height: 50%;
      }
    }
  }
}
</style>
