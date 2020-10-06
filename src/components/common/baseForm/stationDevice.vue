<template>
  <!-- {label: '建站设备列表', value: 'newStationDevice'} -->
  <el-table
    :data="data"
    style="width: 100%">
    <el-table-column label="序号" type="index" width="50"></el-table-column>
    <el-table-column
      v-for="item in column"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width">
        <template slot-scope="scope">
          <el-select v-if="item.options" v-model="scope.row[item.prop]" placeholder="请选择" disabled>
            <el-option
              v-for="col in item.options"
              :key="col.value"
              :label="col.label"
              :value="col.value">
            </el-option>
          </el-select>
          <span v-else>{{scope.row[item.prop]}}</span>
          <!--<el-input v-else v-model="scope.row[item.prop]" placeholder="请输入"></el-input>-->
        </template>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        column: [
          {
            prop: 'materialType',
            label: '物品类型',
            width: 180,
            options: this.lookUpOptions('stMatType.matType')
          },
          {
            prop: 'materialName',
            label: '物品名称'
          },
          {
            prop: 'deviceType',
            label: '物品型号'
          },
          {
            prop: 'deviceCount',
            label: '数量'
          },
          {
            prop: 'deposit',
            label: '押金(元)'
          },
          {
            prop: 'depreciationFee',
            label: '折旧费(元)'
          }
        ]
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
