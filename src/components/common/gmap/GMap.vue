<template>
  <div class="gaode-map-div" :style="{ height: MapHeight + 'px' }">
    <!--头部功能区-->
    <slot name="map-opt"></slot>
    <!--地图展示区-->
    <div class="map-body">
      <!--统计表格-->
      <slot name="map-table"></slot>
      <slot name="dataBtn"></slot>
      <!--高德地图-->
      <div id="my_container"></div>
      <!--坐标信息-->
      <div class="location">
        X:<span v-text="lng"></span>
        Y:<span v-text="lat"></span>
      </div>
      <!--工具栏-->
      <el-button-group class="ruler-button" v-if="showToolbar">
        <!--测距-->
        <el-button type="primary" @click="measureDistance()" v-if="showMeasureDistance">测距</el-button>
        <el-button type="danger" @click="clearMeasure()" v-if="showMeasureDistance">清除</el-button>
        <!--热力图-->
        <el-button :type="heatMapColor" @click="heatMapDis()" v-if="showHeatmap">热力图<i :class="iconType" class="el-icon--right" v-if="showIcon"></i></el-button>
        <div class="heatMapOption" v-if="heatmapStatus">
          <slot name="heatMapOption"></slot>
        </div>
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
  import remoteLoad from '@/utils/remoteLoad'
  export default {
    name: 'GMap',
    props: {
      // 地图高度
      MapHeight: {
        type: String,
        default: '500'
      },
      // 地图区域
      regionName: {
        type: String,
        default: ''
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
      markerData: {
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
      }
    },
    data() {
      return {
        polygonArrs: [],
        searchForm: {},
        cluster: null,
        arr: [],
        AMap: '',
        map: null,
        ruler: '', // 测量点距离
        heatmap: '', // 热力图
        lng: '0', // 坐标点位置
        lat: '0', // 坐标点位置
        locStart: null, // 路线规划起点
        locEnd: null, // 路线规划起点
        locationStartMarker: null,
        locationStartMarker: null,
        ridingPath: null, // 路线规划
        points: [],
        heatmapStatus: false,
        heatMapColor: 'warning',
        iconType: 'el-icon-d-arrow-left'
      }
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    watch: {
      heatmapStatus(val) {
        if (val) {
          this.heatmap.show() // 打开热力图
        } else {
          this.heatmap.hide() // 关闭热力图
        }
      },
      locStart(val) {
        if (val && this.locEnd) this.ridingPathCreat()
      },
      locEnd(val) {
        if (val && this.locStart) this.ridingPathCreat()
      }
    },
    methods: {
      // 边界查询
      async queryHeatmapData() {
        let heartMapSearch = {}
        let bounds = this.map.getBounds()
        heartMapSearch.stationLngMax = bounds.northeast.lng
        heartMapSearch.stationLngMin = bounds.southwest.lng
        heartMapSearch.stationLatMax = bounds.northeast.lat
        heartMapSearch.stationLatMin = bounds.southwest.lat
        var res = await this.postJson('station', {
          apiCode: 300068,
          content: heartMapSearch
        })
        if (res.code === '0') {
          this.heatMapData = res.content
          this.setHeatMap(this.heatMapData)
        }
      },
      setHeatMap(val) {
        let salesArr = val
        let points = []
        let maxNum = 0
        salesArr.forEach((val, index) => {
          let obj = {}
          obj.lng = val.lng
          obj.lat = val.lat
          obj.count = val.count
          // obj.count = parseFloat(val[this.statisticTime])
          // if (obj.count > maxNum) maxNum = obj.count
          points.push(obj)
        })
        this.heatmap.setDataSet({
          max: maxNum,
          data: points
        })
        this.heatmap.setMap(this.map)
      },

      async createAmap(regionName, showData = true) {
        if (this.ridingPath) {
          this.ridingPath.clear()
          this.locEnd = null
          this.locStart = null
        }
        const that = this
        // import AMap from 'AMap'   // 在页面中引入高德地图
        var AMap = this.AMap = window.AMap
        let map = this.map = new AMap.Map('my_container',
          {
            zoom: 12,
            // center: [113.658167, 34.756454],
            expandZoomRange: true
          }
        )
        this.map.clearMap()
        this.map.setCity(regionName)
        map.setDefaultCursor('default') // 设置默认鼠标样式
        AMap.plugin(['AMap.ToolBar'],
          function () {
            map.addControl(new AMap.ToolBar())
          })
        // 区域划分
        if (this.showDistrictSearch) {
          AMap.plugin('AMap.DistrictSearch', function () {
            let district = new AMap.DistrictSearch({
              extensions: 'all',
              level: 'district'
            })
            district.search(regionName, function(status, result) {
              console.log('DistrictSearch开始')
              let bounds = result.districtList[0].boundaries
              if (bounds) {
                that.polygonArrs = []
                for(let i = 0, l = bounds.length; i < l; i++){
                  let polygon = new AMap.Polygon({
                    strokeWeight: 3,
                    path: bounds[i],
                    fillOpacity: 0.6,
                    fillColor: '#CCF3FF',
                    strokeColor: '#CC66CC'
                  })
                  that.polygonArrs.push(polygon)
                }
                map.add(that.polygonArrs)
                map.setFitView()
                console.log('DistrictSearch结束')

              }
            })
          })
        }
        if(this.markerData) {
          this.markerData.forEach((val, index) => {
            if (val.stationLat != null && val.stationLng != null && val.stationLat != '' && val.stationLng != '') {
              this.arr.push([val.stationLng, val.stationLat, val.stationCode, val.stationAddr, val.nameX, val.mobile])
            }
          })
          var markers = []
          this.arr.forEach(function (marker) {
            var k = new AMap.Marker({
              map: map,
              // icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
              icon: img,
              position: [marker[0], marker[1]],
              offset: new AMap.Pixel(0, 0)
            })
            // 鼠标点击marker弹出自定义的信息窗体
            AMap.event.addListener(k, 'click', function() {
              that.$emit('show_task_info', marker)
            })

            k.setLabel({
              offset: new that.AMap.Pixel(15, 25),
              content: marker[2]
            })
            markers.push(k)
          })
          /* ok 点聚合 */
          var cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80})
        }
        if(this.heatMapData.length > 0) {
          map.plugin(['AMap.Heatmap'], function () {
            // 初始化heatmap对象
            that.heatmap = new AMap.Heatmap(map, {
              radius: 25, // 给定半径
              opacity: [0, 0.8]
            })
            that.heatmap.hide()
          })
          let salesArr = this.heatMapData
          let points = []
          let maxNum = 0
          salesArr.forEach((val, index) => {
            let obj = {}
            obj.lng = val.lng
            obj.lat = val.lat
            obj.count = parseFloat(val[this.statisticTime])
            if (obj.count > maxNum) maxNum = obj.count
            points.push(obj)
          })
          this.heatmap.setDataSet({
            max: maxNum,
            data: points
          })
          // console.log(this.heatmap.setMap())
          this.heatmap.setMap(this.map)
        }
        map.plugin(['AMap.Scale'], function () {
          var scale = new AMap.Scale()
          map.addControl(scale)
        })
        /* 测量距离 */
        map.plugin(['AMap.RangingTool'], function () {
          that.ruler = new AMap.RangingTool(map)
          // that.ruler.turnOn()
          AMap.event.addListener(that.ruler, 'end', function (e) {
            that.ruler.turnOff()
          })
        })
        // 展示路径规划
        if (that.showPath) {
          /* 设置右键菜单 */
          var contextMenu = new AMap.ContextMenu()  // 创建右键菜单
          let contextMenuPositon
          let middleLocationArr = [] // 存‘起终’经纬度坐标,中间件
          let locationStartMarker = []
          let locationEndMarker = []
          contextMenu.addItem('设为起点', function () {
            if (locationStartMarker.length) {
              locationStartMarker[0].setMap(null)
              locationStartMarker = []
            }
            var marker = new AMap.Marker({
              map: map,
              position: contextMenuPositon, // 基点位置
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png'
            })
            locationStartMarker.push(marker)
            that.locationStartMarker = locationStartMarker
            that.locStart = JSON.parse(JSON.stringify(middleLocationArr))
          }, 0)
          contextMenu.addItem('设为终点', function () {
            if (locationEndMarker.length) {
              locationEndMarker[0].setMap(null)
              locationEndMarker = []
            }
            var marker = new AMap.Marker({
              map: map,
              position: contextMenuPositon, // 基点位置
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png'
            })
            locationEndMarker.push(marker)
            that.locationEndMarker = locationEndMarker
            that.locEnd = JSON.parse(JSON.stringify(middleLocationArr))
          }, 1)
          // 地图绑定鼠标右击事件——弹出右键菜单
          map.on('rightclick', function (e) {
            contextMenu.open(map, e.lnglat)
            contextMenuPositon = e.lnglat
            middleLocationArr = [e.lnglat.lng, e.lnglat.lat]
          })
        }
        map.on('moveend', function(e) {
        })
        map.on('mousemove', function (e) {
          that.lng = e.lnglat.getLng()
          that.lat = e.lnglat.getLat()
        })
        map.on('zoomend', function(e) {
        })
        map.on('complete', function() {
        });
      },
      /* 热力图 */
      heatMapDis() {
        if(this.heatmapStatus) {
          this.heatmapStatus = false
          this.heatMapColor = 'warning'
          this.iconType = 'el-icon-d-arrow-left'
        } else {
          this.heatmapStatus = true
          this.heatMapColor = 'success'
          this.iconType = 'el-icon-d-arrow-right'
        }
      },
      /* 测量距离 */
      measureDistance() {
        this.ruler.turnOn()
        if (this.showDistrictSearch) {
          this.map.remove(this.polygonArrs)
        }
      },
      /* 清除测量距离 */
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
      },
      /* 路程规划创建 */
      ridingPathCreat() { // 骑行导航（根据起点和终点获取骑行路线)
        var AMap = this.AMap
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
    },
    components: {
      remoteLoad
    },
    async mounted() {
      if (window.AMap) {
        this.createAmap(this.regionName, false)
      }else {
        await remoteLoad(`https://webapi.amap.com/maps?v=1.4.15&key=4199fe377dd77297c6e4cee01bd0b266&plugin=AMap.MarkerClusterer,AMap.Riding,AMap.AdvancedInfoWindow`)
        this.createAmap(this.regionName, false)
      }
    }
  }
</script>
<style lang="less">
  .gaode-map-div{
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    /*padding: 10px;*/
    margin-bottom: 20px;
    .map-opt{
      margin-bottom: 10px;
    }
    .map-body{
      flex: 1;
      width: 100%;
      margin-bottom: 8px;
      position: relative;
      #my_container{
        width: 100%;
        height: 100%;
        border: 1px solid #dddee1;
        border-radius:0 0 0px 0px;
        font-size:12px;
        .amap-toolbar {
          top: 30px !important;
        }
      }
      .location {
        position: absolute;
        left: 10px;
        top: 10px;
        font-size: 14px;
        color: #5a4e4e;
      }
      .ruler-button {
        position: absolute;
        right: 10px;
        top: 10px;
        .heatMapOption {
          width: 66px;
          float: right;
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
