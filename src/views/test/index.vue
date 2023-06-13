<template>
  <div class="page">
    <!-- <Test>
      <img style="width: 500px; height: 300px" src="http://lcglcglcg.gitee.io/image_bed/images/openlayer/image0.png" />
    </Test> -->
    <!-- <img v-bind:[attributeName]="url" style="width: 500px; height: 300px" /> -->
    <input v-on:keyup.page-down="submit" />
    <a-tree-select style="width: 90%" allowClear :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :treeData="personData" showSearch :load-data="onLoadData" />
    <div style="margin-top:20px;">
      <ul class="tabs">
        <li v-for="(item, i) in tabs" :key="i" @click="clickTab(item)" :class="currentActive==item?'active':''">{{ item }}</li>
      </ul>
      <div class="content" v-if="currentActive == 1">
        <label v-for="(item, i) in orginData" :key="i" :class="tagValue.includes(item.value) ? 'active':''">
          <input type="checkbox" v-model="argData1[item.value]" @click="clickTag(item.value)">{{ item.label }}
        </label>
      </div>
      <div class="content" v-if="currentActive == 2">
        <label v-for="(item, i) in orginData" :key="i" :class="tagValue.includes(item.value) ? 'active':''">
          <input type="checkbox" v-model="argData2[item.value]" @click="clickTag(item.value)">{{ item.label }}
        </label>
      </div>
    </div>

    <a-button type="primary" @click="showModal">点击</a-button>
    <AModal ref="AModal" />
    <a-button type="primary" @click="showModal1">点击1</a-button>
    <BModal ref="BModal" />
  </div>
</template>   

<script>
import Test from './components/Test'
import AModal from './components/AModal'
import BModal from './components/BModal'
var testVal = '24395773'
export default {
  components: { Test, AModal, BModal },
  name: 'TestPage',
  data() {
    return {
      url: 'http://lcglcglcg.gitee.io/image_bed/images/openlayer/image0.png',
      attributeName: 'src',
      test: '4th4ui---',
      personData: [],
      currentActive: '1',
      tagValue: ['org'],
      tabs: [1, 2, 3],
      name1: '',
      name2: '',
      orginData: [
        { label: '表格', value: 'table' },
        { label: '元素', value: 'ele' },
        { label: '组织', value: 'org' },
      ],
      argData1: {
        table: false,
        ele: false,
        org: true,
      },
      argData2: {
        table: false,
        ele: false,
        org: true,
      },
    }
  },
  methods: {
    showModal() {
      this.$refs.AModal.show = true
    },
    showModal1() {
      this.$refs.BModal.show = true
    },
    clickTab(i) {
      this.currentActive = i
    },
    clickTag(i) {
      if (!this.argData1[i]) {
        !this.tagValue.includes(i) && this.tagValue.push(i)
      } else {
        this.tagValue.splice(this.tagValue.indexOf(i), 1)
      }
    },
    onLoadData(treeNode) {
      var that = this
      console.log('=======>>>')
      return new Promise((resolve) => {
        if (treeNode.$vnode.children) {
          resolve()
          return
        }
        const { id } = treeNode.dataRef
        let pid = treeNode.$vnode.key
        let param = {
          pid: pid,
          condition: false,
        }
        getAction('/basic/basicStaff/findStaffByOfficeForSelect', { officeId: id }).then((res) => {
          if (res.success) {
            for (let i of res.result) {
              i.value = i.key
              if (i.leaf == false) {
                i.isLeaf = false
              } else if (i.leaf == true) {
                i.isLeaf = true
              }
            }
            this.addChildren(pid, res.result, this.personData)
            this.personData = [...this.personData]
          }
          resolve()
        })
      })
    },
    addChildren(pid, children, treeArray) {
      if (treeArray && treeArray.length > 0) {
        for (let item of treeArray) {
          if (item.key == pid) {
            if (!children || children.length == 0) {
            } else {
              item.children = children
            }
            break
          } else {
            this.addChildren(pid, children, item.children)
          }
        }
      }
    },
    submit() {
      alert('submit')
    },
  },
  mounted() {
    console.log('mounted: ')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
  text-align: center;
  #test {
    background-color: hotpink;
  }
  .tabs {
    display: flex;
    align-items: center;
    li {
      width: 200px;
      text-align: center;
      font-size: 20px;
      background-color: pink;
      color: #fff;
      border: 1px solid gold;
      cursor: pointer;
      &.active {
        background-color: skyBlue;
      }
    }
  }
  .content {
    label {
      cursor: pointer;
      width: 100px;
      height: 40px;
      line-height: 40px;
      background-color: gray;
      color: #fff;
      display: inline-block;
      border-radius: 8px;
      margin-left: 10px;
      &:first-of-type {
        margin-left: 0;
      }
      input {
        width: 0;
      }
      &.active {
        background: linear-gradient(to right, red, hotpink);
      }
    }
  }
}
</style>
