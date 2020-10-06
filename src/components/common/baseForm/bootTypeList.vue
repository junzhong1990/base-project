<template>
  <!--  停开机流程-停机方式切换-->
  <div>
    <el-form-item label="停机方式" :prop="item.readOnly ? '' : item.prop">
      <el-select
        :filterable="item.filterable"
        :disabled="item.readOnly"
        v-model="form[item.prop]"
        :placeholder="`请选择停机方式`"
        :class="item.class"
      >
        <el-option
          v-for="(items,index) in typeOptions"
          :key="index"
          :label="items.label"
          @click.native="changeSelectMain(item)"
          :value="items.value"
          :disabled="items.disabled"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="stationType" label="网点编号" prop="stationCode">
      <!-- 加载网点 -->
      <el-select
        v-model="form.stationCode"
        filterable
        remote
        :remote-method="getStationList"
        @change="queryStationInfo($event)"
      >
        <el-option
          v-for="(station, index) in stationList"
          :value="station.stationCode"
          :key="index"
          :label="station.stationCode"
        >{{station.stationCode}}-{{$common.getLabel($store.state.dicStore[station.stationStatusDic], station.stationStatus)}}-{{station.stationOwner}}</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="负责人" v-if="stationType">
      <el-input disabled v-model="form.principal"></el-input>
    </el-form-item>
    <el-form-item label="投注站地址" v-if="stationType">
      <el-input disabled v-model="form.stationAddress"></el-input>
    </el-form-item>
    <el-form-item label="投注站电话" v-if="stationType">
      <el-input disabled v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="可用余额下限" v-if="stationType">
      <el-input disabled v-model="form.accountLimit"></el-input>
    </el-form-item>
    <el-form-item label="代销费率" v-if="stationType">
      <el-table :data="form.stationPermissionInfoVos" style="width: 100%">
        <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column label="游戏" prop="gameName"></el-table-column>
        <el-table-column label="代销费率" prop="gameCommissionFee">
          <template slot-scope="scope">{{ (scope.row.gameCommissionFee * 100).toFixed(2) + '%' }}</template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="网点导入" v-if="!stationType">
      <ModalUpload
        :showTemp="true"
        :showComments="false"
        :downloadOpts="downloadOpts"
        :btnName="'导入'"
        :backIds="form.fileId + ''"
        :uploadApi="'stationBootOrStopImport'"
        @uploadResult="uploadResult"
        :type="['xls','xlsx']"
        :disabled="item.readOnly?item.readOnly:false"
      >
        <div slot="warnTxt">
          <p>提示：附件个数不能超过1个</p>
          <p>类型：可用文件格式 xls、 xlsx其中的一种</p>
        </div>
      </ModalUpload>
    </el-form-item>
  </div>
</template>

<script>
import ImporExcel from '@/components/common/upload/ImportExcel'

export default {
  name: 'bootTypeList',
  components: {
    ImporExcel
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
      downloadOpts: {
        apiCode: 'downloadBootTemplate',
        fileName: '停开机站点列表导入模板'
      },
      stationList: [],
      form: {
        fileId: ''
      },
      typeOptions: [
        { label: '按网点', value: 'stationCode' },
        { label: '批量导入', value: 'batchImport' }
      ]
    }
  },
  computed: {
    stationType() {
      return this.form[this.item.prop] === 'stationCode'
    }
  },
  created() {
    this.$set(this.form, this.item.prop, 'stationCode')
    Object.assign(this.form, this.item.otherAllData)
    console.log('this.form', this.form)
    this.$emit('bootTypeListValueBack', this.form)
  },
  methods: {
    uploadResult(rst) {
      this.$message.closeAll()
      if (!rst.stationCodes && rst.fileId) {
        this.$message.warning('网点编号无效')
      } else if (rst.msg) {
        this.$message.success(rst.msg)
      }
      console.log('rst', rst)
      // this.form.fileId = val.split(',')
      if (rst) {
        console.log('rst有值')
        Object.assign(this.form, rst)
        this.$emit('bootTypeListValueBack', this.form)
      }
    },

    // 根据网点编号查询网点所有信息
    async queryStationInfo(val) {
      if (!val) return
      let data = {
        stationCode: val
      }
      let res = await this.$api.getStationBaseInfoByCode({ data })

      if (res && res.code === 0) {
        let resData = res.data
        this.$set(this.form, 'principal', resData.principal)
        this.$set(this.form, 'stationAddress', resData.stationAddress)
        this.$set(this.form, 'phone', resData.phone)
        this.$set(this.form, 'accountLimit', resData.accountLimit)
        this.$set(
          this.form,
          'stationPermissionInfoVos',
          resData.stationPermissionInfoVos
        )
        this.$emit('bootTypeListValueBack', this.form)
      }
    },
    // 获取网点类型列表
    async getStationList(sCode) {
      if (!sCode) return
      let data = {
        stationCode: sCode
      }
      let res = await this.$api.queryStationCode({ data })
      if (res && res.code == 0) {
        // console.log(res)
        this.stationList = res.data
      }
    },

    changeSelectMain() {
      console.log('this.form', this.form)

      this.$emit('bootTypeListValueBack', this.form)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
