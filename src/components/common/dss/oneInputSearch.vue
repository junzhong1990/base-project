<template>
  <!-- 数据中需要配远程搜索的接口/ -->
  <div class="oneInput-search-div">
      <el-autocomplete
        data-name="oneInputSearch"
        v-model="shearchValue"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
        @blur="handleBlur"
      >
      </el-autocomplete>
  </div>
</template>

<script type="text/ecmascript-6">
  import ajax from '@/utils/ajax.js'
  import { dssURL } from '@/api/baseConfig'
  import { mapGetters } from 'vuex'
  const baseURL = dssURL

  export default {
    name: 'oneInputSearch',
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
        shearchValue: '',
        optionsData: [],
        shearchOptions: {},
      }
    },

    created() {
    },
    
    mounted() {
      this.initData(this.item);
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    watch: {
      item: {
        handler(newValue, oldValue) {
          // console.log('oneInputSearch 变化 初始化', )
          this.initData(newValue);
        },
        deep: true
      },
    },

    methods: {
      async getOptions(queryString) {
        this.shearchOptions.qryStr = queryString;
        let res = await ajax.get(this.item.options.api, {
          data: this.shearchOptions,
          baseURL: baseURL,
        })
        // console.log(res)
        if( res.code == '0' && res.data.length > 0 ) {
          let options = [];
          res.data.forEach(value => {
            options.push({ "value": value.toString(), "id": value })
          })
          this.optionsData = options;
          return 'SUCESS'
        } else {
          return 'FAIL'
        }
        // console.log(this.optionsData)
      },

      async querySearchAsync(queryString, cb) {
        // console.log(queryString)
        // console.log(this.item.options.api)
        if( queryString || queryString === 0 ) {
          let status = await this.getOptions(queryString);
          let restaurants = status == 'SUCESS' ? JSON.parse(JSON.stringify(this.optionsData)) : [];
          // console.log(restaurants)
          cb(restaurants.filter(this.createStateFilter(queryString.toString())));
        } else if ( (!queryString && queryString !== 0) ) {
          cb([])
        }
      },

      createStateFilter(queryString) {
        return (state) => {
          return (state.value.indexOf(queryString) != -1);
        };
      },

      handleSelect(item) {
        // console.log('选中的值', item.value);
        this.formBack(item.value);
      },

      handleBlur(e) {
        // console.log(e, e.target.value, e.target.dataset.name);
        let value = e.target.value;
        // console.log('inputRangeValue  失去焦点', value)
        this.formBack(value);
      },

      formBack(val) {
        // console.log('最终回调的值', val)
        let shearchForm = {};
        shearchForm[this.item.attrName] = val;
        this.$emit('oneInputSearchValueBack', shearchForm)
      },

      // 数据初始化
      initData(newValue) {
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        console.log('缓存的数据', this.dssResourceCode, backParam, newValue);
        console.log(backParam[newValue.attrName], newValue)

        if( backParam.hasOwnProperty(newValue.attrName) ) {
          console.log('回填初始化')
          this.shearchValue = backParam[newValue.attrName];

          if( newValue.hasOwnProperty('firstValue') && newValue.firstValue == 2 && backParam.hasOwnProperty('RegionFlag') && backParam.RegionFlag != 2 ) {
            this.shearchValue = '';
          }

        } else  {
          console.log('普通初始化')
          this.shearchValue = '';
        }

        console.log(this.shearchValue)
        
          this.formBack(this.shearchValue);
      }


    },
  }
</script>

<style lang="less">
</style>
