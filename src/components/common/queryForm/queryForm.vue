<template>
  <div>
    <!-- 动态表单--根据表单模板渲染 -->
    <div v-if="formData.length">
      <BaseForm
        class="sform-list"
        ref="baseForm"
        :formData="formData"
        :rules="formRules"
        :colSpan="12"
        direction="right"
        @change="changeForm"
      >
        <el-form-item slot="formButton" class="full-line">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetBaseForm" class="gl-common-ml">重置</el-button>
        </el-form-item>
      </BaseForm>
    </div>
    <!-- 静态表单--itemList -->
    <el-form
      v-else
      class="form-inline"
      ref="searchForm"
      :inline="formLine"
      :model="searchForm"
      :label-width="labelWidth"
      :rules="formRules"
    >
      <el-form-item
        v-for="(item, index) in itemList"
        :value="item.value"
        :key="index"
        :label="item.label"
        :prop="item.value"
        :class="{'full-line': item.isFullLine, 'full-line_time': item.isFullLine}"
      >
        <!-- 站点编号远程搜索 -->
        <div v-if="item.type === 'stationCode'">
          <span v-show="$route.params.id">{{ searchForm.stationCode }}</span>
          <el-select
            v-show="!$route.params.id"
            v-model="searchForm[item.value]"
            :disabled="item.disable"
            :remote-method="remoteMethod"
            :placeholder="item.placeholder ? `${item.placeholder}` : `请输入${item.label}`"
            :loading="loading"
            remote
            filterable
          >
            <el-option
              v-for="(option, index) in options"
              :value="option.value"
              :key="index"
              :label="option.label"
            ></el-option>
          </el-select>
        </div>
        <!-- input控件 -->
        <div v-if="item.type === 'text' || item.type === 'textarea'">
          <el-input
            :type="item.type"
            v-model="searchForm[item.value]"
            :disabled="item.disable"
            :placeholder="item.placeholder ? `${item.placeholder}` : `请输入${item.label}`"
            :maxlength="item.maxlength == undefined ? 20 : item.maxlength"
          >
            <template slot="append" v-if="item.appendText">{{item.appendText}}</template>
          </el-input>
        </div>
        <div v-if="item.type === 'number'">
          <el-input
            type="text"
            v-model.number="searchForm[item.value]"
            :disabled="item.disable"
            :placeholder="item.placeholder ? `${item.placeholder}` : `请输入${item.label}`"
            :maxlength="item.maxlength == undefined ? 20 : item.maxlength"
          >
            <template slot="append" v-if="item.appendText">{{
              item.appendText
            }}</template>
          </el-input>
        </div>
        <!-- select组件 -->
        <div v-if="item.type === 'select'">
          <el-select
            v-model="searchForm[item.value]"
            :placeholder="item.placeholder ? `${item.placeholder}` : `请选择${item.label}`"
            clearable
            :disabled="item.disable"
            :multiple="item.multiple || false"
            @change="selectChange($event, item)"
          >
            <el-option
              v-for="items in item.options"
              :value="items.value"
              :key="items.value"
              :label="items.text || items.label"
            ></el-option>
          </el-select>
        </div>
        <!-- datePicker选择组件 -->
        <div v-if="item.type === 'datePicker'">
          <el-date-picker
            v-model="searchForm[item.value]"
            :type="item.format"
            :value-format="item.valueFormat || 'yyyy-MM-dd'"
            v-bind="item.$attrs"
            @change="(date) => getDateResult(date, item)"
            style="width: 100%"
          ></el-date-picker>
        </div>
        <!-- 站点星级组件 -->
        <div v-if="item.type === 'Star'" ref="station_Star">
          <el-rate v-model="searchForm[item.value]"></el-rate>
        </div>
        <!-- radio组件 -->
        <div v-if="item.type === 'radioGroup'">
          <el-radio-group v-model="searchForm[item.value]">
            <el-radio
              v-for="(type, index) of item.options"
              :key="index"
              :label="type.value"
            >
              {{ type.label }}
            </el-radio>
          </el-radio-group>
        </div>
        <!-- radio组件 -->
        <div v-if="item.type === 'radioButton'">
          <el-radio-group v-model="searchForm[item.value]">
            <el-radio-button
              v-for="(type, index) of item.options"
              :key="index"
              :label="type.value"
            >
              {{ type.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="item.type === 'commonCascader'">
          <CommonCascader
            ref="commonCascader"
            :select_any_level_flag="item.selectAnyLevelFlag ? item.selectAnyLevelFlag : true"
            :qryObj="qryObjArea"
            :initAreaSelectFlag="initAreaSelectFlag"
            :stage="item.stage || 3"
            @commonSelectResult="commonSelectAreaResult"
          ></CommonCascader>
        </div>
        <div v-if="item.type === 'deptCascader'">
          <CommonCascader
            ref="deptCascader"
            :qryObj="qryObjDept"
            :stage="item.stage || 3"
            :res="searchForm.departmentCode"
            valueKey="id"
            @commonSelectResult="selectDptResult"
          ></CommonCascader>
        </div>
        <div v-if="item.type === 'cascader'">
          <CommonCascader
            ref="cascader"
            :item="item"
            :select_any_level_flag="true"
            :qryObj="item.qryObj || qryObjArea"
            :stage="item.stage || 3"
            :valueKey="item.valueKey || 'code'"
            :res="searchForm[item.value]"
            @commonSelectResult="selectCustomResult($event, item)"
          ></CommonCascader>
        </div>
      </el-form-item>
      <slot name="extend"></slot>
      <el-form-item label="" class="full-line">
        <!-- 列表查询组件 -->
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="resetForm" class="gl-common-ml">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    // 区域默认选中第一个
    initAreaSelectFlag: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '140px'
    },
    itemList: {
      type: Array,
      default: function () {
        return []
      }
    },
    formLine: {
      type: Boolean,
      default: true
    },
    queryApiCode: {
      type: Object,
      default: function () {
        return {}
      }
    },
    rules: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 是否默认查询
    initQuery: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      qryObjArea: {
        apiCode: 'sysRegion',
        content: {
          status: 1
        }
      },
      qryObjDept: {
        apiCode: 'sysDepartment',
        content: {
          status: 1
        }
      },
      loading: false,
      checkboxList: [], // 导出数组
      options: [], // 存放查询数组
      searchForm: this.initSearchParam(),
      confirmSearch: this.initSearchParam(),
      formData: [],
      formRules: {}
    }
  },
  created() {
    if (!this.queryApiCode.resourceCode && Object.keys(this.rules).length) {
      this.formRules = this.rules
    }
  },
  mounted() {
    if (this.initQuery) {
      this.initData()
    }
  },
  methods: {
    initData() {
      if (this.queryApiCode.resourceCode) {
        this.getActDeModelDetails()
      } else {
        this.initStaticForm()
      }
    },
    // 初始静态表单配置
    async initStaticForm() {
      this.formRules = this.rules
      await this.initSearchForm()
      this.init()
      // 如果存在站点星级组件，默认值设为空，Element-ui默认值为0（好坑）
      if (this.$refs.station_Star) {
        this.searchForm.stationStar = null
      }
    },
    // 区域级联选择结果
    commonSelectAreaResult(val, name) {
      this.$set(this.searchForm, 'regionCode', val.join(','))
      this.$set(this.searchForm, 'regionName', name.join(','))
      this.$emit('changeAreaResult', { value: val, name })
    },
    // 机构级联选择结果
    selectDptResult(val, name) {
      this.$set(this.searchForm, 'departmentCode', val.join(','))
    },
    // 选择数据字典返回的树结构数据
    selectCustomResult(val, item) {
      // console.log(val, item)
      this.$set(this.searchForm, item.prop, val.join(','))
    },
    // 下拉选择框
    selectChange(val, item) {
      // console.log(val, item)
      this.$emit('selectChange', val, item)
    },
    // 远程搜索站点编号向后台请求
    remoteMethod(query) {
    },
    // 所属区域结果
    areaSelectResult(val) {
      if (val.length > 0) {
        this.searchForm.regionCode = val[val.length - 1].regionCode
        this.searchForm.regionName = val[val.length - 1].regionName
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
    },
    // 时间获取结果
    getDateResult(date, item) {
      // console.log('date', date, item)
      if (Array.isArray(date)) {
        // 时间段是一个值
        /**
           * options: {
              value: 'rewardPunishBeginTime',
            }
          * */
        if (item.options.value) {
          this.searchForm[item.options.value] = date.join(' ~ ')
        }
        // 如果时间段是两个值的形式
        /*
          * options: {
              value1: 'rewardPunishBeginTime',
              value2: 'rewardPunishEndTime',
            }
          *
          * */
        if (item.options.value1 && item.options.value2) {
          this.searchForm[item.options.value1] = date[0]
          this.searchForm[item.options.value2] = item.dayEnd
            ? date[1].replace('00:00:00', '23:59:59')
            : date[1]
        }
        // console.log(this.searchForm)
      } else {
        // 2020-07-16 00:00:00 时间参数加了一个  dayEnd: true    可以将"00:00:00" 替换成 "23:59:59"
        if (date && item.dayEnd) {
          this.$set(
            this.searchForm,
            item.value,
            date.replace('00:00:00', '23:59:59')
          )
        }
        // 当点击日期组件的清除按钮时，把值重置掉
        if (item.options && item.options.value1) {
          this.searchForm[item.options.value1] = ''
          this.searchForm[item.options.value2] = ''
        }
      }
      this.$emit('getDateResult', this.searchForm)
    },
    async init() {
      this.eventBus.$off('pagechange')
      this.eventBus.$on('pagechange', (val) => {
        this.confirmSearch.pageInfo.pageNum = val
        this.searchForm.pageInfo.pageNum = val
        this.query()
      })
      if (this.queryApiCode.type !== 'confirmSearchBackQueryMode') {
        // console.log('queryApiCode')
        this.search()
      }
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.eventBus.$emit('pageInit', 1)
      if (this.queryApiCode.resourceCode && this.formData.length) {
        this.$refs.baseForm.validate(async (valid) => {
          let flag = Boolean(valid)
          if (flag) {
            this.query(flag)
          }
        })
      } else {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.query(valid)
          }
        })
      }
    },
    // 页面查询
    async query(valid) {
      // 特殊的回调方法，返回父组件重新调用查询方法
      if (this.queryApiCode.type === 'confirmSearchBackQueryMode') {
        this.$emit('confirmSearchBackQuery', this.confirmSearch, valid)
      } else {
        this.$emit('getConfirmSearch', this.confirmSearch)
        let data = this.confirmSearch
        let res = await this.$api[this.queryApiCode.apiCode]({ data })
        if (res && res.code === 0) {
          let dataArr = res.data.list ? res.data.list : res.data
          if (
            dataArr.length === 0 &&
            this.confirmSearch.pageInfo.pageNum !== 1
          ) {
            // 删除后当前页没数据，请求上一页的数据
            this.confirmSearch.pageInfo.pageNum -= 1
            this.query()
            return
          }
          this.$emit('confirmSearchBack', this.confirmSearch)
          // 返回查询数据
          this.$emit('tableData', dataArr)
          // 返回总数与当前页数对象
          this.$emit(
            'tablePageInfo',
            res.data.total
              ? {
                  count: res.data.total,
                  page: this.confirmSearch.pageInfo.pageNum
                }
              : { count: 0, page: 1 }
          )
        }
      }
    },
    // 重置静态表单
    resetForm() {
      if (this.$refs.searchForm) {
        this.$refs['searchForm'].resetFields()
      }
      if (this.$refs.commonCascader) {
        this.$refs['commonCascader'].forEach((v) => v.clear())
      }
      if (this.$refs.cascader) {
        this.$refs['cascader'].forEach((v) => v.clear())
      }
      if (this.$refs.deptCascader) {
        this.$refs['deptCascader'].forEach((v) => v.clear())
      }
      this.initSearchForm()
      this.$emit('resetForm')
    },
    // 初始默认参数
    initSearchForm() {
      this.searchForm = this.initSearchParam()
      // 判断是否存在sysModule参数
      if (this.queryApiCode.sysModule) {
        this.searchForm.sysModule = this.queryApiCode.sysModule
      }
      // 父组件额外传参
      if (this.queryApiCode.content) {
        Object.entries(this.queryApiCode.content).forEach((v) => {
          this.$set(this.searchForm, v[0], v[1])
        })
      }
      // console.log(this.searchForm)
    },
    // 获取参数
    getParams() {
      return this.searchForm
    },
    // 设置参数
    setParams(obj) {
      this.searchForm = { ...this.searchForm, ...obj }
    },
    // 设置分页
    setPageParams(obj) {
      this.searchForm.pageInfo = { ...this.searchForm.pageInfo, ...obj }
    },
    // 获取表单模板
    async getActDeModelDetails() {
      let menuTreeDic = JSON.parse(
        sessionStorage.getItem('menuTreeDic') || '{}'
      )
      let data = menuTreeDic[this.queryApiCode.resourceCode]
      // console.log(menuTreeDic)
      // console.log(this.queryApiCode.resourceCode,data)
      let id = data && data.formId
      if (id) {
        const res = await this.$api.flowFormDetail({ data: { id: Number(id) } })
        // console.log(res)
        if (res && res.code === 0) {
          let groupList = res.data.actDeGroupList
          let rulesRes = {}
          const formList = []
          // console.log(groupList)
          groupList.forEach((val, i) => {
            val.actDeModelFormList.forEach(async (valItem, iItem) => {
              valItem.title = valItem.name
              valItem.prop = valItem.field
              valItem.vavalItemlue = ''
              // console.log('获取查询表单数据', valItem)
              if (valItem.source === 'key') {
                // 从数据字典  this.$store.state.dicStore['stMatType.matType']
                valItem.options = this.$store.state.dicStore[valItem.sourceData]
              } else if (valItem.source === 'url') {
                // 从接口获取
                const res_data = await this.$api.getSourceData({
                  url: valItem.sourceData
                })
                if (res_data.code === 0) {
                  this.$set(valItem, 'options', res_data.data)
                } else {
                  valItem.options = []
                }
                // console.log(valItem)
              } else {
                // 从固定json数据 或者 其他
                valItem.options = valItem.sourceData
                  ? JSON.parse(valItem.sourceData)
                  : []
              }
              // 设置校验规则
              if (valItem.required || valItem.fieldQualification) {
                this.$set(rulesRes, valItem.field, {})
              }
              // 如果是双下拉框的形式，必填规则需特殊处理
              if (valItem.required) {
                this.$set(rulesRes[valItem.field], 'required', true)
                this.$set(rulesRes[valItem.field], 'trigger', [
                  'change',
                  'blur'
                ])
                if (valItem.fieldQualification) {
                  this.$set(rulesRes[valItem.field], 'name', valItem.name)
                } else {
                  this.$set(
                    rulesRes[valItem.field],
                    'message',
                    valItem.name + '不能为空'
                  )
                }
              }
              if (valItem.fieldQualification) {
                this.$set(
                  rulesRes[valItem.field],
                  'validator',
                  this.$rules[valItem.fieldQualification]
                )
                this.$set(rulesRes[valItem.field], 'trigger', [
                  'change',
                  'blur'
                ])
              }
              formList.push(valItem)
            })
          })
          this.formData = groupList.length
            ? [{ actDeModelFormList: formList }]
            : formList
          this.formRules = rulesRes
          this.$nextTick((_) => {
            this.initSearchForm()
            this.init()
          })
          if (!this.formData.length) {
            this.initStaticForm()
          }
        }
      } else {
        this.initStaticForm()
      }
    },
    // 改变baseForm参数，获取最新参数
    changeForm(params) {
      let obj = {}
      // console.log(params)
      Object.keys(params).forEach((k) => {
        let keyArr = k.split('_')
        // console.log(keyArr)
        if (keyArr.length > 1) {
          let dateArr = params[k] || []
          obj[keyArr[0]] =
            dateArr.length && dateArr[0]
              ? moment(dateArr[0]).format('YYYY-MM-DD HH:mm:ss')
              : ''
          obj[keyArr[1]] =
            dateArr.length && dateArr[1]
              ? moment(dateArr[1]).format('YYYY-MM-DD HH:mm:ss')
              : ''
        }
        if (k === 'undefined') {
          delete params[k]
        }
      })
      this.searchForm = { ...this.searchForm, ...params, ...obj }
      // console.log('this.searchForm', this.searchForm)
    },
    // 重置动态表单baseForm
    resetBaseForm() {
      this.searchForm = this.initSearchParam()
      this.$refs.baseForm.resetForm()
    },
    // 初始化查询分页参数
    initSearchParam() {
      return {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        }
      }
    }
  }
}
</script>

<style lang="less">
.sform-list {
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: 60%;
      .el-date-editor {
        width: 100%;
      }
    }
  }
}
</style>
