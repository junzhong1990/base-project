<template>
  <div>
    <el-form-item :label="item.type == 'storeAllocationGoodsList' ? '调出仓库' : '报损仓库'" :prop="item.type == 'storeAllocationGoodsList' ? 'exportWarehouseId' : 'whId' " v-if="item.type == 'storeAllocationGoodsList' || item.type == 'storeDamageGoodsList'">
      <el-select v-model="form.exportWarehouseId" placeholder="请选择" @change="setOutListNum" :disabled="item.readOnly" v-if="item.type == 'storeAllocationGoodsList'">
        <el-option v-for="item in storeList" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="form.whId" placeholder="请选择" @change="setOutListNum" :disabled="item.readOnly" v-if="item.type == 'storeDamageGoodsList'">
        <el-option v-for="item in storeList" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="单据编号" prop="applyNo">
      <el-input v-model="form.applyNo" disabled></el-input>
    </el-form-item>
    <!-- {label: '仓储采购入库物品列表', value: 'storeGoodsList'} -->
    <el-form-item label="物品列表" :prop="item.readOnly ? '' : item.prop">
      <div style="width: 900px;">
        <el-table
            border stripe
            :data="tableData">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column
              prop="matName"
              label="物品名称">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.matName" placeholder="请输入备注" :disabled="item.readOnly" @focus="showGoodsList(scope)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="matModel"
              label="物品型号">
          </el-table-column>
          <!--<el-table-column-->
              <!--prop="goodsCount"-->
              <!--label="数量">-->
            <!--<template slot-scope="scope">-->
              <!--<el-input v-model.number="scope.row.goodsCount" placeholder="请输入数量" :disabled="data.readOnly?data.readOnly:false"></el-input>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
              prop="matUnit"
              label="单位"
              min-width="200px">
            <template slot-scope="scope">
              <!--<unitItem :unitItem="scope.row.matTypeUnit" :firstStage="true" :tableIndex="scope.$index" :disabled="item.type == 'storeGoodsList' || item.type == 'storeDamageGoodsList' ? false : !form.exportWarehouseId"></unitItem>-->
              <unitItem :unitItem="scope.row.matTypeUnit" :firstStage="true" :tableIndex="scope.$index" :disabled="item.readOnly" :key="unitKey"></unitItem>
            </template>
          </el-table-column>
          <el-table-column
              prop="costPrice"
              label="成本单价">
          </el-table-column>
          <el-table-column
              prop="totalPrice"
              label="金额(元)">
            <!--<template slot-scope="scope">-->
              <!--<el-input v-model.number="scope.row.goodsCount" placeholder="请输入成本单价" :disabled="data.readOnly?data.readOnly:false"></el-input>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
              v-if="item.type == 'storeGoodsList' || item.type == 'storeAllocationGoodsList'"
              prop="remark"
              label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="item.readOnly"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              v-if="item.type == 'storeDamageGoodsList'"
              prop="remark"
              label="报损原因">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.remark" placeholder="请输入报损原因" :disabled="data.readOnly?data.readOnly:false"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              v-if="item.type == 'storeAllocationGoodsList' || item.type == 'storeDamageGoodsList'"
              prop="exportWarehouseAmount"
              label="仓库库存">
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
    <div style="margin-top: 10px;margin-left: 165px;margin-bottom: 10px;">
      <el-button  type="primary" size="medium" @click="storeGoodsAdd" :disabled="item.readOnly">增加</el-button>
      <el-button  size="medium" @click="storeGoodsMi" :disabled="item.readOnly">减少</el-button>
    </div>
    <el-form-item label="合计金额(元)" prop="totalPrice">
      <el-input v-model="form.totalPrice" disabled></el-input>
    </el-form-item>
    <!--选择物品名称--弹窗-->
    <el-dialog title="提示(只能选择一种类型)" :visible.sync="dialogVisible" width="80%">
      <el-tabs v-model="goodsLabel" class="_blue-header" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="设备" name="设备"></el-tab-pane>
        <el-tab-pane label="耗材" name="耗材"></el-tab-pane>
        <el-table stripe :data="goodsTableData" border style="width: 100%" height="200" ref="multipleTable"
               @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
          <el-table-column label="物品类型" prop="matName"></el-table-column>
          <el-table-column label="物品型号" prop="matModel" v-if="versionVisible"></el-table-column>
          <el-table-column label="计量单位" prop="matTypeUnit">
            <template slot-scope="scope">
              <lastUnit :matTypeUnit="scope.row.matTypeUnit"></lastUnit>
            </template>
          </el-table-column>
          <el-table-column label="成本单价" prop="costPrice"></el-table-column>
        </el-table>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseGoodsName">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import unitItem from './unitItem'
  import lastUnit from './lastUnit'
  export default {
    components: {
      unitItem,
      lastUnit
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        unitKey: 1,
        storeList: [],
        arr: [], // 对应级别转换率数组
        stepArr: [], // 一条数据，每一级转化成最小单位
        form: {},

        activeIndex: 0,
        allGoodsList: {
          device: [],
          consumables: []
        },
        versionVisible: true,
        multipleSelection: [],
        goodsLabel: '设备',
        goodsTableData: [],
        dialogVisible: false,
        tableData: [],
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
    computed: {},
    methods: {
      getLastUnit(item) {
        if (item.child == undefined || JSON.stringify(item.child) == '{}') {
          return item.matTypeUnit
        }
        this.getLastUnit(item.child)
      },
      emitEvent() {
        console.log(this.form)
        this.$set(this.form, this.item.prop, this.tableData)
        this.$emit('storeGoodsListValueBack', this.form)
      },
      storeGoodsAdd() {
        console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.tableData))
        arr.push({
          exportWarehouseId: this.item.type == 'storeAllocationGoodsList' ? this.form.exportWarehouseId : this.form.whId
        })
        this.tableData = arr
        // this.$set(this.form, prop, arr)
        this.totalSum()
        this.emitEvent()
      },
      storeGoodsMi() {
        this.tableData.pop()
        // 算出库的库存
        this.setOutListNum()
        console.log('减少')
        this.totalSum()
        this.emitEvent()
      },
      // 弹窗--显示列表
      async showGoodsList(item) {
        this.tabClick()
        // console.log('获取编号item', item, item.$index)
        this.dialogVisible = true
        this.multipleSelection = []
        setTimeout(() => {
          this.$refs.multipleTable.clearSelection()
        }, 100)
        this.activeIndex = item.$index
      },
      // tab点击事件
      tabClick() {
        if (this.goodsLabel == '设备') {
          this.goodsTableData = this.allGoodsList.device
          console.log('设备', this.goodsLabel)
          this.versionVisible = true
        }
        if (this.goodsLabel == '耗材') {
          this.goodsTableData = this.allGoodsList.consumables
          console.log('耗材', this.goodsLabel)
          this.versionVisible = false
        }
      },
      // 选择物品名称
      chooseGoodsName(item) {
        let arr = JSON.parse(JSON.stringify(this.multipleSelection))
        this.tableData.splice(this.activeIndex, 1)
        this.tableData.splice(this.activeIndex, 0, ...arr)
        // 算出库库存
        this.setOutListNum()
        this.dialogVisible = false
      },
      // checkbox 多选事件
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 获取物品列表信息
      async getGoodsList() {
        let res = await this.$api.getMaterialList()
        let device = []
        let consumables = []
        if (res && res.code === 0) {
          res.data.forEach((val, i) => {
            if (val.matType == 'device') {
              device.push(val)
            } else if (val.matType == 'consumables') {
              consumables.push(val)
            }
          })
          this.allGoodsList.device = device
          this.allGoodsList.consumables = consumables
        }
      },
      // 获取仓库列表
      async getWarehouseList() {
        let res = await this.$api.getWarehouseList()
        if (res && res.code === 0) {
          this.storeList = res.data
        }
      },
      // 获取调出仓库的库存
      async setOutListNum() {
        this.emitEvent()
        if ((this.item.type == 'storeAllocationGoodsList' && this.form.exportWarehouseId || this.item.type == 'storeDamageGoodsList' && this.form.whId) ) {
          this.tableData.forEach((val, i) => {
            // 每一条数据加上出库id
            this.$set(this.tableData[i], 'exportWarehouseId', this.item.type == 'storeAllocationGoodsList' ? this.form.exportWarehouseId : this.form.whId)
            // 物品列表空数据  就不做请求
            if (!val.matModelId) {
              return
            }
            let data = {
              matModelId: val.matModelId,
              wareHouseId: this.item.type == 'storeAllocationGoodsList' ? this.form.exportWarehouseId : this.form.whId
            }
            this.$api.checkWarehouseInventory({data}).then(res => {
              if (res.code == '0') {
                this.tableData
                this.$set(this.tableData[i], 'exportWarehouseAmount', res.data)
              }
            })
          })
        }
        this.checkNumOutOver()
        this.emitEvent()
      },
      // 获取单据编号
      async getApplyNo() {
        if (this.$route.query.taskId) {
          return
        }
        let data = {
          indexName: ''
        }
        if (this.item.type == 'storeGoodsList') {
          data.indexName = 'CG'
        } else if (this.item.type == 'storeDamageGoodsList') {
          data.indexName = 'BS'
        } else if (this.item.type == 'storeAllocationGoodsList') {
          data.indexName = 'DB'
        }
        let res = await this.$api.generateCode({data})
        if (res && res.code === 0) {
          this.$set(this.form, 'applyNo', res.data)
          console.log(this.form)
          this.emitEvent()
        }
      },
      // 判断，每一级运行一次itemCal
      runItemCal(matTypeUnit) {
        if (JSON.stringify(matTypeUnit) == '{}') {
          let thisStageNum = matTypeUnit.matAmount ? matTypeUnit.matAmount : 0
          this.stepArr.push(thisStageNum)
          return
        }
        this.itemCal(matTypeUnit)
        // 后加 报错 解决
        // if (!matTypeUnit) {
        //   return
        // }
        if (JSON.stringify(matTypeUnit) != '{}' && matTypeUnit.child) {
          this.runItemCal(matTypeUnit.child)
        }
      },
      // 计算每一级别的数量 push到stepArr
      itemCal(matTypeUnit) {
        // let first = matTypeUnit.matAmount * this.returnUnitConvert(matTypeUnit.child)
        this.arr = []
        this.returnUnitConvert(matTypeUnit)
        let changeNum = 1
        this.arr.forEach((val, i) => {
          changeNum = changeNum * val
        })
        let thisStageNum = changeNum * (matTypeUnit ? (matTypeUnit.matAmount ? matTypeUnit.matAmount : 0) : 0)
        this.stepArr.push(thisStageNum)
      },
      returnUnitConvert(matTypeUnit) {
        if (matTypeUnit && matTypeUnit.child && JSON.stringify(matTypeUnit.child) != '{}') {
          this.arr.push(matTypeUnit.child.unitConvert)
          this.returnUnitConvert(matTypeUnit.child)
        } else {
          this.arr.push(1)
        }
        // if (matTypeUnit.matAmount)
      },
      // 把组件过来的每一级别的matAmount赋值到列表对应的数据
      setCount(newObj, oldObj) {
        // 后加 报错 解决
        // if (!newObj.matAmount || !oldObj) return
        if (newObj.id == oldObj.id) {
          oldObj.matAmount = newObj.matAmount
        } else {
          this.setCount(newObj, oldObj.child)
        }
      },
      totalSum() {
        let totalSum = 0
        this.tableData.forEach((val, i) => {
          totalSum += val.totalPrice ? val.totalPrice : 0
        })
        this.$set(this.form, 'totalPrice', totalSum)
      },
      makeNumZero(matTypeUnit) {
        matTypeUnit.matAmount = 0
        if (matTypeUnit && matTypeUnit.child && JSON.stringify(matTypeUnit.child) != '{}') {
          this.makeNumZero(matTypeUnit.child)
        }
      },
      // 做库存对比校验
      checkNumOutOver() {
        if (this.$store.state.dicStore["CHECK_INVENTORY"] && (this.item.type == 'storeAllocationGoodsList' || this.item.type == 'storeDamageGoodsList')) {
          console.log(this.tableData)
          setTimeout(() => {
            this.tableData.forEach((val, i) => {
              let allNum = val.exportWarehouseAmount
              let outNum = val.totalPrice / val.costPrice
              // 假如超过
              if (outNum > allNum && outNum != 0) {
                this.tableData[i].totalPrice = 0
                this.makeNumZero(this.tableData[i].matTypeUnit)
                this.unitKey++
                this.$message.closeAll()
                this.$message.warning(val.matModel + '数量超出库存数')
              }
            })
          }, 100)
        }
      }
    },
    beforeMount() {
      this.getApplyNo()
      this.getWarehouseList()
      this.getGoodsList()
      this.tableData = this.item.value ? this.item.value : []
    },
    created() {
      this.eventBus.$on('unitItem', (item, index) => {
        // 需要找对应层级，给设置amtAmount---可以通过matModelId 去查找对应的对象进行设置
        // 通过计算，计算每一条数据的totalPrice
        setTimeout(() => {
          // if (!item.id) {
          //   return
          // }
          this.setCount(item, this.tableData[index].matTypeUnit)
          this.checkNumOutOver()
        }, 100)
        setTimeout(() => {
          this.stepArr = []
          // if (!this.tableData[index].matTypeUnit) {
          //   return
          // }
          this.runItemCal(this.tableData[index].matTypeUnit)
          let totalPrice = eval(this.stepArr.join('+')) * this.tableData[index].costPrice
          this.$set(this.tableData[index], 'totalPrice', totalPrice)
          this.totalSum()
          this.emitEvent()
        }, 200)
      })
    },
    async mounted() {
      this.eventBus.$on('storeGoodsListChange', (allForm) => {
        this.$set(this.form, 'applyNo', allForm.applyNo)
        this.$set(this.form, this.item.prop, allForm[this.item.prop])
        this.$set(this.form, 'totalPrice', allForm.totalPrice)
        if (this.item.type == 'storeAllocationGoodsList') {
          this.$set(this.form, 'exportWarehouseId', allForm.exportWarehouseId)
        }
        if (this.item.type == 'storeDamageGoodsList') {
          this.$set(this.form, 'whId', allForm.whId)
        }
        this.emitEvent()
      })
    }
  }
</script>
<style lang="less" scoped>

</style>
