<template>
  <div style="width: 100%;">
    <!-- 【表头部分】 -->
    <div class="columns-bar">
      <!-- 序号 -->
      <div v-if="hasIndex" :style="{'--width': defaultWidth+'px', '--flex-grow': noEnlarge}">序号</div>
      <!-- 表头 -->
      <div v-for="(item, index) in columns" :key="index"
        :style="{'--width': (item.width || defaultWidth)+'px', '--flex-grow': item.width?noEnlarge:enlarge}">
        <span>{{ item.title }}</span>
      </div>
    </div>
    <!-- 【表格部分】 -->
    <DraggableList v-if="dataSource.length" v-model="tempArr" v-bind="options"
      :style="{'max-height': maxHeight+'px', 'overflow-y': 'auto' }" @start="onStart" @end="onEnd">
      <transition-group>
        <div v-for="(element, elementIndex) in dataSource" :key="'row'+elementIndex" class="row-bar">
          <!-- 序号 -->
          <div v-if="hasIndex" :style="{'--width': defaultWidth+'px', '--flex-grow': noEnlarge}">{{ elementIndex + 1 }}
          </div>
          <!-- 表格数据 -->
          <div v-for="(columnsObj, columnsIndex) in columns" :key="'div'+columnsIndex"
            :style="{'--width': (columnsObj.width || defaultWidth)+'px', '--flex-grow': columnsObj.width?noEnlarge:enlarge}">
            <span v-if="!columnsObj.scopedSlots">{{ element[columnsObj.dataIndex] }}</span>
            <slot v-else :name="columnsObj.scopedSlots.customRender"
              v-bind="{text:element[columnsObj.dataIndex],record:element,index:elementIndex}"></slot>
          </div>
        </div>
      </transition-group>
    </DraggableList>
    <!-- 【暂无数据 -->
    <div v-else>
      <a-empty />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Vue from 'vue'
const isEmpty = (v) => {
  if (v == undefined || v == null) return true
  else return false
}
export default {
  name: 'DraggableTable',
  components: { DraggableList: draggable },
  data() {
    return {
      list: [],
      options: {
        animation: 200,
      },
      defaultWidth: 50,
      enlarge: 1,
      noEnlarge: 0,
      tempArr: this.dataSource,
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    maxHeight: {
      type: Number,
      default: 450,
    },
    hasIndex: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onStart(e) {},
    onEnd(e) {
      let { oldIndex, newIndex } = e
      if (!isEmpty(oldIndex) && !isEmpty(newIndex)) {
        let arr = this.dataSource
        if (newIndex >= oldIndex) {
          // 上往下
          arr.splice(newIndex + 1, 0, arr[oldIndex])
          arr.splice(oldIndex, 1)
        } else {
          // 下往上
          arr.splice(newIndex, 0, arr[oldIndex])
          arr.splice(oldIndex + 1, 1)
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.columns-bar {
  display: flex;
  height: 51px;
  line-height: 51px;
  background: rgba(248, 248, 248, 0.81);
  border-radius: 5px;
  & > div {
    padding: 0 10px;
    width: var(--width);
    flex-grow: var(--flex-grow);
    box-sizing: border-box;
  }
}
.row-bar {
  display: flex;
  min-height: 51px;
  cursor: move;
  & > div {
    padding: 15px 10px;
    width: var(--width);
    flex-grow: var(--flex-grow);
    box-sizing: border-box;
  }
  &:active {
    background-color: #c5d9db;
  }
  &:hover {
    background-color: #c5d9db4b;
  }
}
</style>