<template>
  <div class="StatusCheck">
    <InfoHeader title="状态监控" />
    <div class="info-content">
      <div class="item">
        <dv-border-box-12>
          <div class="circle">
            <img class="img" src="../icon/histogram.png" alt="" />
          </div>
          <div class="desc">
            <div class="txt">离线率</div>
            <div class="num">2.05%</div>
          </div>
        </dv-border-box-12>
      </div>
    </div>
  </div>
</template>
<script>
import InfoHeader from './InfoHeader'
export default {
  name: 'StatusCheck',
  components: { InfoHeader },
  props: {},
}
</script>
<style lang="less" scoped>
.StatusCheck {
  width: 100%;
  height: 100%;
  .info-content {
    width: 100%;
    height: 80%;
    background-color: rgba(15, 26, 45, 0.5);
    margin-top: 20px;
    border-radius: 5%;
    .item {
      width: 100%;
      height: 100%;
      /deep/ .border-box-content {
        display: flex;
        align-items: center;
        justify-content: center;
        .circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          text-align: center;
          background-image: linear-gradient(rgba(38, 59, 75, 0.5), rgba(15, 30, 58, 0.5));
          box-shadow: 0 0 30px rgb(0, 153, 184) inset;
          position: relative;
          .img {
            width: 50px;
            height: 50px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .desc {
          width: 40%;
          margin-left: 50px;
          position: relative;
          &::after {
            content: ' ';
            display: block;
            border: 10px solid yellow;
            border-bottom: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid transparent;
            position: absolute;
            right: 0;
            bottom: 50%;
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
}
</style>
