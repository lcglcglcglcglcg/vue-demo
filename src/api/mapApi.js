import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import Image from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import TileImage from 'ol/source/TileImage'
import View from 'ol/View.js'

const mapRoad = window.g.mapRoad
const mapText = window.g.mapText
const mapTextEn = window.g.mapTextEn

// 离线地图地图配置
let layer = {
  black: {
    sx: 'cors:ShanXi_balck', // 山西
    xa: 'cors:ShǎnXi_balck', // 陕西
    yn: 'cors:YunNan_black', // 云南
    cq: 'cors:ChongQing', // 重庆
    gd: 'cors:osm_china_map_black', // 广东
    all: 'cors:china_map', // 全国
  },
  white: {
    sx: 'cors:ShanXi_white',
    xa: 'cors:ShǎnXi_white',
    yn: 'cors:YunNan_white',
    cq: 'cors:ChongQing_white',
    gd: 'cors:osm_china_map',
    // all: 'cors:china_map_white'
    all: 'cors:write_china_map',
  },
}
let offlineMapLayerColro = window.g.offlineMapLayerColor || 'black'
let offlineMapLayer = window.g.offlineMapLayer || 'cq'
let offlineLayer = layer[offlineMapLayerColro][offlineMapLayer]

// 天地图加载资源
const tianDiTuMapLayer = new Tile({
  title: '天地图路网',
  preload: Infinity,
  source: new XYZ({
    url: mapRoad,
  }),
})
const tianDiTuAnnotation = new Tile({
  title: '天地图文字标注',
  source: new XYZ({
    url: mapText,
  }),
})

const tianDiTuAnnotationEn = new Tile({
  title: 'english',
  source: new XYZ({
    url: mapTextEn,
  }),
})

console.log(offlineLayer)
// 离线地图底图
const worldMap = new Image({
  source: new ImageWMS({
    ratio: 1,
    url: window.g.mapApiwms,
    params: {
      FORMAT: 'image/png',
      VERSION: '1.1.0',
      STYLES: '',
      // LAYERS: 'cors:china_map'
      LAYERS: offlineLayer,
    },
  }),
})
// 离线地图(白)
const worldWhiteMap = new Image({
  source: new ImageWMS({
    ratio: 1,
    url: window.g.mapApiwms,
    params: {
      FORMAT: 'image/png',
      VERSION: '1.1.0',
      STYLES: '',
      LAYERS: 'cors:write_china_map',
    },
  }),
})

const worldMapBackground = new Image({
  source: new ImageWMS({
    ratio: 1,
    url: window.g.mapApiwms,
    params: {
      FORMAT: 'image/png',
      VERSION: '1.1.0',
      STYLES: '',
      LAYERS: 'cors:background',
    },
  }),
})

const googleMapLayer = new Tile({
  source: new XYZ({
    url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    // 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2sen-US!3sen!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
    // 'http://www.google.cn/maps/vt?lyrs=m@189&hl=en-US&x={x}&y={y}&z={z}'
  }),
})

const googleMapLayerZh = new Tile({
  source: new XYZ({
    url: 'http://mt0.google.com/vt/lyrs=m&hl=zh&x={x}&y={y}&z={z}',
    // 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'
    // 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
    // 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G'
  }),
})

const gaodeMapLayer = new Tile({
  source: new XYZ({
    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
  }),
})

function showMap(v) {
  if (window.g.mapType === 1) {
    tianDiTuMapLayer.setVisible(false)
    tianDiTuAnnotation.setVisible(false)
    tianDiTuAnnotationEn.setVisible(false)
    if (v === 'en-US') {
      googleMapLayer.setVisible(true)
      googleMapLayerZh.setVisible(false)
    } else {
      googleMapLayer.setVisible(false)
      googleMapLayerZh.setVisible(true)
    }
  } else {
    googleMapLayer.setVisible(false)
    googleMapLayerZh.setVisible(false)
    tianDiTuMapLayer.setVisible(true)
    if (v === 'en-US') {
      tianDiTuAnnotation.setVisible(false)
      tianDiTuAnnotationEn.setVisible(true)
    } else {
      tianDiTuAnnotation.setVisible(true)
      tianDiTuAnnotationEn.setVisible(false)
    }
  }
}

let layersArr = [
  tianDiTuMapLayer,
  tianDiTuAnnotation,
  tianDiTuAnnotationEn,
  googleMapLayer,
  googleMapLayerZh,
]

let layersArrOfflineTDT = [worldMap]

if (window.g.useOfflineMap) {
  layersArr = layersArrOfflineTDT
}

function viewOption(center = '', zoom = '') {
  return new View({
    projection: 'EPSG:4326',
    center: center || window.g.center,
    zoom: zoom || window.g.zoomVal,
    minZoom: window.g.minzoomVal,
    maxZoom: window.g.maxzoomVal,
    // extent: [-180, -45, 180, 48]
    extent: window.g.areaExtext,
  })
}

export function setMapColor(id) {
  if (!window.g.useOfflineMap) return
  // document.getElementById(id).style.backgroundColor = "#133f58";
  if (window.g.offlineMapLayerColor !== 'white') {
    document.getElementById(id).style.backgroundColor = '#09152A'
  } else {
    document.getElementById(id).style.backgroundColor = '#AAC6EE'
  }
}

export {
  tianDiTuMapLayer,
  tianDiTuAnnotation,
  tianDiTuAnnotationEn,
  worldMap,
  worldMapBackground,
  worldWhiteMap,
  googleMapLayer,
  googleMapLayerZh,
  gaodeMapLayer,
  layersArr,
  viewOption,
  showMap,
}
