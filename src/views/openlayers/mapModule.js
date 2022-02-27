// import {
//   tianDiTuMapLayer,
//   tianDiTuAnnotation,
//   tianDiTuAnnotationEn,
//   worldMap,
//   worldWhiteMap,
//   googleMapLayer,
//   googleMapLayerZh,
//   gaodeMapLayer,
// } from '@/api/mapApi'

import 'ol/ol.css'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import Overlay from 'ol/Overlay.js'
import SourceVector from 'ol/source/Vector'
import LayerVector from 'ol/layer/Vector'
import Image from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import GeoJSON from 'ol/format/GeoJSON'
import Icon from 'ol/style/Icon'
import Projection from 'ol/proj/Projection'
import FullScreen from 'ol/control/FullScreen'
import Draw from 'ol/interaction/Draw'
import { defaults as defaultControls, ScaleLine } from 'ol/control.js'
import MousePosition from 'ol/control/MousePosition'
import { createStringXY } from 'ol/coordinate.js' // 展示鼠标实时位置
import { transform } from 'ol/proj'
import { Point, Polygon, LineString } from 'ol/geom'
import { unByKey } from 'ol/Observable.js'
import Feature from 'ol/Feature.js'
import Circle from 'ol/geom/Circle.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { OSM, Vector as VectorSource } from 'ol/source.js'
import { Circle as CircleStyle, Fill, Stroke, Style, Text, RegularShape } from 'ol/style.js'
import WMSCapabilities from 'ol/format/WMSCapabilities.js'
import { easeOut } from 'ol/easing'
import { getArea, getLength } from 'ol/sphere.js'

export {
  // tianDiTuMapLayer,
  // tianDiTuAnnotation,
  // tianDiTuAnnotationEn,
  // worldMap,
  // worldWhiteMap,
  // googleMapLayer,
  // googleMapLayerZh,
  // gaodeMapLayer,
  Map,
  Overlay,
  LayerVector,
  View,
  Image,
  ImageWMS,
  SourceVector,
  GeoJSON,
  Icon,
  Projection,
  FullScreen,
  Draw,
  defaultControls,
  ScaleLine,
  MousePosition,
  createStringXY,
  transform,
  Point,
  Polygon,
  LineString,
  unByKey,
  Feature,
  Circle,
  TileLayer,
  VectorLayer,
  OSM,
  VectorSource,
  CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  RegularShape,
  WMSCapabilities,
  easeOut,
  getArea,
  getLength,
}
