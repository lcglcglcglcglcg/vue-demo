<template>
  <div class="screen-wrapper">
    <div class="screen" id="screen">
      <div class="demo-root">
        <header>头部</header>
        <main>
          <div className="demo-left"></div>
          <div class="demo-center"></div>
          <div class="demo-right"></div>
        </main>
        <footer>底部</footer>
      </div>
    </div>
    <footer class="large-footer"></footer>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  /*
        js  ---vue
    */
  mounted() {
    //初始化自适应  ----在刚显示的时候就开始适配一次
    this.handleScreenAuto()
    //绑定自适应函数   ---防止浏览器栏变化后不再适配
    window.onresize = () => this.handleScreenAuto()
  },
  deleted() {
    window.onresize = null
  },
  methods: {
    //数据大屏自适应函数
    handleScreenAuto() {
      const designDraftWidth = 1920 //设计稿的宽度
      const designDraftHeight = 960 //设计稿的高度
      //根据屏幕的变化适配的比例
      const scale =
        document.documentElement.clientWidth / document.documentElement.clientHeight <
        designDraftWidth / designDraftHeight
          ? document.documentElement.clientWidth / designDraftWidth
          : document.documentElement.clientHeight / designDraftHeight
      //缩放比例
      document.querySelector('#screen').style.transform = `scale(${scale}) translate(-50%)`
    },
  },
}
</script>

<style lang="less" scoped>
.screen-wrapper {
  height: 100%;
  width: 100%;
  .screen {
    display: inline-block;
    width: 1920px;
    height: 960px;
    transform-origin: 0 0;
    position: absolute;
    left: 50%;
    .demo-root {
      header {
        width: 1920px;
        height: 200px;
        background: rgba(53, 150, 206, 0.3);
        font-size: 40px;
        text-align: center;
        line-height: 200px;
      }
      main {
        display: flex;
        height: 660px;
        div {
          width: 640px;
          height: 100%;
        }
        .demo-left {
          background: rgba(206, 52, 154, 0.3);
        }
        .demo-center {
          background: rgba(13, 30, 179, 0.3);
        }
        .demo-right {
          background: rgba(64, 163, 6, 0.849);
        }
      }
      footer {
        width: 100%;
        height: 100px;
        font-size: 40px;
        text-align: center;
        line-height: 100px;
        background: rgba(19, 211, 115, 0.3);
      }
    }
  }
}
</style>