<template>
  <div class="downLoad">
    <a-button type="primary" @click="onDownload">下载</a-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {}
  },
  methods: {
    // 下载模板
    onDownload(e) {
      axios({
        // 表明服务器返回的数据类型这里注意要加上responseType,可选值为arraybuffer,blob,document,json,text,stream，默认值为json
        url: '/test' + '/histarposinterface/pos/task/solution/download?id=28041&fileType=2', // 请求的地址
        headers: { 'Auth-Token': 'Cf3piXbu7VSIPCnVTf5Uxw==' }, // token给后端验证
        responseType: 'blob', // 表明服务器返回的数据类型这里注意要加上responseType
      })
        .then((res) => {
          console.log('res: ', res)
          const blob = res.data
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = (e) => {
            const a = document.createElement('a')
            let fileNameArr = res.headers['content-disposition'].split(';')[1].split('=')[1]
            // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
            a.download = fileNameArr
            a.href = e.target.result
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }

          // let reader = new FileReader()
          // reader.addEventListener('loadend', () => {
          //   const { message } = JSON.parse(reader.result)
          //   this.$message.error(message || '下载失败')
          // })
          // reader.readAsText(res, 'utf-8')

          // if (!res.data || res.data.type == 'application/json') {
          //   return this.$message.error('下载错误,请重试')
          // }
          // let fileName = 'rinex.zip'
          // let link = document.createElement('a')
          // link.href = URL.createObjectURL(res.data) // 创建下载的链接
          // link.download = fileName
          // link.click() // 点击下载
          // URL.revokeObjectURL(link.href) // 释放掉blob对象
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style>
</style>