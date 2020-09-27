<!--
 * @Description: In User Edit
 * @Author: your name
 * @Date: 2019-08-13 09:57:55
 * @LastEditTime: 2019-08-22 14:20:01
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-cascader
    :options="options"
    :change-on-select="select_any_level_flag"
    clearable
    v-model="result"
    @active-item-change="activeItemChange"
    :show-all-levels="show_all_levels"
    :disabled="disabled"
    @change="valueChange"
    :placeholder="placeholder"
  ></el-cascader>
</template>
<script>
/* eslint-disable */
export default {
  props: {
    // 根据父组件的结果，展示对应的内容
    // res: {
    //   type: String,
    //   default: ''
    // },
    res: '',
    // 是否可以选择任何一级(默认false,只能选择最后一级,如果是true的话，stage可以不填)
    select_any_level_flag: {
      type: Boolean,
      default: false
    },
    // 是否显示全部按钮
    showAllcheck: {
      type: Boolean,
      default: false
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
    show_all_levels: true,
    // 是否禁用
    disabled: {
      type: [Boolean, String],
      default: false
    },
    // 是否把所有级别的选择结果全部返回,默认只返回最后一级的regionCode
    ruturnAllLevelResultFlag: {
      type: Boolean,
      default: false
    },
    apiCode: {
      type: Number,
      default: 100027
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      // element组件展示使用
      result: [],
      // 传给父组件的数据，数据结构[ {label,value} ]
      resArr: [],
      options: [],
      tempArr: []
    }
  },
  watch: {
    result(val) {},
    res(val) {
      // console.log(val)
      // let interval = setInterval(() => {
      if (val && this.options && this.options.length) {
        // console.log(0)
        this.showResult(val)
        // window.clearInterval(interval)
      }
      // }, 100)
    },
    options(value) {
      if (this.options && this.options.length && this.res) {
        // console.log(11)
        this.showResult()
      }
    }
  },
  methods: {
    // 初始化数据
    async init() {
      var tempArr = []
      let datas = {
        status: 1
      }
      if (!this.$store.state.all_area_data) {
        ;(async (datas) => {
          let res = await this.$api.sysRegion({ datas })
          if (res && res.code == 0) {
            let data = res.data
            this.options = []
            let k = []
            this.rebuildData(data, k)
            tempArr = JSON.parse(JSON.stringify(k))
            this.$store.commit('SET_ALLAREADATA', k)
          }
        })(datas)
      } else {
        tempArr = JSON.parse(JSON.stringify(this.$store.state.all_area_data))
      }
      if (this.stage == 1) {
        let arr = tempArr
        if (this.showAllcheck) {
          arr.unshift({
            children: '',
            label: this.checkName,
            value: this.checkCode
          })
        }
        arr.forEach((v) => {
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
    },
    // 把数据处理成渲染的数据
    rebuildData(data, arr) {
      data.forEach((val, i) => {
        arr.push({
          value: val.code,
          label: val.name
        })
        if (val.children !== undefined) {
          arr[i].children = []
          this.rebuildData(val.children, arr[i].children)
        }
      })
    },
    // 根据父组件传过来的数值，展示区域名称
    showResult(val) {
      // console.log(this.options)
      // console.log(this.res)   // res有问题
      // console.log(val)
      let findInLevel1 = this.options.find((v) => {
        if (v.value == this.res) {
          // console.log(101)
          this.$set(this.result, 0, v.value)
          this.$emit('areaSelectAllResult', [
            { value: v.value, label: v.label }
          ])
          return v
        }
      })
      // console.log(findInLevel1)
      if (!findInLevel1) {
        let findInLevel2 = this.options.find((v) => {
          if (v.children) {
            return v.children.find((v2) => {
              if (v2.value == this.res) {
                this.$set(this.result, 0, v.value)
                this.$set(this.result, 1, v2.value)
                this.$emit('areaSelectAllResult', [
                  { value: v.value, label: v.label },
                  { value: v2.value, label: v2.label }
                ])
                return v2
              }
            })
          }
        })
        // console.log(findInLevel2)
        if (!findInLevel2) {
          this.options.find((v) => {
            if (v.children) {
              return v.children.find((v2) => {
                if (v2.children) {
                  return v2.children.find((v3) => {
                    if (v3.value == this.res) {
                      this.$set(this.result, 0, v.value)
                      this.$set(this.result, 1, v2.value)
                      this.$set(this.result, 2, v3.value)
                      this.$emit('areaSelectAllResult', [
                        { value: v.value, label: v.label },
                        { value: v2.value, label: v2.label },
                        { value: v3.value, label: v3.label }
                      ])
                      return v3
                    }
                  })
                }
              })
            }
          })
          // console.log(this.result)
        }
      }
    },
    // 清除功能
    clear() {
      this.result = []
      this.$emit('areaSelectResult', [])
    },
    valueChange(val) {
      // console.log(val)
      let resArr = (this.resArr = []) // 存放最终选择的结果
      let tmp = JSON.parse(JSON.stringify(this.options)) // 用来过滤的数据源
      let i = 0
      let filterEvent = (arr, index) => {
        // 单级一级区域处理，否则filter方法报错
        if (arr !== undefined) {
          arr = arr.filter((v) => {
            return v.value === val[index]
          })
        }
        if (arr && arr.length > 0) {
          resArr[index] = { label: arr[0].label, value: arr[0].value }
          tmp = arr[0].children
        } else {
          return
        }
      }
      while (i < this.stage) {
        filterEvent(tmp, i)
        i++
      }
      if (this.ruturnAllLevelResultFlag) {
        this.$emit('areaSelectResult', resArr)
        this.$emit(
          'sendToAreaSelect',
          resArr.map((v) => {
            return {
              regionCode: v.value,
              regionName: v.label
            }
          })
        ) // 兼容河南版本
      } else {
        this.$emit('areaSelectResult', resArr[this.stage - 1])
        // console.log(resArr)
        this.$emit(
          'sendToAreaSelect',
          resArr.map((v) => {
            return {
              regionCode: v.value,
              regionName: v.label
            }
          })[this.stage - 1]
        ) // 兼容河南版本
      }
    },
    activeItemChange(val) {}
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="less">
.el-cascader {
  width: 100%;
}
</style>
