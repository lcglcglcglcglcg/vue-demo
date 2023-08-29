<template>
  <div class="album">
    <div class="hovertreeinfo">
      <!-- <h2>松隆子</h2> -->
    </div>
    <div class="wrap">
      <!-- <audio id="audio" class="audio" src="../assets/杨千嬅 - 捞月亮的人 (Live).mp3" muted autoplay controls loop>
        捞月亮的人
      </audio> -->
      <!--	/*包裹所有元素的容器*/-->
      <div class="cube">
        <div class="out_front">
          <img :src="imgPre + '/image0.png'" class="pic" />
        </div>
        <div class="out_back">
          <img :src="imgPre + '/image1.png'" class="pic" />
        </div>
        <div class="out_left">
          <img :src="imgPre + '/image2.png'" class="pic" />
        </div>
        <div class="out_right">
          <img :src="imgPre + '/image3.png'" class="pic" />
        </div>
        <div class="out_top">
          <img :src="imgPre + '/image4.png'" class="pic" />
        </div>
        <div class="out_bottom">
          <img :src="imgPre + '/image5.png'" class="pic" />
        </div>
        <!--小正方体 -->
        <span class="in_front">
          <img :src="imgPre + '/image3.png'" class="in_pic" />
        </span>
        <span class="in_back">
          <img :src="imgPre + '/image5.png'" class="in_pic" />
        </span>
        <span class="in_left">
          <img :src="imgPre + '/image4.png'" class="in_pic" />
        </span>
        <span class="in_right">
          <img :src="imgPre + '/image0.png'" class="in_pic" />
        </span>
        <span class="in_top">
          <img :src="imgPre + '/image1.png'" class="in_pic" />
        </span>
        <span class="in_bottom">
          <img :src="imgPre + '/image2.png'" class="in_pic" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/common'
export default {
  data() {
    return {
      imgPre: config.imgUrlPrefix + '/images/openlayer',
      // imgs: [
      //   '/images/openlayer/image0.png',
      //   '/images/openlayer/image1.png',
      //   '/images/openlayer/image3.png',
      //   '/images/openlayer/image4.png',
      // ],
    }
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.album {
  z-index: 100;
  position: absolute;
  right: 0;
  top: 0;
  // background: linear-gradient(#ff6666 20%, #336699 100%);
  .wrap {
    width: 200px;
    margin: 20px auto;
    position: relative;
    .audio {
      width: 100%;
      height: 30px;
    }
  }
  .cube {
    width: 200px;
    height: 200px;
    // margin: 0 auto;
    transform-style: preserve-3d;
    transform: rotateX(-30deg) rotateY(-80deg);
    animation: rotate 20s infinite;
    animation-timing-function: linear;
  }
  .cube div {
    position: absolute;
    top: 50px;
    left: 50px;
    width: 100px;
    height: 100px;
    // opacity: 0.8;
    // transition: all 0.4s;
  }
  /*定义所有图片样式*/
  .pic {
    width: 100px;
    height: 100px;
  }
  .cube .out_front {
    transform: rotateY(0deg) translateZ(50px);
  }
  .cube .out_back {
    transform: translateZ(-50px) rotateY(180deg);
  }
  .cube .out_left {
    transform: rotateY(90deg) translateZ(50px);
  }
  .cube .out_right {
    transform: rotateY(-90deg) translateZ(50px);
  }
  .cube .out_top {
    transform: rotateX(90deg) translateZ(50px);
  }
  .cube .out_bottom {
    transform: rotateX(-90deg) translateZ(50px);
  }
  /*定义小正方体样式*/
  .cube span {
    display: bloack;
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50px;
    left: 50px;
  }
  .cube .in_pic {
    width: 100px;
    height: 100px;
  }
  .cube .in_front {
    transform: rotateY(0deg) translateZ(50px);
  }
  .cube .in_back {
    transform: translateZ(-50px) rotateY(180deg);
  }
  .cube .in_left {
    transform: rotateY(90deg) translateZ(50px);
  }
  .cube .in_right {
    transform: rotateY(-90deg) translateZ(50px);
  }
  .cube .in_top {
    transform: rotateX(90deg) translateZ(50px);
  }
  .cube .in_bottom {
    transform: rotateX(-90deg) translateZ(50px);
  }
  /*鼠标移入后样式*/
  .cube:hover .out_front {
    transform: rotateY(0deg) translateZ(100px);
  }
  .cube:hover .out_back {
    transform: translateZ(-100px) rotateY(180deg);
  }
  .cube:hover .out_left {
    transform: rotateY(90deg) translateZ(100px);
  }
  .cube:hover .out_right {
    transform: rotateY(-90deg) translateZ(100px);
  }
  .cube:hover .out_top {
    transform: rotateX(90deg) translateZ(100px);
  }
  .cube:hover .out_bottom {
    transform: rotateX(-90deg) translateZ(100px);
  }
  .hovertreeinfo {
    text-align: center;
  }
  .hovertreeinfo a {
    color: white;
  }
}

@keyframes rotate {
  from {
    transform: rotateX(0deg) rotateY(0deg);
  }
  to {
    transform: rotateX(360deg) rotateY(360deg);
  }
}
</style>
