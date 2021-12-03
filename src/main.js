import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Storage from 'vue-ls'

import '@/style/index.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

const storageOptions = {
  namespace: 'pro__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
}

Vue.use(Storage, storageOptions)

Vue.use(Antd)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
