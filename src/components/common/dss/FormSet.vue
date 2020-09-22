<template>
<!--  注意事项
必要条件选择(如果是必要的话红框）
dssform 获取值的时候有的是数组形式，
-->
<!-- this.item.options 暂时是假数据-->
  <!-- 统计查询查询表单的表单组件-->
  <div class="form-set">
    <!--input控件 -->
    <div v-if="item.type=='input' || item.type=='textarea'">
      <el-input
                v-model="inputValue"
                :placeholder="item.placeholder"
                :maxlength="item.maxlength == undefined ? 20 : item.maxlength"
                @change="(val) => formDataBackDssForm(item, val)">
      </el-input>
    </div>

    <!--单选框组件 -->
    <div v-if="item.type=='radio'">
      <el-radio-group
                  v-model="radioValue"
                  @change="(val) => formDataBackDssForm(item, val)">
        <el-radio v-for="(type, index) of item.options" :key="index" :label="type.value">{{type.text}}</el-radio>
      </el-radio-group>
    </div>

    <!--单选下拉框组件 -->
    <div v-if="item.type=='select'">
      <el-select  v-model="selectValue" 
                  :clearable="item.attrName == 'GameId' ? false : true" 
                  placeholder="请选择" 
                 @change="(val) => formDataBackDssForm(item, val)">
        <el-option v-for="items in item.options" :value="items.value" :key="items.value"
                   :label="(items.label || items.text)"></el-option>
      </el-select>
    </div>

    <!--多选下拉框组件 -->
    <div v-if="item.type=='selectMult'">
      <el-select v-model="selectMultiValue"
                clearable 
                 multiple
                 placeholder="请选择" 
                 @change="(val) => formDataBackDssForm(item, val)">
        <el-option v-for="items in item.options" :value="items.value" :key="items.value"
                   :label="(items.label || items.text)"></el-option>
      </el-select>
    </div>

    <!--多选框-->
    <div v-if="item.type=='checkBoxAll'">
      <check-box-all :item="item" :isInit="isInit" @checkAllValueBack="(val) => formDataBackDssForm(item, val)"></check-box-all>
    </div>

    <!--日期选择器-->
    <div v-if="item.type=='dateRangeFast' || item.type=='daterange' || item.type=='year'  || item.type=='month'">
      <date-query :item="item" :isInit="isInit" @getDateValue="(val) => formDataBackDssForm(item, val)"></date-query>
    </div>

    <!--双模糊搜索框-->
    <div v-if="item.type=='inputRange'">
      <input-range :item="item" :isInit="isInit" @inputRangeValueBack="(val) => formDataBackDssForm(item, val)"></input-range>
    </div>

    <!--单模糊搜索框-->
    <div v-if="item.type=='oneInputSearch'">
      <one-input-search :item="item" :isInit="isInit" @oneInputSearchValueBack="(val) => formDataBackDssForm(item, val)"></one-input-search>
    </div>

    <!--两个下拉框-->
    <div v-if="item.type=='DoubleSelect'">
      <double-select :item="item" :isInit="isInit" @doubleSelectValueBack="(val) => formDataBackDssForm(item, val)"></double-select>
    </div>

    <!--下拉框联动组件-->
    <div v-if="item.type=='selectLinkage'">
      <select-linkage :linkageObject="item" :isInit="isInit" @linkageValueGet="(val) => formDataBackDssForm(item, val)">
      </select-linkage>
    </div>

    <!-- 单选框联动组件-->
    <div v-if="item.type=='radioLinkage'">
      <radio-linkage :linkageObject="item" :isInit="isInit" @linkageValueGet="(val) => formDataBackDssForm(item, val)"></radio-linkage>
    </div>

    <!--区域单选可选择任何一级-->
    <div v-if="item.type=='areaMixtureRadio'">
      <CommonCascader
        :qryObj="qryObjArea"
        :stage="3"
        :valueKey="'regionId'"
        :valueName="'regionName'"
        :select_any_level_flag="true"
        :isInit="isInit"
        :initAreaSelectFlag="initAreaSelectFlag"
        :defaultArea="defaultArea"
        @commonSelectResult="(val) => formDataBackDssForm(item, val)"
      ></CommonCascader>
    </div>
    <!--区域多选只可多选同一级-->
    <div v-if="item.type=='areaMultiple'">
      <AreaMult
        :qryObj="qryObjArea"
        :isInit="isInit"
        @areaMultResult="(val) => formDataBackDssForm(item, val)"
      ></AreaMult>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import DateQuery from '@/components/common/dss/DateQuery'
  import InputRange from '@/components/common/dss/InputRange'
  import CheckBoxAll from '@/components/common/dss/CheckBoxAll'
  import AreaMult from '@/components/common/dss/AreaMult'
  import DoubleSelect from '@/components/common/dss/DoubleSelect'
  import oneInputSearch from '@/components/common/dss/oneInputSearch'
  import SelectLinkage from "./SelectLinkage"
  import { mapGetters } from 'vuex'

  export default {
    name: 'FormSet',
    components: {
      SelectLinkage,
      DateQuery,
      InputRange,
      CheckBoxAll,
      AreaMult,
      DoubleSelect,
      oneInputSearch
    },

    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },

      isResetInputValue: {
        type: Boolean,
        default: false
      },

      isInit: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        initAreaSelectFlag: true,     // 区域单选可选择任何一级 是否需要 默认值
        defaultArea: -999,            // 区域单选可选择任何一级 默认值
        inputValue: '',
        selectValue: '',
        selectMultiValue: [],
        radioValue: '',
        qryObjArea: {
          apiCode: 'getRegionScope',
          content: {
          }
        },
      }
    },

    created() {
    },

    mounted() {
      // console.log('组件挂载初始化')
      this.initData(this.item);
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    watch: {
        isResetInputValue: function(newVal, oldVal) {
          this.inputValue = ''
        },

        item: {
          handler(newValue, oldValue) {
            this.initData(newValue)
          },
          deep: true
        },
    },

    methods: {
      formDataBackDssForm(item, val, isFirst) {
        // console.log('formset 里面的 item', item)
        // console.log('formset 里面的 val', val)
        // console.log(Object.prototype.toString.call(val))
        
        // || (item.attrName == 'Fstation,Tstation' && item.type =='inputRange') 
        if( item.attrName == 'GameId' && item.type =='select' ) {
          // console.log(item)
            this.eventBus.$emit('startAndEndDateNo', {item, val, isFirst})
        }

        let form = {};
        let addParameters = false;
        let doubleAttrComponent = ['areaMultiple', 'dateRangeFast', 'daterange', 'inputRange', 'DoubleSelect'];
        if (Object.prototype.toString.call(val) == '[object Object]') {
          // console.log(form, val)
          form = val
        } else {
          if (item.type === 'selectMult') {
            // console.log('item.type',item.type)
            form[this.item.attrName] = val ? val.join(',') : val;
            // || item.type === 'month'
          } else if ( doubleAttrComponent.includes(item.type) ) {
            // console.log('item.type',item.type)
            let firstProp = this.item.attrName.split(',') [0]
            let secondProp = this.item.attrName.split(',') [1]
            form[firstProp] = val && val.length > 0 ? val[0] : val;
            form[secondProp] = val && val.length > 0 ? val[1] : val;
            item.type === 'areaMultiple' ? addParameters = true : addParameters = false;
          } else if (item.type === 'areaMixtureRadio') {
            form[this.item.attrName] = val && val.length > 0 ? val.pop() : '';
          } else {
            form[this.item.attrName] =  val;
          }
        }


        // 如果是区域范围组件 item.type === 'areaMultiple'，UserId RegionUserId RegionTypeId RegionLevel RegionList 参数必传

        // 如果有站点范围参数 RegionFlag(站点选择)，以下附加参数必传
        // RegionFlag	(0按范围，1按站点范围，2单站), 有 RegionFlag 时才传；
        // UserId
        // RegionUserId	== UserId
        // RegionTypeId	区域类型编号：默认为 0 ，原来还有一个下拉框可选，但这个下拉框目前没用，所以默认为 0；
        // RegionLevel	按区域范围为选择的值；按站号范围为 默认为1；按单站为 默认为1;
        // RegionList	  按区域范围为选择的值；按站号范围为  默认为空或-999；按单站为  默认为空或-999;
        // Fstation		  按区域范围为 null 或 -999；按站号范围为输入的值；按单站为输入的值;
        // Tstation		  按区域范围为 null 或 -999；按站号范围为输入的值；按单站为 Fstation;
        if( form.hasOwnProperty("RegionFlag") || addParameters ) {
          // console.log('有  RegionFlag', form)
            form.UserId = this.$store.state.loginInfo.id;
            form.RegionUserId = this.$store.state.loginInfo.id;
            form.RegionTypeId = 0;
            if( form.RegionFlag == 1 || form.RegionFlag == 2 ) {
              form.RegionLevel = 1;
              form.RegionList = -999;
              form.Tstation = form.RegionFlag == 2 ? form.Fstation : form.Tstation;
            } else if ( form.RegionFlag === 0 ) {
              form.Fstation = -999;
              form.Tstation = -999;
            }
        }

        // console.log('form', form)
        this.$emit('formSetValueReturn', form);
      },

      initData(newValue) {
          let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
          // console.log('缓存的数据', this.dssResourceCode, backParam, newValue);

          let itemTypeList = {
            'input': 'inputValue',
            'textarea': 'inputValue',
            'radio': 'radioValue',
            'select': 'selectValue',
            'selectMult': 'selectMultiValue',
            'areaMixtureRadio': 'defaultArea'
          }

          if( newValue && Object.keys(itemTypeList).includes(newValue.type) ) {
                // console.log('当前组件符合')
              let key = itemTypeList[newValue.type];
              if( backParam.hasOwnProperty(newValue.attrName) ) {
                // console.log('输入框、单选框、下拉框、下拉多选框、回填初始化')
                let defaultValue = backParam[newValue.attrName];
                this[key] = newValue.type == 'selectMult' ?  defaultValue.split(',') : defaultValue;
                // console.log(key, this[key])
              } else {
                // console.log('输入框、单选框、下拉框、下拉多选框、普通初始化')
                Object.values(itemTypeList).forEach(key => {
                  this[key] = newValue.type == 'areaMixtureRadio' ? -999 : (newValue.type == 'selectMult' ? [] : '');
                })

                if( newValue.type == 'select' && newValue.attrName == 'GameId' && newValue.options && newValue.options.length > 0 ) {
                  // console.log('是游戏下拉框', this.selectValue)
                  this.selectValue = newValue.options[0].value;
                  // this.formDataBackDssForm(newValue, newValue.options[0].value, true);
                }
              }
              // console.log(this.defaultArea)
              if( newValue.type == 'areaMixtureRadio' ) return          // 如果是单选同级地区组件，组件内已发送到全局表单则不再发送
              this.formDataBackDssForm(newValue, this[key], true);

          }
      },

    },



    beforeDestroy () {
      this.eventBus.$off('startAndEndDateNo')
    },
  }
</script>

<style lang="less">
  .form-set {
    .el-form-item {
    }
    .el-cascader {
      width: 100%;
    }
  }
</style>
