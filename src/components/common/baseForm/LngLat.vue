<template>
    <div class="layout evalute">

        <div class="makeMiddle" style="height: 100%;">
            <div class="searchBox" style="height: 100%; margin-bottom: 0;display: flex;flex-direction: column">
                <div style="height: auto;line-height:29px;border: 1px solid #dddee1;padding: 6px;" class="mt12">
                    <!--经营类型: 全部站点2个 &nbsp; 自助站点2个 &nbsp; 便利站点0个 &nbsp; 快开站点0个-->
                    <div>
                      <span>坐标：</span>
                      <div style="display: inline-block;">
                        <el-input v-model="lngPoint" disabled></el-input>
                      </div>
                      <div style="display: inline-block;">
                        <el-input v-model="latPoint" disabled></el-input>
                      </div>
                    </div>
                </div>
                <div style="width: 100%;flex: 1;margin-bottom: 8px;">
                    <div id="my_container" v-loading="spinShow">
                        <!--<Spin v-if="spinShow" fix></Spin>-->
                        <!--坐标点-->
                        <div class="location" style="position: absolute; left: 20px;top: 20px;z-index: 151">
                            X:<span v-text="lng"></span>
                            Y:<span v-text="lat"></span>
                        </div>
                    </div>
                    <!--骑行导航-->
                    <div id="panel" ref="panel"></div>


                    <div class="info-tip">
                        <div id="centerCoord"></div>
                        <div id="tips"></div>
                    </div>
                </div>
            </div>


        </div>

    </div>
</template>

