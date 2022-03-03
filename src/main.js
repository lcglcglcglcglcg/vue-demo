import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入自定义样式
import '@/style/index.css'
import '@/assets/less/JAreaLinkage.less'

Vue.config.productionTip = false

// 引入cesium
import 'cesium/Widgets/widgets.css'

// 引入ant-design-vue
import '@/plugins/antd'

// 引入dataV
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

// 批量引入组件
import '@/components'

// localStorage 处理插件
import Storage from 'vue-ls'
const storageOptions = {
  namespace: 'pro__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
}

Vue.use(Storage, storageOptions)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
