<template>
  <el-cascader
    ref="cascader"
    v-model="result"
    :props="props"
    :options="options"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    :placeholder="placeholder"
    :key="flagKey"
    @change="valueChange"
    @expand-change="activeItemChange"
    clearable
    :checkStrictly="true">
  </el-cascader>
</template>
<script>
  export default {
    props: {
      // 默认选中第一个
      initAreaSelectFlag: {
        type: Boolean,
        default: false
      },
      defaultArea: {
        type: Number
      },
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 获取父元素传过来的获取级联数据的接口
      qryObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 根据父组件的结果，展示对应的内容
      res: {
        type: String,
        default: ''
      },
      // 是否可以选择任何一级(默认false,只能选择最后一级,如果是true的话，stage可以不填)
      select_any_level_flag: {
        type: Boolean,
        default: false
      },
      // 是否显示全部按钮
      showAllcheck: {
        type: Boolean,
        default: false,
      },
      // 全部按钮名称
      checkName: {
        type: String,
        default: ''
      },
      // 全部按钮值
      checkCode: {
        type: String,
        default: ''
      },
      // 数据展示到第几级， 1代表第一级，2代表第二级， 3代表第三级，最高到第三级(默认3级)
      stage: {
        type: Number,
        default: 3
      },
      // 是否显示完整的路径，将其赋值为false则仅显示最后一级
      showAllLevels: {
        type: [Boolean, String],
        default: true
      },
      // 是否禁用
      disabled: {
        type: [Boolean, String],
        default: false
      },
      // 是否把所有级别的选择结果全部返回,默认只返回最后一级
      returnAllLevelResultFlag: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 是否多选
      allowMultiple: {
        type: Boolean,
        default: false
      },
      // 取值字段
      valueKey: {
        type: String,
        default: 'code'
      },
      // 取显示值字段
      valueName: {
        type: String,
        default: 'name'
      },
      isInit: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        form: {},
        props: {
          multiple: this.allowMultiple,
          checkStrictly: this.select_any_level_flag
        },
        // element组件展示使用
        result: [],
        // 数据源
        options: [],
        // 添加一个标志渲染父组件动态传过来的值（原因：数据不动态加载显示）
        flagKey: 1,

        allRegionOptions: [], // 全部地区选项
        emitDataTimeout: null
      }
    },
    created() {
      if (JSON.stringify(this.item) !== '{}') {
        if (this.item.field.indexOf(',') !== -1) {
          this.mainProp = this.item.field.split(',')[0]
        } else {
          this.item.field = this.item.field
          this.mainProp = this.item.field
        }
        this.subProp = this.item.field.split(',')[1]
        if (this.item.value) {
          this.form[this.mainProp] = this.item.value
        } else {
          this.form[this.mainProp] = ''
        }
      }
    },
    mounted() {
      console.log('区域单选可选择任何一级- 初始化 ')
      console.log(this.$refs)
      this.init()
    },
    watch: {
      result(val) {
      },
      res(val) {
        if (val && this.options && this.options.length) {
          this.showResult(val)
        }
      },
      options(value) {
        if (this.options && this.options.length && this.res) {
          this.showResult()
        }
      },
      $route: {
        handler: function(val, oldVal) {
          console.log('区域单选只可多选同一级 路由切换')
          console.log(this.$refs)
          this.init() // init 换成了 回填
        },
        deep: true
      }
    },
    methods: {
      findLable(arr, id) {
        arr.forEach((val, i) => {
          if (val.value === id) {
            this.form[this.subProp] = val.label
            this.$emit('areaVauleBack', this.form)
            return val.label
          } else {
            if (val.children && val.children.length > 0) {
              this.findLable(val.children, id)
            }
          }
        })
      },
      // 初始化数据
      async init() {
        // console.log(this.item)
        // console.log(this.qryObj)
        var tempArr = []
        this.allRegionOptions = []
        this.result = []
        /*
        * 考虑优化点（暂）
        * 有些级联需要缓存数据避免每次都要服务器请求
        * */
        if (Object.keys(this.qryObj).length === 0) {
          return
        }
        let data = this.qryObj.content
        let res = await this.$api[this.qryObj.apiCode]({data})
        if (res && res.code === 0) {
          let resData = res.data
          this.options = []
          let k = []
          this.rebuildData(resData, k)
          tempArr = JSON.parse(JSON.stringify(k))
          if (JSON.stringify(this.item) !== '{}' && this.item.options.length > 0) {
            tempArr = JSON.parse(JSON.stringify(this.item.options))
          }
        }
        if (this.stage === 1) {
          let arr = tempArr
          if (this.showAllcheck) {
            arr.unshift({children: '', label: this.checkName, value: this.checkCode})
          }
          arr.forEach(v => {
            v.children = ''
          })
          this.options = arr
        } else if (this.stage === 2) {
          for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].children) {
              for (let j = 0; j < tempArr[i].children.length; j++) {
                tempArr[i].children[j].children = ''
              }
            }
          }
          this.options = tempArr
        } else {
          this.options = tempArr
        }
        if (JSON.stringify(this.item) !== '{}' && this.item.value) {
          this.findLable(this.options, this.item.value)
        }
        // console.log(this.options, this.defaultArea)
        this.initDefaultArea()
        // if ( this.initAreaSelectFlag ) {
        //   if( this.defaultArea ) {
        //     this.result = this.defaultArea;
        //     let areaName = this.allRegionOptions.find(option => option.id == this.result );
        //     areaName ? areaName : '';
        //     console.log('区域单选组件有传默认值', this.result, areaName);
        //     this.$emit('commonSelectResult', [this.result], [areaName]);
        //   } else {
        //     this.result = [this.options[0].value]
        //     // 返回全部级联节点信息
        //     this.$emit('commonSelectResult', [this.options[0].value], [this.options[0].label])
        //   }
        // }
      },
      // 把数据处理成渲染的数据
      rebuildData(data, arr) {
        // console.log(data, arr)
        data.forEach((val, i) => {
          arr.push({
            value: val[this.valueKey],
            label: val[this.valueName]
          })
          this.allRegionOptions.push({id: val[this.valueKey], name: val[this.valueName]})
          if (val.children !== undefined) {
            arr[i].children = []
            this.rebuildData(val.children, arr[i].children)
          }
        })
      },
      /*
        * 方法：根据父组件传过来的数值，展示级联名称
        * 类型：String
        * 格式：（单选/多选）多选逗号隔开
        * 说明：值为级联最后一位的编码值
        * */
      showResult() {
        let resArr = this.res.split(',')
        // debugger
        resArr.forEach((item, i) => {
          let findLevel1 = this.options.find(v => {
            if (v.value === item) {
              this.$set(this.result, i, v.value)
              return v
            }
          })
          if (!findLevel1) {
            let findLevel2 = this.options.find(v => {
              if (v.children) {
                return v.children.find(v2 => {
                  if (v2.value === item) {
                    if (!this.allowMultiple) {
                      // 非多选result格式为：result:['10','101']
                      this.$set(this.result, 0, v.value)
                      this.$set(this.result, 1, v2.value)
                    } else {
                      // 多选result格式为：result:['10,101','20,201']
                      this.$set(this.result, i, v.value + ',' + v2.value)
                    }
                    return v2
                  }
                })
              }
            })
            // console.log(findLevel2)
            if (!findLevel2) {
              this.options.find(v => {
                if (v.children) {
                  return v.children.find(v2 => {
                    if (v2.children) {
                       return v2.children.find(v3 => {
                        if (v3.value === item) {
                          if (!this.allowMultiple) {
                            // 非多选result格式为：result:['10','101','1011']
                            this.$set(this.result, 0, v.value)
                            this.$set(this.result, 1, v2.value)
                            this.$set(this.result, 2, v3.value)
                          } else {
                            // 多选result格式为：result:['10,101,1011','20,201,2011']
                            this.$set(this.result, i, v.value + ',' + v2.value + ',' + v3.value)
                          }
                          return v3
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
        this.flagKey++
      },
      // 清除功能
      clear() {
        this.result = []
        this.$emit('commonSelectResult', [], [])
        this.$emit('areaVauleBack', this.form)
      },
      valueChange(val) {
        // console.log('选择的值：')
        // console.log(val)
        let valTemp = val // 临时存放级联选择的数据，用于单选多选取值变化时，对数据结构重新组装与处理
        if (!this.allowMultiple) {
          // val ['30','3001','300112'] => [['30','3001','300112']]
          valTemp = [val]
        } else {
          val.forEach((tempVal, tempIndex) => {
            if (typeof tempVal === 'string') {
              // val [['10'],['20,201,2011']] => [['10'],['20','201','2011']]
              valTemp[tempIndex] = tempVal.split(',')
            } else {}
          })
        }
        let tmp = JSON.parse(JSON.stringify(this.options)) // 用来过滤的数据源
        var tempArr = []
        var temArrName = []
        var tempArrofAllReturn = []
        var tempArrofAllReturnName = []
        for (var n = 0; n < valTemp.length; n++) {
          // 建立获取所有选择级联节点信息的数组
          tempArrofAllReturn.push([])
        }
        valTemp.forEach((valItem, valIndex) => {
          let i = 0
          while (i < this.stage) {
            tmp.forEach(tmpItem => {
              if (valItem[i] === tmpItem.value) {
                // 方式一：返回定义的对象，包括级联编码与名称[{ value:'test', label:'test' }]
                // tempArr[valIndex] = { value: tmpItem.value, label: tmpItem.label }
                // 方拾二：简单的返回所选级联编码['10','20','30']
                tempArr[valIndex] = tmpItem.value
                temArrName[valIndex] = tmpItem.label
                // 组装返回全部级联编码
                tempArrofAllReturn[valIndex].push(tempArr[valIndex])
                // tempArrofAllReturnName[valIndex] = tmpItem.label
                tempArrofAllReturnName.push(tmpItem.label)
                if (tmpItem.children) {
                  // 当前节点有子节点，建立新数据源
                  tmp = tmpItem.children
                }
              }
            })
            i++
            if (i === this.stage) {
              // 级联层循环结束，恢复数据源
              tmp = JSON.parse(JSON.stringify(this.options))
            }
          }
        })
        if (this.returnAllLevelResultFlag) {
          // 返回全部级联节点信息
          this.$emit('commonSelectResult', tempArrofAllReturn, tempArrofAllReturnName)
          this.$emit('areaVauleBack', this.form)
        } else {
          this.form[this.mainProp] = tempArr.join(',')
          this.form[this.subProp] = temArrName.join(',')

          // console.log(this.mainProp, tempArr)
          // console.log(this.subProp, temArrName)
          // console.log(this.form)
          // 返回最后级联节点信息
          this.$emit('commonSelectResult', tempArr, temArrName)
          this.$emit('areaVauleBack', this.form)
        }
        // 处理 下拉框跑屏幕左上角  bug
        let aa = document.getElementsByClassName('el-cascader__dropdown')
        aa[aa.length - 1].style.display = 'none'
      },
      activeItemChange(val) {
      },
      initDefaultArea() {
        let that = this
        that.$nextTick(() => {
          that.emitDataTimeout = setTimeout(() => {
            let allRefs = that.$refs
            console.log(allRefs.cascader)
            if (allRefs.cascader) {
              if (that.initAreaSelectFlag) {
                if (that.defaultArea) {
                  that.result = that.defaultArea
                  let areaName = that.allRegionOptions.find(option => option.id === that.result)
                  // areaName = areaName ? areaName : ''
                  console.log('区域单选组件有传默认值', that.result, areaName)
                  that.$emit('commonSelectResult', [that.result], [areaName])
                } else {
                  that.result = [that.options[0].value]
                  // 返回全部级联节点信息
                  that.$emit('commonSelectResult', [that.options[0].value], [that.options[0].label])
                }
              }
            }
          }, 500)
        })
      }
    },

    beforeDestroy() {
      clearTimeout(this.emitDataTimeout)
    }
  }
</script>
<style>
</style>
