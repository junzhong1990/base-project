<template>
  <div class="amap-show" :style="{ height: mapHeight + 'px' }">
    <!--头部功能区-->
    <slot name="map-opt"></slot>
    <!--地图展示区-->
    <div class="map-body">
      <!--统计表格-->
      <slot name="map-table"></slot>
      <slot name="dataBtn"></slot>
      <!--高德地图-->
      <div id="mapContainer"></div>
      <!--坐标信息-->
      <div class="location">
        X：<span v-text="lng"></span>
        Y：<span v-text="lat"></span>
      </div>
      <!--工具栏-->
      <el-button-group class="ruler-button" v-if="showToolbar">
        <el-button :type="heatmapStatus?'success':'warning'" @click="heatMapDis" v-if="showHeatmap">
          热力图
          <i v-if="showIcon" :class="heatmapStatus?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
        </el-button>
        <slot name="heatMapOption" v-show="heatmapStatus"></slot>
        <template v-if="btnList.length">
          <ul
            v-show="heatmapStatus"
            class="heat-map-btns">
            <li
              v-for="(item, index) in btnList"
              :key="index"
              :label="item.key"
              @click="handleBtn(item, index)"
              :class="{'active': btnIndex === index}">
              {{item.label}}
            </li>
          </ul>
        </template>
         <!-- 测距 -->
        <el-button type="primary" @click="measureDistance" v-if="showMeasureDistance">测距</el-button>
        <el-button type="danger" @click="clearMeasure" v-if="showMeasureDistance">清除</el-button>
      </el-button-group>
      <!--骑行导航-->
      <div id="panel" ref="panel"></div>
      <div class="info-tip">
        <div id="centerCoord"></div>
        <div id="tips"></div>
      </div>
    </div>
    <!--弹窗信息-->
    <slot name="dialog"></slot>
  </div>
