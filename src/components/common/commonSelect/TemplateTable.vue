<template>
  <div class="teamplateDroup">
    <TablePage :totalCount="pageInfo.count" :showPowerSearch="showPowerSearch">
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
        <!--<TableBody :tableData="tableData" :column="columnTitle" :SearchPage="pageInfo.page"></TableBody>-->
        <el-table stripe border :data="tableData" ref="tableSelection" :highlight-current-row="!multiple"
               @current-change="onSelectChange"
               @row-click="onRowClick"
               @select="handleSelect"
               @select-all="handleSelectAll">>
          <el-table-column v-if="multiple" type="selection" width="40" align="center"></el-table-column>
          <el-table-column fixed label="序号" width="60" align="center" v-if="numFlag && !multiple">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(pageInfo.page-1)*20}} </span>
            </template>
          </el-table-column>
          <el-table-column
                  v-for="(item, key) in columnTitle"
                  :key="key"
                  :prop="item.prop"
                  :label="item.label"
                  :minWidth="item.minWidth"
          ></el-table-column>
        </el-table>
      </div>
    </TablePage>
  </div>
</template>
<script>
export default {
  name: 'teamplateDroup',
  props: {
    itemList: {
      type: Array,
      default: function () {
        return []
      }
    },
    searchApi: {
      type: Object,
      default: function () {
        return {}
      }
    },
    columnTitle: {
      type: Array,
      default: function () {
        return []
      }
    },
    showPowerSearch: {
      type: Boolean,
      default: true
    },
    numFlag: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkedItems: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tableData: [],
      pageInfo: {}, // 分页数据
      chooseRes: null // 单选存放选择结果
    }
  },
  computed: {},
  methods: {
    // 获取列表数据 - 数组
    getTableData(val) {
      this.tableData = val
      // 多选默认选择
      this.tableData.forEach(item => {
        // 方法一：额外获取已选数据 checkedItems[{id: 'id', name: 'name'}]
        this.checkedItems.forEach(itemCheck => {
          if (itemCheck.id === item.id) {
            this.$nextTick(() => {
              this.$refs.tableSelection.toggleRowSelection(item)
            })
          }
        })
        // 方法二：服务端直接在返回的列表中添加hasChecked字段，true或者false
        // if(item.hasChecked) {
        //   this.$nextTick(() => {
        //     this.$refs.tableSelection.toggleRowSelection(item, true)
        //   })
        // }
      })
    },
    // 获取分页数据 - 总数：count，页码：page
    getTablePageInfo(val) {
      this.pageInfo = val
    },
    // 单选 - 选择变化的时候触发
    onSelectChange(val) {
      // 约定获取显示的值
      if (val) {
        this.chooseRes = val
      }
    },
    onRowClick(row, index, column) {},
    // 多选 - 选择变化的时候触发
    handleSelectAll(selection) {
      this.tableData.forEach((row) => {
        this.handleSelect(selection, row)
      })
    },
    handleSelect(selection, row) {
      // console.log(selection)
      // console.log(row)
      var rowIndex = -1
      // 判断checkedItems数组中是否已含有当次操作的项，有就代表取消勾选，无就代表勾选
      this.checkedItems.forEach((item, index) => {
        if (item.id === row.id) {
          rowIndex = index
        }
      })
      console.log(rowIndex)
      if (selection.indexOf(row) > -1 && rowIndex === -1) {
        this.checkedItems.push(row)
      } else if (selection.indexOf(row) === -1 && rowIndex > -1) {
        this.checkedItems.splice(rowIndex, 1)
      }
    }
  },
  mounted: function () {
  }
}
</script>
<style lang="less">
  .teamplateDroup .el-table .current-row .cell {
    color: #2D8CF0;
    font-weight: bold;
  }
  .teamplateDroup .el-table .cell {
    cursor: pointer;
  }
</style>
