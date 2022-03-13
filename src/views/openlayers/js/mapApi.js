import { Tile, Vector as VectorLayer } from 'ol/layer'
import XYZ from 'ol/source/XYZ'
import Image from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import TileImage from 'ol/source/TileImage'
import View from 'ol/View.js'

const key = '40b72a34fc05f53b1eccca7b0bfb631a'

const mapRoad = `http://t${Math.round(Math.random() * 7)}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${key}`
const mapText = `http://t${Math.round(Math.random() * 7)}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${key}`
const mapTextEn = `http://t${Math.round(Math.random() * 7)}.tianditu.com/DataServer?T=eva_w&x={x}&y={y}&l={z}&tk=${key}`

// 天地图加载资源
export const tianDiTuMapLayer = new Tile({
  title: '天地图路网',
  source: new XYZ({
    url: mapRoad,
  }),
  opacity: 1,
})
export const tianDiTuAnnotation = new Tile({
  title: '天地图文字标注',
  source: new XYZ({
    url: mapText,
  }),
  opacity: 1,
})

export const tianDiTuAnnotationEn = new Tile({
  title: 'english',
  source: new XYZ({
    url: mapTextEn,
  }),
  opacity: 1,
})
