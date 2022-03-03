<template lang="">
  <div class="infoHeader">
    <span class="title">{{ title }}</span>
    <!-- <dv-decoration-5 style="width:300px;height:40px;" /> -->
    <!-- <dv-decoration-3 style="width:150px;" /> -->
  </div>
</template>
<script>
export default {
  name: "InfoHeader",
  props: {
    title: {
      type: String,
      default: "基础信息",
    },
  },
}
</script>
<style lang="less" scoped>
.infoHeader {
  display: flex;
  .title {
    font-size: 22px;
    text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 8px #fff;
  }
}
</style>
