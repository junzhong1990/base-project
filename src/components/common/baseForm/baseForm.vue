<template>
  <el-form
    ref="form"
    class="base-form"
    :model="form"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="direction"
    :disabled="disabled"
    :key="formKey"
  >
    <el-row v-for="(itemG, indexG) in formData" :key="indexG">
      <h2 class="title" v-if="itemG.groupName">{{itemG.groupName}}</h2>
      <el-col :span="colSpan" v-for="(item,index) in itemG.actDeModelFormList" :key="index">
        <el-form-item
          :label="item.title"
          :prop="setProp(item)"
          :class="[{'siding':item.type==='minMax'}, hideStationCategory(item)]"
          v-if="(!item.destroy && hideFormItem(item.type) && item.whetherShow)"
        >
          <!-- 输入框 -->
          <el-input
              v-if="item.type=='input'"
              :disabled="item.readOnly?item.readOnly:false"
              v-model.trim="form[item.prop]"
              :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
              :maxlength="item.maxlength"
              :onbeforepaste="item.onbeforepaste"
              :oninput="item.oninput"
              :class="item.class"
              show-word-limit
          ></el-input>
          <!-- 输入域-->
          <el-input
              v-if="item.type==='textarea'"
              v-model="form[item.prop]"
              type="textarea"
              :maxlength="item.maxlength?item.maxlength:'500'"
              :disabled="item.readOnly?item.readOnly:false"
              :autosize="{ minRows: 3, maxRows: 5}"
              :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
          ></el-input>
          <!--活动区域-->
          <areaCheckbox
            :item="item"
            v-if="item.type==='areaCheckbox'"
            @areaCheckboxVauleBack="componentValueSet"
          ></areaCheckbox>
          <!-- 单下拉框 -->
          <select-one
            :item="item"
            v-if="item.type==='select'"
            @selectVauleBack="componentValueSet"
            :allForm="form"
          ></select-one>
          <!-- 双输入框-->
          <input-two
            :item="item"
            v-if="['inputTwo', 'inputTwoLngLat'].includes(item.type)"
            @inputTwoValueBack="componentValueSet"
          ></input-two>
          <!--双下拉框-->
          <select-two
            :item="item"
            v-if="item.type==='selectTwo'"
            @selectTwoVauleBack="componentValueSet">
          </select-two>
          <!-- 统计分析时间范围 -->
          <date-query
            :item="item"
            v-if="['dateRangeFast', 'year', 'month'].includes(item.type)"
            @getDateValue="componentValueSet"
          ></date-query>
          <!-- 统计分析多选框 -->
          <check-box-all
            :item="item"
            v-if="item.type==='checkBoxAll'"
            @checkAllValueBack="componentValueSet"
          ></check-box-all>
          <!-- 日期选择 -->
          <el-date-picker
            v-if="item.type==='date'"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="form[item.prop]"
            type="date"
            :disabled="item.readOnly?item.readOnly:false"
            placeholder="选择日期">
          </el-date-picker>
          <!-- 起止日期选择 -->
          <el-date-picker
              type="daterange"
              v-if="item.type==='daterange' || item.type === 'daterangeTimePass' || item.type === 'daterangeTimeFuture'"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="form[item.prop]"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions(item.type)"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-date-picker>
          <!-- 单个时间选择 -->
          <el-date-picker
              type="datetime"
              :disabled="item.readOnly?item.readOnly:false"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-if="item.type==='datetime'"
              v-model="form[item.prop]"
          ></el-date-picker>
          <!-- 两个时间选择 -->
          <el-date-picker
              type="datetimerange"
              v-if="item.type==='datetimerange'"
              v-model="form[item.prop]"
              @change="changeTime(item)"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-date-picker>
          <!--大额兑奖转款业务申请 -->
          <!--中奖彩票明细-->
          <div style="width: 900px;" v-if="item.type==='winDetail'">
            <el-table
                :data="form[item.prop]"
                style="width: 100%">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column
                  prop="gameId"
                  label="游戏类型"
                  width="180">
                <template slot-scope="scope">
                  <el-select @change="perListChange(form[item.prop], scope.$index)" v-model="scope.row.gameId" placeholder="请选择">
                    <el-option
                        v-for="item in $store.state.dicStore['misStationPermission.gameName']"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                  prop="lotteryStationCode"
                  label="网点编号"
                  width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.lotteryStationCode" placeholder="请输入网点编号" @change="perListChange(form[item.prop], scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="gamePeriodNo"
                  label="期数">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.gamePeriodNo" placeholder="请输入期数" @change="perListChange(form[item.prop], scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="lineNumber"
                  label="流水号"
                  width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.lineNumber" placeholder="请输入流水号" @change="perListChange(form[item.prop], scope.$index)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="cashStationCode"
                  label="兑奖站号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.cashStationCode" placeholder="请输入兑奖站号"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="amount"
                  label="中奖金额(元)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.amount" disabled></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
              <el-button type="primary" size="medium" @click="winDetailAdd(item.prop)">增加</el-button>
              <el-button  size="medium" @click="winDetailMi(item.prop)">减少</el-button>
            </div>
          </div>
          <!-- 加载网点 -->
          <el-select
            v-if="item.type==='loadStation' "
            v-model="form[item.prop]"
            filterable
            remote
            :remote-method="getStationList"
            @change="queryStationInfo($event, item)"
          >
            <el-option
              v-for="(station, index) in stationList"
              :value="station.stationCode"
              :key="index"
              :label="station.stationCode"
            >{{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}</el-option>
          </el-select>
          <!-- 加载停机网点 -->
          <el-select
            v-if="item.type==='loadStopStation' "
            v-model="form[item.prop]"
            filterable
            remote
            :remote-method="getStopStationList"
            @change="queryStationInfo($event, item)"
          >
            <el-option
              v-for="(station, index) in stationList"
              :value="station.stationCode"
              :key="index"
              :label="station.stationCode"
            >{{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}</el-option>
          </el-select>
          <!-- 加载最近网点 nearestStation -->
          <el-select
            v-if="item.type==='loadNearestStation' "
            v-model="form[item.prop]"
            filterable
            remote
            :remote-method="getStationList"
            @change="queryNearestStationInfo"
          >
            <el-option
              v-for="(station, index) in stationList"
              :value="station.stationCode"
              :key="index"
              :label="station.stationCode"
            >{{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}</el-option>
          </el-select>
          <!-- 加载即开票网点  -->
          <el-select
            v-if="item.type==='loadJKPStation' "
            v-model="form[item.prop]"
            filterable
            remote
            :remote-method="getJKPStationList"
            :disabled="item.readOnly?item.readOnly:false"

          >
            <el-option
              v-for="(station, index) in jkpStationList"
              :value="station.jkpCode"
              :key="index"
              :label="station.jkpCode"
            >{{station.jkpCode}}</el-option>
          </el-select>
          <CommonCascader
              v-if="item.type==='cascader'"
              :select_any_level_flag="noAnyLevel(item) ? false : true"
              :item="item"
              :qryObj="qryObjArea"
              :stage="3"
              ref="commonCascader"
              :res="form[item.prop]"
              @areaVauleBack="componentValueSet($event, item.prop)"
              :disabled="item.readOnly?item.readOnly:false"
          ></CommonCascader>
          <!-- 级联选择 返回对象-->
          <el-cascader
              v-if="item.type==='cascader-object'"
              v-model="form[item.prop]"
              :value="item"
              :options="item.options"
              :props="item.setProps"
              :disabled="item.readOnly?item.readOnly:false"
              :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
          ></el-cascader>
          <!-- 级联选择（多选） -->
          <el-cascader
              v-if="item.type==='cascader-multiple'"
              v-model="form[item.prop]"
              :options="item.options"
              :props="item.setProps"
              :disabled="item.readOnly?item.readOnly:false"
              :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
              clearable
          ></el-cascader>
          <!-- 单选 -->
          <el-radio-group
              v-if="item.type==='radio'"
              @change="changeRadio"
              v-model="form[item.prop]"
              :disabled="item.readOnly?item.readOnly:false"
          >
            <el-radio
                v-for="(list,index) in item.options"
                :key="index"
                :label="list.value"
            >{{list.label}}</el-radio>
          </el-radio-group>
          <!-- 上下排列的单选 带输入框 -->
          <div v-if="item.type==='radio-textarea'">
            <el-radio
                v-model="form[item.props[0]]"
                :label="item.options[0].value"
            >{{item.options[0].label}}</el-radio>
            <div class="flex-wrap">
              <el-radio
                  v-model="form[item.props[0]]"
                  :label="item.options[1].value"
              >{{item.options[1].label}}</el-radio>
              <el-input
                  v-model="form[item.props[1]]"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
              ></el-input>
            </div>
          </div>
          <!-- 地址栏 -->
          <CommonCascader
              v-if="item.type==='address'"
              :item="item"
              :select_any_level_flag="true"
              :qryObj="qryObjArea"
              :stage="3"
              ref="commonCascader"
              :res="form[item.prop]"
              @areaVauleBack="componentValueSet"
              :disabled="item.readOnly?item.readOnly:false"
          ></CommonCascader>
          <!-- 最大值最小值 -->
          <el-input
              v-if="item.type==='minMax'"
              v-model="form[item.options[0]]"
              @blur="checkNumber"
              type="text"
              placeholder="输入最小值"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-input>
          <span v-if="item.type==='minMax'" class="siding-flag">至</span>
          <el-input
              v-if="item.type==='minMax'"
              v-model="form[item.options[1]]"
              @blur="checkNumber"
              type="text"
              placeholder="输入最大值"
              :disabled="item.readOnly?item.readOnly:false"
          ></el-input>
          <!-- 多选checkbox -->
          <el-checkbox-group
              v-if="item.type==='checkbox'"
              @change="changeCheckbox"
              v-model="form[item.prop]"
              :disabled="item.readOnly?item.readOnly:false"
          >
            <el-checkbox
              v-for="(list, index) in item.options"
              :key="index"
              :label="list.value">
              {{list.label}}
            </el-checkbox>
          </el-checkbox-group>
          <ModalUpload
            v-if="item.type==='upload'"
            :backIds="item.value"
            @uploadResult="backFileId"
            :propName="item.prop"
            :type="['txt','doc','xls','xlsx','jpg','bmp','png','rar','zip']"
            :disabled="item.readOnly?item.readOnly:false"
            :isMultiple="true"
          >
            <div slot="warnTxt">
              <p>提示：附件个数不能超过4个</p>
              <p>类型：可用文件格式 txt、doc、xls、jpg、bmp、png、rar、zip、office2007 其中的一种</p>
            </div>
          </ModalUpload>
          <!-- 培训课程题目选择 -->
          <div v-if="item.type==='trainCourseSelect'">
            <trainCourseSelect
                :item="item"
                @trainCourseSelectVauleBack="componentValueSet"
            ></trainCourseSelect>
          </div>
          <!-- 多个图片上传 -->
          <div v-if="item.type==='upload-drag'">
            <el-upload
              drag
              multiple
              action
              :limit="10"
              :show-file-list="true"
              :on-remove="handleRemove"
              :http-request="uploadFile"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
          <!-- 建站设备列表 -->
          <div style="width:700px" v-if="item.type==='newStationDevice'">
            <stationDevice
              :data="form[item.prop] || []">
            </stationDevice>
          </div>
          <!-- 网点标签 -->
          <stationLabels
            v-if="item.type==='stationLabels'"
            :item="item"
            @stationLabelsBack="componentValueSet">
          </stationLabels>
        </el-form-item>

        <!-- 夜间销售权限- 根据网点获取游戏权限  -->
        <game-permissions
          :item="item"
          v-if="item.type==='gamePermissions'"
          @gamePermissionsValueBack="componentValueSet"
        ></game-permissions>
        <!-- 游戏兑奖金额权限业务申请-游戏原信息填充 -->
        <game-cash-item
          :item="item"
          v-if="item.type==='gameCashItem'"
          @gameCashItemValueBack="componentValueSet"
        ></game-cash-item>
        <!-- 网点新增 渠道选择 -->
        <new-station-agent
          :item="item"
          v-if="item.type==='newStationAgent'"
          @newStationAgentValueBack="componentValueSet"
          @clearCategory="clearCategory"
        ></new-station-agent>
        <!-- 仓储采购入库 报损申请 物品列表 -->
        <storeGoodsList
          :item="item"
          v-if="['storeGoodsList', 'storeDamageGoodsList', 'storeAllocationGoodsList'].includes(item.type)"
          @storeGoodsListValueBack="componentValueSet"
        ></storeGoodsList>
        <!--建站申请物品列表 -->
        <newStationGoodsList
          :item="item"
          v-if="item.type==='newStationGoodsList'"
          @newStationGoodsListValueBack="componentValueSet"
        ></newStationGoodsList>
        <!-- 网点撤销终端-撤销投注设备-->
        <revokeTerminalList
          :item="item"
          v-if="item.type==='revokeTerminalList'"
          @revokeTerminalListValueBack="componentValueSet"
        ></revokeTerminalList>
        <!-- 网点新增终端-新增投注设备-->
        <terminalDeviceList
          :item="item"
          v-if="item.type==='terminalDeviceList'"
          @terminalDeviceListValueBack="componentValueSet"
        ></terminalDeviceList>
        <!-- 站点停开机-停开机方式 -->
        <bootTypeList
          :item="item"
          v-if="item.type==='bootTypeList'"
          @bootTypeListValueBack="componentValueSet"
        ></bootTypeList>
        <!-- 网点新增区域-区域经理联动 -->
        <areaAdmin
          :item="item"
          v-if="item.type==='areaAdmin'"
          @areaAdminValueBack="componentValueSet"
        ></areaAdmin>
        <!-- 培训 课程 课件上传 -->
        <trainUpload
          :item="item"
          v-if="item.type==='trainUpload'"
          @trainUploadValueBack="componentValueSet"
        ></trainUpload>
        <!-- 网点原址转让联动框 -->
        <station-transfer
          :item="item"
          v-if="item.type==='stationTransfer'"
          @stationTransferValueBack="componentValueSet"
          @setRules="setNewRules"
        ></station-transfer>
        <!-- 游戏类型游戏期号联动框 -->
        <game-type-issue-num
          :item="item"
          v-if="item.type==='gameTypeIssueNum'"
          @gameTypeIssueNumValueBack="componentValueSet"
        ></game-type-issue-num>
        <!-- 审批操作 -->
        <approvalOpreate
          :item="item"
          v-if="item.type==='approvalOpreate'"
          @approvalOpreateValueBack="componentValueSet"
        ></approvalOpreate>
        <!-- 代销费率 -->
        <stationCommission
          :item="item"
          :tableList="form[item.prop]"
          :flowKey="flowKey"
          :gameTypes="gameTypes"
          v-if="item.type==='newStationRate'"
          @stationCommissionBack="componentValueSet"
        ></stationCommission>
        <!--加载网点销售权限-游戏列表-->
        <stationRightGame
          :item="item"
          :data="form[item.prop]"
          :gameTypeList="gameTypeList"
          v-if="!item.destroy && item.type==='stationRight'"
          @stationRightGameBack="componentValueSet"
        ></stationRightGame>
        <!--网点销售费率-游戏列表-->
        <stationRate
          :item="item"
          :data="form[item.prop]"
          v-if="!item.destroy && item.type==='loadStationRate'"
        ></stationRate>
        <!-- 设备类型与型号联动 -->
        <matTypeModelDevice
          :item="item"
          v-if="item.type==='matTypeModelDevice'"
          @matTypeModelDeviceBack="componentValueSet"
        ></matTypeModelDevice>
        <!--大额兑奖转款业务申请 -->
        <el-form-item
            :label="'转账总金额'"
            :prop="item.readOnly ? '' : item.prop"
            v-if="!item.destroy && item.type==='winDetail'">
          <el-input v-model="form.transferSumAmount" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="colSpan">
        <!-- 按钮组 -->
        <slot name="formButton"></slot>
      </el-col>
    </el-row>
    <!-- 提供自定义或者比较复杂的逻辑表单插槽 -->
    <slot name="exForm"></slot>
  </el-form>
</template>

<script>
  import moment from 'moment'
  import baseFormFn from './baseFormFn'
  export default {
    mixins: [baseFormFn],
    props: {
      formKey: {
        type: Number,
        default: 0
      },
      formData: {
        type: Array,
        default() {
          return []
        }
      },
      rules: {
        type: Object,
        default() {
          return {}
        }
      },
      direction: {
        type: String,
        default: 'right'
      },
      flowKey: {
        //流程 id
        type: String,
        default: ''
      },
      labelWidth: {
        type: String,
        default: '140px'
      },
      // 如果是 来自todo 页面
      fromTodo: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      colSpan: {
        type: Number,
        default: 24
      }
    },
    data() {
      return {
        jkpStationList: [],
        checkboxprops: [],
        qryObjArea: {
          apiCode: 'sysRegion',
          content: {
            status: 1
          }
        },
        gameTypeList: this.$store.state.dicStore['misStationPermission.gameName'],
        // 网点编号集合
        stationList: [],
        stationTableData: [],
        cityKey: 1,
        cityData: [],
        citySelect: '',
        cascaderProps: {
          label: 'name',
          value: 'code',
          children: 'children'
        },
        form: {},
        radioValue: '',
        radioParam: {}, // 用于保存radio的参数
        switchText: '开启',
        dateParam: {}, // 用于保存起止日期的参数
        timeParam: {}, // 用于保存起止时间的参数
        selectParam: {}, // 用于保存起止时间的参数
        cascaderParams: {}, // 用于保存级联选择器（多选）的参数
        cascaderParam: {}, // 用于保存级联选择器（单选）的参数
        imageUrl: '',
        gameTypes: []
      }
    },
    watch: {
      form: {
        handler(newValue, oldValue) {
          let param = JSON.parse(JSON.stringify(newValue))
          // console.log('newValue', newValue)
          // 用于保存级联选择器
          // for (let key in this.cascaderParams) {
          //   if (param[key] && param[key].length > 0) {
          //     for (let i = 0; i < param[key].length; i++) {
          //       param[key][i] = param[key][i][param[key][i].length - 1]
          //     }
          //   }
          // }
          // for (let key in this.cascaderParam) {
          //   if (param[key] && param[key].length > 0) {
          //     param[key] = param[key][param[key].length - 1]
          //   }
          // }
          // console.log('param', param)
          // 去除附件 有值 还提示必填校验
          this.checkboxprops.forEach((val) => {
            if (param[val] && param[val].length > 0) {
              setTimeout(() => {
                this.clearValidate(val)
              }, 10)
            }
          })
          this.$emit('change', param)
          this.cityKey++
        },
        // 深度监听 监听对象，数组的变化
        deep: true
      },
      formData: {
        handler(newValue, oldValue) {
          // console.log('formData变化', newValue, oldValue)
          // this.form = {}
          // console.log(newValue)
          this.init(newValue)
        },
        // deep: true
      }
    },
    created() {
      // console.log(this.formData)
      this.init(this.formData)
      this.getGames()
    },
    beforeMount() {
      this.cityData = JSON.parse(sessionStorage.getItem('area'))
    },
    methods: {
      // 初始化数据
      init(data) {
        data && data.forEach(item => {
          this.dealData(item.actDeModelFormList)
        })
        // console.log('初始化数据this.form.questionIds', this.form.questionIds)
        this.findCheckboxProps()
        // console.log('初始化数据this.form.questionIds', this.form.questionIds)
      },
      // 获取游戏数据
      getGames() {
        this.$api.getGameScope({}).then(res => {
          const arr = []
          const resData = res.data || []
          resData.forEach((val, i) => {
            val.gameId = val.value
            arr.push(val)
          })
          this.gameTypes = resData
          this.gameTypeList = arr
        })
      },
      findCheckboxProps() {
        let arr = []
        this.formData.forEach((val, i) => {
          val.actDeModelFormList.forEach((val1, i) => {
            if (val1.required == true && (val1.type === 'upload')) {
              arr.push(val1.prop)
            }
            if (val1.required == true && (val1.type === 'trainUpload')) {
              arr.push(val1.field.split(',')[1])
            }
          })
        })
        this.checkboxprops = arr
      },
      // 时间范围选择参数
      pickerOptions(type) {
        let options = {}
        if (type === 'daterangeTimePass') {
          options = {
            disabledDate(time) {
              return time.getTime() > Date.now()
            }
          }
        }
        if (type === 'daterangeTimeFuture') {
          options = {
            disabledDate(time) {
              // 24*60*60*1000
              return time.getTime() < Date.now() - 86400000
            }
          }
        }
        return  options
      },
      // 网点原址转让联动框添加规则
      setNewRules(flag, rule) {
        if (flag === 'add') {
          this.rules = Object.assign(this.rules, rule)
        } else if (flag === 'delete') {
          delete this.rules[rule]
        }
        // console.log('设置新规则', this.rules)
      },
      // 从组建返回的值，obj是组件返回的对象，prop参数是对应的字段
      async componentValueSet(obj, prop) {
        // console.log(obj)
        // 假如是课程修改，下拉选择，请求详情
        if (prop === 'id') {
          const res = await this.$api.trainCourseGet({ data: { id: obj['id'] }})
          let resD = res.data
          let fileIdArr = []
          resD.filFileVos.forEach((val, i) => {
            fileIdArr.push(val.id)
          })
          let questionIdsArr = []
          resD.questionBankManageVos.forEach((val, i) => {
            questionIdsArr.push(val.id)
          })
          this.$set(obj, 'courseName', resD.trainCourse.courseName)
          this.$set(obj, 'courseTypeId', resD.trainCourse.courseTypeId +'')
          this.$set(obj, 'fileType', resD.trainCourse.fileType)
          this.eventBus.$emit('fileType', resD.trainCourse.fileType)
          this.$set(obj, 'fileUpload', fileIdArr.join(','))
          this.eventBus.$emit('fileUpload', fileIdArr.join(','))
          this.$set(obj, 'singleScore', resD.trainCourse.singleScore)
          this.$set(obj, 'courceContent', resD.trainCourse.courceContent)
          if (!this.fromTodo) {
            // 如果是业务申请才触发，如果是处理页面不触发
            // console.log('trainCourse触发')
            this.$set(obj, 'questionIds', questionIdsArr.join(','))
            this.eventBus.$emit('trainCourse', questionIdsArr.join(','), resD.trainCourse.singleScore)
          }
        }
        // 假如是课程新增， 选择题目，判断ids  有ids  就清除空校验
        if (prop === 'questionIds' && obj['questionIds'].length > 0) {
          this.$refs.form.clearValidate(['questionIds'])
        }
        // 如果是投注站类别的时候，发送值给stationCommission.vue组件
        if (prop === 'stationCategory') {
          this.eventBus.$emit('stationCategoryChange', obj)
        }
        Object.keys(obj).forEach((prop) => {
          this.$set(this.form, prop, obj[prop])
          // this.form[prop] = obj[prop]
        })
        // this.$emit('change', this.form)
        // 清空有值的校验 bug
        for (let i in this.form) {
          if (this.rules[i] && this.rules[i][0] && this.rules[i][0].name) {
            if (this.form[i] && this.form[i].length > 0 && (this.rules[i][0].required == true || this.rules[i][1].required == true) && ((this.rules[i][0].validator && this.rules[i][0].validator.name === 'specialRequire') || (this.rules[i][1].validator && this.rules[i][1].validator.name === 'specialRequire'))) {
              this.clearValidate(i)
            }
          }
        }

        // console.log('组件值变化', this.form)
      },
      // 中奖彩票明细
      // async stationRightGameChange(list, index) {
      //   // 设置gameName
      //   if (list[index].gameId) {
      //     list[index].gameName = this.$common.getLabel(this.gameTypeList, list[index].gameId)
      //   }
      // },
      // 中奖彩票明细
      async perListChange(list, index) {
        // console.log(list)
        // 设置gameName
        if (list[index].gameId) {
          list[index].gameName = this.$common.getLabel(this.gameTypeList, list[index].gameId)
        }

        // 转账总金额
        if (!this.form.transferSumAmount) {
          this.$set(this.form, 'transferSumAmount', 0)
        }
        let data = {
          ticketStationId: list[index].lotteryStationCode,
          issue: list[index].gamePeriodNo,
          tsn: list[index].lineNumber,
          gameId: list[index].gameId
        }
        if (data.ticketStationId && data.issue && data.tsn && data.gameId) {
          // console.log(12)
        } else {
          return
        }
        let res = await this.$api.getLotteryPrice({  data })
        if (res.code != 0) return
        this.$set(list[index], 'amount', res.data ? res.data : 0)
        let num = 0
        list.forEach((val, i) => {
          num = num + (val.amount * 1)
        })
        this.$set(this.form, 'transferSumAmount', num)
        // console.log(this.form, this.form.transferSumAmount)
      },
      winDetailAdd(prop) {
        // console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.form[prop]))
        arr.push({})
        this.$set(this.form, prop, arr)
      },
      winDetailMi(prop) {
        this.form[prop].pop()
        // console.log('减少')
      },
      // 根据最近投注站网点编号查询网点类别信息
      async queryNearestStationInfo(val) {
        if (!val) return
        let data = {
          stationCode: val
        }
        let res = await this.$api.queryStationAllInfoByCode({ data })
        if (res && res.code === 0) {
          this.$set(this.form, 'nearestStationCategory', res.data.stationCategory)
          // console.log('根据最近投注站网点编号查询网点类别信息', res.data.stationCategory)
        }
      },
      // 根据网点编号查询网点所有信息
      async queryStationInfo(val, item) {
        if (!val) return
        let data = {
          stationCode: val
        }
        let res
        const flowKeyApi = {
          sta_temporary_lines: 'getCreditLimit',
          station_owner_withdraw: 'queryStationWithdrawInfo'
        }[this.flowKey.toLowerCase()]

        let apiStr = flowKeyApi ? flowKeyApi : 'queryStationAllInfoByCode'

        // 加载网点，支持配置请求路径
        if (['loadStation', 'loadStopStation'].includes(item.type) && item.sourceData) {
          res = await this.$api.getSourceData({url: item.sourceData, data})
        } else {
          res = await this.$api[apiStr]({ data })
        }

        if (res && res.code === 0) {
          let resData = res.data || {}
          // console.log('网点信息', this.form)
          // 将网点信息中对象数据暴露到上层
          for (let key  in resData) {
            if (resData[key].constructor === Object) {
              let keyArr = Object.keys(resData[key])
              let valueArr = Object.values(resData[key])
              keyArr.forEach((val, i) => {
                resData[key + '-' + val] = valueArr[i]
              })
            }
          }
          Object.assign(this.form, resData)
          if (typeof this.form.additionalItems === 'string') {
            this.form.additionalItems = this.form.additionalItems.split(',')
          }
          Object.keys(resData).forEach(key => {
            // 数字改成字符串
            if (typeof this.form[key] === 'number' && !isNaN(this.form[key])) {
              this.form[key] = this.form[key] + ''
            }
            let value = this.form[key]
            let newKey = key + 'Old'
            this.$set(this.form, newKey, '')
            this.form[newKey] = value
            // this.$set(this.form, newKey, value)
          })
          // this.stationList = resData
        }
        // 网点信息变更 经纬度回填
        if (this.flowKey === 'station_info_change') {
          this.eventBus.$emit('lnglat', this.form.stationLng, this.form.stationLat)
        }
        if (['sta_game_cash_permissions'].includes(this.flowKey)) {
          /*
          *
          * 游戏兑奖金额权限业务申请
          * 游戏名称下拉框来源于网点信息的stationPermission,gameId,gameName
          * */
          this.eventBus.$emit('stationCodeChange', this.form.stationPermission)
          this.form.stationPermission = {}
        }
        if (this.flowKey === 'station_relocation') {
          /*
          如果是网点迁址
          * 原最近投注站nearestStationCodeOld,通过网点获取
          需要根据nearestStationCodeOld获取nearestStationCategoryOld,
          同时置空nearestStationCode
          nearestStationCode,nearestStationCategory,nearestStationDistan
          * */
          this.$set(this.form, 'nearestStationCode', '')

          let data2 = {
            stationCode: this.form.nearestStationCodeOld
          }

          let res2 = await this.$api.queryStationAllInfoByCode({ data: data2 })
          this.$set(this.form, 'nearestStationCategoryOld', res2.data.stationCategory)

        }
        // if (this.flowKey === 'rightStationGameNightProcess' || this.flowKey === 'udcompent') {
        //   // udcompent这个是测试流程
        //   // rightStationGameNightProcess游戏夜间销售权限流程
        //   this.eventBus.$emit('stationCodeChange', this.form.stationPermission)
        // }

        // 撤站，查询网点结算余额
        if (this.flowKey === 'repeal_station') {
          const _res = await this.$api.queryStationBalance({ data })
          let balance = (_res && _res.code === 0) ? _res.data : ''
          this.$set(this.form, 'stationBalance', balance)
        }

        // 停开机，查询网点折旧费、代销费率、可用余额下限
        if (this.flowKey === 'station_stop_boot') {
          const _res = await this.$api.getStationStopBootInfo({ data })
          let d = (_res && _res.code === 0) ? _res.data : {}
          this.$set(this.form, 'depreciation', d.depreciation || '')
          this.$set(this.form, 'saleCommission', d.saleCommission || '')
          this.$set(this.form, 'accountLimit', d.accountLimit || '')
        }
        if (this.flowKey === 'station_cancel_terminal') {
          // 如果是网点终端撤销流程-需要传回 code 的值，然后根据他获取终端设备列表信息
          this.eventBus.$emit('stationCodeBack', this.form.stationCode)
        }

      },
      // 获取即开票类型列表
      async getJKPStationList(sCode) {
        if (!sCode) return
        let data = {
          jkpCode: sCode
        }
        let res = await this.$api.queryJkpCode({ data })
        if (res && res.code == 0) {
          // console.log(res)
          this.jkpStationList = res.data
        }
      },
      // 获取网点类型列表
      async getStationList(sCode) {
        if (!sCode) return
        let data = {
          stationCode: sCode
        }
        let res = await this.$api.queryStationCode({ data })
        if (res && res.code == 0) {
          // console.log(res)
          this.stationList = res.data
        }
      },
      // 获取停机网点列表
      async getStopStationList(sCode) {
        if (!sCode) return
        let data = {
          stationCode: sCode
        }
        let res = await this.$api.queryStopStationCode({ data })
        if (res && res.code == 0) {
          this.stationList = res.data
        }
      },
      backFileId(id, prop) {
        this.$set(this.form, prop, id)
      },
      handleRemove() {},
      async uploadFile(files) {
        let formData = new FormData()
        this.softData[3].value = `${(files.file.size / 1024).toFixed(1)} KB`
        formData.append('file', files.file)
        formData.append('refId', 1)
        formData.append('flag', true)
        formData.append('busType', 1)
        const res = await this.$api.testUpload({
          timeout: 99999999999999,
          data: formData,
          onUploadProgress(evt) {
            // console.log('上传进度事件:', evt)
          }
        })
        // console.log('uploadFile', res)
        // this.gameBagId = res.data.fileId
      },
      changeCheckbox(val) {
        // console.log('复选框变化', val, this.form)
      },
      checkNumber(val, flag) {
        if (this.form[val] < 0) {
          this.$message.warning(`${flag}须大于0`)
        }
      },
      success(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.warning('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.warning('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      changeDate(val) {
        this.form[val.options[0]] = moment(this.dateParam[val.prop][0]).format('YYYY-MM-DD')
        this.form[val.options[1]] = moment(this.dateParam[val.prop][1]).format('YYYY-MM-DD')
      },
      changeTime(val) {
        this.form[val.options[0]] = moment(this.timeParam[val.prop][0]).format('YYYY-MM-DD HH:mm:ss')
        this.form[val.options[1]] = moment(this.timeParam[val.prop][1]).format('YYYY-MM-DD HH:mm:ss')
      },
      changeRadio(val) {
        // console.log(val)
        // this.form[val.prop] = this.radioParam[val.prop]
      },
      resetForm() {
        this.$refs.form.resetFields()
        if (this.$refs.commonCascader) {
          this.$refs['commonCascader'].forEach(item => {
            item.clear()
          })
        }
      },
      // 选择渠道类型，清空投注站类别
      clearCategory() {
        this.$set(this.form, 'stationCategory', '')
        if (this.$refs.commonCascader) {
          this.$refs['commonCascader'].forEach(v => {
            if (v.item.field === 'stationCategory') {
              v.clear()
            }
          })
        }
      },
      clearValidate(itemProp) {
        this.$refs.form.clearValidate([itemProp])
      },
      validate(callback) {
        this.$refs.form.validate((valid, checkObj) => {
          if (valid) {
            // console.log('校验通过')
            callback('true')
          } else {
            // console.log('校验不通过')
            callback('false')
          }
        })
      },
      changeSwitch(val) {
        this.switchText = val ? '开启' : '关闭'
      },
      changeSelect(val) {
        // console.log(val)
        this.form[val.prop] = this.selectParam[val.prop]
        // console.log(this.selectParam)
      },
      async dealData(arr) {
        // console.log('arr', arr)
        // console.log('this.form.questionIds', this.form.questionIds)
        const self = this
        arr = arr || []
        arr.forEach(item => {
          // console.log(item)
          if (item.stationCode) {
            self.$set(self.form, 'stationCode', item.stationCode)
          }
          if (item.type === 'datepicker-range' || item.type === 'datetime-range') {
            if (item.value != '') {
              // 数据回填
              self.timeParam[item.prop] = item.value
              self.dateParam[item.prop] = item.value
            } else {
              self.$set(self.form, item.options[0], '')
              self.$set(self.form, item.options[1], '')
              // self.timeParam[item.type] = item.options // 用于获取起止时间的字段名称
              // console.log('时间参数', self.timeParam)
            }
          } else if (item.type === 'switch') {
            if (item.value !== '') {
              // 数据回填
              self.changeSwitch(item.value)
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, 0)
            }
          } else if (item.type === 'radio') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.radioParam, item.prop, item.value)
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
              self.$set(self.radioParam, item.prop, '')
            }
          } else if (item.type === 'address') {
            // console.log(item)
            if (item.value !== '') {
              // 数据回填
              self.citySelect = item.value
              // console.log(self.citySelect)
              self.$set(self.form, item.prop, item.value)
              this.cityKey++
            } else {
              // self.$set(self.form, 'provinceId', '')
              // self.$set(self.form, 'provinceName', '')
              // self.$set(self.form, 'cityId', '')
              // self.$set(self.form, 'cityName', '')
              // self.$set(self.form, 'townId', '')
              // self.$set(self.form, 'townName', '')
              // self.$set(self.form, 'address', '')
            }
          } else if (item.type === 'select') {
            // value为0(int)是'' 这里要用 !==
            if (item.value !== '') {
              // 数据回填
              self.$set(self.selectParam, item.prop, item.value)
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
              self.$set(self.selectParam, item.prop, '')
            }
          } else if (item.type === 'checkbox') {
            // console.log(item)
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
          } else if (item.type === 'radio-textarea') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.props[0], item.value[0])
              self.$set(self.form, item.props[1], item.value[1])
            } else {
              self.$set(self.form, item.props[0], '')
              self.$set(self.form, item.props[1], '')
            }
          } else if (item.type === 'cascader-multiple') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
            self.$set(self.cascaderParams, item.prop, '')
          } else if (item.type === 'cascader') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
            }
            self.$set(self.cascaderParam, item.prop, '')
          } else if (item.type === 'cascader-object') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, [])
            }
            // self.$set(self.cascaderParam, item.prop , '')
          } else if (item.type === 'upload') {
            // console.log(item)
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
            }
            // self.$set(self.cascaderParam, item.prop , '')
          } else if (item.type === 'winDetail') {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
            }
            self.$set(self.form, 'transferSumAmount', item.transferSumAmount)
          } else if (item.type === 'newStationRate') {
            if (item.value !== '' && item.value.length > 0) {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              // self.$set(self.form, item.prop, '')
              this.$api.getGameScope({}).then(res => {
                let arr = []
                const data = res.data || []
                data.forEach((val, i) => {
                  val.gameName = val.label
                  val.gameId = val.value
                  arr.push(val)
                })
                self.$set(self.form, item.prop, arr)
              })
            }
          } else {
            if (item.value !== '') {
              // 数据回填
              self.$set(self.form, item.prop, item.value)
            } else {
              self.$set(self.form, item.prop, '')
            }
          }
        })
      },
    }
  }
</script>

<style lang="less">
  .flex-wrap {
    display: flex;
    align-items: center;
  }
  .station-category{
    display: none;
  }
</style>
