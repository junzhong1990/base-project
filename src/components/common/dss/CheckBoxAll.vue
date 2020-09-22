<template>
  <div class="check-all">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div class="margin-div"></div>
    <el-checkbox-group v-model="checkedItems" @change="handleCheckedItemsChange">
      <el-checkbox v-for="arrItem in allOptions" :label="arrItem.value" :key="arrItem.value">{{arrItem.text}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default {
    name: 'CheckAll',
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
        checkAll: false,
        checkedItems: [],
        optionsValueArr: [],
        allOptions: [],
        isIndeterminate: false
      }
    },

    created() {
    },

    mounted() {
      // console.log('CheckBoxAll 初始化', this.item)
      // this.getOptions();
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    watch: {
      item: {
        handler(newValue, oldValue) {
          if ( newValue.options) {
            // console.log('chckBoxAll item 变化',  newValue)
            this.getOptions()
          }
        },
        deep: true
      },
    },

    methods: {
      handleCheckAllChange(val) {
        // console.log(val)
        this.checkedItems = val ? this.optionsValueArr : [];
        this.isIndeterminate = false;
        this.$emit('checkAllValueBack', this.checkedItems.join(','))
      },

      handleCheckedItemsChange(value) {
        // console.log(value)
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.optionsValueArr.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.optionsValueArr.length;
        // console.log('checkedItems', this.checkedItems)

        this.$emit('checkAllValueBack', this.checkedItems.join(','))
      },

       getOptions() {
        this.allOptions  = this.item.options;
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        // console.log('缓存的数据', this.dssResourceCode, backParam, this.item);

        if( backParam.hasOwnProperty(this.item.attrName) ) {
          // console.log('回填初始化', this.allOptions)
          this.optionsValueArr = backParam[this.item.attrName].split(',');
        } else  {
          // console.log('普通初始化', this.allOptions)
          this.optionsValueArr = this.allOptions.map(itemOption => itemOption.value);
        }

        this.checkAll = this.optionsValueArr.length == this.item.options.length ? true : false;

        // console.log('任选框组件',this.item, this.checkAll, this.optionsValueArr)
        this.handleCheckAllChange(true);
      },
    },

  }
</script>

<style lang="less">
  .check-all {
    display: flex;
    justify-content: flex-start;
    .margin-div {
      margin-left: 10px;
    }
  }
</style>
