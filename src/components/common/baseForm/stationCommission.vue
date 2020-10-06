<template>
  <!-- { label: '建站代销费率表', value: 'newStationRate' } -->
  <div>
    <el-form-item label="代销费率" class="game-list-v1">
      <el-table
        :key="readerKey"
        :data="tableData"
        style="width: 80%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column
          v-for="obj in column"
          :key="obj.prop"
          :prop="obj.prop"
          :label="obj.label"
          :width="obj.width">
            <template slot-scope="scope">
              <el-select
                v-if="obj.options"
                v-model="scope.row[obj.prop]"
                :disabled="item.readOnly"
                @change="changeSelect"
                placeholder="请选择">
                  <el-option
                    v-for="col in obj.options"
                    :key="col.value"
                    :label="col.label"
                    :value="col.value">
                  </el-option>
              </el-select>
              <span v-else>{{scope.row[obj.prop]}}</span>
            </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      defualt: () => ({})
    },
    flowKey: {
      type: String,
      defualt: ''
    },
    gameTypes: {
      type: Array,
      defult: () => ([])
    },
    tableList: {
      type: Array,
      defult: () => ([])
    }
  },
  data() {
    return {
      tableData: [],
      column: [
        {
          label: '游戏',
          prop: 'gameName',
        },
        {
          label: '代销费率',
          prop: 'saleCommission',
          options: this.lookUpOptions('station.saleCommission')
        }
      ],
      allGameData: [],
      isFrist: true,
      stationStationCategoryMap: {},
      readerKey: 0
    }
  },
  watch: {
    tableList: {
      handler(newVal) {
        newVal = newVal || []
        newVal.forEach(v => {
          this.$set(v, 'saleCommission', v.saleCommission ? v.saleCommission + '' : '')
        })
        this.tableData = newVal
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.eventBus.$on('stationCategoryChange', data => {
      if (this.isFrist && (this.$route.query.draftId || this.$route.name === 'todosDeals')) {
        this.isFrist = false
        return
      }
      console.log(data)
      this.setSaleCommission(data.stationCategory)
    })
    this.transformData()
    // 网点新增，初始化代销费率列表
    if (this.flowKey === 'insert_station') {
      this.initGameList()
    }
  },
  methods: {
    // 初始游戏列表
    initGameList() {
      const arr = []
      this.gameTypes.forEach((val, i) => {
        let obj = {}
        obj = {...val}
        obj.gameName = val.label
        obj.gameId = val.value
        obj.saleCommission = ''
        arr.push(obj)
      })
      this.allGameData = arr
      this.initData()
    },
    // 初始化数据
    initData() {
      if (this.tableList && this.tableList.length) {
        this.tableData = this.tableList
        this.allGameData.forEach(v => {
          this.tableData.forEach(vv => {
            if (v.value === vv.value) {
              v.saleCommission = vv.saleCommission
            }
          })
        })
      } else {
        this.tableData = this.allGameData
      }
    },
    // 发送表格数据
    changeSelect() {
      this.$emit('stationCommissionBack', {
        [this.item.field]: this.tableData
      })
    },
    // 转换投注站类别的数据
    transformData() {
      const treeToObj = (data, key = 'value') => {
        let obj = {}
        const getValue = (data, key) => {
          data.forEach(cur => {
            obj[cur[key]] = cur
            if (cur.children) {
              getValue(cur.children, key)
            }
          })
        }
        getValue(data, key)
        return obj
      }
      this.stationStationCategoryMap = Object.freeze(treeToObj(this.lookUpOptions('station.stationCategory')))
    },
    // 设置代销费率
    setSaleCommission(key) {
      const item = this.stationStationCategoryMap[key]
      if (item && item.hasOwnProperty('fee') && item.hasOwnProperty('game')) {
        this.allGameData.forEach(v => {
          this.$set(v, 'saleCommission', item.game.includes(+v.value) ? (item.fee === 0 ? item.fee.toFixed(2) : item.fee) : '')
        })
        this.tableData = this.allGameData.filter(v => v.saleCommission !== '')
      } else {
        this.allGameData.forEach(v => {
          this.$set(v, 'saleCommission', '')
        })
        this.tableData = JSON.parse(JSON.stringify(this.allGameData))
      }
      this.readerKey = Math.random()
      this.changeSelect()
    },
    beforeDestroy() {
      this.eventBus.$off('stationCategoryChange')
    }
  }
}
</script>
<style lang="less">
.game-list-v1{
  .el-form-item__content{
    min-width: 900px;
  }
  .el-checkbox-group{
    margin-left: 30px;
  }
  .select-list{
    display: flex;
  }
}
</style>
