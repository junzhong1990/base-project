<template>
  <!-- { label: '网点销售权限', value: 'stationRight' } -->
  <el-form-item
    :label="item.title"
    :prop="item.readOnly ? '' : item.prop"
  >
    <div style="width: 700px;">
      <el-table :data="data" style="width: 100%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="gameId" label="游戏" width="180">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.gameId"
              placeholder="请选择"
              @change="stationRightGameChange(data, scope.$index)"
              disabled
            >
              <el-option
                v-for="item in $store.state.dicStore['misStationPermission.gameName']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="wager" label="投注权限" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.wager" placeholder="请选择">
              <el-option
                v-for="item in $store.state.dicStore.allowBan"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="cancel" label="注销权限">
          <template slot-scope="scope">
            <el-select v-model="scope.row.cancel" placeholder="请选择">
              <el-option
                v-for="item in $store.state.dicStore.allowBan"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="兑奖权限">
          <template slot-scope="scope">
            <el-select v-model="scope.row.cash" placeholder="请选择">
              <el-option
                v-for="item in $store.state.dicStore.allowBan"
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
    },
    gameTypeList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 中奖彩票明细
    async stationRightGameChange(list, index) {
      // 设置gameName
      if (list[index].gameId) {
        list[index].gameName = this.$common.getLabel(this.gameTypeList, list[index].gameId)
      }
    }
  }
}
</script>
