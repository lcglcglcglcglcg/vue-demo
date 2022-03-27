<template>
  <!-- 工具箱 -->
  <div class="toolkit">
    <div @click="toolkibtnShow" class="toolkibtn">
      <img src="~@/assets/toolkibtn/工具箱.png" alt="" />
      <p>工具箱</p>
    </div>
    <div v-show="maptoolkishow" class="maptoolki">
      <div @click="resetKey" class="restoration">
        <img src="~@/assets/toolkibtn/复位.png" alt="" />
        <p>复位</p>
      </div>
      <div @click="onSelectDistance(true)" class="restoration">
        <img src="~@/assets/toolkibtn/测面.png" alt="" />
        <p>测量</p>
      </div>
      <div @click="onSelectDistance(false)" class="restoration">
        <img src="~@/assets/toolkibtn/清除.png" alt="" />
        <p>清除</p>
      </div>
      <div @click="zoomIn" class="restoration">
        <img src="~@/assets/toolkibtn/放大.png" alt="" />
        <p>放大</p>
      </div>
      <div @click="zoomOut" class="restoration">
        <img src="~@/assets/toolkibtn/缩小.png" alt="" />
        <p>缩小</p>
      </div>
      <div class="restoration">
        <div @click="showCutmapBtn" class="basemapCut">
          <img v-if="cutimg === true" src="~@/assets/toolkibtn/卫星.png" alt="" />
          <img v-if="cutimg === false" src="~@/assets/toolkibtn/卫星_52.png" alt="" />
          <p v-if="cutTixt === true">基础</p>
          <p v-if="cutTixt === false">卫星</p>
        </div>
        <div v-show="showCutmap" class="cutmap">
          <div @click="change_vec(1)" class="mapWorld">
            <img src="~@/assets/toolkibtn/卫星.png" alt="" />
            <span>基础</span>
          </div>
          <div @click="change_vec(2)" class="mapWorld">
            <img src="~@/assets/toolkibtn/卫星_52.png" alt="" />
            <span>卫星</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      maptoolkishow: false,
      showCutmap: false,
    }
  },
  methods: {
    // 隐藏展开工具箱
    toolkibtnShow() {
      this.maptoolkishow = !this.maptoolkishow
    },
    // 复位
    resetKey() {
      console.log('resetKey: ')
      this.$emit('resetKey')
    },
    // 测距和取消
    onSelectDistance(type) {
      console.log('onSelectDistance: ')
      this.$emit('onSelectDistance', type)
    },
    // 放大
    zoomIn() {
      console.log('zoomIn')
      this.$emit('zoomIn')
    },
    // 缩小
    zoomOut() {
      console.log('zoomOut')
      this.$emit('zoomOut')
    },
    // 卫星图显示隐藏
    showCutmapBtn() {
      console.log('showCutmapBtn')
      this.showCutmap = !this.showCutmap
    },
    // 切换地图
    change_vec(type) {
      console.log('change_vec')
      this.$emit('change_vec', type)
    },
  },
}
</script>

<style></style>
