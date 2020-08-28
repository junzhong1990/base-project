
<template>
  <div>
    <el-table
      ref="glTable"
      v-bind="$attrs"
      highlight-current-row
      :data="data"
      :span-method="merge"
      :max-height="maxHeight"
      @sort-change="sortChange"
      @row-dblclick="dbClickHandler"
      @current-change="handleCurrentChange"
      @selection-change="selectChangeHandler"
      style="width: 100%"
    >
      <el-table-column v-if="showCheckbox"
        :resizable="false"
        fixed
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column v-if="showIndex"
        :resizable="false"
        :index="indexFormat"
        fixed
        type="index"
        label="序号"
        width="60">
      </el-table-column>
      <!-- 支持多级表头 -->
      <TableColumn
        :column="column">
      </TableColumn>
      <!--操作按钮-->
      <slot name="handle"></slot>
    </el-table>
    <div v-if="pages">
      <el-pagination
        style="float:right;margin-top:12px;"
        background
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :page-size="pages.pageSize"
        :total="pages.total"
        :current-page="currentPage"
        :page-sizes="pages.pageSizes"
        layout="sizes, total, prev, pager, next">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import TableColumn from './column'
  export default {
    name: 'glTable',
    components: {
      TableColumn
    },
    props: {
      // 是否显示序号
      showIndex: {
        type: Boolean,
        default: true
      },
      // 是否显示多选
      showCheckbox: {
        type: Boolean,
        default: false
      },
      // 表头
      column: {
        type: Array,
        default () {
          return []
        }
      },
      // 表数据
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 表格最大高度
      maxHeight: {
        type: [String, Number]
      },
      // 合并项
      merge: {
        type: Function,
        default () {
          return function () {
            return {rowspan: 1, colspan: 1}
          }
        }
      },
      // 序号格式
      indexFormat: {
        type: Function,
        default: function (index) {
          return index + 1
        }
      },
      // 分页信息
      pages: Object
    },
    data () {
      return {
        currentPage: 1
      }
    },
    methods: {
      sortChange ({column, prop, order}) {
        this.$emit('sortChange', {column, prop, order})
      },
      clearSort () {
        this.$refs.glTable.clearSort()
      },
      toggleRowSelection (arr) {
        arr.forEach(row => {
          this.$refs.glTable.toggleRowSelection(row)
        })
      },
      dbClickHandler (row, col, e) {
        this.$emit('dbClick', row, col, e)
      },
      // 复选框发生变化的时候
      selectChangeHandler (val) {
        this.$emit('selectionChange', val)
      },
      // 单选发生变化的时候
      handleCurrentChange (row) {
        this.$emit('currentChange', row)
      },
      // 页码改变
      pageSizeChange (size) {
        this.$emit('pageSize', size)
      },
      // 页码改变
      pageCurrentChange (page) {
        this.$emit('pageChange', page)
      }
    }
  }
</script>
