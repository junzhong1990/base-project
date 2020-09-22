<template>
  <div class="stationSelect">
    <el-dialog
        append-to-body
        title="站点选择列表"
        :visible.sync="stationFlag"
        width="900px"
        @closed="$emit('closed')"
    >
      <TablePage :totalCount="pageInfo.count">
        <!--顶部按钮组-->
        <div slot="btn_groups">
          <!--<ButtonGroup>-->
        </div>
        <!--查询条件-->
        <div slot="query">
          <QueryForm ref="query_form"
                     :queryApiCode="searchApi"
                     :itemList="itemList"
                     @tableData="getTableData"
                     @tablePageInfo="getTablePageInfo">
          </QueryForm>
        </div>
        <!--表格-->
        <div slot="TableSlot">
          <!--带操作按钮的列表-->
          <TableBody :tableData="tableData" :column="columnTitle" :SearchPage="pageInfo.page" :selectionFlag="true" @selectionResult="stationSelectChange">
          </TableBody>
        </div>
      </TablePage>
      <!--底部按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="stationFlag = false">关 闭</el-button>
        <el-button style="margin-left: 10px;"
                   type="primary"
                   @click="stationFlag = false">确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'stationSelect',
    props: {
      stationListFlag: {
        type: Boolean,
        default: false // 是否能多附件上传，默认单文件上传
      },
    },
    data() {
      return {
        stationFlag: false,
        pageInfo: {}, // 分页数据
        tableData: [],
        columnTitle: [
          {
            label: '站点编号',
            prop: 'stationCode',
            minWidth: 100
          },
          {
            label: '负责人',
            prop: 'owner',
            minWidth: 100
          },
          // {
          //   label: '经营方式',
          //   value: 'operType',
          //   type: 'select',
          //   options: this.lookUpOptions('station.operType')
          // },
          {
            label: '所属区域',
            prop: 'regionName'
          }
        ],
        searchApi: {
          apiCode: 'networkDataList',
          // resourceCode: 'networkDataList'
          // apiCode: 'stationJkpCitySetupPage',
          // content: {
          // }
        },
        itemList: [
          {
            label: '站点编号',
            value: 'stationCode',
            type: 'text'
          },
          {
            label: '所属区域',
            value: 'regionCode',
            type: 'commonCascader'
          },

        ],
      }
    },
    watch: {
      stationListFlag: {
        handler(newValue, oldValue) {
          console.log(newValue)
          this.stationFlag = newValue
        },
        // 深度监听 监听对象，数组的变化
        deep: true
      }
    },
    methods: {
      stationSelectChange(ids, val) {
        console.log(ids)
        this.$emit('stationChange', ids.join(','))
      },
      /* 获取列表信息 */
      getTableData(val) {
        this.tableData = val
      },
      /* 获取列表分页信息 */
      getTablePageInfo(val) {
        this.pageInfo = val
      },
    },
    beforeDestroy () {},
    deactivated () {}
  }
</script>

<style lang="less">
  // .stationSelect {}
</style>
