import Vue from 'vue'
// 批量引入组件
const modulesFiles = require.context('@/config', true, /\.vue$/)
console.log('modulesFiles: ', modulesFiles)

// modulesFiles.keys().forEach((modulePath) => {
//   const moduleName = modulePath.split('/').pop().replace('.vue', '')
//   const value = modulesFiles(modulePath)
//   Vue.component(moduleName, value.default)
// })