<script>
  var centerImg = require('@/assets/img/center.png')
  import remoteLoad from '@/utils/remoteLoad'
  import cdnConfig from '@/utils/cdnConfig'
  // var AMap = require('Amap')
  export default {
    name: 'manage',
    data() {
      return {
        // 按钮当前激活序号
        currentIndex: 0,
        btnList: [
          '日销量',
          '周销量',
          '月销量',
          '年销量'
        ],
        // 站点类型
        // levelCode: -1,
        levelCode: -1,
        // limitRadius: 0,
        cityCode: '400000',
        areaCode: '',
        areaCodeArr: [],
        reginCode: [
          {nameX: '哈尔滨市', valueX: '230100'},
          {nameX: '齐齐哈尔市', valueX: '230200'},
          {nameX: '鸡西市', valueX: '230300'},
          {nameX: '鹤岗市', valueX: '230400'},
          {nameX: '双鸭山市', valueX: '230500'},
          {nameX: '大庆市', valueX: '230600'},
          {nameX: '伊春市', valueX: '230700'},
          {nameX: '佳木斯市', valueX: '230800'},
          {nameX: '七台河市', valueX: '230900'},
          {nameX: '牡丹江市', valueX: '231000'},
          {nameX: '黑河市', valueX: '231100'},
          {nameX: '绥化市', valueX: '231200'},
          {nameX: '大兴安岭地区', valueX: '232700'}
        ],
        AMap: null,
        AMapUI: null,
        map: null,
        spinShow: false,
        districtSearch: {}, // 区划查询对象
        // loadingMap: false, // 加载地图中
        heatMapLoading: true, // 热力图加载中
        statisticTime: 'lastDay', // 统计时间段
        stationAnalysisList: [], // 类型统计
        cluster: {}, // 聚合点对象
        placeSearch: {}, // 地点查询
        autoComplete: {}, // 地点搜查提示
        labelCircle: [], // 标签点圆
        labelCircleObj: {}, // 标签点圆对象
        labelMarkerObj: {}, // 标签对象
        labelMarkerTextObj: {}, // 标签文本对象
        labelMarkerText: [], // 标签文本
        labelMarker: [], // 标签点
        // labelTxt: [], // 标签内容
        labelRadiusArr: [], // 标签圆半径备选排序数组
        Obj: {},
        ruler: '', // 测量点距离
        heatmap: '', // 热力图
        heatMapData: [], // 热力图数据
        heatmapStatus: false, // 热力图开关状态
        stationArr: [], // 站点数据
        markersArr: [], // 站点标识
        proRadius: [], // 保护半径
        lng: '0', // 坐标点位置
        lat: '0', // 坐标点位置
        lngPoint: '0', // 坐标点位置
        latPoint: '0', // 坐标点位置
        locStart: null, // 路线规划起点
        locEnd: null, // 路线规划起点
        ridingPath: null, // 路线规划
        centerMarker: null // 鼠标点击，圆心标记
      }
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      limitRadius: function () {
        let arr = this.proRadius
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].stationAreaLevelCode === this.levelCode) {
            return arr[i].limitRadius
          }
        }
      }
    },
    watch: {
      locStart(val) {
        if (val && this.locEnd) this.ridingPathCreat()
      },
      locEnd(val) {
        if (val && this.locStart) this.ridingPathCreat()
      }
    },
    beforeCreate() {
    },
    async mounted() {
      console.log(1212)
      // const that = this
      // const id = 'sync_amap'
      if (!window.AMap && !window.AMapUI) {
        await remoteLoad(cdnConfig.amap)
        await remoteLoad(cdnConfig.amapUi)
        // this.initMap()
      }
      console.log(1)
      // function fn() {
      // var AMap = require('AMap')
      // that.AMap = AMap
      this.AMapUI = window.AMapUI
      console.log(2)
      this.AMap = window.AMap
      console.log(3)
      this.createAmap('重庆市')
      console.log(4)
      // }

      this.getmarkers()
      this.getProRadius()
    },
    methods: {
      saleCountClicked(index) {
        this.currentIndex = index
        switch (index) {
          case 0:
            this.statisticTime = 'lastDay'
            break
          case 1:
            this.statisticTime = 'thisWeek'
            break
          case 2:
            this.statisticTime = 'thisMonth'
            break
          case 3:
            this.statisticTime = 'thisYear'
            break
          default:
            this.statisticTime = 'lastDay'
        }
        this.setHeatMap(this.heatMapData)
      },
      setCity(e) {
        this.spinShow = true
        let adCode
        if (!e) {
          if (this.areaCode === '') {
            adCode = this.cityCode
          } else {
            adCode = this.areaCode
          }
        } else {
          adCode = e.poi.adcode
        }
        let _this = this
        this.map.setZoom(12)
        this.map.setCity(adCode, _this.query())
      },
      query() {
        let _this = this
        let bounds = _this.map.getBounds()
        _this.Obj.stationLngMax = bounds.northeast.lng
        _this.Obj.stationLngMin = bounds.southwest.lng
        _this.Obj.stationLatMax = bounds.northeast.lat
        _this.Obj.stationLatMin = bounds.southwest.lat
        // 请求
        // _this.postJson('station', {
        //   apiCode: 300067,
        //   content: _this.Obj
        // }).then(res => {
        //   if (res.code === '0') {
        //     _this.stationArr = res.content.stationList
        //     _this.stationAnalysisList = res.content.stationAnalysis
        //     _this.addMarkers()
        //   }
        // })
        // 静态数据
        let res = {"apiCode":"300067","ts":"203107112219","content":{"stationAnalysis":[{"operateModeName":"专营店","operateModeId":"10","stationCount":189},{"operateModeName":"兼营店","operateModeId":"73","stationCount":110}],"stationList":[{"stationID":null,"regionCode":"230100000000","regionName":"重庆市","stationStatus":null,"stationCode":"23010047","stationAddr":null,"stationPostcode":null,"stationAcreage":null,"contractSigning":null,"contractVersion":null,"contractSignTime":null,"contractExpireTime":null,"stationStar":null,"stationLng":"106.55000","stationLat":"29.57000","houseType":null,"setUpTime":null,"operateModeId":"73","operateModeName":"兼营店","operateTypes":null,"stationPhone":null,"masterID":null,"nameX":null,"empNo":null,"sex":null,"mobile":null,"idCard":null,"hkAddress":null,"cultureDegree":null}]},"digest":"0f5c9a304cb5d193a365f6cfcdd5cfec","code":"0","msg":"操作成功"}
        _this.stationArr = res.content.stationList
        _this.stationAnalysisList = res.content.stationAnalysis
        _this.addMarkers()
        //  ............................................. 不需要热力图
        // _this.postJson('station', {
        //   apiCode: 300068,
        //   content: _this.Obj
        // }).then(res => {
        //   if (res.code === '0') {
        //     _this.heatMapData = res.content
        //     _this.setHeatMap(_this.heatMapData)
        //   }
        // })
        // let res1 = {"apiCode":"300068","ts":"203107112219","content":[{"thisYear":"2856.00","stationCode":"65010107","lng":"126.489829","lastDay":"2856.00","thisWeek":"2856.00","thisMonth":"9000.00","lat":"45.821976"},{"thisYear":"286.00","stationCode":"65010439","lng":"126.557635","lastDay":"286.00","thisWeek":"286.00","thisMonth":"9000.00","lat":"45.828794"}],"digest":"23531b064770112c98470441120b70a8","code":"0","msg":"操作成功"}
        // _this.heatMapData = res1.content
        // _this.setHeatMap(_this.heatMapData)
      },
      getmarkers() {
        // 请求
        // let Obj = {
        //   apiCode: 300131,
        //   content: {}
        // }
        // this.postJson('station', Obj).then(res => {
        //   this.markersArr = res.content.dataList
        // })
        // 静态
        let res = {"apiCode":"300131","ts":"203107112218","content":{"dataList":[{"id":1,"typeId":"73","typeX":"兼营店","remark":"兼营店图标","createBy":1,"createByName":"系统超级管理员","createDate":"2018-11-01 15:41:41","updateBy":1,"updateByName":"系统超级管理员","lastUpdate":"2018-11-01 15:41:41","flagPicture":"http://202.105.127.10:10001/fastdfs/show/178?token=A718DAFE495540AC8B75BFC0BAF96703BCFAA32EA0C5CB88"},{"id":6,"typeId":"10","typeX":"专营店","remark":"专营店图标","createBy":58,"createByName":"Briven","createDate":"2018-11-01 16:33:57","updateBy":1,"updateByName":"系统超级管理员","lastUpdate":"2018-11-01 16:33:56","flagPicture":"http://202.105.127.10:10001/fastdfs/show/178?token=A718DAFE495540AC8B75BFC0BAF96703BCFAA32EA0C5CB88"}],"dataPage":{"limit":20,"page":1,"totalCount":2,"firstPage":true,"lastPage":true,"prePage":1,"nextPage":1,"hasPrePage":false,"hasNextPage":false,"startRow":1,"endRow":2,"slider":[1],"totalPages":1,"offset":0},"dataQry":{"colNames":null,"colCNNames":null}},"digest":"0e2418ea19331886658231ed324b07ae","code":"0","msg":"操作成功"}
        this.markersArr = res.content.dataList
      },
      getProRadius() {
        // 请求
        // let Obj = {
        //   apiCode: 300121,
        //   content: {}
        // }
        // this.postJson('station', Obj).then(res => {
        //   this.proRadius = res.content.dataList
        //   this.proRadius.unshift({
        //     stationAreaLevelName: '全部',
        //     stationAreaLevelCode: -1,
        //     limitRadius: 0
        //   })
        // })
        // 静态
        let res = {"apiCode":"300121","ts":"203107112218","content":{"dataList":[{"id":1,"limitRadius":100,"stationAreaLevelCode":"0","stationAreaLevelName":"常规站","createBy":58,"createByName":"Briven","createDate":"2018-10-31 11:32:35","updateBy":1,"updateByName":"系统超级管理员","lastUpdate":"2019-07-22 10:34:17","extInfo":null},{"id":2,"limitRadius":100,"stationAreaLevelCode":"1","stationAreaLevelName":"快开","createBy":null,"createByName":null,"createDate":null,"updateBy":null,"updateByName":null,"lastUpdate":"2019-06-28 11:37:59","extInfo":null}],"dataPage":{"limit":20,"page":1,"totalCount":2,"firstPage":true,"lastPage":true,"prePage":1,"nextPage":1,"hasPrePage":false,"hasNextPage":false,"startRow":1,"endRow":2,"slider":[1],"totalPages":1,"offset":0},"dataQry":{"colNames":null,"colCNNames":null}},"digest":"a11c7bcd7e09c58395d92511bed63024","code":"0","msg":"操作成功"}
        this.proRadius = res.content.dataList
        this.proRadius.unshift({
          stationAreaLevelName: '全部',
          stationAreaLevelCode: -1,
          limitRadius: 0
        })
      },
      addMarkers() {
        let points = this.stationArr
        let markers = []
        // let circles = []
        let AMap = this.AMap
        let map = this.map
        let iconPath
        let _this = this
        if (this.cluster.clearMarkers) {
          this.cluster.clearMarkers()
        }
        this.map.clearMap()
        for (let i = 0; i < points.length; i++) {
          let marker = points[i]
          if (this.levelCode === -1 || marker.operateModeId == this.levelCode) {
            // count += 1
            let arr = _this.markersArr
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].typeId === marker.operateModeId) {
                iconPath = arr[i].flagPicture
                break
              }
            }
            let k = new AMap.Marker({
              radius: _this.limitRadius,
              map: map,
              icon: iconPath,
              position: [marker.stationLng, marker.stationLat]
            })
            map.add(k)
            // map.setFitView()
            // circles.push(c)
            markers.push(k)
          }
        }
        // )
        /* ok 点聚合 */
        this.cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80})
        this.spinShow = false
      },
      addNewMarker(e) {
        console.log(e.lnglat.getLng())
        this.lngPoint = e.lnglat.getLng()
        console.log(e.lnglat.getLat())
        this.latPoint = e.lnglat.getLat()
        this.$emit('setPoint', [this.lngPoint, this.latPoint])
        let AMap = this.AMap
        let map = this.map
        // let that = this
        let centerMarkers = this.labelMarker
        let centerCircles = this.labelCircle
        let centerText = this.labelMarkerText
        // let centerTxt = this.labelTxt
        // let hasOtherStation = false
        if (centerMarkers.length >= 1) {
          map.remove([centerMarkers[0], centerCircles[0], centerText[0]])
          centerMarkers.shift()
          centerCircles.shift()
          centerText.shift()
        }
        let marker = new AMap.Marker({
          map: map,
          icon: centerImg,
          cursor: 'move',
          raiseOnDrag: true,
          position: [e.lnglat.getLng(), e.lnglat.getLat()],
          offset: new AMap.Pixel(-8, -39)
        })
        let markerText = new AMap.Marker({
          map: map,
          cursor: 'move',
          // content: '<div style="position: absolute;z-index: 2;color:red;' +
          //   'border: 1px solid #999999;background-color: white;cursor: default;' +
          //   'white-space: normal;padding: 3px;font-size: 12px;line-height: 14px;"></div>',
          raiseOnDrag: true,
          position: [e.lnglat.getLng(), e.lnglat.getLat()],
          offset: new AMap.Pixel(15, -20)
        })
        this.labelMarkerTextObj = markerText
        this.labelMarkerObj = marker
        let circle = new AMap.Circle({
          center: new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat()), // 圆心位置
          // radius: that.limitRadius, // 半径
          // radius: 1000, // 半径
          bubble: true,
          strokeColor: '#F33', // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线粗细度
          strokeStyle: 'dashed', // 线透明度
          fillColor: 'transparent', // 填充颜色
          fillOpacity: 0.35 // 填充透明度
        })
        this.labelCircleObj = circle
        // 获取当前视窗范围内的站点
        let bounds = this.map.getBounds()
        let Obj = {}
        let stationArr
        Obj.stationLngMax = bounds.northeast.lng
        Obj.stationLngMin = bounds.southwest.lng
        Obj.stationLatMax = bounds.northeast.lat
        Obj.stationLatMin = bounds.southwest.lat
        // 请求
        // this.postJson('station', {
        //   apiCode: 300067,
        //   content: Obj
        // }).then(res => {
        //   stationArr = res.content.stationList
        //   this.judge(stationArr)
        // })
        // 静态
        let res = {"apiCode":"300067","ts":"203107112219","content":{"stationAnalysis":[{"operateModeName":"专营店","operateModeId":"10","stationCount":189},{"operateModeName":"兼营店","operateModeId":"73","stationCount":110}],"stationList":[{"stationID":null,"regionCode":"650100000000","regionName":"乌鲁木齐","stationStatus":null,"stationCode":"65015047","stationAddr":null,"stationPostcode":null,"stationAcreage":null,"contractSigning":null,"contractVersion":null,"contractSignTime":null,"contractExpireTime":null,"stationStar":null,"stationLng":"87.554616","stationLat":"43.882119","houseType":null,"setUpTime":null,"operateModeId":"73","operateModeName":"兼营店","operateTypes":null,"stationPhone":null,"masterID":null,"nameX":null,"empNo":null,"sex":null,"mobile":null,"idCard":null,"hkAddress":null,"cultureDegree":null},{"stationID":null,"regionCode":"650100000000","regionName":"乌鲁木齐","stationStatus":null,"stationCode":"65010898","stationAddr":null,"stationPostcode":null,"stationAcreage":null,"contractSigning":null,"contractVersion":null,"contractSignTime":null,"contractExpireTime":null,"stationStar":null,"stationLng":"87.605111","stationLat":"43.850482","houseType":null,"setUpTime":null,"operateModeId":"73","operateModeName":"兼营店","operateTypes":null,"stationPhone":null,"masterID":null,"nameX":null,"empNo":null,"sex":null,"mobile":null,"idCard":null,"hkAddress":null,"cultureDegree":null}]},"digest":"0f5c9a304cb5d193a365f6cfcdd5cfec","code":"0","msg":"操作成功"}
        stationArr = res.content.stationList
        this.judge(stationArr)
        // 黑龙江假数据
        this.labelMarker.push(marker)
        this.labelCircle.push(circle)
        this.labelMarkerText.push(markerText)
        map.add(circle, marker, markerText)
      },
      judge(stations) {
        // let AMap = this.AMap
        // 深度克隆
        function clone(origin) {
          let originProto = Object.getPrototypeOf(origin)
          return Object.assign([], Object.create(originProto), origin)
        }

        this.labelRadiusArr = clone(this.proRadius)
        this.labelRadiusArr.shift() // 去掉全部项
        this.labelRadiusArr = this.labelRadiusArr.sort((a, b) => {
          return b.limitRadius - a.limitRadius
        })
        let exceptTypeId = ''
        let exceptTypeIdArr = []
        let exceptTypeText = ''
        for (let i = 0; i < stations.length; i++) {
          let val = stations[i]
          let result = this.labelCircleObj.contains([val.stationLng, val.stationLat])
          let isExist = exceptTypeId.indexOf(',' + val.operateModeId + ',') !== -1 // 判断依据中是否已有该Id
          if (result) {
            if (isExist) continue
            exceptTypeId = exceptTypeId + ',' + val.operateModeId + ','
            exceptTypeIdArr.push(val.operateModeId)
            this.labelRadiusArr.forEach((v, index) => {
              if (v.stationAreaLevelCode === val.operateModeId) {
                this.labelRadiusArr.splice(index, 1) // 去除保护半径内下该模式的店类型
              }
            })
          }
        }
        this.labelRadiusArr.forEach(val => {
          exceptTypeText = exceptTypeText + val.stationAreaLevelName + ','
        })
        exceptTypeText = ''
        let maxRadius = this.labelRadiusArr[0].limitRadius
        this.labelMarkerTextObj.setContent('<div style="position: absolute;z-index: 2;color:red;' +
          'background-color: white;cursor: default;' +
          'white-space: normal;padding: 3px;font-size: 12px;line-height: 14px;">' +
          '</div>')
        this.labelCircleObj.setRadius(maxRadius) // 标签点的取值半径有待商榷
      },
      setHeatMap(sale) {
        return
        let salesArr = sale
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
        console.log(this.heatmap)
        this.heatmap.setDataSet({
          max: maxNum,
          data: points
        })
        // console.log(this.heatmap.setMap())
        this.heatmap.setMap(this.map)
      },
      // 定位到市
      select_by_reginCode(code) {
        console.log(code)
        this.areaCode = ''
        let _this = this
        this.districtSearch.search(code, function (status, result) {
          if (status === 'complete') {
            _this.areaCodeArr = result.districtList[0].districtList
          }
        })
        this.autoComplete.setCity(code)
        this.autoComplete.setCityLimit(code)
      },
      select_by_areaCode(code) {
        console.log(code)
        this.autoComplete.setCity(code)
        this.autoComplete.setCityLimit(code)
      },
      /* 创建地图 */
      createAmap(regionName) {
        const that = this
        var AMap = this.AMap
        let map = this.map = new AMap.Map('my_container',
          {
            zoom: 12,
            center: [106.530635013, 29.5446061089],
            expandZoomRange: true
          }
        )
        map.setDefaultCursor('default') // 设置默认鼠标样式
        map.plugin(['AMap.ToolBar'],
          function () {
            map.addControl(new AMap.ToolBar())
          })
        map.plugin(['AMap.Scale'], function () {
          var scale = new AMap.Scale()
          map.addControl(scale)
        })
        // 输入框提示
        AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
          // 实例化Autocomplete
          let autoOptions = {
            city: that.cityCode, // 兴趣点城市
            citylimit: true, // 将城市限定在兴趣点范围内
            input: 'tipinput'
          }
          let searchOptions = {
            city: that.cityCode,
            citylimit: true,
            map: map,
            panel: 'panel',
            pageSize: 5,
            pageIndex: 1
          }
          let placeSearch = new AMap.PlaceSearch(searchOptions)
          let autoComplete = new AMap.Autocomplete(autoOptions)
          that.placeSearch = placeSearch
          that.autoComplete = autoComplete
          map.addControl(autoComplete)
          map.addControl(placeSearch)
          AMap.event.addListener(autoComplete, 'select', function (e) {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name)
            // that.query(e)
            that.setCity(e)
          })
        })
        AMap.plugin('AMap.DistrictSearch', function () {
          let districtSearch = new AMap.DistrictSearch({
            // 关键字对应的行政区级别，country表示国家
            // level: 'country',
            showBiz: false,
            //  显示下级行政区级数，1表示返回下一级行政区
            subdistrict: 1
          })
          that.districtSearch = districtSearch
          districtSearch.search(that.cityCode, function (status, result) {
            if (status === 'complete') {
              that.areaCodeArr = result.districtList[0].districtList
            }
          })
          // that.select_by_reginCode(that.cityCode)
        })
        /* 测量距离 */
        map.plugin(['AMap.RangingTool'], function () {
          that.ruler = new AMap.RangingTool(map)
          // that.ruler.turnOn()
          AMap.event.addListener(that.ruler, 'end', function (e) {
            that.ruler.turnOff()
          })
        })

        /* 热力图 */
        map.plugin(['AMap.Heatmap'], function () {
          // 初始化heatmap对象
          that.heatmap = new AMap.Heatmap(map, {
            radius: 25, // 给定半径
            opacity: [0, 0.8]
          })
          that.heatmap.hide()
        })

        /* 鼠标在地图上移动的时候，获取经纬度坐标 */
        map.on('mousemove', function (e) {
          that.lng = e.lnglat.getLng()
          that.lat = e.lnglat.getLat()
        })

        /* 设置右键菜单 */
        var contextMenu = new AMap.ContextMenu()  // 创建右键菜单
        let contextMenuPositon
        let middleLocationArr = [] // 存‘起终点’经纬度坐标,中间件
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
            icon: 'http://webapi.amap.com/theme/v1.3/markers/n/start.png'
          })
          locationStartMarker.push(marker)
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
            icon: 'http://webapi.amap.com/theme/v1.3/markers/n/end.png'
          })
          locationEndMarker.push(marker)
          that.locEnd = JSON.parse(JSON.stringify(middleLocationArr))
        }, 1)

        // 地图绑定鼠标右击事件——弹出右键菜单
        map.on('rightclick', function (e) {
          contextMenu.open(map, e.lnglat)
          contextMenuPositon = e.lnglat
          middleLocationArr = [e.lnglat.lng, e.lnglat.lat]
        })
        map.on('click', function (e) {
          that.addNewMarker(e)
        })
        map.on('moveend', function () {
          that.query()
        })
        map.on('complete', function () {
          that.query()
        })
      },
      /* 测量距离 */
      measureDistance() {
        this.ruler.turnOn()
      },
      /* 热力图开关 */
      toggleHeatMap(status) {
        const that = this
        if (status) {
          that.heatmap.show() // 打开热力图
        } else {
          that.heatmap.hide() // 关闭热力图
        }
      },
      /* 路程规划创建 */
      ridingPathCreat() { // 骑行导航（根据起点和终点获取骑行路线)
        var AMap = this.AMap
        if (!this.ridingPath) {
          this.ridingPath = new AMap.Riding({
            map: this.map,
            panel: 'panel',
            count: 1
          })
        }
        // 根据起终点坐标规划骑行路线
        this.ridingPath.search(this.locStart, this.locEnd)
      },
      clearAll() {
        this.cluster.clearMarkers()
        this.placeSearch.clear()
        this.heatmap.setMap(null)
        // marker被清除后，再移动地图的过程中被移除的marker会重新出现，但circle去无法重现
        this.map.clearMap()
      }
    },
  }
