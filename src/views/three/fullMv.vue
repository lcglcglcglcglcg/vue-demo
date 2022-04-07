<template>
  <div class="big-container">
    <div class="screen-container" id="screenContainer" ref="screenContainer">
      <div class="video-container" id="videoContainer"></div>
      <div class="video-mask">
        <img src="./fullMvImage/play.png" @click="toggleVideo" alt="play.png" />
      </div>
      <div class="video-bar">
        <div class="video-btn" @click="toggleVideo">
          <img src="./fullMvImage/pause.png" class="btn-hidden" alt="pause.png" width="68%" />
          <img src="./fullMvImage/play.png" alt="pause.png" width="68%" />
        </div>
        <div class="progress-container">
          <div class="time-box">
            <span class="current-video-time">00:00</span>/<span class="total-video-time">00:00</span>
          </div>
          <div class="progress-wrapper">
            <div class="progress" id="progress-play"></div>
          </div>
        </div>
        <div class="full-screen" @click="toggleBigScreen">
          <img src="./fullMvImage/bigscreen.png" alt="bigscreen.png" width="68%" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'fullMv',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      mesh: null,

      video: null,
      player: null,
      playVariables: {
        playClick: true,
        isBigScreen: false,
      },
    }
  },
  mounted() {
    const element = document.getElementById('videoContainer')
    this.initScene()
    this.initCamera(element)
    this.initLight()
    this.initRenderer(element)
    this.initVideo()
    this.initContent()
    this.initControls(element)
    this.render()
  },
  components: {},
  methods: {
    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0x101010)
    },
    // 初始化相机
    initCamera(element) {
      this.camera = new THREE.PerspectiveCamera(75, element.offsetWidth / element.offsetHeight, 1, 10000)
      this.camera.position.set(1, 0, 0)
      this.camera.lookAt(0, 0, 0)
    },
    // 初始化光线
    initLight(element) {
      let ambientLight = new THREE.AmbientLight(0x999999)
      this.scene.add(ambientLight) // 环境光
    },

    // 初始化渲染器
    initRenderer(element) {
      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true, // canvas 截图需要设置
      })
      this.renderer.setPixelRatio(window.devicePixelRatio) // 为了兼容高清屏幕
      // 阴影效果
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.renderer.setSize(element.offsetWidth, element.offsetHeight)
      element.appendChild(this.renderer.domElement)
    },
    // 初始化视频
    initVideo() {
      this.video = document.createElement('video')
      this.video.preload = 'auto'
      this.video.crossOrigin = 'anonymous'
      this.video.src = require('./fullMvImage/video.mp4')
      this.player = this.video

      this.video.ontimeupdate = (e) => {
        const event = e.path[0]
        var totalTime = this.s_to_hs(Math.floor(event.duration))
        document.getElementsByClassName('total-video-time')[0].innerHTML = totalTime

        var currentTime = this.s_to_hs(Math.floor(event.currentTime))
        document.getElementsByClassName('current-video-time')[0].innerHTML = currentTime

        document.getElementById('progress-play').style.width = `${
          (Math.floor(event.currentTime) / Math.floor(event.duration)) * 100
        }%`

        if (currentTime === totalTime) {
          this.video.currentTime = 0
          this.toggleVideo()
          document.getElementsByClassName('video-mask')[0].style.display = 'block'
        }
      }
    },
    initContent() {
      let geometry = new THREE.SphereBufferGeometry(300, 90, 90)
      geometry.scale(-1, 1, 1)
      let texture = new THREE.VideoTexture(this.video)
      texture.minFilter = THREE.LinearFilter
      texture.format = THREE.RGBAFormat
      let material = new THREE.MeshBasicMaterial({
        map: texture,
      })
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 0, 0)
      this.scene.add(mesh)
    },
    // 初始化控制器
    initControls(element) {
      this.controls = new OrbitControls(this.camera, element)
      this.controls.minDistance = 1
      this.controls.maxDistance = 100
      // this.controls.enablePan = false
      // this.controls.enableDamping = true
      this.controls.dampingFactor = 0.25
      this.controls.enableZoom = true
    },

    // 窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    render() {
      //用效果合成器渲染
      requestAnimationFrame(this.render)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },

    toggleVideo() {
      var imgArr = document.getElementsByClassName('video-btn')[0].children
      if (this.playVariables.playClick) {
        imgArr[1].setAttribute('class', 'btn-hidden')
        imgArr[0].setAttribute('class', '')
        document.getElementsByClassName('video-mask')[0].style.display = 'none'
        this.playVariables.playClick = false
        this.player.play()
      } else {
        imgArr[0].setAttribute('class', 'btn-hidden')
        imgArr[1].setAttribute('class', '')
        this.playVariables.playClick = true
        this.player.pause()
      }
    },

    toggleBigScreen() {
      if (this.playVariables.isBigScreen) {
        this.exitFullscreen()
      } else {
        this.requestFullScreen()
      }
    },

    requestFullScreen() {
      var de = document.getElementById('screenContainer')
      if (de.requestFullscreen) {
        de.requestFullscreen()
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen()
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen()
      }
      this.playVariables.isBigScreen = true
    },

    exitFullscreen() {
      var de = document
      if (de.exitFullscreen) {
        de.exitFullscreen()
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen()
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen()
      }
      this.playVariables.isBigScreen = false
    },

    s_to_hs(s) {
      var h
      h = Math.floor(s / 60)
      s = s % 60
      h += ''
      s += ''
      h = h.length == 1 ? '0' + h : h
      s = s.length == 1 ? '0' + s : s
      return h + ':' + s
    },
  },
}
</script>

<style>
.big-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  height: 80vh;
}
.screen-container {
  width: 100%;
  height: 100%;
}
.video-container {
  width: 100%;
  height: 100%;
}
.video-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.video-mask img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
}
.video-bar {
  position: absolute;
  z-index: 10;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0em 1em;
  box-sizing: border-box;
  width: 100%;
  background-image: linear-gradient(to top, black, rgba(0, 0, 0, 0));
}
.video-btn {
  flex: 0 0 22px;
  cursor: pointer;
}
.progress-container {
  position: relative;
  flex: 1;
  padding: 0.8em;
  color: #ffffff;
  font-size: 14px;
}
.time-box {
  width: 80px;
  display: inline-block;
}
.progress-container .progress-wrapper {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 120px);
  height: 0.2em;
  border-radius: 30px;
  background-color: rgba(150, 150, 150, 1);
  cursor: pointer;
}
.progress-wrapper .progress {
  position: absolute;
  width: 0%;
  height: 100%;
  background-color: rgb(22, 175, 236);
  transition: width 0.5s;
}
.progress::after {
  content: '';
  display: block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #ffffff;
  cursor: pointer;
}
.full-screen {
  flex: 0 0 22px;
  cursor: pointer;
}
.btn-hidden {
  display: none;
}
</style>
