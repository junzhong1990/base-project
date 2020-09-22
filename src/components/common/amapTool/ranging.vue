<template>
  <div>
    <div class="ranging-btns" v-if="showTool">
      <div></div>
      <div>
        <el-button type="primary" @click="measureDistance">测距</el-button>
        <el-button @click="clearMeasure">清除</el-button>
      </div>
    </div>
    <div id="mapContainer" class="map-box"></div>
  </div>
</template>
<script>
  import { aMapAk } from '@/utils/common'
  /* global AMap */
  export default {
    props: {
      showTool: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        map: null,
        ranging: null
      }
    },
    created() {
      aMapAk().then(_ => {
        this.initMap()
      })
    },
    methods: {
      initMap() {
        const map = new AMap.Map('mapContainer', {
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: [117.000923, 36.675807],
          zoom: 5,
          expandZoomRange: true          
        })
        this.map = map
        map.setDefaultCursor('default') // 设置默认鼠标样式
        AMap.plugin([
          'AMap.ToolBar',
          'AMap.Scale'
        ], () => {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })
        // 测量距离
        AMap.plugin([
          'AMap.RangingTool'
        ], () => {
          this.ranging = new AMap.RangingTool(map)
          AMap.event.addListener(this.ranging, 'end', (e) => {
            map.setDefaultCursor('default')
            this.ranging.turnOff()
          })
        })
        map.on('complete', () => {
          this.$emit('complete', map)
        })
      },
      // 添加marker
      addMarker(item) {
        this.map.clearMap()
        if (!item.stationLng || !item.stationLat) return
        let marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: item.fileUrl || item.icon || 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new AMap.Size(22, 36)
          }),
          position: [+item.stationLng, +item.stationLat],
          offset: new AMap.Pixel(0, 0)
        })
        marker.setLabel({
          offset: new AMap.Pixel(15, 25),
          content: item.stationCode
        })
        marker.setMap(this.map)
      },
      // 测量距离
      measureDistance() {
        this.ranging.turnOn()
        this.map.setDefaultCursor('Crosshair')
      },
      // 清除
      clearMeasure() {
        this.ranging.turnOff()
        this.map.clearMap()
      },
      // 设置中心点
      setCenter(point) {
        this.map.setCenter(point)
      },
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .map-box{
    width: 100%;
    height: 100%;
    min-height: 500px;
  }
  .ranging-btns{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
</style>
