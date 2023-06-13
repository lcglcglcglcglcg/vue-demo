<template>
  <div style="text-align: center;">
    <img src="./ALBH_bnd_sat.png" style="width:1000px;height:50px;" alt="">
  </div>
</template>

<script>
import PSD from 'psd.js'
const fs = require('fs')
export default {
  data() {
    return {
      src: '',
    }
  },
  mounted() {
    console.log('PSD: ', PSD)
    PSD.fromURL('./.ALBH_bnd_sat.psd').then(function (psd) {
      console.log('psd: ', psd, psd.image.toPng())
    })

    // Load from event, e.g. drag & drop
    // function onDrop(evt) {
    //   PSD.fromEvent(evt).then(function (psd) {
    //     console.log(psd.tree().export());
    //   });
    // }
  },
}
</script>

<style>
</style>