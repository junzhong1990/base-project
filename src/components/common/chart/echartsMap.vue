<template>
  <div :id="domId" :style="{ height: MapHeight + 'px', width: MapWidth + '%' }"
       v-loading="isLoading"
       :element-loading-text="loadingText"
       :element-loading-customClass="loadingClass"
  ></div>
  <!--:element-loading-spinner="loadingBody.spinner"-->
</template>

<script>
import remoteLoad from '@/utils/remoteLoad'

export default {
  name: "echartsMap",
  props: {
    // dom节点容器高度 默认500
    MapHeight: {
      type: String,
      default: '500'
    },
    // dom节点容器宽度 默认100%
    MapWidth: {
      type: String,
      default: '100'
    },
    // 是否启用遮罩
    isLoading: {
      type: Boolean,
      default: true
    },
    // 遮罩提示语定义
    loadingText: {
      type: String,
      default: '玩命加载中'
    },
    // 遮罩样式自定义
    loadingClass: {
      type: String,
      default: 'gb-loading'
    },
    // 遮罩图标定义
    loadingSpinner: {
      type: String,
      default: 'el-icon-loading iconfont icon-loading'
    },
    // dom节点名称，默认echartMap
    domId: {
      type: String,
      default: 'echartMap'
    },
    // 区域拼音名称
    name: {
      type: String,
      default: 'pinyin'
    },
    // 区域中文名称，默认为空不显示标题
    text: {
      type: String,
      default: ''
    },
    // 区域编码，默认为空，空时code与name相同（一级地图文件以拼音命名）
    code: {
      type: String,
      default: ''
    },
    // 是否显示restore按钮，默认不显示
    showRestore: {
      type: Boolean,
      default: false
    },
    // 是否显示地图上的地区名字
    showLabel: {
      type: Boolean,
      default: true
    },
    // 是否允许地图缩放
    isRoam: {
      type: Boolean,
      default: true
    },
    // 是否启用Echart遮罩
    echartLoading: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    createMap(name, text, code, domId) {
      const that = this
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(domId))
      // 加载提示
      if(that.echartLoading) {
        myChart.showLoading({
          text : '正在加载数据'
        })
      }
      var data = []
      var option
      // code与name同名
      var code = code || name
      const json = require(`@/assets/province/${name}/${code}.json`)
      // if(name === 'china' || name === 'world') {
      //   var json = require(`echarts/map/json/${name}.json`)
      // } else {
      //   var json = require(`echarts/map/json/province/${name}.json`)
      // }
      var geoJson = json
      // console.log('地图数据', JSON.stringify(geoJson))
      for (var i = 0; i < geoJson.features.length; i++) {
        data.push({name: geoJson.features[i].properties.name, value: (Math.random() * 10000).toFixed(2)})
      }
      option = {
        backgroundColor: '#fff', // 背景颜色
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },
        title: {
          text,
          // text: '', // 不显示地图标题
          left: 'center',
          textStyle: {
            color: '#404a59'
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          x: 'right',
          y: 'center',
          feature: {
            mark: {
              show: true
            },
            restore: this.showRestore ? {} : false, // 恢复按钮
            dataView: { // 显示数据视窗
              show: false,
              readOnly: false
            }
          }
        },
        visualMap: {
          // 左侧颜色控制条
          show: false,
          min: 100,
          max: 50000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: name,
            type: 'map',
            mapType: name,
            label: {
              normal: {
                show: true, // 地图上显示地区名字
                textStyle: {
                  color: '#000'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#000'
                }
              }
            },
            roam: that.isRoam, // 是否开启缩放
            zoom: 1.3,
            scaleLimit: {
              min: 1,
              max: 12
            },
            selectedMode: 'single',
            showLegendSymbol: false,
            itemStyle: {
              normal: {
                show: true,
                borderColor: '#389BB7',
                areaColor: '#404a59'
              },
              emphasis: {
                show: true,
                areaColor: '#389BB7',
                borderWidth: 0
              }
            },
            animation: false,
            data: data,
          }
        ]
      }
      echarts.registerMap(name, geoJson)
      myChart.setOption(option, true)
      // 关闭提示
      if(that.echartLoading) {
        setTimeout(function(){ myChart.hideLoading() }, 3000);
      }
      // 点击事件监听
      myChart.off('click')
      myChart.on('click', function (params) {
        that.$emit('mapClick', params)
      })
      // 恢复事件监听
      if (this.showRestore) {
        myChart.off('restore')
        myChart.on('restore', function (params) {
          that.$emit('mapRestore', params)
        })
      }
    }
  },
  async beforeMount() {
    const url = 'https://cdn.jsdelivr.net/npm/echarts@4.1.0/dist/echarts.js'
    await remoteLoad(url)
    // await remoteLoad('echarts/dist/echarts')
    // 由于单向下行绑定规则，子组件不允许修改父组件已经传过来的值，只能修改父组件中传递的参数
    this.$parent.isLoading = false
    this.createMap(this.name, this.text, this.code, this.domId)
  }
}
</script>

<style>
</style>
