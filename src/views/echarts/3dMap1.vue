<template>
  <!-- <div class="map-container" id="myEchart" ref="myEchart"></div> -->
  <div class="map-container" id="container"></div>
</template>

<script>
import * as echarts from 'echarts'
import * as THREE from 'three'
import * as d3 from 'd3'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let dataPoint = [
  {
    name: '龙亭镇',
    value: [107.64046846020508, 33.215041091597946, 2],
  },
  {
    name: '谢村镇',
    value: [107.45208, 33.183403, 2],
  },

  {
    name: '马畅镇',
    value: [107.380081, 33.19104, 2],
  },
  {
    name: '溢水镇',
    value: [107.451401, 33.252083, 2],
  },
  {
    name: '磨子桥镇',
    value: [107.522369, 33.186253, 2],
  },
  {
    name: '黄家营镇',
    value: [107.73360483593751, 33.10465171943266, 2],
  },
  {
    name: '黄安镇',
    value: [107.616379, 33.188942, 2],
  },
  {
    name: '黄金峡镇',
    value: [107.851662, 33.183479, 2],
  },
  {
    name: '槐树关镇',
    value: [107.715042, 33.24757, 2],
  },
  {
    name: '金水镇',
    value: [107.854279, 33.2747, 2],
  },
  {
    name: '华阳镇',
    value: [107.392563, 33.612713, 2],
  },
  {
    name: '茅坪镇',
    value: [107.684509, 33.433952, 2],
  },
  {
    name: '八里关镇',
    value: [107.628944, 33.386372, 2],
  },
  {
    name: '桑溪镇',
    value: [108.012367, 33.201622, 2],
  },
  {
    name: '关帝镇',
    value: [107.509422, 33.321411, 2],
  },
]
let mapData = [
  {
    name: '卫校附设医院',
    value: [107.554558, 33.21843, 2],
  },
  {
    name: '黄安卫生院',
    value: [107.61841747885131, 33.1884481733651, 2],
  },
  {
    name: '溢水卫生院',
    value: [107.4494698095093, 33.25498544659004, 2],
  },
  {
    name: '龙亭园卫生院',
    value: [107.6554190932541, 33.20854674023374, 2],
  },
  {
    name: '华阳医院',
    value: [107.54518100000001, 33.59248987410931, 2],
  },
  {
    name: '茅坪中心卫生院',
    value: [107.68401547354127, 33.43404824947542, 2],
  },
  {
    name: '桑溪卫生院',
    value: [108.00989400328827, 33.20189131981074, 2],
  },
  {
    name: '金水中心卫生院',
    value: [107.85502600000001, 33.27706248479885, 2],
  },
  {
    name: '马畅中心卫生院',
    value: [107.37508672681429, 33.192166785182195, 2],
  },
]

var camera, controls, scene, renderer
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var directionalLight
var earth
var mapSize = {
  width: 4096,
  height: 2048,
}
var mapCanvas, mapTexture

