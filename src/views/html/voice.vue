<template>
  <div class="page">
    <h2>输入播放的文字</h2>
    <a-textarea :rows="8" placeholder=" 请输入文字" allow-clear v-model="areaText" />
    <!-- <a-select v-model="voice" style="width:100%">
      <a-select-option v-for="(item, i) in voices" :key="i" :value="i">{{ item.name}}</a-select-option>
    </a-select> -->
    <a-button type="primary" @click="play">播放声音</a-button>
  </div>
</template>

<script>
const synth = window.speechSynthesis
const msg = new SpeechSynthesisUtterance()
export default {
  data() {
    return {
      areaText: '你来人间一趟，你要看看太阳',
    }
  },
  methods: {
    play() {
      if (!this.areaText) return
      msg.text = this.areaText
      msg.lang = 'zh-CN'
      synth.speak(msg)
    },
  },
  mounted() {
    this.play()
  },
}
</script>

<style lang="less" scoped>
.page {
  width: 300px;
  height: 500px;
  margin: auto;
  button {
    margin-top: 10px;
  }
}
</style>