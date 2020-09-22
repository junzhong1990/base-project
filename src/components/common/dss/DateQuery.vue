<template>
  <div>
    <!--    dateType-->
    <!--    dateRangeFast.起止日期 + 快速设置时间:昨天、本周、上周、本月、上月、今年、去年（后台接口返回）-->
    <!--    daterange.起止日期-->
    <!--    year.年份选择-->
       <!-- month月份选择 -->

    <el-date-picker
      ref="aa"
      v-model="value"
      :type="type"
      align="right"
      unlink-panels
      @change="dateChange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :value-format="valueFormat"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default {
    name: 'DateQuery',
    components: {},

    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },
      valueFormat: {
        type: String,
        default: 'yyyyMMdd'
      },
      isInit: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        value: '',
        pickerOptions: {},
        type: ''
      }
    },

    created() {},

    mounted() {
      this.dateType = this.item.type;
      // console.log(this.dateType)
      // this.dateType = 'year';
      // this.dateType = 'month';
      // console.log('DateQuery 初始化')
      this.setPickerOptions(this.dateType)
    },

    computed: {
      ...mapGetters([ 'dssResourceCode'])
    },

    watch: {
      item: {
        handler(newValue, oldValue) {
          if( newValue && newValue.type ) {
            // console.log('++++++++++', newValue)
            this.dateType = newValue.type;
            this.setPickerOptions(newValue.type);
          }
        },
        deep: true
      },
    },

    methods: {
      dateChange(val) {
        // console.log(val)
        let rst
        if (this.dateType == 'dateRangeFast' || this.dateType == 'daterange') {
          rst = val
        }  else if (this.dateType == 'year' && val ) {
          // rst = val.split('-')[0]
          rst = val.split('').slice(0, 4).join('');
        } else if (this.dateType == 'month' && val ) {
          // rst = val.split('-').slice(0, 2)
          // let year = val.split('').slice(0, 4).join('');
          let month = val.split('').slice(4, 6).join('');
              // rst = [year,month];
          rst = month;
        }
        // console.log(rst)
        this.$emit('getDateValue', rst)
      },

      setPickerOptions(val) {
        function getLastDate() {
          const nowDate = new Date();
          let lastDateNum = nowDate.getDate() - 1
          nowDate.setDate(lastDateNum)
          return nowDate
        }
        function getFirstDayOfWeek() {
          // 如果当天是周一，那本本周选项不可选
          const start = new Date()
          var dayOfWeek = start.getDay()
          // console.log('dayOfWeek', dayOfWeek)

          if (dayOfWeek === 0) {
            dayOfweek = 7
          }
          start.setDate(start.getDate() - dayOfWeek + 1)
          return start
        }
        let self = this
        // console.log('设置 pickerOptions', val)
        if (val == 'dateRangeFast') {
          // 如果是类型1，那么有快捷选项
          /*
          5.15获取数据
          * 昨天 5.14-5.14
          * 本周5.11-5.14（如果是周一，本周不可选）
          * 上周5.4-5.10
          * 本月、5.1-5.14(如果是本月第一天，本月不可选）
          * 上月、4.01-4.30
          * 今年、2020-0101-2020-5.14
          * 去年 2019-01-01 -2019-12-31
          * */
          this.pickerOptions = {
            shortcuts: [
              {
                text: '昨天',
                onClick(picker) {
                  const end = getLastDate()
                  const start = getLastDate()
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '本周',
                onClick(picker) {
                  const end = getLastDate()
                  const start = getFirstDayOfWeek()
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '上周',
                onClick(picker) {
                  const end = new Date()
                  const start = new Date()
                  let dayOfWeek = start.getDay()
                  if (dayOfWeek === 0) {
                    dayOfWeek = 7
                  }
                  end.setTime(start.getTime() - 3600 * 1000 * 24 * dayOfWeek);
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * (dayOfWeek + 6));
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '本月',
                onClick(picker) {
                  const end = getLastDate()
                  const start = getLastDate()
                  start.setDate(1)
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '上月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  let thisMonth = start.getMonth()
                  start.setMonth(thisMonth - 1)
                  start.setDate(1)
                  end.setMonth(thisMonth)
                  end.setDate(0)

                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '今年',
                onClick(picker) {
                  const end = getLastDate()
                  const start = getLastDate()
                  start.setMonth(0)
                  start.setDate(1)
                  picker.$emit('pick', [start, end]);
                }
              },
              {
                text: '去年',
                onClick(picker) {
                  let year = new Date().getFullYear() - 1
                  const start = new Date(`${year}-1-1`);
                  const end = new Date(`${year}-12-31`);

                  picker.$emit('pick', [start, end]);
                }
              },
            ]
          }
          this.type = 'daterange'
        } else if (val == 'daterange') {
          this.pickerOptions = {}
          this.type = 'daterange'
        } else if (val == 'year') {
          this.pickerOptions = {}
          this.type = 'year'
        } else if (val == 'month') {
          this.pickerOptions = {}
          this.type = 'month'
        }
        this.setNowTime();
      },

      setNowTime() {
          const nowDate = new Date();
          let year = nowDate.getFullYear();
          let month = nowDate.getMonth() + 1;
          let today = nowDate.getDate();
              nowDate.setDate(1);
          let startDay = nowDate.getDate();
              month = month < 10 ? '0' + month : month;
              startDay = startDay < 10 ? '0' + startDay : startDay;
              today = today < 10 ? '0' + today : today;
          if( this.type == 'daterange' ) {
            let startTime = `${year}${month}${startDay}`;
            let endTime = `${year}${month}${today}`
            this.value = [startTime, endTime];
            // console.log('daterange', this.value)
            if( !this.fillDefaultTime() ) this.$emit('getDateValue', this.value) ;
            // this.$emit('getDateValue', this.value)
          } else {
            this.type == 'year' ? nowDate.setMonth(0) : '';
            month = nowDate.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            this.value = `${year}${month}${startDay}`

            let emitVlue = this.type == 'year' ? `${year}` : `${year}${month}`

            if( !this.fillDefaultTime(month, startDay) ) this.$emit('getDateValue', emitVlue) ;
            // this.$emit('getDateValue', emitVlue)        
          } 
      },

      fillDefaultTime(month, startDay) {
        let backParam = this.dssResourceCode.param ? JSON.parse(this.dssResourceCode.param) : {};
        // console.log('缓存的数据', this.dssResourceCode, backParam, this.item);

        let attr01 = this.item.attrName.split(',')[0];
        let attr02 = this.item.attrName.split(',')[1];

        if( backParam.hasOwnProperty(attr01) || backParam.hasOwnProperty(attr02) ) {
          // console.log('回填初始化')
          if( this.type == 'daterange' ) {
            let startTime = backParam[attr01] ? backParam[attr01] : ''
            let endTime = backParam[attr02] ? backParam[attr02] : ''
            this.value = startTime && endTime ? [ startTime, endTime ] : '';
            this.$emit('getDateValue', this.value);
          } else {
            this.value =  backParam[attr01] ? (this.type == 'year' ? `${backParam[attr01]}${month}${startDay}` : `${backParam[attr01]}${startDay}`) : '';
            this.$emit('getDateValue', backParam[attr01])
          }
        } else  {
          // console.log('普通初始化')
          return false;
        }
        // console.log('事件回填值', this.value)
      },

    }

  }
</script>

<style lang="scss">
</style>
