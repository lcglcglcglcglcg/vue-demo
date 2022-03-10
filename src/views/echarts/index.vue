<template>
  <div class="page">
    <div class="box">
      <!-- 数据1 -->
      <div class="title">图表展示</div>
      <EchartCom id="EchartCom" ref="EchartCom" :option="option" name="速度" />
    </div>
    <div class="box">
      <!-- 数据1 -->
      <div class="title">图表展示</div>
      <EchartCom id="EchartCom1" ref="EchartCom" :option="option" name="质量" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import EchartCom from './components/EchartCom'
import { DemoOption } from './js/options'
import { DemoData } from './js/mock'
export default {
  components: { EchartCom },
  data() {
    return {
      option: {},
      list: [],
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.option = DemoOption
      this.list = DemoData
      this.handleData()
    },
    handleData() {
      const fileds = ['r', 'p', 'height']
      const { xArr, yObj } = this.handleArrData(this.list, fileds, 'MM-DD HH:mm')
      this.option.xAxis.data = xArr
      this.option.series[0].data = yObj['r']
      this.option.series[1].data = yObj['p']
      this.option.series[2].data = yObj['height']
      this.$refs['EchartCom'].setOption()
      this.$refs['EchartCom1'].setOption()
    },
    handleArrData(dataArr, fileds, format = 'YYYY-MM-DD HH:mm:ss') {
      const tempArr = format.split(' ')
      let newFormat = tempArr[1] + '\n' + tempArr[0]
      let xArr = []
      let yObj = {}
      fileds.forEach((v) => (yObj[v] = []))
      dataArr.map((item) => {
        xArr.push(dayjs(item.currentTime).format(newFormat))
        fileds.forEach((val) => {
          yObj[val].push(item[val])
        })
      })
      return { xArr, yObj }
    },
  },
}
</script>

<style lang="less" scoped>
.page {
  .box {
    padding: 50px 10px 0 10px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
    .title {
      font-size: 20px;
      color: #333;
      margin-bottom: 10px;
    }
  }
}
</style>
