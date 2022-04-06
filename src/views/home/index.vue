<template>
  <div class="home">
    <div class="menu">
      <h1>我的项目</h1>
      <ul class="content">
        <li class="item" v-for="(item, i) in workList" :key="i">
          <div class="head">
            <div class="title">{{ item.title }}</div>
            <span class="desc">{{ item.description }}</span>
          </div>
          <div class="box" @click="toPath(item)">
            <img class="img" :src="item.image" alt="描述图片" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workList: [
        {
          path: '/cesium/index',
          title: '大数据平台站点分布',
          description: '基于cesium省份城市站点数据分布',
          image: require('./images/site.png'),
          three: true,
        },
        {
          path: '/openlayers/index',
          title: '台风轨迹',
          description: 'openlayers 实现台风运动轨迹',
          image: require('./images/typhoon.png'),
          three: true,
        },
        {
          path: '/houseViewer/index',
          title: '360°看房场景',
          description: 'three实现3D看房场景',
          image: require('./images/houseViewer.png'),
          three: true,
        },
        {
          path: '/echarts/index',
          title: 'echarts',
          description: 'echarts组件问题记录封装',
          image: require('./images/echarts.png'),
          three: true,
        },
        {
          path: '/olympic/olympic',
          title: '冰墩墩',
          description: '2022冬奥吉祥物冰墩墩',
          image: require('./images/olympic.png'),
          three: true,
        },
      ],
    }
  },
  methods: {
    toPath(item) {
      this.$router.push(item.path)
    },
  },
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  min-height: 100vh;
  background-color: black;
  background-size: 100%;
  .menu {
    width: 80%;
    margin: 0 auto;
    padding-top: 50px;
    h1 {
      text-align: center;
      color: #fff;
    }
    .content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item {
        cursor: pointer;
        width: 30%;
        margin: 10px 12px;
        border: 1px solid #fff;
        border-radius: 0.5em;
        opacity: 0.8;
        &:hover {
          opacity: 1;
          border: 1px solid gold;
        }
        .head {
          padding: 10px;
          border-bottom: 2px solid #ccc;
          .title {
            font-size: 20px;
            color: #fff;
            font-weight: bold;
          }
          .desc {
            margin-top: 5px;
            font-size: 14px;
            color: #ccc;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            text-overflow: ellipsis;
          }
        }
        .box {
          padding: 10px 0 0 0;
          height: 250px;
          .img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
