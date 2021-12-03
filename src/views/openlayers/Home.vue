<template>
  <div class="userDistributionMapContent">
    <a-spin :spinning="spinning" size="large">
      <div id="mapServeRange" class="userDistributionMap">
        <div id="operationContent">
          <!-- 选择操作板 -->
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="省市区查询">
              <a-form-model
                v-model="form.province"
                :model="form"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="省">
                  <a-select @change="onProvinceChange" placeholder="请选择省份">
                    <a-select-option
                      v-for="item in provinceList"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="市">
                  <a-select
                    v-model="form.city"
                    @change="onCityChange"
                    placeholder="请选择城市"
                  >
                    <a-select-option
                      v-for="item in cityList"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.locname }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="区/县">
                  <a-select
                    v-model="form.county"
                    @change="onCountyChange"
                    placeholder="请选择区县"
                  >
                    <a-select-option
                      v-for="item in countyList"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.locname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-form-model>
            </a-tab-pane>
            <a-tab-pane key="2" tab="经纬度查询" force-render>
              <a-form-model
                :model="formLocation"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="经度">
                  <a-input
                    v-model="formLocation.lon"
                    placeholder="请输入经度,如113.1372"
                  >
                  </a-input>
                </a-form-model-item>
                <a-form-model-item label="纬度">
                  <a-input
                    v-model="formLocation.lat"
                    placeholder="请输入纬度,如23.4132"
                  >
                  </a-input>
                </a-form-model-item>
              </a-form-model>
              <a-button
                type="primary"
                @click="onLocal"
                style="text-align: center; margin-bottom: 10px"
              >
                定位
              </a-button>
            </a-tab-pane>
            <a-tab-pane key="3" tab="关键词搜索" force-render>
              <a-form-model
                :model="formArea"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="关键字">
                  <a-select
                    show-search
                    v-model="formArea.keyword"
                    placeholder="请输入关键字"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :dropdownMatchSelectWidth="false"
                    :not-found-content="null"
                    optionLabelProp="label"
                    @search="handleSearch"
                    @change="handleChange"
                  >
                    <a-select-option
                      v-for="(d, i) in tips"
                      :key="i + d.typecode"
                      :label="d.name"
                      :value="i + '/' + d.adcode + '/' + d.typecode"
                    >
                      <div :style="{ fontSize: '12px', color: '#000' }">
                        {{ d.name }}
                        <span :style="{ color: '#999', marginLeft: '6px' }">
                          {{ d.district }}
                        </span>
                      </div>
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="区域">
                  <a-input
                    disabled
                    v-model="formArea.area"
                    placeholder="在上面输入关键词"
                  >
                  </a-input>
                </a-form-model-item>
              </a-form-model>
            </a-tab-pane>
          </a-tabs>
        </div>
        <!-- 选择按钮 -->
        <div id="selectBtn">
          <div class="check">
            <a-checkbox v-model="cmChecked" @change="changeCmChecked">
              <span style="color: rgba(24, 144, 255)">厘米级别</span>
            </a-checkbox>
            <a-checkbox v-model="yamiChecked" @change="changeYamiChecked">
              <span style="color: rgba(255, 202, 24)">亚米级别</span>
            </a-checkbox>
          </div>
        </div>
        <!-- 返回按钮 -->
        <div class="returnUrl">
          <a-button @click="clickReturn">返回</a-button>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { cover, location, GetStations } from '@/api/home.js'
import { layersArr, showMap, setMapColor } from '@/api/mapApi'
import { filtersMixin } from '@/mixins/filtersMixin'

import * as turf from '@turf/turf' // 一次性引入
import 'ol/ol.css'
import Map from 'ol/Map.js'
import Overlay from 'ol/Overlay.js'
import SourceVector from 'ol/source/Vector'
import LayerVector from 'ol/layer/Vector'
import View from 'ol/View.js'
import GeoJSON from 'ol/format/GeoJSON'
import Icon from 'ol/style/Icon'
import Projection from 'ol/proj/Projection'
import FullScreen from 'ol/control/FullScreen'
import Draw from 'ol/interaction/Draw'
import { defaults as defaultControls, ScaleLine } from 'ol/control.js'
import MousePosition from 'ol/control/MousePosition'
import { createStringXY } from 'ol/coordinate.js' // 展示鼠标实时位置
import { transform } from 'ol/proj'
import { LineString, Polygon, MultiPolygon } from 'ol/geom'
import Feature from 'ol/Feature.js'
import Circle from 'ol/geom/Circle.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { OSM, Vector as VectorSource } from 'ol/source.js'
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
  RegularShape,
} from 'ol/style.js'
import WMSCapabilities from 'ol/format/WMSCapabilities.js'
import Point from 'ol/geom/Point'
import { easeOut } from 'ol/easing'
// 测距
import { getArea, getLength } from 'ol/sphere.js'
import { unByKey } from 'ol/Observable.js'

