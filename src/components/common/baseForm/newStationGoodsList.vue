<template>
  <div>

    <el-form-item :label="mainTitle" :prop="item.readOnly ? '' : item.prop">
      <!-- 900px -->
      <div style="width: 830px;">
        <el-table
            :data="tableData">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column
              prop="matName"
              label="物品名称">
            <template slot-scope="scope">
              <el-input :disabled="item.readOnly?item.readOnly:false" v-model.number="scope.row.matName" placeholder="请选择物品" @focus="showGoodsList(scope)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              prop="matModel"
              label="物品型号">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商">
          </el-table-column>
          <el-table-column
              prop="deviceCount"
              label="数量"
              width="180">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.deviceCount" placeholder="请输入数量" maxlength="9" :disabled="item.readOnly?item.readOnly:false" @change="emitEvent"></el-input>
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
      <el-button  type="primary" size="medium" @click="storeGoodsAdd" :disabled="item.readOnly?item.readOnly:false">增加</el-button>
      <el-button size="medium" @click="storeGoodsMi" :disabled="item.readOnly?item.readOnly:false">减少</el-button>
    </div>
    <!--选择物品名称--弹窗-->
    <el-dialog title="提示(只能选择一种类型)" :visible.sync="dialogVisible" width="80%">
      <el-tabs v-model="goodsLabel" class="_blue-header" type="border-card" >
        <el-tab-pane label="设备" name="设备"></el-tab-pane>
        <!--<el-tab-pane label="耗材" name="耗材"></el-tab-pane>-->

        <TablePage :showPagination="false">
          <!--顶部按钮组-->

          <!--查询条件-->
          <div slot="query">
            <QueryForm ref="query_form"
                       :queryApiCode="searchApi"
                       :itemList="itemList"
                       @tableData="getTableData"
                       >
            </QueryForm>
          </div>
          <!--表格-->
          <div slot="TableSlot">
            <!--带操作按钮的列表-->
            <el-table stripe :data="goodsTableData" border style="width: 100%" height="200" ref="multipleTable"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
              <el-table-column label="物品名称" prop="matName"></el-table-column>
              <el-table-column label="物品型号" prop="matModel" ></el-table-column>
              <el-table-column label="计量单位" prop="matTypeUnit">
                <template slot-scope="scope">
                  <lastUnit :matTypeUnit="scope.row.matTypeUnit"></lastUnit>
                </template>
              </el-table-column>
              <el-table-column label="成本单价" prop="costPrice"></el-table-column>
              <el-table-column label="供应商" prop="supplierName"></el-table-column>

              <el-table-column label="是否标配" prop="standardStatus">
                <template slot-scope="scope">

                  {{ lookup(scope.row.standardStatusDic, scope.row.standardStatus) || '否' }}
                </template>
              </el-table-column>

            </el-table>

          </div>
        </TablePage>


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
        itemList: [
          {
            label: '物品名称',
            value: 'matName',
            type: 'text',
            disable: false
          },
          {
            label: '物品型号',
            value: 'matModel',
            type: 'text',
            disable: false
          },
          {
            label: '是否标配',
            value: 'standardStatus',
            type: 'select',
            options: this.lookUpOptions('yesOrNo')
          }
        ],
        searchApi: {
          apiCode: 'getMaterialList'
        },
        mainProp: '',
        mainTitle: '',
        arr: [], // 对应级别转换率数组
        stepArr: [], // 一条数据，每一级转化成最小单位
        form: {},
        activeIndex: 0,
        multipleSelection: [],
        goodsLabel: '设备',
        goodsTableData: [],
        dialogVisible: false,
        tableData: [],
        column: [
          {
            prop: 'materialType',
            label: '物品名称',
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

      /* 获取列表信息 */
      getTableData(val) {

        this.goodsTableData = val

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
        // console.log('获取编号item', item, item.$index)
        this.dialogVisible = true
        this.multipleSelection = []
        setTimeout(() => {
          this.$refs.multipleTable.clearSelection()
        }, 100)
        this.activeIndex = item.$index
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
        console.log('多选的值', val)
        this.multipleSelection = val
      },
    },
    beforeMount() {
    },
    created() {
      this.tableData = this.item.value ? this.item.value : []
      this.mainProp = this.item.field.split(',')[0]
      this.mainTitle = this.item.title.split(',')[0]
      this.emitEvent()
    },
    async mounted() {
      console.log(this.$route.path)
    }
  }
</script>
<style lang="less" scoped>

</style>
