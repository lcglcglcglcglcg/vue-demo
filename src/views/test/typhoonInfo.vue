<template>
  <div class="typhoon-box">
    <div class="title">
      <span>实况台风信息</span><i class="el-icon-close" @click="closeInfo"></i>
    </div>
    <div class="second">
      <div class="left">
        <span class="leftSpan">编号:</span>
        <span class="rightSpan">{{ typhoonData.tcId }}</span>
      </div>
      <div class="right">
        <span class="leftSpan">强度:</span>
        <span class="rightSpan">{{ typhoonData.strong }}</span>
      </div>
    </div>
    <div class="third odd">
      <div class="left">
        <span class="leftSpan">名称:</span>
        <span class="rightSpan">{{ typhoonData.tscName }}</span>
      </div>
    </div>
    <div class="third">
      <div class="left">
        <span class="leftSpan">时间:</span>
        <span class="rightSpan">{{ typhoonData.time }}</span>
      </div>
    </div>
    <div class="third odd">
      <div class="left">
        <span class="leftSpan">位置:</span>
        <span class="rightSpan"
          >东经:{{ typhoonData.lng }},北纬:{{
            typhoonData.lat
          }}</span
        >
      </div>
    </div>
    <div class="second">
      <div class="left">
        <span class="leftSpan">气压:</span>
        <span class="rightSpan">{{ typhoonData.pressure }}百帕</span>
      </div>
      <div class="right">
        <span class="leftSpan">风力:</span>
        <span class="rightSpan">{{ typhoonData.speed }}米/秒</span>
      </div>
    </div>
    <div class="second odd">
      <div class="left">
        <span class="leftSpan">6级风圈:</span>
        <span class="rightSpan">{{ typhoonData.rr06 }}公里</span>
      </div>
      <div class="right">
        <span class="leftSpan">7级风圈:</span>
        <span class="rightSpan">{{ typhoonData.rr07 }}公里</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TyphoonInfo",
  data() {
    return {};
  },
  props: {
    typhoonData: Object,
    closeInfo: Function
  },
  methods: {
     
  }
};
</script>

<style lang="less" scoped>
@border-color: rgba(255, 255, 255, 0.4);
@common-font-color: #0fdaff;
@background: rgba(0, 0, 0, 0.4);
@oddBackground: rgba(0, 0, 0, 0.1);
.typhoon-box {
  width: 420px;
  height: 280px;
  border-radius: 10px;
  background: @background;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  bottom: 200px;
  right: 200px;
  z-index: 1001;
  color: #fff;

  .second,
  .third {
    display: flex;
    height: 32px;
    line-height: 32px;
  }
  .title {
    display: flex;
    border-radius: 12px 12px 0 0;
    background: @background;
    height: 50px;
    line-height: 50px;
    color: #0fdaff;
    /deep/.el-icon-close {
      display: block;
      font-size: 30px;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
    }
    span {
      text-align: center;
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 1.5px;
    }
  }
  .left .leftSpan {
    width: 100px;
    text-align: right;
    padding-right: 10px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: bold;
    color: @common-font-color;
    border-right: 1px solid @border-color;
  }
  .second {
    border-bottom: 1px solid @border-color;
    .left {
      display: flex;
      width: 50%;
      border-right: 1px solid @border-color;
      .rightSpan {
        flex: 1;
        text-align: center;
      }
    }
    .right {
      display: flex;
      width: 50%;
      .leftSpan {
        width: 100px;
        color: @common-font-color;
        font-size: 16px;
        font-weight: bold;
        padding-right: 10px;
        box-sizing: border-box;
        border-right: 1px solid @border-color;
        text-align: right;
      }
      .rightSpan {
        flex: 1;
        text-align: center;
      }
    }
  }
  .end {
    border-bottom: none;
  }
  .odd {
    background: @oddBackground;
  }
  .third {
    .second();
    .left {
      width: 100%;
      border-right: none;
    }
  }
}
</style>