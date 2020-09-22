<template>
  <!-- 数据中需要配远程搜索的接口/ -->
      <div class="DoubleSelect-div">
        <label>{{label[0]}}</label>
        <el-form-item >
          <el-select v-model="fatherValue" placeholder="请选择">
            <el-option
              v-for="fatherItem in item.options"
              :key="fatherItem.paramId"
              :label="fatherItem.paramName"
              :value="fatherItem.paramId">
            </el-option>
          </el-select>
        </el-form-item >
        <span class="dividingLine">--</span>
        <label>{{label[1]}}</label>
        <el-form-item>
          <el-select v-model="childValue" placeholder="请选择" @change="optionChange">
            <!-- :value="childItem.paramId" -->
            <el-option
              v-for="childItem in childOptions"
              :key="childItem.paramId"
              :label="childItem.paramName"
              :value="childItem.paramId">
            </el-option>
          </el-select>
        </el-form-item >
      </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import ajax from '@/utils/ajax.js'
  import { dssURL } from '@/api/baseConfig'
  const baseURL = dssURL

  export default {
    name: 'DoubleSelect',
    components: {},
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isInit: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        fatherValue: '',
        childValue: '',
        label: [],
        childOptions: [],
        fatherAttr: '',
        childAttr: ''
      }
    },
    
    created() {
    },

    mounted() {
      // console.log(this.item);
      this.initData();
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },


    watch: {
      item: {
        handler(newVal, oldVal) {
          // console.log('DoubleSelect 变化',  newVal)
            this.initData();
        },
        deep: true
      },

      fatherValue(newVal, oldVal) {
        if( this.item.options && this.item.options.length > 0 ) {
          let isHas = this.item.options.find(item => item.paramId == newVal );
          this.childOptions =  isHas ? isHas.children : [];
          this.childValue = this.childOptions.length > 0 ? this.childOptions[0].paramId : '';
          
          // console.log(this.childOptions, this.childValue);
          this.formDataSet(newVal, this.childValue);
        }

      },
    },

    methods: {
      initData() {
        // console.log(this.item)
        this.label = this.item.label.split(',');
        this.fatherAttr = this.item.attrName.split(',')[0];
        this.childAttr = this.item.attrName.split(',')[1];
        
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        // console.log('缓存的数据', this.dssResourceCode, backParam);

        if( backParam.hasOwnProperty(this.fatherAttr) ) {
          // console.log('回填初始化')
          this.fatherValue = backParam[this.fatherAttr];
          this.childValue = backParam[this.childAttr];
          if( this.item.options && this.item.options.length > 0 ) {
            let isHas = this.item.options.find(item => item.paramId == this.fatherValue );
            this.childOptions =  isHas ? isHas.children : [];
          }
        } else if ( this.item.options && this.item.options.length > 0 ) {
          // console.log('普通初始化')
          this.fatherValue = this.item.options[0].paramId;
          this.childValue = this.item.options[0].children && this.item.options[0].children.length > 0 ? this.item.options[0].children[0].paramId : '';
        }
          // console.log(this.fatherValue, this.childValue);

          this.formDataSet(this.fatherValue, this.childValue)
      },

      optionChange(value) {
        // console.log(value)
        this.formDataSet(this.fatherValue, value);
      },

      formDataSet(fatherId, childId) {
        // console.log('linkage-div值回传设置', val)
        // console.log(this.linkageObject)item

        let form = {}
        form[this.fatherAttr] = fatherId;
        form[this.childAttr] = childId;

        // console.log(form)
        this.$emit('doubleSelectValueBack', form)
      },


    },
  }
</script>

<style lang="less">
  .DoubleSelect-div {
    display: flex;
    justify-content: space-between;
    margin-left: 50px;
    width: 650px;
      .el-form-item {
        .el-form-item__content {
            width: 100% !important;
        }
      }
    .dividingLine {
      display: inline-block;
      width: 20px;
      margin: 0 16px;
    }
    label {
      display: inline-block;
      width: 120px;
      // margin-left: 50px;

    }
  }
</style>
