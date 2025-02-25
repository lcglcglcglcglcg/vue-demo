import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 批量引入
const modulesFiles = require.context('./modules', true, /.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})


export default new Vuex.Store({
  plugins: [],
  modules,
  state: {},
  mutations: {},
  actions: {}
})
