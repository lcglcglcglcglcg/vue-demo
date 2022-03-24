<template>
  <div class="page">
    <Test>
      <img style="width: 500px; height: 300px" src="http://lcglcglcg.gitee.io/image_bed/images/openlayer/image0.png" />
    </Test>
  </div>
</template>

<script>
import Test from './components/Test'
var testVal = '24395773'
export default {
  components: { Test },
  name: 'TestPage',
  data() {
    return {
      test: '4th4ui---',
    }
  },
  methods: {},
  mounted() {
    console.log('mounted: ')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
  text-align: center;
  #test {
    background-color: hotpink;
  }
}
</style>
