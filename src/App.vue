<template>
  <div id="app">
    <!-- <a-button @click="newPhoto">点击</a-button> -->
    <a-button class="snapshotBtn" type="primary" @click="newPhoto">快照测试</a-button>
    <router-view />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  data() {
    return {}
  },
  methods: {
    newPhoto() {
      console.log('快照')
      const html = document.getElementById('app')
      const options = {
        // 未生效
        useCORS: true, // 跨域
        preserveDrawingBuffer: true,
        foreignObjectRendering: true,
        allowTaint: true, // 允许污染
      }
      html2canvas(html, options).then(async (canvas) => {
        const dataUrl = canvas.toDataURL('image/png', 1)

        let link = document.createElement('a')
        link.href = dataUrl
        link.download = '1.png'
        link.click()
        URL.revokeObjectURL(link.href)
      })
    },
  },
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100vh;
  position: relative;
  .snapshotBtn {
    position: absolute;
    top: 0;
    left: 5%;
    z-index: 99;
    opacity: 0.4;
    &:hover {
      opacity: 1;
      transition: opacity 1s;
    }
  }
}
</style>