import WKT from 'ol/format/WKT'

import axios from 'axios'
import Qs from 'qs'
import { transGCJ2ToWGS } from '@/utils/coordTransform'

import locationRed from '@/assets/images/locationRed.png' // 导入图片资源

var map,
  personWFSLayer,
  mapEvent,
  mapClick,
  overlay,
  polygonLayer,
  polygonSource,
  StationSource,
  StationLayer,
  StationSourceLine,
  StationLayerLine,
  triangleSource, //三角网图层源
  triangleLayer //三角网图层

var wktFormat = new WKT()
var gdkey = 'f98de2203be7ed5b7b6f8c6066b8b7f5'

export default {
  name: 'Coverage',
  mixins: [filtersMixin],
  data() {
    return {
      spinning: false,
      locationRed,
      personDataArr: {},
      //经纬度查询表单
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        province: undefined,
        city: undefined,
        county: undefined,
      },
      formLocation: {
        lon: '',
        lat: '',
      },
      formArea: {
        keyword: undefined,
        area: '',
      },
      tips: [],
      cmChecked: true,
      yamiChecked: true,

      provinceList: [],
      cityList: [],
      countyList: [],
      geom: '',

      stations: [], // 基站
      triangles: [], // 三角网
    }
  },

  watch: {},

  methods: {
    initMap() {
      let fullHeight = `${document.documentElement.clientHeight}`
      fullHeight = fullHeight
      document.getElementById('mapServeRange').style.height = fullHeight + 'px'

      this.$nextTick(() => {
        var format = 'image/png'
        // 获取各个图层
        /* 点击弹框显示当前设备具体信息*/
        var container = document.getElementById('userPopup')
        // 创建一个overlay，绑定html元素container
        overlay = new Overlay(
          /** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            autoPanAnimation: {
              duration: 250,
            },
          })
        )

        StationSource = new VectorSource()
        StationLayer = new VectorLayer({
          source: StationSource,
          style: function (feature) {
            return new Style({
              fill: new Fill({
                color: [24, 144, 255, 0.4], // 蓝色
              }),
            })
          },
        })

        StationSourceLine = new VectorSource()
        StationLayerLine = new VectorLayer({
          source: StationSourceLine,
          style: function (feature) {
            return new Style({
              fill: new Fill({
                color: [255, 202, 24, 0.4], // 橙色
              }),
            })
          },
        })

        polygonSource = new VectorSource()
        polygonLayer = new VectorLayer({
          source: polygonSource,
          style: function (feature) {
            return new Style({
              stroke: new Stroke({
                width: 6,
                color: '#c76b7a',
              }),
            })
          },
        })
        map = new Map({
          // 默认控件隐藏，并添加控件
          controls: defaultControls().extend([
            new ScaleLine({
              units: 'metric',
            }),
          ]),
          overlays: [overlay],
          target: 'mapServeRange',
          layers: [...layersArr, polygonLayer, StationLayerLine, StationLayer],
          view: new View({
            projection: 'EPSG:4326',
            center: window.g.center,
            zoom: window.g.zoomVal,
            minZoom: window.g.minzoomVal,
            maxZoom: window.g.maxzoomVal,
          }),
        })
        setMapColor('mapServeRange')

        // 监听屏幕缩放事件
        map.on('moveend', function (e) {
          let currentZoom = map.getView().getZoom() //获取当前地图的缩放级别
          if (currentZoom > 9) {
            this.isShowBig = true
          } else {
            this.isShowBig = false
          }
        })

        /*添加鼠标滑动显示实时坐标控件*/
        map.addControl(
          new MousePosition({
            undefinedHTML: 'outside',
            projection: 'EPSG:4326',
            coordinateFormat: createStringXY(4),
          })
        )
        window.addEventListener('resize', this.changeSize)
        // 鼠标移动事件
        let _this = this
        mapEvent = function (evt) {
          if (evt.dragging) {
            return
          }
          // 当前点击的地图坐标点
          var pixel = map.getEventPixel(evt.originalEvent)
          // 如果当前点击地图坐标点与layer层的坐标点相交，返回该坐标点；
          var feature = map.forEachFeatureAtPixel(
            pixel,
            function (feature, layer) {
              // 过滤掉与非基准站坐标层相交的其他图层的点
              if (feature.getProperties().user_name) return feature
            }
          )
          // 如果当前指针坐标不经过基准站坐标点，隐藏弹窗
          if (feature === null || feature === undefined) {
            overlay.setPosition(undefined)
          } else {
            var coordinates = feature.getGeometry().getCoordinates()
            var stationData = feature.getProperties()
            _this.personDataArr = stationData
            overlay.setPosition(coordinates)
          }
        }
        mapClick = map.on('click', mapEvent)

        // this.addPolygon()
      })
    },
    // 获取矢量图层
    getLayers() {
      let featuresArr = []
      let featuresLineArr = []

      this.stations.forEach((v) => {
        let { l, b } = v
        featuresArr.push(
          turf.buffer(turf.point([l, b]), 30, { units: 'kilometers' })
        )

        featuresLineArr.push(
          turf.buffer(turf.point([l, b]), 50, { units: 'kilometers' })
        )
      })

      console.log('featuresArr: ', featuresArr, featuresLineArr)
      // 处理相交部分
      var union1 = featuresArr[0]
      featuresArr.forEach((ele) => {
        try {
          union1 = turf.union(union1, ele)
        } catch (e) {}
      })
      StationSource.addFeature(new GeoJSON().readFeature(union1))

      var union2 = featuresLineArr[0]
      featuresLineArr.forEach((ele) => {
        try {
          union2 = turf.union(union2, ele)
        } catch (e) {}
      })
      StationSourceLine.addFeature(new GeoJSON().readFeature(union2))
    },
    handleSearch(value) {
      console.log('value1', value)
      // 搜索
      const str = Qs.stringify({
        keywords: value,
        key: gdkey,
        type: '分类代码',
        citylimit: true,
      })
      axios
        .get(`https://restapi.amap.com/v3/assistant/inputtips?${str}`)
        .then((res) => {
          if (res.status !== 200) return
          this.tips = res.data.tips
        })
    },
    handleChange(value) {
      console.log('value2', value)
      const i = value.split('/')[0]
      this.formArea.area = this.tips[i].district
      const params = {
        key: gdkey,
        extensions: 'all', //获取行政区域边界值
      }
      const id = this.tips[i].id
      if (id && JSON.stringify(id) === '[]') {
        params.keywords = this.tips[i].name
      } else {
        params.keywords = this.tips[i].adcode
      }
      const str = Qs.stringify(params)
      axios
        .get(`https://restapi.amap.com/v3/config/district?${str}`)
        .then((res) => {
          if (res.status !== 200) return
          const polyline = res.data.districts[0].polyline
          polygonSource.clear()
          this.handelLonLat(polyline)
        })
    },
    // 处理经纬度
    handelLonLat(polyline) {
      const multipleBlockCoord = polyline.split('|')
      multipleBlockCoord.forEach((subItem) => {
        let arr = []
        subItem.split(';').forEach((item) => {
          let splitArr = item.split(',')
          const { lat, lon } = transGCJ2ToWGS(splitArr[1], splitArr[0])
          arr.push([lon, lat])
          // arr.push([splitArr[0], splitArr[1]]);
        })
        let feature = new Feature({
          type: 'Polygon',
          geometry: new Polygon([arr]),
        })
        polygonSource.addFeature(feature)
      })
      let extent = polygonSource.getExtent()
      map.getView().fit(extent, map.getSize())
    },
    changeCmChecked() {
      StationLayer.setVisible(this.cmChecked)
    },
    changeYamiChecked() {
      StationLayerLine.setVisible(this.yamiChecked)
    },
    changeSize() {
      // 监听屏幕缩放事件
      if (!document.getElementById('mapServeRange')) return
      let fullHeight = `${document.documentElement.clientHeight}`
      fullHeight = fullHeight
      document.getElementById('mapServeRange').style.height = fullHeight + 'px'
      map.updateSize()
    },
    fixedfn(Numerator, denominator) {
      if (!denominator) return '-'
      let result = `${Number(((Numerator / denominator) * 100).toFixed(2))}%`
      return result
    },
    initCommon() {
      this.cityList = []
      this.countyList = []
      this.form.city = ''
      this.form.county = ''
    },
    onProvinceChange(v) {
      if (v == 1000) {
        polygonSource.clear()
        map.getView().setCenter(window.g.center)
        map.getView().setZoom(window.g.zoomVal)
        this.initCommon()
        return
      }
      this.spinning = true
      this.form.city = ''
      this.cityList = []
      this.form.county = ''
      this.countyList = []
      cover(1, v)
        .then((res) => {
          if (res.success) {
            let { province, cityList, stationList, countyList, triangleList } =
              res.result
            this.cityList = cityList
            this.addMultiPolygon(province.geom)
            // this.addStation(stationList, triangleList, province.geom);
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    onCityChange(v) {
      this.spinning = true
      // StationSource.clear();
      // StationSourceLine.clear();
      this.form.county = ''
      this.countyList = []
      cover(2, v)
        .then((res) => {
          if (res.success) {
            let { city, countyList, stationList, triangleList } = res.result
            this.countyList = countyList
            this.addMultiPolygon(city.geom)
            // this.addStation(stationList, triangleList, city.geom);
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    onCountyChange(v) {
      this.spinning = true
      // StationSource.clear();
      // StationSourceLine.clear();
      if (!v) {
        this.onCityChange()
        return
      }
      cover(3, v)
        .then((res) => {
          if (res.success) {
            let { county, stationList, triangleList } = res.result
            this.addMultiPolygon(county.geom)
            // this.addStation(stationList, triangleList, county.geom);
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 划线范围
    addMultiPolygon(geom) {
      // map.removeLayer(polygonLayer)
      polygonSource.clear()
      let feature = wktFormat.readFeature(geom)
      console.log(feature, 'feature')
      polygonSource.addFeature(feature)
      let extent = polygonSource.getExtent()
      map.getView().fit(extent, map.getSize())
    },

    onLocal() {
      let { lon, lat } = this.formLocation
      if (!lon || !lat) {
        this.$message.error('请输入经纬度!')
      } else {
        //172.16.15.137:22702
        location(lon, lat).then((res) => {
          if (res.success) {
            let { county, stationList, countyList, triangleList } = res.result
            this.addMultiPolygon(county.geom)
            this.addStation(stationList, triangleList, county.geom)
            let feature = new Feature({
              geometry: new Point([lon, lat]),
            })
            feature.setStyle(
              new Style({
                image: new Icon({
                  src: locationRed,
                  anchor: [0.5, 1], // 设置图标位置
                }),
              })
            )
            polygonSource.addFeature(feature)
            // console.log(map.getSize(), "====>>");
            // let extent = polygonSource.getExtent();
            // map.getView().fit(extent, map.getSize());
          } else {
            this.$message.error($it(res.message))
          }
        })
      }
    },

    clickReturn() {
      window.location.href = window._CONFIG['returnUrl']
    },

    // 获取站点信息
    getStations() {
      GetStations().then((res) => {
        if (!res.success) return
        this.stations = res.result.stationList
        this.triangles = res.result.triangleList
        // 获取图层
        this.getLayers()
      })
    },
  },
  mounted() {
    this.getStations()
    cover(0).then((res) => {
      if (res.success) {
        this.provinceList = res.result.provinceList
        this.provinceList.unshift({
          id: '1000',
          name: '请选择省份',
        })
      }
    })
    this.initMap()
  },
  destroyed() {
    window.removeEventListener('resize', this.changeSize)
  },
  deactivated() {
    window.removeEventListener('resize', this.changeSize)
  },

  //地图自适应缩放
  computed: {},
}
</script>

<style lang="less" scoped>
.userDistributionMapContent {
  position: relative;
  width: 100%;
  height: 100%;
  #mapServeRange {
    > .ol-mouse-position {
      top: auto;
      bottom: 10px;
    }
  }

  #operationContent {
    position: absolute;
    top: 30px;
    right: 20px;
    z-index: 99;
    width: 340px;
    padding: 0 15px;
    text-align: center;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background: #fff;
    color: #333;
  }

  /deep/ .ant-tabs-tab {
    margin-right: 0;
  }

  #selectBtn {
    position: absolute;
    top: 30px;
    right: 370px;
    z-index: 99;
    padding: 10px 15px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background: #032a38;
    color: #fff;
    .check {
      color: #fff;
      margin-top: 10px;
    }
    .hr {
      margin: 10px 0 0 0;
    }
    /deep/ .ant-checkbox-inner {
      border-radius: 50%;
    }
  }

  .returnUrl {
    position: absolute;
    left: 40px;
    top: 10px;
    z-index: 99;
  }

  #userPopup {
    ul {
      margin: 0;
      padding: 0;

      li {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        padding-right: 0;
        color: #fff;
        list-style: none;
      }
    }
  }

  .ol-mouse-position {
    top: auto;
    bottom: 10px;
  }

  .ol-popup {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 290px;
  }

  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .ol-popup:after {
    border-top-color: rgba(0, 0, 0, 0.6);
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }

  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }

  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }

  .ol-popup-closer:after {
    content: '✖';
  }

  .station_basicinfo {
    text-align: center;
    font-size: 16px;
    margin: 0 0 10px 0;
    color: #fff;
    border-bottom: 1px solid #fff;
    padding-bottom: 10px;
  }
}
</style>
