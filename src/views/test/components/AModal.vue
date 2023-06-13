<template>
  <a-modal v-drag-modal :visible="show" title="颤三" @ok="show = false" @cancel="show = false">
    内容内容内容内容内容内
    内容内容内容内容内容内
    内容内容内容内容内容内
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
}
</script>

<style>
</style>