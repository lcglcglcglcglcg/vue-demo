<template>
  <div id="container">
    <div class="tools">
      <a-button type="primary" @click="move">回溯轨迹</a-button>
    </div>
  </div>
</template>

<script>
let map, marker, polylineLayer, path, myModel
export default {
  data() {
    return {
      key: '3ETBZ-JBPKR-IRRWE-WXNNY-2XOTZ-F2BLG',
      avatarList: [],
    }
  },
  methods: {
    initMap() {
      //定义地图中心点坐标
      var center = new TMap.LatLng(39.98412, 116.307484)
      //定义map变量，调用 TMap.Map() 构造函数创建地图
      map = new TMap.Map(document.getElementById('container'), {
        center: center, //设置地图中心点坐标
        zoom: 17.2, //设置地图缩放级别
        renderOptions: {
          // enableBloom: true, //是否启用泛光效果 注：为true才会有效果
        },
      })

      let points = [
        { lat: 39.982266575222155, lng: 116.30596876144409 },
        { lat: 39.98081500848338, lng: 116.30571126937866 },
        { lat: 39.982348784165886, lng: 116.3111400604248 },
        { lat: 39.978813710266024, lng: 116.3111400604248 },
        { lat: 39.978813710266024, lng: 116.31699800491333 },
        { lat: 39.978913710266024, lng: 116.31799800491333 },
        { lat: 39.978213710266024, lng: 116.31299800491333 },
      ]

      path = []
      points.map((item) => {
        path.push(new TMap.LatLng(item.lat, item.lng))
      })

      // var path = [
      //   { lat: 39.98081500648338, lng: 116.30571126937866, height: 0 },
      //   { lat: 39.982266575222155, lng: 116.30596876144409, height: 0 },
      //   { lat: 39.982348784165886, lng: 116.3111400604248, height: 0 },
      //   { lat: 39.978813710266024, lng: 116.3111400604248, height: 0 },
      //   { lat: 39.978813710266024, lng: 116.31699800491333, height: 0 },
      // ]

      // 计算汽车初始偏移角度
      let rotate = (180 / Math.PI) * Math.atan2(points[1].lat - points[0].lat, points[1].lng - points[0].lng) + 270
      console.log('rotate: ', rotate)

      polylineLayer = new TMap.MultiPolyline({
        map, // 绘制到目标地图
        // 折线样式定义
        styles: {
          // style_blue: new TMap.PolylineStyle({
          //   color: '#3777FF', //线填充色
          //   width: 4, //折线宽度
          //   borderWidth: 2, //边线宽度
          //   borderColor: '#FFF', //边线颜色
          //   lineCap: 'butt', //线端头方式
          // }),
          //第一组样式
          style_blue: new TMap.PolylineStyle({
            color: '#3777FF', //线填充色
            width: 6, //折线宽度
            borderWidth: 5, //边线宽度
            borderColor: '#FFF', //边线颜色
            lineCap: 'round', // 线端头方式
            // dashArray: [10, 10], // 虚线展示方式
            arrowOptions: {
              space: 70,
            },
            enableBloom: true, //是否启用泛光  注：为true才会有效果
          }),
        },
        geometries: [
          {
            styleId: 'style_blue',
            rainbowPaths: [
              // 彩虹线数组
              {
                path: [path[0], path[1]],
                color: 'rgba(0, 180, 0, 1)',
              },
              {
                path: [path[1], path[2]],
                color: 'rgba(255, 0, 0, 1)',
              },
              {
                path: [path[2], path[3]],
                color: 'rgba(204,153, 0, 1)',
              },
              {
                path: [path[3], path[4]],
                color: 'rgba(255, 0, 0, 1)',
              },
              {
                path: [path[4], path[5]],
                color: 'rgba(204,153, 0, 1)',
              },
              {
                path: [path[5], path[6]],
                color: 'rgba(0, 180, 0, 1)',
              },
            ],
          },
        ],
      })

      // 初始化模型
      myModel = new TMap.model.GLTFModel({
        url: 'https://mapapi.qq.com/web/visualization/demo-asset/airplane.glb', //模型路径
        map: map,
        position: new TMap.LatLng(39.982266575222155, 116.30596876144409, 50), //放置位置，
        scale: [30, 30, 40], //模型在XYZ三轴上的缩放比例
      })

      marker = new TMap.MultiMarker({
        map,
        styles: {
          'car-down': new TMap.MarkerStyle({
            width: 40,
            height: 40,
            anchor: {
              x: 20,
              y: 20,
            },
            faceTo: 'map',
            rotate: rotate,
            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
          }),
          start: new TMap.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 16, y: 32 },
            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png',
          }),
          end: new TMap.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 16, y: 32 },
            src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png',
          }),
        },
        geometries: [
          {
            id: 'car',
            styleId: 'car-down',
            position: path[0],
          },
          {
            id: 'start',
            styleId: 'start',
            position: path[0],
          },
          {
            id: 'end',
            styleId: 'end',
            position: path[path.length - 1],
          },
        ],
      })
    },
    move() {
      marker.moveAlong({ car: { path, speed: 1000 } }, { autoRotation: true, loop: Infinity })
      let modelPath = path.map((item) => {
        return { position: item }
      })
      console.log('modelPath: ', modelPath)
      myModel.moveAlong({ path: modelPath, duration: 10000, loop: Infinity, degreeToNorth: 180 })
    },
    loadScript() {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://wemapvis.map.qq.com/api/gljs?v2&key=' + this.key + '&libraries=geometry,model'
      script.onload = script.onreadystatechange = () => {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
          this.initMap()
          script.onload = script.onreadystatechange = null
        }
      }
      document.body.appendChild(script)
    },
  },
  mounted() {
    this.loadScript()
  },
}
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
  position: relative;
  .tools {
    position: absolute;
    z-index: 1001;
    right: 20px;
    bottom: 20px;
  }
}
</style>
