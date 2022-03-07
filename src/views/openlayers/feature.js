export const featureObj = {
  // feature 类型判定
  typeJudge: function(feature) {
    if (feature.get('typhoonPoint')) {
      return 'typhoonPoint'
    } else if (feature.get('typhoonSolar')) {
      return 'typhoonSolar'
    } else {
      return 'isFeatureButDontNeedTodo'
    }
  },
  // 台风点相关
  typhoonPointClick(feature) {
    console.log('typhoonPointClick')
  },
  typhoonPointHover(feature) {
    console.log('typhoonPointHover')
    this.map.getTargetElement().style.cursor = 'pointer'
    this.setPointStyle(this.lastZoomPoint, 4)
    this.setPointStyle(feature, 8)
    this.lastZoomPoint = feature
  },
  // 风圈相关
  solarPointClick(feature) {
    console.log('solarPointClick')
  },
  solarPointHover(feature) {
    console.log('solarPointHover')
  },
}
