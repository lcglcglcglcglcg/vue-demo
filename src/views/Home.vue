<template>
  <div class="home">
    <div class="menu">
      <h1>目录</h1>
      <ul>
        <li v-for="(item, i) in routes" :key="i">
          <router-link :to="item.path">{{ item.path }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import routes from '@/router/routes'
const whiteList = ['*', '/Home', '/exception/403', '/exception/404', '/exception/500', '/exception/ExceptionPage']

export default {
  name: 'Home',
  data() {
    return {
      routes: routes.filter((v) => !whiteList.includes(v.path))
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  .menu {
    width: 40%;
    margin: 50px auto 0px auto;
    h1 {
      text-align: center;
    }
    ul > li {
      height: 20px;
      line-height: 20px;
      font-size: 18px;
      margin: 10px 0;
      padding-left: 50px;
      width: 50%;
      display: inline-block;
    }
  }
}
</style>
