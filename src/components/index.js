import Vue from 'vue'
// 批量引入组件
const modulesFiles = require.context('@/components', true, /\.vue$/)
// 取组件定义的name属性
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
//   const value = modulesFiles(modulePath);
//   modules[moduleName] = value.default;
//   console.log(moduleName, value.default, "====>>");
//   return modules;
// }, {});
// Object.keys(modules).forEach((key) =>
//   Vue.component(modules[key].name, modules[key])
// );
// 2 取组件文件名
modulesFiles.keys().forEach((modulePath) => {
  const moduleName = modulePath.split('/').pop().replace('.vue', '')
  const value = modulesFiles(modulePath)
  Vue.component(moduleName, value.default)
})
