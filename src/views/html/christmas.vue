<template>
  <ul class="tree">
    <!-- <div class="star"></div> -->
    <div class="chunk"></div>
  </ul>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    let tree = document.querySelector('.tree')
    for (let i = 0; i < 120; i++) {
      let li = document.createElement('li')
      // li.style = '--i:' + i;
      // li.style += '--h:' + Math.floor(i / 4) * 4;
      li.style = `--i:${i}`
      tree.appendChild(li)
    }

    // 创建多个星星
    for (let i = 2; i < 20; i += 4) {
      let div = document.createElement('div')
      div.style = `--i:${i}`
      div.className = 'star'
      tree.appendChild(div)
    }
  },
}
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  background-color: rgb(54, 66, 70);
}

.tree {
  position: relative;
  width: 500px;
  height: 700px;
  display: flex;
  justify-content: center;
  margin: 80px auto;
}

.star {
  width: 50px;
  height: 50px;
  position: absolute;
  left: calc(var(--i) * 22px + 8px);
  top: 0;
  background-color: rgb(236, 234, 167);
  z-index: 999;
  margin-bottom: 40px;
  clip-path: polygon(50% 0%, 70% 30%, 100% 40%, 80% 66%, 80% 100%, 50% 80%, 20% 100%, 20% 66%, 0% 40%, 30% 30%);
  animation: mymove 8s linear 0.2s infinite;
}

@keyframes mymove {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.chunk {
  width: 30px;
  height: 600px;
  background-color: rgb(63, 60, 60);
  z-index: 20;
  position: relative;
  top: 30px;
}
.tree li {
  position: absolute;
  top: 25px;
  width: 4px;
  background: linear-gradient(rgba(46, 204, 113, 0), rgba(46, 203, 113, 0.25));
  transform-origin: 50% 0;
  animation: swing 4s calc(var(--i) * -17.13s) ease-in-out infinite;
  /* animation: swing 4s calc(var(--i) * -0.23s) ease-in-out infinite; */
  height: calc(var(--i) * 4px);
  /* height: 200px; */
}

li::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 20px;

  background-color: #fff;

  position: absolute;
  bottom: 0;
  right: 50%;
  left: 50%;
}

li:nth-child(4n)::before {
  background-color: red;
  box-shadow: 0 0 10px 2px red;
}

li:nth-child(4n + 1)::before {
  background-color: blue;
  box-shadow: 0 0 10px 2px blue;
}

li:nth-child(4n + 2)::before {
  background-color: orange;
  box-shadow: 0 0 10px 2px orange;
}

li:nth-child(4n + 3)::before {
  background-color: cyan;
  box-shadow: 0 0 10px 2px cyan;
}

@keyframes swing {
  0%,
  100% {
    transform: rotate(-30deg);
  }
  5%,
  45% {
    opacity: 0.185;
    z-index: 0;
  }

  0%,
  50%,
  100% {
    opacity: 1;
    z-index: 99;
  }

  50% {
    transform: rotate(30deg);
  }
}
</style>
