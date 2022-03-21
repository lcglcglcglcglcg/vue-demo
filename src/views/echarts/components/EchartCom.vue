<template>
  <div class="echartBox">
    <!-- <div v-if="name" class="echartTitle">{{ name }}</div> -->
    <div :id="id" :style="{ width: '100%', height: height + 'px' }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    option: {
      type: Object,
      default: () => {},
    },
    height: {
      type: Number,
      default: 350,
    },
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dayjs,
      myChart: null,
    }
  },
  mounted() {
    setTimeout(() => this.init(), 100)
  },
  methods: {
    init() {
      let chartDom = document.getElementById(this.id)
      this.myChart = echarts.init(chartDom)
      this.myChart && this.setOption()

      // 窗口变动
      window.addEventListener('resize', () => {
        this.myChart && this.myChart.resize()
      })
    },
    setOption() {
      this.myChart && this.myChart.setOption(this.option)
    },
  },
}
</script>

<style lang="less">
.echartBox {
  position: relative;
  .echartTitle {
    position: absolute;
    top: 10px;
    left: 30px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}
</style>
