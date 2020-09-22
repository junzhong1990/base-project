<template>
  <div>
    <!--    dateType-->
    <!--    dateRangeFast.起止日期 + 快速设置时间:昨天、本周、上周、本月、上月、今年、去年（后台接口返回）-->
    <!--    dateRange.起止日期这个暂时没有-->
    <!--    year.年份选择-->
    <!--    month月份选择-->

    <el-date-picker
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
        default: 'yyyy-MM-dd'
      },
    },
    data() {
      return {
        value: '',
        pickerOptions: {},
        type: 'daterange'
      }
    },
    watch: {
      dateType: function (val) {
        console.log('type变化', val)
        this.setPickerOptions(val)
      }
    },
    methods: {
      dateChange(val) {
        console.log('数据',  val, typeof val)
        let obj = {}

        if (this.dateType === 'dateRangeFast') {
          // 起止时间形式
          let start = this.item.prop.split(',')[0]
          let end = this.item.prop.split(',')[1]
          if (val.length > 0) {
            obj[start] = val[0]
            obj[end] = val[1]
          } else {
            obj[start] = ''
            obj[end] = ''
          }

        } else if (this.dateType === 'month') {
          // 月份形式 fDate=2019&tDate=04
          let start = this.item.prop.split(',')[0]
          let end = this.item.prop.split(',')[1]
          if (val) {
            obj[start] = val.split('-')[0]
            obj[end] = val.split('-')[1]
          } else {
            obj[start] = ''
            obj[end] = ''
          }


        } else if (this.dateType === 'year') {
          // 年份
          let key = this.item.prop
          if (val) {
            obj[key] = val.split('-')[0]
          } else {
            obj[key] = ''
          }


        }

        this.$emit('getDateValue', obj)
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
          console.log('dayOfWeek', dayOfWeek)

          if (dayOfWeek === 0) {
            dayOfweek = 7
          }
          start.setDate(start.getDate() - dayOfWeek + 1)
          return start
        }
        let self = this
        console.log('设置 pickerOptions', val)
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
      }
    },
    async mounted() {

    },
    created() {
      // console.log('统计分析查询组件', this.item)
      this.dateType = this.item.type
      this.setPickerOptions(this.dateType)
    }
  }
</script>

<style lang="scss">
</style>
