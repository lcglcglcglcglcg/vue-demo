<template>
  <div id="page"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
var camera, render
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
      var scene = new THREE.Scene()

      var dir = new THREE.Vector3(1, 0, 0, 2)
      var origin = new THREE.Vector3(0, 0, 0)
      var length = 50
      var hex = 0xffff00
      var headLength = 3
      var headWidth = 3

      var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth)
      arrowHelper.line = 12
      scene.add(arrowHelper)

      var arrowHelper1 = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, length, hex)
      scene.add(arrowHelper1)
      var arrowHelper2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, length, hex)
      scene.add(arrowHelper2)

      var arrowHelper3 = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), origin, length, hex)
      scene.add(arrowHelper3)

      // 创建相机   参数：视角、视角比例（宽度和高度比）、最近像素、最远像素
      camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 1, 1000)

      // 控件可以监听鼠标的变化，改变相机对象的属性
      var controls = new OrbitControls(camera)
      // 渲染器
      // 把眼睛看到的大千世界绘制到HTML页面中
      render = new THREE.WebGLRenderer({ antialias: false })
      // 计算处理dpi
      render.setPixelRatio(window.devicePixelRatio)
      // 设置画布大小
      render.setSize(window.innerWidth, window.innerHeight)

      var app = document.getElementById('page')
      // 绘制出一个canvas小面板
      app.appendChild(render.domElement)

      // 虚线
      var geometry = new THREE.BoxBufferGeometry(10, 10, 10)
      var edges = new THREE.EdgesGeometry(geometry)
      var line = new THREE.LineSegments(
        edges,
        new THREE.LineDashedMaterial({
          color: 0xffffff,
          dashSize: 4,
          gapSize: 0.1,
          linewidth: 50,
        })
      )
      // line.computeLineDistances(); // 非常重要 不然出不来效果
      line.position.y = 2
      scene.add(line)

      /*********************************内容绘制区域************************************************/

      // 创造一个立方体, 点模型
      // var geometry = new THREE.BoxGeometry(10, 10, 10); //创建一个立方体几何对象Geometry
      // var material1 = new THREE.PointsMaterial({
      //   color: "red",
      //   size: 1.0, //点对象像素尺寸
      // });
      // //点模型
      // var point = new THREE.Points(geometry, material1);

      // // 创造一个立方体, 线模型
      // var material2 = new THREE.LineBasicMaterial({
      //   color: "red",
      // });
      // var lines = new THREE.Line(geometry, material2);

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
      render.render(scene, camera)

      /*********************************内容绘制区域************************************************/

      // 产生动效  网格对象进行旋转
      function animate() {
        render.render(scene, camera)
      }
      setInterval(animate, 100)
    },
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
