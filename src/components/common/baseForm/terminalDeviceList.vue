<!--
设备名称，设备型号，终端编号，供应商，游戏，押金，折旧费


新增终端 - 设备名称、设备型号、供应商从仓库管理系统获取，押金、折旧费手动输入，为整数，单位为元，游戏下拉框选择
撤销设备
-->
<template>
  <div >
    <el-form-item :label="mainTitle" :prop="item.readOnly ? '' : item.prop">
      <div style="width: 830px;">
        <el-table
          border stripe
          :data="tableData">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column
            prop="matTypeName"
            label="设备名称"
            width="132">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.matTypeName" placeholder="请选择投注设备" :disabled="item.readOnly?item.readOnly:false"  @focus="showGoodsList(scope)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="matModelName"
            label="设备型号">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商">
          </el-table-column>
          <el-table-column
            prop="stationCode"
            label="终端编号"
            width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stationCode" placeholder="请输入终端编号" maxlength="10" :disabled="item.readOnly?item.readOnly:false" @blur="stationCodeChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="游戏"
            width="150">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.gameId"
                placeholder="请选择游戏"
                multiple
                :disabled="item.readOnly"
              >
                <el-option
                  v-for="item in scope.row.gameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="deposit"
            label="押金(元)"
            width="100">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.deposit" placeholder="请输入押金" maxlength="9" :disabled="item.readOnly?item.readOnly:false" @change="emitEvent"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="depreciationFee"
            label="折旧费(元)"
            width="100">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.depreciationFee" placeholder="请输入折旧费" maxlength="9" :disabled="item.readOnly?item.readOnly:false" @change="emitEvent"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
    <div style="margin-top: 10px;margin-left: 165px;margin-bottom: 10px;">
      <el-button type="primary" size="medium" :disabled="item.readOnly?item.readOnly:false"  @click="storeGoodsAdd" >增加</el-button>
      <el-button size="medium" :disabled="item.readOnly?item.readOnly:false"  @click="storeGoodsMi" >减少</el-button>
    </div>
    <!--选择设备名称--弹窗-->
    <el-dialog title="提示(只能选择一种类型)" :visible.sync="dialogVisible" width="80%">
      <el-tabs v-model="goodsLabel" class="_blue-header" type="border-card">
        <el-tab-pane label="设备" name="设备"></el-tab-pane>
        <!--<el-tab-pane label="耗材" name="耗材"></el-tab-pane>-->
        <el-table stripe :data="goodsTableData" border style="width: 100%" height="200" ref="multipleTable"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
          <el-table-column label="设备名称" prop="matTypeName"></el-table-column>
          <el-table-column label="设备型号" prop="matModelName"></el-table-column>
          <el-table-column label="供应商" prop="supplierName"></el-table-column>

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
        multipleSelection: [],
        goodsLabel: '设备',
        goodsTableData: [],
        dialogVisible: false,
        tableData: [],
        column: [
          {
            prop: 'materialType',
            label: '设备类型',
            width: 180,
            options: this.lookUpOptions('station.materialType')
          },
          {
            prop: 'materialName',
            label: '设备名称'
          },
          {
            prop: 'deviceType',
            label: '设备型号'
          },
          {
            prop: 'saleTerminalCode',
            label: '设备序列号'
          }
        ]
      }
    },
     created() {
      this.getGoodsList()
      this.tableData = this.item.value ? this.item.value : []
      this.mainProp = this.item.field.split(',')[0]
      this.mainTitle = this.item.title.split(',')[0]
      this.emitEvent()
    },
    methods: {
      stationCodeChange() {
        let stationCodeMap = this.tableData.map(d => d.stationCode)
        let stationCodeSet = Array.from(new Set(stationCodeMap))
        if(stationCodeMap.length > stationCodeSet.length) {
          this.$message.warning('投注设备终端编号不能重复')
        }
        this.emitEvent()
      },
      emitEvent() {
        this.$set(this.form, this.mainProp, this.tableData)
        this.$emit('terminalDeviceListValueBack', this.form)
      },
      storeGoodsAdd() {
        console.log('增加')
        let arr = JSON.parse(JSON.stringify(this.tableData))
        arr.push({
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
        // console.log('获取编号item', item, item.$index)
        this.dialogVisible = true
        this.multipleSelection = []
        setTimeout(() => {
          this.$refs.multipleTable.clearSelection()
        }, 100)
        this.activeIndex = item.$index
      },

      // 选择设备名称
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
      // 获取设备列表信息
      async getGoodsList() {
        let res = await this.$api.terminalPage()
        if (res && res.code === 0) {
          this.goodsTableData = res.data.list
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
    }
  }
</script>
<style lang="less" >

</style>
