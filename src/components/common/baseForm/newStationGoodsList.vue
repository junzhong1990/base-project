<template>
  <div>
    <el-form-item label="物品是否标配" prop="examStatus" v-if="$route.path == '/home/homePage/stationFlowNormal'">
      <el-radio-group v-model="isStandard" @change="isStandardChange">
        <el-radio label="yes">是</el-radio>
        <el-radio label="no">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="mainTitle" :prop="item.readOnly ? '' : item.prop">
      <div style="width: 700px;">
        <el-table
            border stripe
            :data="tableData">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column
              prop="matType"
              label="物品类型"
              v-if="isStandard=='yes'"
              width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.matType" disabled>
                <el-option
                    v-for="item in $store.state.dicStore['stMatType.matType']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
              prop="matName"
              label="物品名称">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.matName" placeholder="请输入备注" :disabled="isStandard=='yes'" @focus="showGoodsList(scope)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              v-if="isStandard=='no'"
              prop="matModel"
              label="物品型号">
          </el-table-column>
          <el-table-column
              v-if="isStandard=='yes'"
              prop="matModelId"
              label="物品型号">
            <template slot-scope="scope">
              <el-select v-model="scope.row.matModelId" @change="emitEvent">
                <el-option
                    v-for="item in scope.row.matModels"
                    :key="item.matModelId"
                    :label="item.matModel"
                    :value="item.matModelId">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
              prop="deviceCount"
              label="数量"
              width="180">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.deviceCount" placeholder="请输入数量" :disabled="item.readOnly?item.readOnly:false" @change="emitEvent"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
    <div style="margin-top: 10px;margin-left: 120px;margin-bottom: 10px;">
      <el-button  type="success" size="medium" @click="storeGoodsAdd" :disabled="isStandard=='yes'">增加</el-button>
      <el-button type="danger" size="medium" @click="storeGoodsMi" :disabled="isStandard=='yes'">减少</el-button>
    </div>
    <!--选择物品名称--弹窗-->
    <el-dialog title="提示(只能选择一种类型)" :visible.sync="dialogVisible" width="80%">
      <el-tabs v-model="goodsLabel" class="_blue-header" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="设备" name="设备"></el-tab-pane>
        <!--<el-tab-pane label="耗材" name="耗材"></el-tab-pane>-->
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
  import lastUnit from './lastUnit'
  export default {
    components: {
      lastUnit
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        standardTable: [],
        isStandard: 'no',
        mainProp: '',
        mainTitle: '',
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
      isStandardChange(val) {
        if (val == 'yes') {
          this.tableData = this.standardTable
        } else {
          this.tableData = []
        }
        this.emitEvent()
      },
      // 站点标配下拉框数据
      async standardConfigurationsSelectInput() {
        let res = await this.$api.standardConfigurationsSelectInput()
        if (res && res.code == 0) {
          console.log(res)
          this.standardTable = res.data
        }
      },
      emitEvent() {
        this.$set(this.form, this.mainProp, this.tableData)
        this.$emit('newStationGoodsListValueBack', this.form)
      },
      storeGoodsAdd() {
        console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.tableData))
        arr.push({
          exportWarehouseId: this.form.exportWarehouseId
        })
        this.tableData = arr
        // this.$set(this.form, prop, arr)
        this.emitEvent()
      },
      storeGoodsMi() {
        this.tableData.pop()
        console.log('减少')
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
          console.log(res)
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
      // 把组件过来的每一级别的matAmount赋值到列表对应的数据
      setCount(newObj, oldObj) {
        if (newObj.id == oldObj.id) {
          oldObj.matAmount = newObj.matAmount
        } else {
          this.setCount(newObj, oldObj.child)
        }
      }
    },
    beforeMount() {
    },
    created() {
      this.getGoodsList()
      this.tableData = this.item.value ? this.item.value : []
      this.mainProp = this.item.field.split(',')[0]
      this.mainTitle = this.item.title.split(',')[0]
      this.emitEvent()
      this.standardConfigurationsSelectInput()
    },
    async mounted() {
      console.log(this.$route.path)
    }
  }
</script>
<style lang="less" scoped>

</style>
