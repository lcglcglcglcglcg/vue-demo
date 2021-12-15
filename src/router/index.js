import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

try {
  const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err)
  }
} catch (e) {}

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
