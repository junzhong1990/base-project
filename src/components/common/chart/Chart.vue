<template>
  <div :id="id" :style="style"></div>
</template>
<script>
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入仪表盘
  require('echarts/lib/chart/gauge')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入折线图
  require('echarts/lib/chart/line')
  // 引入饼图
  require('echarts/lib/chart/pie')
  // 引入地图
  require('echarts/lib/chart/map')
  // 雷达图
  require('echarts/lib/chart/radar')

  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/toolbox')
  // require('echarts/lib/component/calculable')
  require('echarts/lib/component/grid')
  require('echarts/lib/component/dataZoom')


  require('echarts/lib/component/title')
  require('echarts/lib/component/legendScroll.js')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/dataZoom')

  // require('echarts/lib/component/geo')
  // require('echarts/lib/component/visualMap')


  export default {
    name: 'Chart',
    data() {
      return {
        // echarts实例
        chart: ''
      }
    },
    props: {
      // 父组件需要传递的参数：id，width，height，option
      id: {
        type: String
      },
      isMap: {
        type: Boolean,
        default: false
      },
      heightResize: {
        type: Boolean,
        default: false
      },
      mapGeoJson: {
        type: String
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      option: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      style() {
        return {
          height: this.height,
          width: this.width
        }
      }
    },
    // 在Chart.vue中加入watch
    watch: {
      // 观察option的变化
      option: {
        handler(newVal, oldVal) {
          if (this.chart) {
            this.chart.clear()
            if (newVal) {
              if (this.isMap && this.mapGeoJson) {
                echarts.registerMap('henan', JSON.parse(this.mapGeoJson))
              }
              this.chart.setOption(newVal, echarts)
            } else {
              if (this.isMap && this.mapGeoJson) {
                echarts.registerMap('henan', JSON.parse(this.mapGeoJson))
              }
              this.chart.setOption(oldVal)
            }
          } else {
            this.init()
          }
          if (this.heightResize) {
            this.chart.resize({height: this.height})
          }
        },
        // 对象内部属性的监听，关键。
        deep: true
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        // 1. 获取一个用于挂在 echarts 的 DOM 元素
        let $echartsDOM = document.getElementById(this.id)
        // 2. 初始化
        this.chart = echarts.init($echartsDOM)
        if (this.isMap && this.mapGeoJson) {
          echarts.registerMap('henan', JSON.parse(this.mapGeoJson))
        }
        // console.log(this.option)
        this.chart.setOption(this.option)
      }
    }
  }

</script>