</script>

<style lang="less" scoped>
    .evalute {
        font-size: 14px;
        .perLine {
            width: 100%;
            max-width: 500px;
            height: 32px;
            margin-top: 12px;
            position: relative;
            display: flex;
            .perLine_left {
                width: 115px;
                overflow: hidden;
                margin-top: -1px;
                z-index: 0;
                box-sizing: border-box;
                padding-right: 18px;
                height: 28px;
                line-height: 28px;
                text-align: right;
                font-size: 12px;
                background: #eeeeee;
                border: 1px solid #dfe0e3;
                border-radius: 4px 0 0 4px;
            }
            .perLine_right {
                flex: 1;
                margin-left: -2px;
                margin-top: -1px;
                position: relative;
                line-height: 1px;
                height: 32px;
                &.border {
                    border: 1px solid #dddee1;
                    line-height: 32px;
                    border-left: none;
                    border-radius: 4px;
                    text-indent: 20px;
                }
                .ivu-select {
                    z-index: 2;
                }
                .ivu-date-picker {
                    width: 100%;
                }
            }
            .ivu-input-wrapper {
                .ivu-input-group-prepend {
                    width: 115px !important;
                    span {
                        text-align: right;
                        //padding-left: 40px;
                        padding-right: 10px;
                        position: relative;
                        em {
                            color: red;
                            font-style: normal;
                        }
                    }
                }
            }
            .ivu-btn {
                margin-right: 10px;
                span {
                    img {
                        width: 12px;
                        height: 12px;
                        transform: translateY(2px);
                        padding-right: 5px;
                    }
                }
            }
        }
    }

    #tipinput {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 28px;
        line-height: 28px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    }

    .evalute {
        padding-top: 12px;
    }

    /* 高德地图 */
    .amap-marker .marker-route {
        position: absolute;
        width: 40px;
        height: 44px;
        color: #e90000;
        background: url(http://webapi.amap.com/theme/v1.3/images/newpc/poi-1.png) no-repeat;
        cursor: pointer;
    }

    .amap-marker .marker-marker-bus-from {
        background-position: -334px -180px;
    }

    #panel {
        position: absolute;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;
        top: 257px;
        right: 10px;
        width: 280px;
    }

    .info-tip {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 12px;
        background-color: #fff;
        height: 35px;
        text-align: left;
    }

    .layout-con {
        height: 100%;
        width: 100%;
    }

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0px;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .protectRadius {
        width: 200px;
        line-height: 30px;
        margin-left: 12px;
        position: absolute;
        right: -210px;
        top: 0;
        text-align: left;
        &.btn {
            right: -322px;
            line-height: inherit;
            width: auto;
        }
    }

    #my_container {
        width: 100%;
        height: 400px;
        border: 1px solid #dddee1;
        border-radius: 0 0 4px 4px;
        font-size: 12px
    }
</style>