</template>
<script>
  import img from '@/assets/img/siteIcon/welfare.png'
  import { aMapAk } from '@/utils/common'
  export default {
    props: {
      // 地图高度
      mapHeight: {
        type: String,
        default: '500'
      },
      // 地图区域
      regionName: {
        type: String,
        default: '重庆'
      },
      // 工具栏
      showToolbar: {
        type: Boolean,
        default: true
      },
      // 测距工具
      showMeasureDistance: {
        type: Boolean,
        default: true
      },
      // 热力图
      showHeatmap: {
        type: Boolean,
        default: true
      },
      // 显示按钮图标
      showIcon: {
        type: Boolean,
        default: true
      },
      // 区域划分
      showDistrictSearch: {
        type: Boolean,
        default: false
      },
      // 骑行规划
      showPath: {
        type: Boolean,
        default: true
      },
      // 遮罩物数组（站点数据）
      stationData: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 热力图数组
      heatMapData: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 按钮组
      btnList: {
        type: Array,
        default: () => {
          return [
            // {key: 'daySales', label: '日销量'},
            // {key: 'weekSales', label: '周销量'},
            // {key: 'monthSales', label: '月销量'},
            // {key: 'yearSales', label: '年销量'}
          ]
        }
      }
    },
    data() {
      return {
        map: null,
        cluster: null,
        locStart: null, // 路线规划起点
        locEnd: null, // 路线规划起点
        locationStartMarker: null,
        locationEndMarker: null,
        ridingPath: null, // 路线规划
        heatmap: null, // 热力图
        heatmapStatus: false,
        statisticType: '',
        ruler: '', // 测量点距离
        lng: 0, // 坐标点位置
        lat: 0, // 坐标点位置
        points: [],
        polygonArrs: [],
        btnIndex: null,
      }
    },
    watch: {
      locStart(val) {
        if (val && this.locEnd) this.ridingPathCreat()
      },
      locEnd(val) {
        if (val && this.locStart) this.ridingPathCreat()
      },
      // 监听热力数组
      heatMapData: {
        handler(newVal) {
          this.setHeatMap(newVal)
        },
        deep: true
      },
      // 监听站点数组
      stationData: {
        handler(newVal) {
          this.addMarkerClusterer()
        },
        deep: true
      },
    },
    mounted() {
      aMapAk().then(_ => {
        this.initMap()
      })
      this.statisticType = this.$attrs.defaultBtnKey
    },
    methods: {
      // 获取地图的最大最小经纬度，即东北-西南角
      getMapBounds() {
        const bounds = this.map.getBounds()
        let swPointB = bounds.getSouthWest() // 西南角
        let nePointB = bounds.getNorthEast() // 东北角
        return {
          stationLngMax: nePointB.lng,
          stationLatMax: nePointB.lat,
          stationLngMin: swPointB.lng,
          stationLatMin: swPointB.lat
        }
      },
      // 设置热力图
      setHeatMap(data) {
        console.log(data)
        let points = []
        let maxNum = 0
        data.forEach((val, index) => {
          let obj = {}
          obj.lng = +val.stationLng
          obj.lat = +val.stationLat
          obj.count = parseFloat(val[this.statisticType])
          if (obj.count > maxNum) maxNum = obj.count
          points.push(obj)
        })
        this.heatmap.setDataSet({
          max: maxNum,
          data: points
        })
        // this.heatmap.setMap(this.map)
      },
      // 初始化地图
      initMap() {
        if (this.ridingPath) {
          this.ridingPath.clear()
          this.locEnd = null
          this.locStart = null
        }
        const that = this
        const map = new AMap.Map('mapContainer', {
          zoom: 5,
          // center: [113.658167, 34.756454],
          expandZoomRange: true
        })
        map.clearMap()
        // map.setCity(this.regionName)
        map.setDefaultCursor('default') // 设置默认鼠标样式
        this.map = map
        // 工具
        AMap.plugin([
          'AMap.ToolBar',
          'AMap.Scale'
        ], () => {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })
        // 聚合
        AMap.plugin([
          'AMap.MarkerClusterer'
        ], () => {
          this.cluster = new AMap.MarkerClusterer(map, {markers: []}, {gridSize: 80})
        })
        // 区域划分
        if (this.showDistrictSearch) {
          this.districtSearch()
        }
        // 点聚合逻辑
        if (this.stationData.length) {
          this.addMarkerClusterer()
        }
        // 初始化heatmap对象
        AMap.plugin([
          'AMap.Heatmap'
        ], () => {
          this.heatmap = new AMap.Heatmap(map, {
            radius: 25, // 给定半径
            opacity: [0, 0.8]
          })
          this.heatmap.hide()
        })
        // 测量距离
        AMap.plugin([
          'AMap.RangingTool'
        ], () => {
          this.ruler = new AMap.RangingTool(map)
          // this.ruler.turnOn()
          AMap.event.addListener(this.ruler, 'end', (e) => {
            this.ruler.turnOff()
            map.setDefaultCursor('default')
          })
        })

        // 展示路径规划
        if (this.showPath) {
          this.setContextMenu()
        }
        map.on('mousemove', (e) => {
          this.lng = e.lnglat.getLng()
          this.lat = e.lnglat.getLat()
        })
        // map.on('moveend', function(e) {
        // })
        // map.on('zoomend', (e) => {
        // })
        map.on('complete', () => {
          this.$emit('complete', map)
        })
      },
      // 区域划分
      districtSearch() {
        const map = this.map
        AMap.plugin('AMap.DistrictSearch', () => {
          let district = new AMap.DistrictSearch({
            extensions: 'all',
            level: 'district'
          })
          district.search(regionName, (status, result) => {
            console.log('DistrictSearch开始')
            let bounds = result.districtList[0].boundaries
            if (bounds) {
              this.polygonArrs = []
              for (let i = 0, len = bounds.length; i < len; i++){
                let polygon = new AMap.Polygon({
                  strokeWeight: 3,
                  path: bounds[i],
                  fillOpacity: 0.6,
                  fillColor: '#CCF3FF',
                  strokeColor: '#CC66CC'
                })
                this.polygonArrs.push(polygon)
              }
              map.add(this.polygonArrs)
              map.setFitView()
              console.log('DistrictSearch结束')
            }
          })
        })
      },
      // 设置点聚合
      addMarkerClusterer() {
        this.cluster.clearMarkers()
        const [arr, markers] = [[], []]
        this.stationData.forEach((val, index) => {
          if (val.stationLat != null && val.stationLng != null && val.stationLat != '' && val.stationLng != '') {
            arr.push([val.stationLng, val.stationLat, val.stationCode, val.stationAddress, val.principal, val.telephone])
          }
        })
        arr.forEach(dat => {
          let marker = new AMap.Marker({
            map: this.map,
            // icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            icon: new AMap.Icon({
              image: img,
              size: new AMap.Size(21, 35)
            }),
            position: [dat[0], dat[1]],
            offset: new AMap.Pixel(0, 0)
          })
          // 鼠标点击marker弹出自定义的信息窗体
          AMap.event.addListener(marker, 'click', () => {
            this.$emit('show_task_info', dat)
          })
          marker.setLabel({
            offset: new AMap.Pixel(15, 25),
            content: dat[2]
          })
          markers.push(marker)
        })
        this.cluster && this.cluster.addMarkers(markers)
        // 设置可视区域
        this.map.setFitView()
      },
      // 设置右键菜单
      setContextMenu() {
        const map = this.map
        const contextMenu = new AMap.ContextMenu()
        let contextMenuPositon
        let middleLocationArr = [] // 存‘起终’经纬度坐标,中间件
        let locationStartMarker = []
        let locationEndMarker = []
        contextMenu.addItem('设为起点', () => {
          if (locationStartMarker.length) {
            locationStartMarker[0].setMap(null)
            locationStartMarker = []
          }
          let marker = new AMap.Marker({
            map: map,
            position: contextMenuPositon, // 基点位置
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png'
          })
          locationStartMarker.push(marker)
          this.locationStartMarker = locationStartMarker
          this.locStart = JSON.parse(JSON.stringify(middleLocationArr))
        }, 0)
        contextMenu.addItem('设为终点', () => {
          if (locationEndMarker.length) {
            locationEndMarker[0].setMap(null)
            locationEndMarker = []
          }
          let marker = new AMap.Marker({
            map: map,
            position: contextMenuPositon, // 基点位置
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png'
          })
          locationEndMarker.push(marker)
          this.locationEndMarker = locationEndMarker
          this.locEnd = JSON.parse(JSON.stringify(middleLocationArr))
        }, 1)
        // 地图绑定鼠标右击事件——弹出右键菜单
        map.on('rightclick', function (e) {
          contextMenu.open(map, e.lnglat)
          contextMenuPositon = e.lnglat
          middleLocationArr = [e.lnglat.lng, e.lnglat.lat]
        })
      },
      // 开关热力图
      heatMapDis() {
        this.heatmapStatus = !this.heatmapStatus
        if (this.heatmapStatus) {
          this.heatmap.show() // 打开热力图
        } else {
          this.heatmap.hide() // 关闭热力图
        }
      },
      // 按钮事件
      handleBtn(item, index) {
        this.statisticType = item.key
        this.btnIndex = index
        this.setHeatMap(this.heatMapData)
      },
      // 测量距离
      measureDistance() {
        this.ruler.turnOn()
        this.map.setDefaultCursor('Crosshair')
        if (this.showDistrictSearch) {
          this.map.remove(this.polygonArrs)
        }
      },
      // 清除
      clearMeasure() {
        this.ruler.turnOff()
        if (this.showDistrictSearch) {
          this.map.add(this.polygonArrs)
        }
        // 清除骑行路径
        if (this.ridingPath) {
          this.ridingPath.clear()
          this.locStart = null
          this.locEnd = null
          this.map.remove(this.locationStartMarker)
          this.map.remove(this.locationEndMarker)
        }
        this.cluster.clearMarkers()
        // this.heatmap.setMap(null)
        this.heatmap.hide()
        this.map.clearMap()
      },
      // 路程规划创建
      ridingPathCreat() {
        // 骑行导航（根据起点和终点获取骑行路线)
        if (!this.ridingPath) {
          this.ridingPath = new AMap.Riding({
            map: this.map,
            policy: 1,
            hideMarkers: true,
            isOutline: true,
            outlineColor: '#ffeeee',
            autoFitView: true,
            panel: 'panel'
          })
        }
        // 根据起终点坐标规划骑行路线
        this.ridingPath.search(this.locStart, this.locEnd)
      }
    }
  }
