<template>
  <div class="page">
    <div id="test" @click="fullScreenClick">测试div</div>
  </div>
</template>

<script>
import { fullScreen, exitScreen, isFullscreenForNoScroll, windowResize } from '@/utils/util'
export default {
  name: 'TestPage',
  data() {
    return {
      //设置当前全屏状态的初始值为 false
      fullScreen: false,
      timer: null,
    }
  },
  methods: {
    setStyle(type) {
      const testDiv = document.getElementById('test')
      let fullWidth = `${document.documentElement.clientWidth}`
      let fullHeight = `${document.documentElement.clientHeight}`
      console.log('fullWidth: ', fullWidth, fullHeight)
      if (type) {
        testDiv.style.width = fullWidth + 'px'
        testDiv.style.height = fullHeight + 'px'
      } else {
        testDiv.style.width = fullWidth - 500 + 'px'
        testDiv.style.height = fullHeight - 500 + 'px'
      }
    },
    // 全屏按钮\退出全屏按钮点击事件
    fullScreenClick() {
      this.fullScreen = !this.fullScreen
      if (this.fullScreen) {
        //当前要启动全屏
        //this.pageFullScreen();//执行全屏之后的一些操作
        this.setStyle(1)
        // this.windowFullScreen()
        fullScreen()
      } else {
        //当前要退出全屏
        //this.pageExitFullScreen();//执行退出全屏之后的一些操作
        this.setStyle()
        exitScreen()
        // this.windowExitFullScreen()
      }
    },
    //启动全屏
    windowFullScreen() {
      let docElm = document.documentElement
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen()
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      }
    },
    //退出全屏
    windowExitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    },
    //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
    checkFull() {
      //火狐浏览器
      let isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },

    init() {
      //由于 全屏状态下 ，按 "Esc" 键退出全屏，浏览器监听不到 "Esc" 键的事件，所以需要通过浏览器窗口大小改变的事件去触发退出全屏事件
      window.addEventListener('resize', () => {
        //增加 timer 定时器的原因是全屏和退出全屏的事件会触发两次窗口大小改变事件，做一次过滤
        if (this.timer) return
        this.timer = setTimeout(() => {
          // 如果是按 "Esc" 键退出全屏，窗口状态已经是非全屏，但是之前记录的状态还是全屏的状态
          if (!this.checkFull() && this.fullScreen) {
            console.log('resize 执行了')
            //退出全屏状态。。。
            this.fullScreen = false
            this.setStyle()
          } else {
            //进入全屏状态。。。
            console.log('全屏')
            this.setStyle(1)
          }
          clearTimeout(this.timer)
          this.timer = null
        }, 0)
      })
    },
  },
  mounted() {
    this.init()
    this.setStyle()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
  #test {
    background-color: hotpink;
  }
}
</style>
