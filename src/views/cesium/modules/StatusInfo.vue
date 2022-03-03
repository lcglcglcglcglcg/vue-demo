<template>
  <div class="StatusInfo">
    <InfoHeader title="状态信息" />
    <div class="info-content">
      <div class="item">
        <dv-border-box-12>
          <img class="img" src="../icon/station_error.png" alt="" />
          <img class="arrow" src="../icon/arrow1.png" alt="" />
          <div class="txt">离线数</div>
          <div class="num">90</div>
        </dv-border-box-12>
      </div>
      <div class="item">
        <dv-border-box-12>
          <img class="img" src="../icon/station_info.png" alt="" />
          <img class="arrow" src="../icon/arrow1.png" alt="" />
          <div class="txt">故障数</div>
          <div class="num">200</div>
        </dv-border-box-12>
      </div>
      <div class="item">
        <dv-border-box-12>
          <img class="img" src="../icon/station_success.png" alt="" />
          <img class="arrow" src="../icon/arrow1.png" alt="" />
          <div class="txt">在线数</div>
          <div class="num">209</div>
        </dv-border-box-12>
      </div>
    </div>
  </div>
</template>
<script>
import InfoHeader from './InfoHeader'
export default {
  name: 'StatusInfo',
  components: { InfoHeader },
  props: {},
}
</script>
<style lang="less" scoped>
.StatusInfo {
  width: 100%;
  height: 100%;
  .info-content {
    width: 100%;
    height: 80%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .item {
      width: 30%;
      height: 100%;
      background-color: rgba(15, 26, 45, 0.5);
      border-radius: 10%;
      // dataV审查内样式
      /deep/ .border-box-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .img {
          width: 80px;
          height: 90px;
        }
        .arrow {
          width: 40px;
          height: 40px;
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
}
</style>
