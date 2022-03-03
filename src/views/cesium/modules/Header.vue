<template>
  <div class="header">
    <div class="left">logo</div>
    <div class="center">
      <dv-decoration-11 class="center-decoration">
        南方网络大数据平台
      </dv-decoration-11>
    </div>
    <div class="right">
      <a-icon
        v-if="!fullFlag"
        @click="fullscreen"
        type="fullscreen"
        class="icon"
      />
      <a-icon v-else @click="fullscreen" type="fullscreen-exit" class="icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      fullFlag: false,
    }
  },
  methods: {
    fullscreen() {
      const element = document.getElementById("app")
      if (this.fullFlag) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.fullFlag = !this.fullFlag
    },
  },
}
</script>

<style scoped lang="less" scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #010341;
  color: #fff;
  .left {
    flex: 20%;
  }
  .center {
    flex: 60%;
    margin: auto 0;
    .center-decoration {
      width: 100%;
      height: 70px;
      font-size: 28px;
    }
  }
  .right {
    flex: 20%;
    text-align: right;
    .icon {
      font-size: 28px;
      margin-right: 20px;
    }
  }
}
</style>
