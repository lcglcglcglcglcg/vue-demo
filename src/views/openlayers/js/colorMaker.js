class ColorMaker {
  // 构造函数..
  constructor(options) {
    let __options = Object.assign({}, options)
    this.leftRGB = __options.colors[0]
    this.rightRGB = __options.colors[1]

    this.RGBDiff = this.calcRGBDiff(this.leftRGB, this.rightRGB)
    // colors 数组的 长度
    this.len = __options.colors.length
    this.colors = __options.colors

    if (__options.avgDivide) {
      if (!__options.maxData || !__options.minData) {
        throw 'avgDivide 配置为true 必须提供 最大值与最小值'
      }
      this.values = this.avgSegmentation(__options.maxData, __options.minData)
      this.leftData = this.values[0]
      this.rightData = this.values[1]
      this.dataDiff = this.rightData - this.leftData
    } else {
      this.leftData = __options.values[0]
      this.rightData = __options.values[1]
      this.values = __options.values
      this.dataDiff = this.rightData - this.leftData
    }

    // 保存 makers
    //  [   ColorMaker , ColorMaker ,ColorMaker ]
    this.makers = []

    if (this.len > 2) {
      this.initMakers()
    }
  }

  // 检查 配置 是否合法
  checkOptionsValid() {
    let lenFlag = this.colors.length == this.values.length
    this.checkColorsRange()
    if (!lenFlag) {
      throw 'colors 数组与values 数组长度不一致！'
    }
  }

  // 平均切分
  avgSegmentation(max, min) {
    let values = []
    if (this.len <= 2) {
      return
    } else {
      let diff = (max - min) / (this.len - 1)
      for (let i = 0; i < this.len; i++) {
        values.push(min + i * diff)
      }
    }
    return values
  }

  // 检查 RGB值是否越界了.
  checkColorsRange() {
    for (let i = 0; i < this.colors.length; i++) {
      let cur = this.colors[i]
      let arr = cur.filter((value) => value >= 0 && value <= 255)
      if (arr.length != 3) {
        throw '颜色数组的RGB值应在0 - 255之间、同时应该是长度为3的数组'
      }
    }
    return true
  }

  // 初始化 makers 用于处理不同的区间
  initMakers() {
    for (let i = 0; i < this.len - 1; i++) {
      let maker = new ColorMaker({
        values: [this.values[i], this.values[i + 1]],
        colors: [this.colors[i], this.colors[i + 1]],
      })
      this.makers.push(maker)
    }
    // console.log(this.makers);
  }

  // 计算RGB差值
  calcRGBDiff(arr1, arr2) {
    return [arr2[0] - arr1[0], arr2[1] - arr1[1], arr2[2] - arr1[2]]
  }

  // 根据val生成颜色
  makeColor(val) {
    if (this.len < 2) {
      return
    } else if (this.len == 2) {
      // 实际上 makeColor 运行的 是这一段逻辑 。.  当颜色数组 大于2 的时候 调用 相应的 colormaker 去 执行 这一段
      // 比例
      let ratio = (val - this.leftData) / this.dataDiff
      //  [  R , G, B]
      //  0 +   (12 - 10) / (20 -10) = 1 / 5
      let R = this.leftRGB[0] + ratio * this.RGBDiff[0]
      let G = this.leftRGB[1] + ratio * this.RGBDiff[1]
      let B = this.leftRGB[2] + ratio * this.RGBDiff[2]
      // 返回字符串 为了 我们使用的使用  rgb(${color});
      return [R, G, B]
    } else {
      for (let i = 0; i < this.makers.length; i++) {
        // 假如 value 落在了这个maker 对应的 区间
        if (val >= this.makers[i].leftData && val < this.makers[i].rightData) {
          return this.makers[i].makeColor(val)
        }
      }
      // 如果 没有在对应的区间找到... 判断他是大于最大值 还是小于最大值 ，只做这个处理. 区域 区间不连贯的不做处理
      // 若都不是  是落入区域不连贯的点 返回undefined
      let min = this.values[0]
      let max = this.values[this.len - 1]
      if (val < min) {
        return this.makers[0].makeColor(min)
      } else if (val > max) {
        return this.makers[this.makers.length - 1].makeColor(max)
      }
    }
  }
}

export default ColorMaker

// 示例.
// let colormakerAVG = new ColorMaker({
//   colors: [
//     [0, 0, 0],
//     [50, 50, 50],
//     [100, 100, 100],
//     [150, 150, 150],
//     [200, 200, 200],
//   ],
//   avgDivide: true,
//   minData: 10,
//   maxData: 30,
// })

// console.log(colormakerAVG.makeColor(12.5))
// console.log(colormakerAVG.makeColor(1.5))
// console.log(colormakerAVG.makeColor(50))

// let colormaker = new ColorMaker({
//   colors: [
//     [0, 0, 0],
//     [50, 50, 50],
//     [100, 100, 100],
//     [150, 150, 150],
//     [200, 200, 200],
//   ],
//   values: [10, 15, 20, 25, 30],
// })
// console.log(colormaker.makeColor(12.5))
// console.log(colormaker.makeColor(1.5))
// console.log(colormaker.makeColor(50))
