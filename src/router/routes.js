const routes = [{ path: '*', redirect: '/home/index' }]

importPages(require.context('@/views', true, /\.vue$/, 'lazy')) // 必须加lazy 否则不显示路由
function importPages (r) {
  r.keys().forEach(async (key) => {
    routes.push({ path: key.split('.')[1], component: () => r(key) })
  })
}

export default routes