</script>
<style lang="less">
  .amap-show{
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    background-color: #fff;
    .map-opt{
      margin-bottom: 10px;
    }
    .map-body{
      flex: 1;
      width: 100%;
      margin-bottom: 8px;
      position: relative;
      #mapContainer{
        width: 100%;
        height: 100%;
        border: 1px solid #dddee1;
        border-radius:0 0 0px 0px;
        font-size:12px;
        // .amap-toolbar {
        //   top: 30px !important;
        // }
      }
      .location {
        position: absolute;
        left: 75px;
        top: 10px;
        padding: 5px;
        font-size: 14px;
        color: #5a4e4e;
        background-color: #fff;
        box-shadow: 0 0 6px 0 #999;
      }
      .ruler-button {
        position: absolute;
        right: 10px;
        top: 10px;
        .heatMapOption {
          width: 66px;
          float: right;
        }
        .heat-map-btns{
          position: absolute;
          left: 2px;
          top: 30px;
          width: 80px;
          // border: 1px solid #DCDFE6;
          font-size: 12px;
          li{
            padding: 7px 15px;
            background-color: #fff;
            cursor: pointer;
            &:not(:last-child){
              border-bottom: 1px solid #DCDFE6;
            }
            &:hover{
              color: #567CDB;
            }
            &.active{
              color: #fff;
              background-color: #567CDB;
            }
          }
        }
      }
      .map-table{
        position: absolute;
        right: 50px;
        top: 300px;
        z-index: 155;
        background: #fff;
        width: 40%;
        font-size: 14px;
        .dataTbs{
          width: 100%;
        }
        .dataTbs tr.header{
          background: #6dbfff;
          color: #fff;
        }
        .dataTbs tr.header th{
          border: 1px solid #fff;
          text-align: center;
          padding: 5px 2px;
        }
        .dataTbs tr.header th span{
          color:#FF5722;
        }
        .dataTbs tr.header th,.dataTbs tr.body td{
          padding: 5px 2px;
        }
        .dataTbs tr td{
          border: 1px solid #d2d2d2;
          text-align: center;
          padding: 5px 2px;
        }
      }
      .dataBtn{
        background: #FF5722;
        color: rgb(255, 255, 255);
        position: absolute;
        top: 424px;
        right: 50px;
        padding: 5px 26px;
        border-radius: 2px;
        cursor: pointer;
        z-index: 999;
      }
      #panel {
        position: absolute;
        background-color: white;
        max-height: 85%;
        overflow-y: auto;
        top: 50px;
        right: 10px;
        width: 280px;
      }
    }
    .heatmap {
      border: 1px solid #d5d5d5;
      padding: 3px 8px 3px 8px;
      border-radius: 5px;
      position: absolute;
      right: 10px;
    }
  }
  /* 高德地图 */
  .amap-marker .marker-route {
    position: absolute;
    width: 40px;
    height: 44px;
    color: #e90000;
    background: url(https://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png) no-repeat;
    cursor: pointer;
  }



</style>
