<template>
  <div class="lnglat-box">
    <div class="lnglat-point">
      <span>坐标：</span>
      <el-input v-model="lngPoint" disabled></el-input>
      <el-input v-model="latPoint" disabled></el-input>
    </div>
    <div class="location">
      X：<span v-text="lng"></span>
      Y：<span v-text="lat"></span>
    </div>
    <div id="mapLngLat" class="map-box"></div>
  </div>
</template>
<script>
  import { aMapAk } from '@/utils/common'
  import centerImg from '@/assets/img/center.png'
  /* global AMap */
  export default {
    data() {
      return {
        map: null,
        lngPoint: 0,
        latPoint: 0,
        lng: 106.530635,
        lat: 29.544606,
      }
    },
    created() {
      aMapAk().then(_ => {
        this.initMap()
      })
    },
    methods: {
      initMap() {
        const map = new AMap.Map('mapLngLat', {
          zoom: 12,
          center: [106.530635, 29.544606],
          expandZoomRange: true,
          resizeEnable: true
        })
        this.map = map
        // 设置默认鼠标样式
        map.setDefaultCursor('default')
        AMap.plugin([
          'AMap.ToolBar',
          'AMap.Scale'
        ], () => {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })
        map.on('click', (e) => {
          this.addMarker(e)
        })
        map.on('mousemove', (e) => {
          this.lng = e.lnglat.getLng()
          this.lat = e.lnglat.getLat()
        })
      },
      // 添加marker
      addMarker(e) {
        this.lngPoint = e.lnglat.getLng()
        this.latPoint = e.lnglat.getLat()
        this.$emit('setPoint', [this.lngPoint, this.latPoint])
        this.map.clearMap()
        const marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: centerImg || 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new AMap.Size(22, 36)
          }),
          position: [this.lngPoint, this.latPoint],
          offset: new AMap.Pixel(-8, -39)
        })
        marker.setMap(this.map)
      },
      // 设置中心点
      setCenter(point) {
        this.map.setCenter(point)
      }
    }
  }
</script>
<style lang="less" scoped>
  .map-box{
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
  .lnglat-box{
    position: relative;
    height: 100%;
    border: 1px solid #dfe0e3;
    border-radius: 4px;
    .lnglat-point{
      padding: 6px;
      .el-input{
        width: 210px;
      }
    }
    .location {
      position: absolute;
      left: 75px;
      top: 60px;
      padding: 5px;
      line-height: 20px;
      font-size: 14px;
      color: #5a4e4e;
      background-color: #fff;
      box-shadow: 0 0 6px 0 #999;
      z-index: 2;
    }
  }
</style>
