<!--
设备名称，设备型号，终端编号，供应商，游戏，押金，折旧费


新增终端 - 设备名称、设备型号、供应商从仓库管理系统获取，押金、折旧费手动输入，为整数，单位为元，游戏下拉框选择
撤销设备
-->
<template>
  <div class="revokeTerminalListDiv">
    <el-form-item :label="mainTitle" :prop="item.readOnly ? '' : item.prop">
      <!-- 900px -->
      <div style="width: 830px;">
        <el-table
          border stripe
          :data="tableData"
          ref="multipleTable"
          :class="{'hideCheckAll': item.readOnly}"

          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="seletableFunc" ></el-table-column>
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column
            prop="matTypeName"
            label="设备名称"
            width="132">
          </el-table-column>
          <el-table-column
            prop="matModel"
            label="设备型号">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商">
          </el-table-column>
          <el-table-column
            prop="terminalStationCode"
            label="终端编号"
            width="150">
          </el-table-column>
          <el-table-column
            prop="deposit"
            label="押金(元)"
            width="100">
          </el-table-column>
          <el-table-column
            prop="depreciationFee"
            label="折旧费(元)"
            width="100">
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>



  </div>
</template>
<script>
  export default {

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
        form: {},
        multipleSelection: [],
        tableData: [],
      }
    },
    computed: {},
    methods: {
      seletableFunc() {
        return !(this.item.readOnly?this.item.readOnly:false)
      },
      async getTerminalList(sCode) {
        if (!sCode) return
        let data = {
          stationCode: sCode
        }
        let res = await this.$api.queryStationExtByMasterStationCode({ data })
        if (res && res.code == 0) {
          this.tableData = res.data
        }
      },
      emitEvent() {
        this.$set(this.form, this.mainProp, this.multipleSelection)
        this.$emit('revokeTerminalListValueBack', this.form)
      },

      // checkbox 多选事件
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.emitEvent()
      },
    },
    async mounted() {
      // 根据传回来的 stationCode 获取列表
      let sCode = this.item.otherAllData ? this.item.otherAllData : ''
      await this.getTerminalList(sCode)
      if (this.item.value) {
        console.log('列表勾选')
        let rows = this.item.value
        if (rows) {
          rows.forEach(row => {
            let index = this.tableData.findIndex(d => d.terminalStationCode === row.terminalStationCode)
            this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
          });
        }

      }
    },
    async created() {
      this.eventBus.$off('stationCodeBack')
      this.eventBus.$on('stationCodeBack', (stationCode) => {
        console.log('站点权限列表监听到站点变化', stationCode)
        this.getTerminalList(stationCode)
      })

      this.mainProp = this.item.field.split(',')[0]
      this.mainTitle = this.item.title.split(',')[0]
      this.emitEvent()
    },

  }
</script>
<style lang="less">
  .revokeTerminalListDiv {
    .el-table.hideCheckAll thead label.el-checkbox.el-checkbox{//找到表头那一行，然后把里面的复选框隐藏掉
      display:none !important
    }
  }

</style>
