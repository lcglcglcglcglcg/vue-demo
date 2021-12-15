import { timeFormatter, parseTime, decodeMode } from '@/utils/util'

export const filtersMixin = {
  filters: {
    // 格式化解算状态
    ggaFormatter(v) {
      switch (v) {
        case 0:
          // return '无效解'
          return $it('device.invalid.solution')
        case 1:
          return $it('device.single.point.solution')
        case 2:
          return $it('device.differential.3d')
        case 3:
          return 'PPP'
        case 4:
          return $it('device.fixed.solution')
        case 5:
          return $it('device.floating.point.solution')
        case 6:
          return $it('device.differential.3d')
        case 7:
          return $it('device.station')
        default:
          return $it('device.unknown')
      }
    },

    // 在线时长转换
    getTimeFormatter(v) {
      return timeFormatter(v)
    },

    // 时间戳转换
    formatterTime(v) {
      return v ? parseTime(v) : '-'
    },

    // 命令转换
    decodeModeFormtter(v) {
      return decodeMode(v)
    },

    isJoinFormtter(v) {
      let arr = ['no', 'network', 'single.base']
      return arr[v] ? $it(arr[v]) : '-'
    },

    toFixed(cellValue) {
      if (!cellValue) return '-'
      return Math.round(cellValue * 1000000) / 1000000
    }
  },

  methods: {},
  created() {}
}
