<template>
  <div>
    <!-- { label: '网点标签', value: 'stationLabels' }, -->
    <div class="station-labels">
      <span class="label-name"
        v-for="(item , i) in stationLabels"
        :key="i">
        {{item.label}}
      </span>
      <el-button class="add-label el-icon-plus" v-if="!item.readOnly" @click="addLabel"></el-button>
    </div>
    <el-dialog
      :visible.sync="visible"
      width="60%"
      title="网点标签"
      class="station-labels-dialog"
    >
      <el-table
        ref="aTable"
        :data="tableData"
        @selection-change="selectionResult"
        maxHeight="300"
        style="width: 100%">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column prop="label" label="标签名"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" @click="sureSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      defualt: () => ({})
    }
  },
  data() {
    return {
      stationLabels: [],
      visible: false,
      tableData: [],
      selectLabels: []
    }
  },
  mounted() {
    this.getStationLabels()
  },
  methods: {
    // 获取标签
    async getStationLabels() {
      let res = await this.$api.getSelectInputDatas()
      if (res && res.code === 0) {
        if (Array.isArray(this.item.value) && this.item.value.length) {
          this.stationLabels = res.data.filter(v => this.item.value.includes(v.value))
        } else {
          this.stationLabels = res.data.slice(0, 5)
          this.$emit('stationLabelsBack', {
            [this.item.field]: this.stationLabels.map(v => v.value)
          })
        }
      }
    },
    // 获取列表信息
    async getLabelList() {
      const res = await this.$api.getSelectInputDatas()
      if (res && res.code === 0) {
        this.tableData = res.data
        const values = this.stationLabels.map(v => v.value)
        this.$nextTick(() => {
          this.tableData.forEach(row => {
            if (values.includes(row.value)) {
              this.$refs.aTable.toggleRowSelection(row)
            }
          })
        })
      }
    },
    addLabel() {
      this.visible = true
      this.getLabelList()
    },
    selectionResult(val) {
      this.selectLabels = val
    },
    sureSubmit() {
      this.visible = false
      this.stationLabels = this.selectLabels.slice(0, 5)
      this.$emit('stationLabelsBack', {
        [this.item.field]: this.stationLabels.map(v => v.value)
      })
    }
  }
}
</script>
<style lang="less">
.station-labels {
  min-width: 600px;
  .label-name,
  .add-label {
    box-sizing: border-box;
    display: inline-block;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    margin: 3px 5px;
    border: 1px solid rgba(203, 211, 220, 1);
    text-align: center;
    border-radius: 2px;
    // box-shadow: 1px 1px 5px #888888;
    cursor: default;
  }
  .add-label {
    width: 50px;
    color: rgba(40, 46, 67, 1);
    cursor: pointer;
  }
}
.station-labels-dialog{
  .el-table{
    th,
    td{
      padding: 0;
    }
  }
  .el-dialog__header{
    line-height: 20px;
  }
}
</style>
