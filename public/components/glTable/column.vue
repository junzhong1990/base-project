<template>
  <div>
    <el-table-column
      v-for="(item, index) in column"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :sortable="item.sortable"
      :minWidth="item.minWidth"
    >
      <template v-if="item.children && item.children.length">
        <tableColumn :column="item.children"></tableColumn>
      </template>
      <template slot-scope="scope">
        <!-- 开关按钮组 -->
        <template v-if="item.flagOnOff && item.options">
          <el-radio-group
            v-model="scope.row[item.prop]"
            @change="(value) => item.change && item.change(value, scope.row)">
            <el-radio-button
              v-for="col in item.options"
              :key="col.value"
              :label="col.value">
              {{ col.label }}
            </el-radio-button>
          </el-radio-group>
        </template>
        <!-- 使用render自定义 -->
        <Render
          v-else-if="item.render"
          :render="item.render"
          :row="scope"
          :column="scope.column"
          :index="scope.$index" />
         <Tips
            v-else
            :width="item.width"
            :content="format(item, scope.row, item.prop)"
            :style="item.style"
            @tipClick="clickRow(scope.$index, scope.row, item.click)" />
      </template>
    </el-table-column>
  </div>
</template>
<script>
  import Render from './expand'
  import Tips from './tips'
  export default {
    name: 'TableColumn',
    components: {
      Render,
      Tips
    },
    props: {
      column: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      getLabel(option, val) {
        let obj = (option || []).find(v => v.value === val)
        return obj ? obj.label : val
      },
      format(column, row, prop) {
        let val = row[prop]
        let value = val
        if (column.options && (value || value === 0)) {
          value = this.getLabel(column.options, val)
        } else if (row[`${prop}Dic`]) {
          // 采用返回数据的字典Dic过滤
          value = this.lookup(row[`${prop}Dic`], val)
        } else if (column.format) {
          // 自定义格式
          value = typeof column.format === 'function' && column.format(row, prop)
        }
        let type = Object.prototype.toString.call(value)
        if (type.indexOf('Null') > -1 || type.indexOf('Undefined') > -1) {
          value = ''
        }
        return value + ''
      },
      clickRow(index, row, fn) {
        fn && fn(index, row)
      }
    }
  }
</script>
