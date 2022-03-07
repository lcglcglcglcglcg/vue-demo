<template>
  <div class="popup">
    <div class="head">
      {{ commonInfo.name }}
      <span class="time">{{ commonInfo.starttime }}</span>
    </div>
    <div class="content">
      <div class="box">
        <div class="left">中心位置</div>
        <div class="right">{{ info.lng }}°/{{ info.lat }}°</div>
      </div>
      <div class="box">
        <div class="left">风速风力</div>
        <div class="right">{{ info.speed + '米/秒' }},{{ info.power + '级' + '(' + info.strong + ')' }}</div>
      </div>
      <div class="box">
        <div class="left">中心气压</div>
        <div class="right">{{ info.pressure + '百帕' }}</div>
      </div>
      <div class="box">
        <div class="left">移速移向</div>
        <div class="right">{{ `${info.movespeed} 公里/小时, ${info.movedirection}` }}</div>
      </div>
      <!-- <div class="box">
        <div class="left">七级半径</div>
        <div class="right">{{ info.rr07 }}公里</div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    commonInfo: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="less" scoped>
.popup {
  width: 300px;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  .head {
    padding: 5px 10px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    background-color: skyblue;
    .time {
      margin-left: 10px;
    }
  }
  .content {
    padding: 5px 10px;
    .box {
      display: flex;
      align-items: center;
      margin: 0 0 5px 0;
      border-bottom: 1px solid #ccc;
      .left {
        width: 30%;
      }
      .right {
        width: 60%;
      }
    }
  }
}
</style>
