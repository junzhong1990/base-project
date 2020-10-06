<template>
  <div>
    <TablePage :totalCount="pageInfo.count" :showPowerSearch="false" >
      <!--查询条件-->
      <div slot="query">
        <QueryForm ref="query_form"
                   :queryApiCode="searchApi"
                   @tableData="getTableData"
                   @tablePageInfo="getTablePageInfo"
        ></QueryForm>
      </div>
      <!--表格-->
      <div slot="TableSlot">
        <!--带操作按钮的列表-->
        <glTable
          :tableData="tableData"
          :column="columnTitle"
          :searchPage="pageInfo.page">
        </glTable>
      </div>
    </TablePage>
  </div>
</template>

<script>
  export default {
    name: 'logManage',
    data() {
      return {
        searchApi: {
          apiCode: 'mcAllList',
          content: {}
        },
        // 分页数据
        pageInfo: {},
        tableData: [],
        columnTitle: [
          {
            label: '操作人',
            prop: 'userName',
            minWidth: 100
          },
          {
            label: '操作时间',
            prop: 'createTime',
            minWidth: 100
          },
          {
            label: '操作内容',
            prop: 'createTime',
            minWidth: 100
          }
        ]
      }
    },
    mounted() {
      console.log(1)
    },
    methods: {
      // 获取列表数据 - 数组
      getTableData(val) {
        this.tableData = val
      },
      // 获取分页数据 - 总数：count，页码：page
      getTablePageInfo(val) {
        this.pageInfo = val
      }
    }
  }
</script>

<style scoped>

</style>
