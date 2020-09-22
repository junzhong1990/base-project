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
        firstOne: false,
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
    methods: {
      componentValueSet(form) {
        this.form[this.mainProp] = form[this.mainProp]
        this.form[this.subProp] = form[this.subProp]
        this.form.adminName = ''
        this.getAdminList(form[this.mainProp])
        if (this.firstOne) {
          this.form.adminId = ''
          this.form.adminName = ''
          this.firstOne = true
        }
        console.log(this.form)
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
    },
    beforeMount() {

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
        this.$set(this.form, this.mainProp , allForm[this.mainProp])
        this.$set(this.form, this.subProp, allForm[this.subProp])
        console.log(this.form)
        this.$emit('areaAdminValueBack', this.form)
      })
    },
    async mounted() {

    }
  }
</script>
<style lang="less" scoped>

</style>
