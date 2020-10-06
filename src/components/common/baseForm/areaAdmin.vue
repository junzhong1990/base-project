<template>
  <div>
    <el-form-item label="区域" :prop="mainProp">
      <CommonCascader
          :item="item"
          :select_any_level_flag="false"
          :qryObj="qryObjArea"
          :stage="3"
          ref="commonCascader"
          :res="form[mainProp]"
          @areaVauleBack="componentValueSet"
          :disabled="item.readOnly?item.readOnly:false"
      ></CommonCascader>
    </el-form-item>
    <el-form-item label="区域经理" prop="applyNo">
      <el-select
          v-model="form.adminId"
          :placeholder="'请选择区域经理'"
          :disabled="item.readOnly?item.readOnly:false"

      >
        <el-option
            v-for="(items,index) in adminList"
            :key="index"
            :label="items.label"
            @click.native="changeSelectMain(items)"
            :value="items.value"
            :disabled="items.disabled"
        ></el-option>
      </el-select>
    </el-form-item>

  </div>
</template>
<script>
  export default {
    components: {
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
        adminDisabled: true,
        adminList: [],
        qryObjArea: {
          apiCode: 'sysRegion',
          content: {
            status: 1
          }
        },
        mainProp: '',
        subProp: '',
        form: {
          adminId: '',
          adminName: ''
        },
        subData: [],
        sourceDataSubObject: {}
      }
    },
    created() {
      this.mainProp = this.item.field.split(',')[0]
      this.subProp = this.item.field.split(',')[1]
      if (this.item.towItemValueObj) {
        this.form = this.item.towItemValueObj
      }
      this.eventBus.$on('areaAdminChange', (allForm) => {
        this.$set(this.form, 'adminId', allForm.adminId)
        this.$set(this.form, 'adminName', allForm.adminName)
        this.$set(this.form, 'regionName' , allForm.regionName)
        this.$set(this.form, this.mainProp , allForm[this.mainProp])
        this.$set(this.form, this.subProp, allForm[this.subProp])
        console.log(this.form)
        this.$emit('areaAdminValueBack', this.form)
      })
    },
    methods: {
      async componentValueSet(form) {
        console.log(form)
        this.form[this.mainProp] = form[this.mainProp]
        // this.form[this.subProp] = form[this.subProp]
        this.$set(this.form, 'regionName' , form[this.subProp])
        await this.getAdminList(form[this.mainProp])
        console.log('this.adminList', this.adminList)
        let indexNowSelected =  this.adminList.findIndex(a => a.value === this.form.adminId)
        console.log('indexNowSelectedadminList', indexNowSelected)

        if (indexNowSelected < 0) {
          this.form.adminName = ''
          this.form.adminId = ''
        }
        this.$emit('areaAdminValueBack', this.form)
      },
      changeSelectMain(selectItem,) {
        this.form.adminName = selectItem.label
        console.log(this.form)
        this.$emit('areaAdminValueBack', this.form)
      },
      async getAdminList(val) {
        if (!val) return
        let data = {
          subAreaCode: val
        }
        let res = await this.$api.getAreaManagerBySubArea({ data })
        if (res && res.code == 0) {
          this.adminList = res.data
        }
      },
    }
  }
</script>
<style lang="less" scoped>

</style>
