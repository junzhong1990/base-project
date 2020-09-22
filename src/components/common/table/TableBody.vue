
<template>
  <div class="tableBody">
    <el-table
      ref="scTable"
      v-bind="$attrs"
      :data="tableData"
      :span-method="merge"
      :max-height="maxHeight"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <slot name="selectionColumn"></slot>
      <el-table-column v-if="selectionFlag" type="selection" width="55"></el-table-column>
      <el-table-column fixed label="序号" width="60" align="center" v-if="numFlag">
        <template slot-scope="scope">
          <span>{{scope.$index+1+(SearchPage-1)*20}} </span>
        </template>
      </el-table-column>
      <!-- 支持多级表头 -->
      <TableColumn :column="column" @statusChange="statusChange"></TableColumn>
      <!--操作按钮-->
      <slot name="options"></slot>
    </el-table>
  </div>
</template>

<script>
  import TableColumn from './TableColumn'
  export default {
    components: {
      TableColumn
    },
    props: {
      // 多选框就会的字段
      selectionReturnProp: {
        type: String,
        default: ''
      },
      // 是否显示多选框
      selectionFlag: {
        type: Boolean,
        default: false
      },
      // 在可以显示多选框的前提下，可以操作单选
      radioOperationFlag: {
        type: Boolean,
        default: false
      },
      // 是否显示序号列
      numFlag: {
        type: Boolean,
        default: true
      },
      // 分页信息
      SearchPage: {
        type: Number,
        default: () => {
          return 1
        }
      },
      // 表头
      column: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 表数据
      tableData: {
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
      }
    },
    methods: {
      sortChange({ column, prop, order }) {
        let obj = {
          desc: order === 'descending',
          order: order ? prop : ''
        }
        // this.eventBus.$emit('sortchange', obj)
        this.$emit('sortchange', obj)
      },
      statusChange(value, params, prop) {
        this.$emit('statusChange', value, params, prop)
      },
      handleSelectionChange(val) {
        let str
        if (this.selectionReturnProp) {
          str = this.selectionReturnProp
        } else {
          str = val.length && val[0].stationCode ? 'stationCode' : 'id'
        }
        let vv = val.map(item => item[str])
        this.$emit('selectionResult', vv, val)
        // 模拟单选的情况，再选第二个单选框是，删除第一个选择
        if (this.radioOperationFlag && val.length > 1) {
          this.tableData.forEach((v, i) => {
            if (val[0].id === v.id) {
              this.$refs.scTable.toggleRowSelection(this.tableData[i], false)
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
  .tableBody{
    .el-table__fixed::before, .el-table__fixed-right::before{
      background-color: #fff;
    }
  }
</style>
