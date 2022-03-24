<template>
  <div>
    <div>里面有个slot</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
  created() {},
  mounted() {
    console.log(this.$parent.test, 'this.$parent')
    this.$nextTick(() => {})
  },
}
</script>

<style></style>
