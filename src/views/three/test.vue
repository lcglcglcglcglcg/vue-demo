<template>
  <div id="page"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
let cameraPersp, cameraOrtho, currentCamera
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
      renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)

      document.getElementById('page').appendChild(renderer.domElement)

      const aspect = window.innerWidth / window.innerHeight

      cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000)
      cameraOrtho = new THREE.OrthographicCamera(-600 * aspect, 600 * aspect, 600, -600, 0.01, 30000)
      currentCamera = cameraPersp

      currentCamera.position.set(1000, 500, 1000)
      currentCamera.lookAt(0, 200, 0)

      scene = new THREE.Scene()
      scene.add(new THREE.GridHelper(1000, 10, 0x888888, 0x444444))

      const light = new THREE.DirectionalLight(0xffffff, 2)
      light.position.set(1, 1, 1)
      scene.add(light)

      orbit = new OrbitControls(currentCamera, renderer.domElement)
      orbit.update()
      orbit.addEventListener('change', this.render)

      control = new TransformControls(currentCamera, renderer.domElement)
      control.addEventListener('change', this.render)

      control.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value
      })

      // control.setMode('scale')
      control.setSize(1.2)

      const texture = new THREE.TextureLoader().load(require('./image/crate.gif'), this.render)
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const geometry = new THREE.BoxGeometry(50, 50, 50)
      const material = new THREE.MeshLambertMaterial({ color: 0x000000 })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      control.attach(mesh)
      scene.add(control)

      window.addEventListener('resize', this.onWindowResize)

      window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
          case 81: // Q
            control.setSpace(control.space === 'local' ? 'world' : 'local')
            break

          case 16: // Shift
            control.setTranslationSnap(100)
            control.setRotationSnap(THREE.MathUtils.degToRad(15))
            control.setScaleSnap(0.25)
            break

          case 87: // W
            control.setMode('translate')
            break

          case 69: // E
            control.setMode('rotate')
            break

          case 82: // R
            control.setMode('scale')
            break

          case 67: // C
            const position = currentCamera.position.clone()

            currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp
            currentCamera.position.copy(position)

            orbit.object = currentCamera
            control.camera = currentCamera

            currentCamera.lookAt(orbit.target.x, orbit.target.y, orbit.target.z)
            this.onWindowResize()
            break

          case 86: // V
            const randomFoV = Math.random() + 0.1
            const randomZoom = Math.random() + 0.1

            cameraPersp.fov = randomFoV * 160
            cameraOrtho.bottom = -randomFoV * 500
            cameraOrtho.top = randomFoV * 500

            cameraPersp.zoom = randomZoom * 5
            cameraOrtho.zoom = randomZoom * 5
            this.onWindowResize()
            break

          case 187:
          case 107: // +, =, num+
            control.setSize(control.size + 0.1)
            break

          case 189:
          case 109: // -, _, num-
            control.setSize(Math.max(control.size - 0.1, 0.1))
            break

          case 88: // X
            control.showX = !control.showX
            break

          case 89: // Y
            control.showY = !control.showY
            break

          case 90: // Z
            control.showZ = !control.showZ
            break

          case 32: // Spacebar
            control.enabled = !control.enabled
            break

          case 27: // Esc
            control.reset()
            break
        }
      })
      window.addEventListener('keyup', (event) => {
        switch (event.keyCode) {
          case 16: // Shift
            control.setTranslationSnap(null)
            control.setRotationSnap(null)
            control.setScaleSnap(null)
            break
        }
      })
    },

    onWindowResize() {
      const aspect = window.innerWidth / window.innerHeight

      cameraPersp.aspect = aspect
      cameraPersp.updateProjectionMatrix()

      cameraOrtho.left = cameraOrtho.bottom * aspect
      cameraOrtho.right = cameraOrtho.top * aspect
      cameraOrtho.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)

      this.render()
    },
    render() {
      renderer.render(scene, currentCamera)
    },
  },
}
</script>

<style lang="less">
#page {
  margin: 0 auto;
  // canvas {
  //   width: 100% !important;
  //   height: 100% !important;
  // }
}
</style>
