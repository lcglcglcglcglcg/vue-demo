<template>
  <div>
    <div id="container"></div>
    <div v-if="loadingProcess !== 100" class="olympic_loading">
      <div class="box">{{ loadingProcess }} %</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

//此处加载gltf模型，故使用GLFTLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
//其他模型加载器
// import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'

import Animations from './js/animations'

import skyTexture from './images/sky.jpg'
import snowTexture from './images/snow.png'
import treeTexture from './images/tree.png'
import flagTexture from './images/flag.png'
// require('./libs/GLTFLoader.js')

let container, controls, stats, mixer
let camera,
  scene,
  renderer,
  light,
  land = null,
  meshes = [],
  points = []
let fiveCyclesGroup = new THREE.Group(),
  clock = new THREE.Clock()
let mouseX = 0,
  mouseY = 0
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

export default {
  data() {
    return {
      loadingProcess: 0,
    }
  },
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      console.log('initThree: ')
      this.init()
      this.animate()
      this.addClick()
    },
    init() {
      let _this = this
      // 创建场景
      scene = new THREE.Scene()
      scene.background = new THREE.TextureLoader().load(skyTexture)
      scene.fog = new THREE.Fog(0xffffff, 10, 100)
      // 创建相机
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, 30, 100)
      camera.lookAt(new THREE.Vector3(0, 0, 0))

      // 创建渲染器
      // 抗锯齿
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true, // canvas 截图需要设置
      })
      // 设置像素比
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // // 0: THREE.BasicShadowMap, 1: THREE.PCFShadowMap, 2: THREE.PCFSoftShadowMap
      container = document.getElementById('container')
      container.appendChild(renderer.domElement)

      // 性能工具
      // stats = new Stats()
      // document.documentElement.appendChild(stats.dom)

      // 创建立方体
      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001)
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a })
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(0, 0, 0)

      // 创建光源
      // 环境光( AmbientLight )：笼罩在整个空间无处不在的光
      // 点光源( PointLight )：向四面八方发射的单点光源
      // 聚光灯( SpotLight )：发射出锥形状的光， 模拟手电筒，台灯等光源
      // 平行光( DirectinalLight )：平行的一束光，模拟从很远处照射的太阳光
      light = new THREE.DirectionalLight(0xffffff, 1)
      light.intensity = 1
      light.position.set(16, 16, 8)
      light.castShadow = true
      light.target = cube
      light.shadow.mapSize.width = 512 * 12
      light.shadow.mapSize.height = 512 * 12
      light.shadow.camera.top = 40
      light.shadow.camera.bottom = -40
      light.shadow.camera.left = -40
      light.shadow.camera.right = 40

      scene.add(light)

      // 光线辅助线
      // const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red')
      // scene.add(lightHelper)
      // const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera)
      // scene.add(lightCameraHelper)

      // 环境光照亮场景
      let ambientLight = new THREE.AmbientLight(0xcfffff)
      ambientLight.intensity = 1
      scene.add(ambientLight)

      // 控制器
      controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 0, 0)
      controls.enableDamping = true
      controls.enablePan = false
      controls.enableZoom = false

      // 垂直旋转角度限制
      controls.minPolarAngle = 1.4
      controls.maxPolarAngle = 1.8

      // 水平旋转角度限制
      controls.minAzimuthAngle = -0.8
      controls.maxAzimuthAngle = 0.8

      // 加载管理器
      const manager = new THREE.LoadingManager()
      manager.onStart = (url, loaded, total) => {}
      manager.onLoad = () => {
        console.log('Loading complete!')
      }
      manager.onProgress = async (url, loaded, total) => {
        if (Math.floor((loaded / total) * 100) === 100) {
          _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout)

          _this.loadingProcessTimeout = setTimeout(() => {
            _this.loadingProcess = Math.floor((loaded / total) * 100)
            Animations.animateCamera(camera, controls, { x: 0, y: -1, z: 20 }, { x: 0, y: 0, z: 5 }, 3600, () => {})
          }, 800)
        } else {
          _this.loadingProcess = Math.floor((loaded / total) * 100)
        }
      }

      // 添加地面
      let loader = new GLTFLoader(manager)
      // 设置跨域
      loader.setCrossOrigin('anonymous')
      loader.load(window.publicPath + '/models/land.glb', (mesh) => {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material.metalness = 0.1
            child.material.roughness = 0.8
            // 地面
            if (child.name === 'Mesh_2') {
              child.material.metalness = 0.5
              child.receiveShadow = true
            }
            // 围巾
            if (child.name === 'Mesh_17') {
              child.material.metalness = 0.2
              child.material.roughness = 0.8
            }
            // 帽子
            if (child.name === 'Mesh_17') {
            }
          }
        })

        mesh.scene.rotation.y = Math.PI / 4
        mesh.scene.position.set(15, -20, 0)
        mesh.scene.scale.set(0.9, 0.9, 0.9)

        land = mesh.scene

        scene.add(land)
      })

      // 旗帜
      loader.load(window.publicPath + '/models/flag.glb', (mesh) => {
        mesh.scene.traverse((child) => {
          if (child.isMesh) {
            meshes.push(child)
            child.castShadow = true

            // 旗帜
            if (child.name === 'mesh_0001') {
              child.material.metalness = 0.1
              child.material.roughness = 0.1
              child.material.map = new THREE.TextureLoader().load(flagTexture)
            }

            // 旗杆
            if (child.name === '柱体') {
              child.material.metalness = 0.6
              child.material.roughness = 0
              child.material.refractionRatio = 1
              child.material.color = new THREE.Color(0xeeeeee)
            }
          }
        })

        mesh.scene.rotation.y = Math.PI / 24
        mesh.scene.position.set(2, -7, -1)
        mesh.scene.scale.set(4, 4, 4)

        // 动画
        let meshAnimation = mesh.animations[0]
        mixer = new THREE.AnimationMixer(mesh.scene)

        let animationClip = meshAnimation
        let clipAction = mixer.clipAction(animationClip).play()

        animationClip = clipAction.getClip()
        scene.add(mesh.scene)
      })

      // bingdwendwen
      loader.load(window.publicPath + '/models/bingdwendwen.glb', function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)

            if (child.name === '皮肤') {
              child.material.metalness = 0.3
              child.material.roughness = 0.8
            }

            if (child.name === '外壳') {
              child.material.transparent = true
              child.material.opacity = 0.4
              child.material.metalness = 0.4
              child.material.roughness = 0
              child.material.refractionRatio = 1.6
              child.castShadow = true
              child.material.envMap = new THREE.TextureLoader().load(skyTexture)
              child.material.envMapIntensity = 1
            }

            if (child.name === '围脖') {
              child.material.transparent = true
              child.material.opacity = 0.6
              child.material.metalness = 0.4
              child.material.roughness = 0.6
            }
          }
        })

        mesh.scene.rotation.y = Math.PI / 24
        mesh.scene.position.set(-5, -11.5, 0)
        mesh.scene.scale.set(24, 24, 24)

        scene.add(mesh.scene)
      })

      // xuerongrong
      loader.load(window.publicPath + '/models/xuerongrong.glb', function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true
            meshes.push(child)
          }
        })

        mesh.scene.rotation.y = Math.PI / 3
        mesh.scene.position.set(-20, -10.8, 0)
        mesh.scene.scale.set(12, 12, 12)

        scene.add(mesh.scene)
      })

      // 添加树
      let treeMaterial = new THREE.MeshPhysicalMaterial({
        map: new THREE.TextureLoader().load(treeTexture),
        transparent: true,
        side: THREE.DoubleSide,
        metalness: 0.2,
        roughness: 0.8,
        depthTest: true,
        depthWrite: false,
        // skinning: false,
        fog: false,
        reflectivity: 0.1,
        refractionRatio: 0,
      })

      let treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: new THREE.TextureLoader().load(treeTexture),
        alphaTest: 0.5,
      })

      loader.load(window.publicPath + '/models/tree.gltf', function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material = treeMaterial
            child.custromMaterial = treeCustomDepthMaterial
          }
        })

        mesh.scene.position.set(14, -9, 0)
        mesh.scene.scale.set(16, 16, 16)
        scene.add(mesh.scene)

        let tree2 = mesh.scene.clone()
        tree2.position.set(10, -8, -15)
        tree2.scale.set(18, 18, 18)
        scene.add(tree2)

        let tree3 = mesh.scene.clone()
        tree3.position.set(-18, -8, -16)
        tree3.scale.set(22, 22, 22)
        scene.add(tree3)
      })

      // 创建五环
      const fiveCycles = [
        { key: 'cycle_0', color: 0x0885c2, position: { x: -250, y: 0, z: 0 } },
        { key: 'cycle_1', color: 0x000000, position: { x: -10, y: 0, z: 5 } },
        { key: 'cycle_2', color: 0xed334e, position: { x: 230, y: 0, z: 0 } },
        {
          key: 'cycle_3',
          color: 0xfbb132,
          position: { x: -125, y: -100, z: -5 },
        },
        {
          key: 'cycle_4',
          color: 0x1c8b3c,
          position: { x: 115, y: -100, z: 10 },
        },
      ]

      fiveCycles.map((item) => {
        let cycleMesh = new THREE.Mesh(
          new THREE.TorusGeometry(100, 10, 10, 50),
          new THREE.MeshLambertMaterial({
            color: new THREE.Color(item.color),
            side: THREE.DoubleSide,
          })
        )

        cycleMesh.castShadow = true
        cycleMesh.position.set(item.position.x, item.position.y, item.position.z)
        meshes.push(cycleMesh)
        fiveCyclesGroup.add(cycleMesh)
      })

      fiveCyclesGroup.scale.set(0.036, 0.036, 0.036)
      fiveCyclesGroup.position.set(0, 10, -8)
      scene.add(fiveCyclesGroup)

      // 创建雪花
      let texture = new THREE.TextureLoader().load(snowTexture)
      let geometry = new THREE.BufferGeometry()
      let pointsMaterial = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        opacity: 0.8,
        map: texture,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthTest: false,
      })

      let range = 100
      let vertices = []
      for (let i = 0; i < 1500; i++) {
        let vertice = new THREE.Vector3(
          Math.random() * range - range / 2,
          Math.random() * range * 1.5,
          Math.random() * range - range / 2
        )
        // 纵向移动速度
        vertice.velocityY = 0.1 + Math.random() / 3
        // 横向移动速度
        vertice.velocityX = (Math.random() - 0.5) / 3
        vertices.push(vertice)
        // 将顶点加入几何
        // geometry.vertices.push(vertice) // 旧版本 失效
      }

      // 将顶点加入几何
      geometry.setFromPoints(vertices)

      geometry.center()
      points = new THREE.Points(geometry, pointsMaterial)
      points.position.y = -30
      scene.add(points)

      window.addEventListener('resize', this.onWindowResize, false)
    },

    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    },

    animate() {
      requestAnimationFrame(this.animate)
      renderer.render(scene, camera)
      stats && stats.update()
      controls && controls.update()
      TWEEN && TWEEN.update()
      fiveCyclesGroup && (fiveCyclesGroup.rotation.y += 0.01)
      let vertices = points.geometry.vertices
      vertices &&
        vertices.forEach(function (v) {
          v.y = v.y - v.velocityY
          v.x = v.x - v.velocityX
          if (v.y <= 0) v.y = 60
          if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1
        })

      // 顶点变动之后需要更新，否则无法实现雨滴特效
      points.geometry.verticesNeedUpdate = true

      let time = clock.getDelta()
      mixer && mixer.update(time)
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
.olympic_loading {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #ffffff url('./images/panda.png') no-repeat left center;
  background-size: auto 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 120px;
  color: #2d2d2d;
  text-shadow: 0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%), 0 3px 0 hsl(174, 5%, 70%),
    0 4px 0 hsl(174, 5%, 66%), 0 5px 0 hsl(174, 5%, 64%), 0 6px 0 hsl(174, 5%, 62%), 0 7px 0 hsl(174, 5%, 61%),
    0 8px 0 hsl(174, 5%, 60%), 0 0 5px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.2),
    0 5px 10px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.3);
}
</style>
