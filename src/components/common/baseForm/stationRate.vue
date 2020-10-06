<template>
  <!-- { label: '网点销售费率', value: 'loadStationRate' } -->
  <el-form-item
    :label="item.title"
    :prop="item.readOnly ? '' : item.prop"
  >
    <div style="width: 700px;">
      <el-table
        :data="data"
        style="width: 100%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="gameId" label="游戏" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.gameId" placeholder="请选择" disabled>
              <el-option
                v-for="item in $store.state.dicStore['misStationPermission.gameName']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="gameCommissionFee" label="原代销费率" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.gameCommissionFee" placeholder="请选择" disabled>
              <el-option
                v-for="item in $store.state.dicStore['station.saleCommission']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="newSaleCommission" label="现代销费率">
          <template slot-scope="scope">
            <el-select v-model="scope.row.newSaleCommission" placeholder="请选择">
              <el-option
                v-for="item in $store.state.dicStore['station.saleCommission']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-form-item>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      defualt: () => ({})
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
  }
}
</script>
