<template>
  <div class="tool">
    <div class="item" v-for="item in 5">
      <img class="img" src="@/assets/demo.png" alt="" />
      <div class="txt">测绘</div>
      <div class="label">113214</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.tool {
  background-color: #eee;
  .item {
    width: 50px;
    margin: 10px auto;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    position: relative;
    &:hover {
      background-color: hotpink;
      .img {
      }
      .txt {
        color: blue;
      }
      .label {
        width: 200px;
        transition: width 0.5s ease-in-out;
      }
    }
    .img {
      width: 30px;
      height: 20px;
    }
    .txt {
      font-size: 10px;
    }
    .label {
      width: 0;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 50px;
      overflow: hidden;
    }
  }
}
</style>
