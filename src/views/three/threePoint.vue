<template>
  <div id="page"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
let cameraPersp, cameraOrtho, currentCamera, camera
let scene, renderer, control, orbit
export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 创建场景
      scene = new THREE.Scene()
      scene.add(new THREE.GridHelper(1000, 10, 0x888888, 0x444444))

      // var dir = new THREE.Vector3(1, 0, 0)
      // var origin = new THREE.Vector3(0, 0, 0)
      // var length = 30
      // var hex = 0x000000
      // var headLength = 3
      // var headWidth = 3

      // var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth)
      // arrowHelper.line = 12
      // scene.add(arrowHelper)

      // 创建相机   参数：视角、视角比例（宽度和高度比）、最近像素、最远像素
      const aspect = window.innerWidth / window.innerHeight

      cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000)
      cameraOrtho = new THREE.OrthographicCamera(-600 * aspect, 600 * aspect, 600, -600, 0.01, 30000)
      camera = cameraPersp
      camera.position.set(1000, 500, 1000)
      camera.lookAt(0, 200, 0)

      const light = new THREE.DirectionalLight(0xffffff, 2)
      light.position.set(1, 1, 1)
      scene.add(light)

      // 渲染器
      // 把眼睛看到的大千世界绘制到HTML页面中
      renderer = new THREE.WebGLRenderer({ antialias: false })
      renderer.setClearColor(0x000000) //背景色
      // 计算处理dpi 分辨率
      renderer.setPixelRatio(window.devicePixelRatio)
      // 设置画布大小
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 绘制出一个canvas小面板
      document.getElementById('page').appendChild(renderer.domElement)

      const texture = new THREE.TextureLoader().load('/image/logo.png', animate)
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      const geometry = new THREE.BoxGeometry(200, 200, 200)
      const material = new THREE.MeshLambertMaterial({ map: texture, transparent: true })

      // 控件可以监听鼠标的变化，改变相机对象的属性
      let orbit = new OrbitControls(camera, renderer.domElement)

      let control = new TransformControls(camera, renderer.domElement)
      control.addEventListener('change', () => {
        renderer.render(scene, camera)
      })

      control.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      control.attach(mesh)
      scene.add(control)

      // 虚线 盒子
      // var geometry = new THREE.BoxBufferGeometry(20, 20, 20)
      // var edges = new THREE.EdgesGeometry(geometry)
      // var line = new THREE.LineSegments(
      //   edges,
      //   new THREE.LineDashedMaterial({
      //     color: 0xffffff,
      //     dashSize: 4,
      //     gapSize: 0.1,
      //     linewidth: 50,
      //   })
      // )
      // line.computeLineDistances() // 非常重要 不然出不来效果
      // line.position.y = 2
      // scene.add(line)

      /*********************************内容绘制区域************************************************/

      // 创造一个立方体, 点模型
      // var geometry = new THREE.BoxGeometry(10, 10, 10) //创建一个立方体几何对象Geometry
      // var material1 = new THREE.PointsMaterial({
      //   color: 'red',
      //   size: 1.0, //点对象像素尺寸
      // })
      // //点模型
      // var point = new THREE.Points(geometry, material1)
      // scene.add(point)

      // 画虚线
      // x轴
      // const points = []
      // points.push(new THREE.Vector3(-20, 0, 0))
      // points.push(new THREE.Vector3(20, 0, 0))
      // const geometry = new THREE.BufferGeometry().setFromPoints(points)
      // // var geometry = new THREE.LineGeometry(20, 20, 20)
      // const material2 = new THREE.LineDashedMaterial({
      //   color: 0x000000,
      //   dashSize: 4,
      //   gapSize: 0.1,
      //   linewidth: 50,
      // })
      // var lines = new THREE.Line(geometry, material2)
      // lines.computeLineDistances()
      // scene.add(lines)

      // // 创造一个立方体, 网格模型
      // var material3 = new THREE.MeshBasicMaterial({
      //   color: "red",
      //   wireframe: true, //网格模型以线条的模式渲染
      // });
      // var meshs = new THREE.Mesh(geometry, material3);

      // //网格模型添加到场景中
      // scene.add(meshs);
      // 让渲染器渲染一下
      // 执行渲染操作   指定场景、相机作为参数
      camera.position.z = 90
      camera.position.y = 10
      camera.position.x = 20
      renderer.render(scene, camera)

      /*********************************内容绘制区域************************************************/

      // 产生动效  网格对象进行旋转
      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }
      animate()
      // setInterval(animate, 100)
    },

    // 画线
  },
}
</script>

<style lang="less">
#page {
  margin: 0 auto;
  width: 500px;
  height: 500px;
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
