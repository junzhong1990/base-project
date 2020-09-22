<template>
  <div>
    <el-table-column
      v-for="(item, key) in column"
      :key="key"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :sortable="item.sortable"
      :minWidth="item.minWidth"
      :fixed="item.fixed"
    >
      <template v-if="item.children && item.children.length">
        <tableColumn :column="item.children"></tableColumn>
      </template>
      <template slot-scope="scope" >
        <!-- true：是  false：否 -->
        <span v-if="item.flagYesNo">{{scope.row[item.prop] === false ? '否': '是'}}</span>
        <!-- 开关按钮组 -->
        <template  v-else-if="(item.flagOnOff && item.options)">
          <el-radio-group v-model="scope.row[item.prop]" @change="(value) => statusChange(value, scope.row, item.prop)" size="small">
            <el-radio-button v-for="col in item.options" :key="col.value" :label="col.value" >{{ col.text || col.label }}</el-radio-button>
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
            :width="item.width || item.minWidth"
            :content="format(item, scope.row, item.prop)"
            :style="item.style"
            @tipClick="clickRow(scope.$index, scope.row, item.click)" />
      </template>
    </el-table-column>
  </div>
</template>
<script>
  import Render from './expand'
  import Tips from './Tips'
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
      statusChange(value, params, prop) {
        this.$emit('statusChange', value, params, prop)
      },
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
