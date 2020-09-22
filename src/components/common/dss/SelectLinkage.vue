<!--
[{"label":"区域范围","firstValue":0,"attrName":"RegionLevel,RegionList","value":"","type":"areaMultiple","labelFirst":"按区域"},{"label":"起止站号","firstValue":1,"attrName":"Fstation,Tstation","value":"","type":"inputRange","labelFirst":"按站号范围"},{"label":"站点编号","firstValue":2,"attrName":"Fstation","value":"","type":"input","labelFirst":"按单站"}]
-->
<template>
  <div class="select-linkage-div">
    <!--统计查询组件联动表单-->
    <el-form-item :prop="linkageObject.attrName" :label="linkageObject.label">
      <el-select v-model="firstStageValue" placeholder="请选择">
        <el-option v-for="(subItem, firstIndex) in linkageObject.sub" :value="subItem.firstValue" :key="firstIndex" :label="subItem.labelFirst"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item :prop="item.attrName" :label="item.label">
      <form-set :item="item" :isInit="isInit" :isResetInputValue="isResetInputValue" @formSetValueReturn="(val) => formDataSet(item, val)" ></form-set>
    </el-form-item>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'

  export default {
    name: 'SelectLinkage',
    components: {
    },

    props: {
      linkageObject: {
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
        firstStageValue: '', // 联动的第一级的值
        item: {},           // 联动第二个组件的数据
        isResetInputValue: false,
      }
    },

    created() {
    },

    mounted() {
      // console.log('selectLinkage 初始化', this.linkageObject);
      this.initData();
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    watch: {
      firstStageValue(val) {
        // console.log('firstStageValue变化', val)
        // console.log(this.linkageObject)
        this.item = this.linkageObject.sub.find((subItem) => {
          return subItem.firstValue === val
        })

        let form = {};
        if( this.item.attrName.indexOf(',') != -1 ) {
          let attrNameArr = this.item.attrName.split(',');
          attrNameArr.forEach( value => {
            form[value] = '';
          });
        } else {
          form[this.item.attrName] = '';
        }

        this.isResetInputValue = !this.isResetInputValue;
        // console.log(form)
        this.formDataSet({}, form);
      },

      linkageObject: {
        handler(newValue, oldValue) {
          // console.log('linkageObject 变化', newValue)
          this.initData();
        },
        deep: true
      },

    },

    methods: {
      initData() {
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        // console.log('缓存的数据', this.dssResourceCode, backParam);
        if( backParam.hasOwnProperty(this.linkageObject.attrName) ) {
          // console.log('回填初始化')
          this.firstStageValue = backParam[this.linkageObject.attrName];
        } else if( this.linkageObject.sub.length > 0 ) {
          // console.log('普通初始化')
          this.firstStageValue = this.linkageObject.sub[0].firstValue;;
        }
        this.formDataSet({},{});
      },

      formDataSet(item, val) {
        // console.log('linkage-div值回传设置', item, val)
        // console.log(this.linkageObject)
        let form = {}
        Object.assign(form, val)
        form[this.linkageObject.attrName] = this.firstStageValue
        // console.log(form)
        this.$emit('linkageValueGet', form)
      },

    },
  }
</script>

<style lang="less">
  .select-linkage-div {
    .el-form-item__content {
      width: 60% !important;
    }
  }
</style>
