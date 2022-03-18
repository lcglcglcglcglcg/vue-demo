// 在线时长格式化 如: 1h2m3s
export function timeFormatter(val) {
  let text
  if (val < 60) {
    text = `${val}` + $it('s')
  } else if (val >= 60 && val < 3600) {
    text = `${parseInt(val / 60)}` + $it('m') + `${parseInt(val % 60)}` + $it('s')
  } else if (val >= 3600) {
    text =
      `${parseInt(val / 3600)}` +
      $it('h') +
      `${parseInt((val % 3600) / 60)}` +
      $it('m') +
      `${parseInt((val % 3600) % 60)}` +
      $it('s')
  }
  return text
}

// 格式化命令类型
export function decodeMode(v) {
  let str = ''
  switch (v) {
    case 0:
      str = 'Auto'
      break
    case 1:
      str = 'Trimble RT27'
      break
    case 2:
      str = 'Novatel'
      break
    case 3:
      str = 'ComNav'
      break
    case 4:
      str = 'UNICORE'
      break
    case 5:
      str = 'TOPCON(Java)'
      break
    case 6:
      str = 'Hemisphere'
      break
    case 7:
      str = 'RTCM 3.X'
      break
    case 8:
      str = 'SOUTH DATA EXCHANGE'
      break
  }
  return str
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (!time) {
    return '-'
  }
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 全屏
export function fullScreen() {
  var el = document.documentElement
  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
  if (typeof rfs != 'undefined' && rfs) {
    rfs.call(el)
  }
  if (typeof window.ActiveXObject != 'undefined') {
    //这的方法 模拟f11键，使浏览器全屏
    var wscript = new ActiveXObject('WScript.Shell')
    if (wscript != null) {
      wscript.SendKeys('{F11}')
    }
  }
  return
}
//退出全屏
export function exitScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
  if (typeof cfs != 'undefined' && cfs) {
    cfs.call(el)
  }
}

//判断浏览器是否处于全屏状态 （需要考虑兼容问题）
export function checkFull() {
  //火狐浏览器
  let isFull =
    document.mozFullScreen ||
    document.fullScreen ||
    document.webkitIsFullScreen ||
    document.webkitRequestFullScreen ||
    document.mozRequestFullScreen ||
    document.msFullscreenEnabled
  if (isFull === undefined) isFull = false
  return isFull
}

//手动触发window的resize事件，重绘图表/地图防止空白
export function windowResize() {
  setTimeout(() => {
    var myEvent = new Event('resize')
    window.dispatchEvent(myEvent)
  }, 100)
}

// 格式化时间间隔
export const formatDuration = (ms) => {
  if (ms < 0) ms = -ms
  const time = {
    天: Math.floor(ms / 86400000),
    小时: Math.floor(ms / 3600000) % 24,
    分: Math.floor(ms / 60000) % 60,
    秒: Math.floor(ms / 1000) % 60,
    毫秒: Math.floor(ms) % 1000,
  }
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val}${key}`)
    .join('')
}
