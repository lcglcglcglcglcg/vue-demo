<template>
  <div id="container" ref="container"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import { sRGBEncoding } from 'three'
//此处加载gltf模型，故使用GLFTLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
//其他模型加载器
// import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'
import dat from 'dat.gui'

let scene, camera, renderer, controls
let group, textMesh1, textMesh2, textGeo, materials
let cube, sphere
export default {
  data() {
    return {
      step: 0,
      controls: {
        rotationSpeed: 0.5,
        bouncingSpeed: 0.5,
      },
    }
  },
  mounted() {
    // this.initgui()
    this.init()
    this.load3D()
    this.initControls()
    this.animate()
  },
  methods: {
    init() {
      // 创建场景
      scene = new THREE.Scene()

      // 创建相机对象
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(40, 40, 40) //设置相机位置
      camera.lookAt(0, 0, 0)

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setClearColor(0xeeeeee) //背景色
      renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
      renderer.setSize(window.innerWidth, window.innerHeight) // 改成这样就可以居中
      renderer.shadowMap.enabled = true //启用阴影

      let container = document.getElementById('container')
      container.appendChild(renderer.domElement)

      // 坐标箭头 添加几何体
      this.initAxes()

      // 划线
      this.drawLine()

      // this.createText()

      // 环境光
      let ambient = new THREE.AmbientLight('#523318', 1)
      scene.add(ambient)
      // scene.add(new THREE.AmbientLight(0x999999)) // 环境光
      // // 半球光源
      // let light = new THREE.HemisphereLight()
      // this.scene.add(light)
      // // 平行光
      // let directionLight = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI)
      // directionLight.position.set(2, 2, 2)
      // this.scene.add(directionLight)

      renderer.render(scene, camera)
    },
    //添加坐标系球体
    initAxes() {
      //添加坐标轴
      let axes = new THREE.AxesHelper(20)
      scene.add(axes)

      //平面
      let planeGeometry = new THREE.PlaneGeometry(60, 20)
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc })
      let plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.receiveShadow = true
      plane.rotation.x = -0.5 * Math.PI
      scene.add(plane)

      let spotLight = new THREE.SpotLight(0xffffff)
      spotLight.position.set(40, 80, -20)
      spotLight.castShadow = true
      scene.add(spotLight)

      //方体
      let cubeGeometry = new THREE.BoxGeometry(5, 5, 5)
      let cubeMaterial = new THREE.MeshNormalMaterial({ color: 0xffee6b })
      cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.castShadow = true
      cube.position.x = -10
      cube.position.y = 10
      //加载纹理
      new THREE.TextureLoader().load(window.publicPath + '/test.jpg', (texture) => {
        cube.material = new THREE.MeshLambertMaterial({ map: texture })
      })
      scene.add(cube)

      //球体
      let sphereGeometry = new THREE.SphereGeometry(2, 20, 20)
      let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff })
      sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.castShadow = true
      sphere.position.x = 20
      sphere.position.y = 5
      sphere.position.z = 0
      //加载纹理
      new THREE.TextureLoader().load(window.publicPath + '/test.jpg', (texture) => {
        sphere.material = new THREE.MeshLambertMaterial({ map: texture })
      })
      scene.add(sphere)
    },
    initgui() {
      const gui = new dat.GUI() // gui监测器
      gui.add(this.controls, 'rotationSpeed', 0, 1).name('旋转速度')
      gui.add(this.controls, 'bouncingSpeed', 0, 1).name('跳跃速度')
    },
    // 加载3D模型
    load3D() {
      const loader = new GLTFLoader()
      loader.load(
        window.publicPath + '/xuerongrong.glb',
        (gltf) => {
          // console.log('gltf: ', gltf)
          // gltf.scene.position.set(0, 0, 0)
          scene.add(gltf.scene)
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.error(error)
        }
      )
      this.render()
    },
    // 控件
    initControls() {
      controls = new OrbitControls(camera, renderer.domElement)
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      controls.enableDamping = true
      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      //controls.dampingFactor = 0.25;
      //是否可以缩放
      controls.enableZoom = true
      //是否自动旋转
      controls.autoRotate = true
      //设置相机距离原点的最远距离
      controls.minDistance = 50
      //设置相机距离原点的最远距离
      controls.maxDistance = 1000
      //是否开启右键拖拽
      controls.enablePan = true
    },
    // 画线
    drawLine() {
      // 创建材质
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
      const points = []
      points.push(new THREE.Vector3(0, 0, 0))
      points.push(new THREE.Vector3(0, 10, 0))
      points.push(new THREE.Vector3(10, 0, 0))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    },
    // 文字
    createText() {
      const MAX_POINTS = 500
      // geometry
      const geometry = new THREE.BufferGeometry()

      // attributes
      const positions = new Float32Array(MAX_POINTS * 3) // 3 vertices per point
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      // draw range
      const drawCount = 2 // draw the first 2 points, only
      geometry.setDrawRange(0, drawCount)

      // material
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

      // line
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    },
    animate() {
      let { controls } = this
      // 再次调用animate方法实现刷新
      requestAnimationFrame(this.animate)
      //旋转方体
      cube.rotation.x += controls.rotationSpeed
      cube.rotation.y += controls.rotationSpeed

      //弹跳球
      this.step += controls.bouncingSpeed
      sphere.position.x = 10 + 10 * Math.cos(this.step)
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(this.step))

      // 开启阻尼时需要update
      // controls.update();

      renderer.render(scene, camera)
    },
    // 窗口监听函数
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
    },
    render() {
      // 再次调用animate方法实现刷新
      // requestAnimationFrame(this.render)
      renderer.render(scene, camera)
    },
  },
}
</script>

<style></style>