export default {
  data() {
    return {
      myEchart: null,
      map: null,

      container: document.body, //容器元素
      geoPath: 'http://192.168.3.200:8090/files/geo/liuzhou.json', //geo路径
      fontPath: 'https://aflies.github.io/china-3d/fonts/chinese.json', //fontPath路径
      center: [109.368652, 24.696399], //地图坐标中心点
      zoom: 100, //缩放大小，建议全国：100左右，省：500左右，市：2000左右
      alpha: 80, //倾斜角，建议30-80之间
      width: 0, //画布宽度，默认为容器大小
      height: 0, //画布高度，默认为容器大小
      itemHeight: 15, //柱子最大的高度，以此作为比例映射显示高度
      depth: 4, //地图的深度
      boxR: 1, //柱子半径
      gapWidth: 1.5, //柱子间隙
      textOffset: 0.8, //显示数量偏移柱子量
      fontSize: 12, //文字大小
      data: [], //渲染数据 [{code: '400200', gCount: 19, aCount: 10}]
    }
  },
  mounted() {
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.setLight()
    let container = document.getElementById('container')
    container.appendChild(renderer.domElement)
    this.loadMapData()
    this.animate()
  },
  methods: {
    loadMapData() {
      let _this = this
      //存缓存
      let geojson_data_v3 = sessionStorage.getItem('geojson_data_v3')
      if (geojson_data_v3) {
        let jsonData = JSON.parse(geojson_data_v3)
        _this.initMap(jsonData)
      } else {
        let loader = new THREE.FileLoader()
        loader.load('/china.json', function (data) {
          sessionStorage.setItem('geojson_data_v3', data)
          let jsonData = JSON.parse(data)
          _this.initMap(jsonData)
        })
      }
    },
    initMap(chinaJson) {
      // 建一个空对象存放对象
      this.map = new THREE.Object3D()
      let _this = this
      // 墨卡托投影转换   104.0, 37.5
      const projection = d3.geoMercator().center(this.center).scale(this.zoom).translate([0, 0])
      chinaJson.features.forEach((elem) => {
        // 定一个省份3D对象
        const province = new THREE.Object3D()
        // 每个的 坐标 数组
        const coordinates = elem.geometry.coordinates
        // 循环坐标数组
        coordinates.forEach((multiPolygon) => {
          multiPolygon.forEach((polygon) => {
            //创建形状
            const shape = new THREE.Shape()
            //采集统计几何体
            const shapeG = new THREE.Shape()
            //线段基础材质
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 'DarkGray',
            })
            //基础几何体创建
            const lineGeometry = new THREE.BufferGeometry()
            var positions = []
            for (let i = 0; i < polygon.length; i++) {
              const [x, y] = projection(polygon[i])
              if (i === 0) {
                shape.moveTo(x, -y)
              }
              shape.lineTo(x, -y)
              positions.push(x, -y, 4.01)
              // lineGeometry.vertices.push(new THREE.Vector3(x, -y, 4.01))
            }

            const newPoss = new Float32Array(positions)
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(newPoss, 3))
            console.log('lineGeometry: ', typeof lineGeometry.setAttribute)

            const extrudeSettings = {
              depth: this.depth, // 地图深度
              bevelEnabled: false,
            }
            //创建拉伸几何体
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
            //板块材质
            const material = new THREE.MeshBasicMaterial({
              color: '#031632',
              transparent: true,
              opacity: 1,
            })
            //板块边缘材质
            const material1 = new THREE.MeshBasicMaterial({
              color: '#3265AF',
              transparent: true,
              opacity: 0.6,
            })

            //为几何体添加材质
            const mesh = new THREE.Mesh(geometry, [material, material1])
            const line = new THREE.Line(lineGeometry, lineMaterial)
            province.add(mesh)
            province.add(line)
          })
        })
        // 将geo的属性放到省份模型中
        province.properties = elem.properties
        //中心点优先拿centroid
        let centroid = elem.properties.centroid || elem.properties.center
        if (centroid) {
          const [x, y] = projection(centroid)
          province.properties._centroid = [x, y]

          //增加柱形图，采集数据，预警数据
          let curArea = this.data.find((v) => v.code == elem.properties.adcode)
          let gCount = curArea ? curArea['gCount'] : 0
          let aCount = curArea ? curArea['aCount'] : 0

          //CylinderGeometry(上面半径，下面的半径，分段数)

          //采集
          let geometry_g = new THREE.CylinderGeometry(this.boxR, this.boxR, this.calcShowHeight(gCount), 100)
          let material_g = new THREE.MeshPhongMaterial({
            color: '#0DEAF8',
            transparent: true,
            opacity: 0.8,
          })

          //预警
          let geometry_w = new THREE.CylinderGeometry(this.boxR, this.boxR, this.calcShowHeight(aCount), 100)
          let material_w = new THREE.MeshPhongMaterial({
            color: '#FFBC00',
            transparent: true,
            opacity: 0.8,
          })

          //添加柱形图,采集量，预警量
          let gHeight = this.calcShowHeight(gCount) //采集，计算后的显示高度
          let aHeight = this.calcShowHeight(aCount) //预警，计算后的显示高度
          //采集柱状图
          let cylinder1 = new THREE.Mesh(geometry_g, material_g)
          cylinder1.position.set(x - this.gapWidth, -y, gHeight / 2 + this.depth)
          cylinder1.rotateX(Math.PI / 2)
          province.add(cylinder1)

          //预警柱形图
          let cylinder2 = new THREE.Mesh(geometry_w, material_w)
          cylinder2.position.set(x + this.gapWidth, -y, aHeight / 2 + this.depth)
          cylinder2.rotateX(Math.PI / 2)
          province.add(cylinder2)

          //采集数量显示
          // this.createText(
          //   gCount + '',
          //   {
          //     x: x - this.gapWidth - (this.boxR / 2) * (gCount + '').length, //根据显示数量计算偏移量
          //     y: -y,
          //     z: gHeight + this.depth + this.textOffset, //柱子的显示高度+地图的深度+偏移量
          //   },
          //   province
          // )

          //预警数量显示
          // this.createText(
          //   aCount + '',
          //   {
          //     x: x + this.gapWidth - (this.boxR / 2) * (aCount + '').length,
          //     y: -y,
          //     z: aHeight + this.depth + this.textOffset,
          //   },
          //   province
          // )
        }
        _this.map.add(province)
      })

      scene.add(this.map)
    },
    calcShowHeight(data) {
      return 6
    },
    // 初始化three.js场景
    initScene() {
      // 场景
      scene = new THREE.Scene()
      // 相机 透视相机
      var k = window.innerWidth / window.innerHeight //窗口宽高比
      var s = 30 //三维场景显示范围控制系数，系数越大，显示的范围越大
      //创建相机对象, 使用正投影相机
      // camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 0.1, 500)
      // camera.position.set(0, -40, 70)
      // camera.lookAt(0, 0, 0)
    },
    // 初始化相机
    initCamera() {
      // 创建相机对象
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500)
      camera.position.set(0, -40, 70) //设置相机位置
      camera.lookAt(0, 0, 0)
    },
    // 初始化渲染器
    initRenderer() {
      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setClearColor(0xeeeeee) //背景色
      renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
      renderer.setSize(window.innerWidth, window.innerHeight) // 改成这样就可以居中
      renderer.shadowMap.enabled = true //启用阴影
    },
    initControls() {
      controls = new OrbitControls(camera, renderer.domElement)
    },
    //创建文字
    createText(text, position, province) {
      var x = 0,
        y = 0

      var heartShape = new THREE.Shape()

      heartShape.moveTo(x + 5, y + 5)
      heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
      heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
      heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
      heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
      heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
      heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)

      // var shapes = this.font.generateShapes(text, this.fontSize / 10) //（文本，字体大小）

      var geometry = new THREE.ShapeBufferGeometry(heartShape)

      var material = new THREE.MeshBasicMaterial()

      var textMesh = new THREE.Mesh(geometry, material)
      textMesh.position.set(position.x, position.y, position.z)
      textMesh.rotateX(Math.PI / 2)

      province.add(textMesh)
    },
    //设置灯光效果
    setLight() {
      //自然光
      let ambientLight = new THREE.AmbientLight(0xffffff, 1)
      scene.add(ambientLight)
      //平行光
      directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(0, 0, 200).normalize()
      scene.add(directionalLight)
    },
    createProvinceInfo() {
      // 显示省份的信息
      if (this.activeInstersect.length && this.activeInstersect[0].object.parent.properties.name) {
        var properties = this.activeInstersect[0].object.parent.properties
        let item = this.data.find((v) => v.code == properties.adcode)

        //获取内容
        const getContent = (name, gCount, aCount) => {
          const style = 'width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 2px;'
          let html = `<h3>${name}</h3>
                <p>
                    <i style="background: #00C4FC; ${style}"></i>
                    采集量：${gCount}</p>
                <p>
                    <i style="background: #F7CD3C; ${style}"></i>
                    预警量：${aCount}
                </p>`
          return html
        }
        if (item) {
          this.provinceInfo.innerHTML = getContent(properties.name, item.gCount, item.aCount)
        } else {
          this.provinceInfo.innerHTML = getContent(properties.name, 0, 0)
        }
        this.provinceInfo.style.visibility = 'visible'
      } else {
        this.provinceInfo.style.visibility = 'hidden'
      }
    },
    animate() {
      requestAnimationFrame(this.animate) // 循环渲染
      controls.update()
      this.render()
    },
    render() {
      // 平行光始终从相机位置照向地球
      // directionalLight.position.copy(camera.position)
      renderer.render(scene, camera)
    },
  },
}
</script>

<style scoped lang="less">
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

#container {
  width: 100%;
  height: 100%;
}

#info {
  position: absolute;
  width: 100px;
  right: 0;
  font-size: 14px;
  padding-top: 10px;
}

#info > a {
  color: #eee;
  text-decoration: none;
}
</style>
