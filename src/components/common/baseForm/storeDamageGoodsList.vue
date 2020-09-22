<template>
  <div>
    <!-- {label: '仓储采购入库物品列表', value: 'storeGoodsList'} -->
    <el-table
        border stripe
        :data="list"
        style="width: 100%">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column
          prop="goodsType"
          label="物品名称">
        <template slot-scope="scope">
          <el-select @change="newStationGoodsChange1(scope.row)" v-model="scope.row.goodsType" placeholder="请选择物品名称" :disabled="data.readOnly?data.readOnly:false">
            <el-option
                v-for="item in scope.row.selectList1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          prop="goodsName"
          label="物品型号">
        <template slot-scope="scope">
          <el-select @change="newStationGoodsChange2(scope.row)" v-model="scope.row.goodsName" placeholder="请选择物品型号" :disabled="data.readOnly?data.readOnly:false">
            <el-option
                v-for="item in scope.row.selectList2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          prop="goodsCount"
          label="数量">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.goodsCount" placeholder="请输入数量" :disabled="data.readOnly?data.readOnly:false"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="goodsCount"
          label="单位">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.goodsCount" placeholder="请输入单位" :disabled="data.readOnly?data.readOnly:false"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="goodsCount"
          label="成本单价">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.goodsCount" placeholder="请输入成本单价" :disabled="data.readOnly?data.readOnly:false"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="goodsCount"
          label="金额(元)">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.goodsCount" placeholder="请输入成本单价" :disabled="data.readOnly?data.readOnly:false"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="goodsCount"
          label="报损原因">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.goodsCount" placeholder="请输入备注" :disabled="data.readOnly?data.readOnly:false"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px;">
      <el-button type="success" size="medium" @click="storeGoodsAdd">增加</el-button>
      <el-button type="danger" size="medium" @click="storeGoodsMi">减少</el-button>
    </div>
  </div>
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
        list: [],
        column: [
          {
            prop: 'materialType',
            label: '物品类型',
            width: 180,
            options: this.lookUpOptions('station.materialType')
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
            prop: 'saleTerminalCode',
            label: '物品序列号'
          }
        ]
      }
    },
    methods: {
      storeGoodsAdd() {
        console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.list))
        arr.push({
          selectList1: this.$store.state.dicStore['station.IssueGoods'],
          selectList2: [],
          selectList3: []
        })
        this.list = arr
        // this.$set(this.form, prop, arr)
      },
      storeGoodsMi() {
        this.list.pop()
        console.log('减少')
      },
    },
    beforeMount() {
      this.list = this.data
    }
  }
</script>
<style lang="less" scoped>

</style>
