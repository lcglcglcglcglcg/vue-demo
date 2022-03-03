<template>
  <div class="WarnInfo">
    <InfoHeader title="告警信息" />
    <div class="info-content">
      <div class="total-box">
        <div class="active">
          <dv-border-box-12>
            <div class="txt">活动告警</div>
            <div class="num">18314</div>
          </dv-border-box-12>
        </div>
        <div class="active">
          <dv-border-box-12>
            <div class="txt">历史告警</div>
            <div class="num">2116</div>
          </dv-border-box-12>
        </div>
      </div>
      <div class="item">
        <dv-border-box-12>
          <dv-charts :option="option" style="width:100%;height:100%;" />
          <span class="txt">告警分布</span>
        </dv-border-box-12>
      </div>
    </div>
  </div>
</template>
<script>
import InfoHeader from "./InfoHeader"
export default {
  name: "WarnInfo",
  components: { InfoHeader },
  props: {},
  data() {
    return {
      option: {
        color: ["#e66229", "#e6d606"],
        series: [
          {
            type: "pie",
            data: [
              { name: "重要", value: 1 },
              { name: "一般", value: 1 },
            ],
            radius: ["55%", "70%"],
            insideLabel: {
              // show: true,
            },
            outsideLabel: {
              formatter: (item) => item.name + item.value,
            },
          },
        ],
      },
    }
  },
}
</script>
<style lang="less" scoped>
.WarnInfo {
  width: 100%;
  height: 100%;
  .info-content {
    width: 100%;
    height: 80%;
    margin-top: 20px;
    .total-box {
      height: 30%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .active {
        width: 48%;
        height: 100%;
        border-radius: 5%;
        background-color: rgba(15, 26, 45, 0.5);
        /deep/ .border-box-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .txt {
            font-size: 18px;
          }
          .num {
            color: yellow;
            font-size: 22px;
          }
        }
      }
    }
    .item {
      width: 100%;
      height: 70%;
      margin-top: 20px;
      position: relative;
      border-radius: 5%;
      background-color: rgba(15, 26, 45, 0.5);
      .txt {
        font-size: 18px;
        font-weight: bold;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
