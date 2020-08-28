<template>
  <el-cascader
    v-bind="$attrs"
    v-model="result"
    :props="props"
    :options="options"
    :show-all-levels="showAllLevels"
    :disabled="disabled"
    :placeholder="placeholder"
    :key="flagKey"
    @change="valueChange"
    :checkStrictly="true"
    clearable>
  </el-cascader>
</template>
<script>
  export default {
    name: 'glCascader',
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      // 获取父元素传过来的获取级联数据的接口
      qryObj: {
        type: Object,
        default: () => {
          return {
            apiCode: 'sysRegion',
            content: {
              status: 1
            }
          }
        }
      },
      // 根据父组件的结果，展示对应的内容
      res: {
        type: String,
        defualt: ''
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
        type: Boolean,
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
        allData: {},
        allIdData: {},
      }
    },
    created() {
      /* eslint-disable */
      if (JSON.stringify(this.item) !== '{}') {
        if (this.item.field.indexOf(',') !== -1) {
          this.mainProp = this.item.field.split(',')[0]
        } else {
          this.item.field = this.item.field
          this.mainProp = this.item.field
        }
        this.subProp = this.item.field.split(',')[1]
        this.form[this.mainProp] = this.item.value || ''
      }
    },
    mounted() {
      this.initData()
    },
    watch: {
      res(val) {
        if (val && this.options && this.options.length) {
          this.showResult(val)
        }
      },
      options(value) {
        if (this.options && this.options.length && this.res) {
          this.showResult()
        }
      }
    },
    methods: {
      // 初始化数据
      async initData() {
        if (Object.keys(this.qryObj).length === 0) {
          return
        }
        let tempArr = []
        const data = this.qryObj.content
        const res = await this.$api[this.qryObj.apiCode]({data})
        if (res && res.code === 0) {
          const resData = res.data || []
          this.options = []
          tempArr = JSON.parse(JSON.stringify(this.rebuildData(resData)))
          // 对于数据字典的数据是树形结构数据时
          if (JSON.stringify(this.item) !== '{}' && this.item.options.length > 0) {
            tempArr = JSON.parse(JSON.stringify(this.item.options))
          }
        }
        this.setRenderData(tempArr)
      },
      // 设置渲染数据
      setRenderData(tempArr) {
        if (this.stage === 1) {
          let arr = tempArr
          if (this.showAllcheck) {
            arr.unshift({
              children: '',
              label: this.checkName,
              value: this.checkCode
            })
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
          this.findLabel(this.options, this.item.value)
        }
      },
      // 把数据处理成渲染的数据
      rebuildData(data) {
        const arr = []
        let allData = {}
        let allIdData = {}
        const assembleData = (data, arr) => {
          data.forEach((val, i) => {
            arr.push({
              value: val[this.valueKey],
              label: val[this.valueName]
            })
            allData[val[this.valueKey]] = {
              id: val.id,
              pid: val.pid,
              value: val[this.valueKey],
              label: val[this.valueName]
            }
            allIdData[val.id] = {
              id: val.id,
              pid: val.pid,
              value: val[this.valueKey],
              label: val[this.valueName]
            }
            if (val.children !== undefined) {
              arr[i].children = []
              assembleData(val.children, arr[i].children)
            }
          })
        }
        assembleData(data, arr)
        // 存储所有数据
        this.allData = Object.freeze(allData)
        this.allIdData = Object.freeze(allIdData)
        return arr
      },
      findLabel(arr, id) {
        arr.forEach((val, i) => {
          if (val.value === id) {
            this.form[this.subProp] = val.label
            this.$emit('areaVauleBack', this.form)
            return val.label
          } else {
            if (val.children && val.children.length > 0) {
              this.findLabel(val.children, id)
            }
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
        const result = []
        const pVal = []
        const getPval = item => {
          if (+item.pid) {
            pVal.unshift(this.allIdData[item.pid].value)
            getPval(this.allIdData[item.pid])
          }
        }
        resArr.forEach(val => {
          let item = this.allData[val]
          if (item) {
            result.unshift(item.value)
            getPval(item)
          }
        })
        this.result = this.allowMultiple ? pVal.concat(result).join(',') : pVal.concat(result)
        // console.log(this.result)
        this.flagKey++
      },
      // 清除功能
      clear() {
        this.result = []
        this.$emit('commonSelectResult', [], [])
        this.$emit('areaVauleBack', this.form)
      },
      // 选择
      valueChange(val) {
        val = [...new Set(val || [])]
        const len = val.length
        const isMultiple = this.allowMultiple
        let valArr = []
        if (isMultiple) {
          val.forEach(v => {
            if (typeof v === 'string') {
              v = v.split(',')
            }
            valArr.push(this.returnAllLevelResultFlag ? v : v.pop())
          })
        }
        if (this.returnAllLevelResultFlag) {
          // 返回全部级联节点信息
          let tempArrAllName = []
          let tempArrAll = len ? (isMultiple ? valArr : val) : []
          if (isMultiple) {
            valArr.forEach(vv => {
              vv.forEach(v => {
                tempArrAllName.push(this.allData[v].label)
              })
            })
          } else {
            tempArrAllName = val.map(v => this.allData[v].label)
          }
          // console.log(valArr, tempArrAllName)
          this.$emit('commonSelectResult', tempArrAll, tempArrAllName)
          this.$emit('areaVauleBack', this.form)
        } else {
          let vpop = val.pop()
          let tempArr = len ? (isMultiple ? valArr : [vpop]) : []
          let temArrName = len ? (isMultiple ? valArr.map(v => this.allData[v].label) : [this.allData[vpop].label]) : []
          // console.log(tempArr, temArrName)
          if (this.mainProp) {
            this.form[this.mainProp] = tempArr.join(',')
          }
          if (this.subProp) {
            this.form[this.subProp] = temArrName.join(',')
          }
          // 返回最后级联节点信息
          this.$emit('commonSelectResult', tempArr, temArrName)
          this.$emit('areaVauleBack', this.form)
        }
        // 处理 下拉框跑屏幕左上角  bug
        let dom = document.getElementsByClassName('el-cascader__dropdown')
        dom[dom.length - 1].style.display = 'none'
      }
    }
  }
</script>
