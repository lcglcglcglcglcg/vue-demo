<template>
  <div>
    <div id="container"></div>
    <!-- <div v-if="loadingProcess !== 100" class="lunar_loading">
      <div class="box">{{ loadingProcess }} %</div>
    </div> -->
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

import bgTexture from './images1/bg.png'
import cycleTexture from './images1/cycle.png'

// import textModel from './models/text.fbx'
// import tigerModel from './models/tiger.gltf'

import Animations from './js/animations'

let container, controls, stats, mixer
let camera,
  scene,
  renderer,
  light,
  land = null,
  meshes = [],
  points = [],
  cycle = null
let fiveCyclesGroup = new THREE.Group(),
  clock = new THREE.Clock()
let mouseX = 0,
  mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

export default {
  data() {
    return {
      // 页面模型加载进度，0：未加载，100：加载完成
      loadingProcess: 0,
    }
  },
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      this.init()
      this.animate()
      // this.addClick()
    },
    init() {
      let _this = this
      // 创建场景
      scene = new THREE.Scene()
      // scene.background = new THREE.TextureLoader().load(bgTexture)
      // 增加雾
      scene.fog = new THREE.Fog(0xdddddd, 100, 120)

      // 创建相机
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(100, 100, 100)
      camera.lookAt(new THREE.Vector3(0, 0, 0))

      // 渲染器
      container = document.getElementById('container')
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      container.appendChild(renderer.domElement)

      // 网格
      // var grid = new THREE.GridHelper(100, 100, 0xefefef, 0xefefef)
      // grid.position.set(0, -8, 0)
      // grid.material.opacity = 0.2
      // grid.material.transparent = true
      // scene.add(grid)

      // 创建地面
      var planeGeometry = new THREE.PlaneGeometry(100, 100)
      // 透明材质显示阴影
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 })
      var plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotation.x = -0.5 * Math.PI
      plane.position.set(0, -8, 0)
      plane.receiveShadow = true
      scene.add(plane)

      // 透明材质显示阴影
      cycle = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshPhongMaterial({
          map: new THREE.TextureLoader().load(cycleTexture),
          transparent: true,
        })
      )
      cycle.rotation.x = -0.5 * Math.PI
      cycle.position.set(0, -9, 0)
      cycle.receiveShadow = true
      scene.add(cycle)

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001)
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a })
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(0, 0, 0)
      scene.add(cube)

      light = new THREE.DirectionalLight(0xffffff, 1)
      light.intensity = 1
      light.position.set(20, 20, 8)
      light.castShadow = true
      light.target = cube
      light.shadow.mapSize.width = 512 * 12
      light.shadow.mapSize.height = 512 * 12
      light.shadow.camera.top = 80
      light.shadow.camera.bottom = -30
      light.shadow.camera.left = -30
      light.shadow.camera.right = 80
      scene.add(light)

      const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red')
      scene.add(lightHelper)
      const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera)
      scene.add(lightCameraHelper)
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },

    animate() {
      requestAnimationFrame(this.animate)
      renderer.render(scene, camera)
      // stats && stats.update()
      // controls && controls.update()
      // TWEEN && TWEEN.update()
      // fiveCyclesGroup && (fiveCyclesGroup.rotation.y += 0.01)
      // let vertices = points.geometry.vertices
      // vertices &&
      //   vertices.forEach(function (v) {
      //     v.y = v.y - v.velocityY
      //     v.x = v.x - v.velocityX
      //     if (v.y <= 0) v.y = 60
      //     if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1
      //   })

      // 顶点变动之后需要更新，否则无法实现雨滴特效
      // points.geometry.verticesNeedUpdate = true

      // let time = clock.getDelta()
      // mixer && mixer.update(time)
    },

    // 增加点击事件
    addClick() {
      // 增加点击事件，声明raycaster和mouse变量
      let raycaster = new THREE.Raycaster()
      let mouse = new THREE.Vector2()
      function onMouseClick(event) {
        // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera(mouse, camera)
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(meshes)

        if (intersects.length > 0) {
          console.log(intersects[0].object)
        }
      }

      window.addEventListener('click', onMouseClick, false)
    },
  },
}
</script>

<style scoped>
.lunar_loading {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #bdc3c7;
  background: -webkit-linear-gradient(to right, #2c3e50, #bdc3c7);
  background: linear-gradient(to right, #2c3e50, #bdc3c7);
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 64px;
  color: #ffffff;
  text-shadow: 0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%), 0 3px 0 hsl(174, 5%, 70%),
    0 4px 0 hsl(174, 5%, 66%), 0 5px 0 hsl(174, 5%, 64%), 0 6px 0 hsl(174, 5%, 62%), 0 7px 0 hsl(174, 5%, 61%),
    0 8px 0 hsl(174, 5%, 60%), 0 0 5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.2),
    0 5px 10px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.3);
}
</style>
