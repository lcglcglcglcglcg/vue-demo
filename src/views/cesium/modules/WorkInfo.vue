<template>
  <div class="WarnInfo">
    <InfoHeader title="工单信息" />
    <div class="info-content">
      <div class="total-box">
        <div class="active">
          <dv-border-box-12>
            <div class="txt">重要告警工单数</div>
            <div class="num">0</div>
          </dv-border-box-12>
        </div>
        <div class="active">
          <dv-border-box-12>
            <div class="txt">一般告警工单数</div>
            <div class="num">0</div>
          </dv-border-box-12>
        </div>
        <div class="active">
          <dv-border-box-12>
            <div class="txt">性能告警工单数</div>
            <div class="num">0</div>
          </dv-border-box-12>
        </div>
        <div class="active">
          <dv-border-box-12>
            <div class="txt">设备原始告警工单数</div>
            <div class="num">0</div>
          </dv-border-box-12>
        </div>
      </div>
      <div class="handle">
        <dv-border-box-12>
          <span class="txt">待受理工单数</span>
          <span class="num">100</span>
        </dv-border-box-12>
      </div>
      <div class="handle">
        <dv-border-box-12>
          <span class="txt">待受理工单数</span>
          <span class="num">100</span>
        </dv-border-box-12>
      </div>
    </div>
  </div>
</template>
<script>
import InfoHeader from './InfoHeader'
export default {
  name: 'WarnInfo',
  components: { InfoHeader },
  props: {},
  data() {
    return {}
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
      height: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .active {
        width: 48%;
        height: 40%;
        background-color: rgba(15, 26, 45, 0.5);
        border-radius: 5%;
        /deep/ .border-box-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          &:nth-of-type(n + 3) {
            margin-top: 20px;
          }
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
    .handle {
      height: 20%;
      /deep/ .border-box-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
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
}
</style>
