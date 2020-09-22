<template>
  <!-- 数据中需要配远程搜索的接口/ -->
  <div v-if="item.options.api" class="input-range-div">
      <el-autocomplete
        data-name="shearch01"
        v-model="value1"
        placeholder="请输入内容"
        @select="handleSelect"
        @focus="handleFocus"
        @blur="handleBlur"
        :fetch-suggestions="querySearchAsync"
      >
      </el-autocomplete>
      -
      <el-autocomplete
        data-name="shearch02"
        v-model="value2"
        placeholder="请输入内容"
        @select="handleSelect"
        @focus="handleFocus"
        @blur="handleBlur"
        :fetch-suggestions="querySearchAsync"
      >
      </el-autocomplete>
  </div>

  <div v-else class="input-range-div">
      <el-input
        data-name="shearch01"
        v-model="value1"
        placeholder="请输入内容"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      </el-input>
      -
      <el-input
        data-name="shearch02"
        v-model="value2"
        placeholder="请输入内容"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      </el-input>
  </div>  
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import ajax from '@/utils/ajax.js'
  import { dssURL } from '@/api/baseConfig'
  const baseURL = dssURL

  export default {
    name: 'InputRange',
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
        value1: '',
        value2: '',
        inputRangeValue: [ '', ''],
        optionsData: [],
        chooseInputName: null,
        startAndEndOptions: {},
        gameOptions: null,
      }
    },

    created() {
    },
    
    async mounted() {
      // console.log('双输入框 初始化', this.item);
      this.initData();

      if( this.item.attrName == "FWinMoney,TWinMoney" ) return;
      this.eventBus.$on('startAndEndDateNo', (itemObj) => {
        if( itemObj.item && itemObj.item.attrName ==  "GameId" ) {
            this.startAndEndOptions.gameId = itemObj.val;
            if( !itemObj.isFirst ) {
              this.value1 = '';
              this.value2 = '';
              this.inputRangeValue =  ['', ''];
            }
            this.gameOptions = itemObj;
            // console.log('选中切换游戏，重置起止期号')
            this.$emit('inputRangeValueBack', this.inputRangeValue)
        }
        // console.log(itemObj)
      })
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    watch: {
      item: {
        handler(newValue, oldValue) {
          // console.log('双输入框变化', newValue)
          this.initData();
        },
        deep: true
      },
    },

    methods: {
      async getOptions(queryString) {
        this.startAndEndOptions.qryStr = queryString;
        !this.gameOptions ?  delete this.startAndEndOptions.gameId : '';
        // this.startAndEndOptions.gameId = 0;            // 测试调试用，记得删除
        let res = await ajax.get(this.item.options.api, {
          data: this.startAndEndOptions,
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
        this.formBack(this.chooseInputName, item.value);
        // console.log(this.chooseInputName, item.value);
      },

      handleFocus(e) {
        this.chooseInputName = e.target.dataset.name;
        // console.log(this.chooseInputName);
      },

      handleBlur(e) {
        // console.log(e, e.target.value, e.target.dataset.name);
        let name = e.target.dataset.name;
        let value = e.target.value;
        // console.log('inputRangeValue  失去焦点')
        this.formBack(name, value);
      },

      formBack(flag, val) {
          if (flag === 'shearch01') {
            this.inputRangeValue[0] = val
          } else if (flag === 'shearch02') {
            this.inputRangeValue[1] = val
          }
          this.$emit('inputRangeValueBack', this.inputRangeValue)
          // console.log(this.inputRangeValue)
      },

      initData() {
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        console.log('缓存的数据', this.dssResourceCode, backParam, this.item);
        let attr01 = this.item.attrName.split(',')[0];
        let attr02 = this.item.attrName.split(',')[1];

        if( backParam.hasOwnProperty(attr01) || backParam.hasOwnProperty(attr02) ) {
          console.log('回填初始化')
            this.value1 = backParam[attr01];
            this.value2 = backParam[attr02];            

          if( this.item.hasOwnProperty('firstValue') && this.item.firstValue == 1 && backParam.hasOwnProperty('RegionFlag') && backParam.RegionFlag != 1 ) {
            this.value1 = '';
            this.value2 = '';
          }
        } else  {
          console.log('普通初始化')
          this.value1 = '';
          this.value2 = '';
        }
          this.inputRangeValue =  [this.value1, this.value2];

          // console.log('选中切换游戏，重置起止期号')
          this.$emit('inputRangeValueBack', this.inputRangeValue)
      },


    },

    beforeDestroy () {
      this.eventBus.$off('startAndEndDateNo')
    },
  }
</script>

<style lang="less">
  .input-range-div {
    display: flex;
    justify-content: space-between;
  }
</style>
