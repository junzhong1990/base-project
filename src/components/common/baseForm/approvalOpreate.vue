<template>
  <div>
    <el-form-item label="审批通过" prop="isAgree" :rules="agreeRule">
      <el-radio-group 
        v-model="form.isAgree"
        :disabled="item.readOnly"
        @change="changeRadio">
          <el-radio
            v-for="(item,index) in lookUpOptions('processApprovalOperation')"
            :key="index"
            :label="item.value">
            {{item.label}}
          </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="!form.isAgree"
      label="回退步骤"
      :prop="subProp">
      <el-select
        v-model="form[subProp]"
        :disabled="item.readOnly"
        @change="changeSelectData">
          <el-option
            v-for="(item,index) in item.options"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
      </el-select>
    </el-form-item>
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
      subProp: '',
      form: {
        isAgree: 1
      },
      agreeRule: []
    }
  },
  created() {
    this.subProp = this.item.field
    this.$set(this.form, this.subProp, '')
    this.eventBus.$on('approvalOpreateChange', data => {
      if (data.hasOwnProperty('isAgree')) {
        this.form.isAgree = +data.isAgree
      }
      // this.$set(this.form, this.subProp, data[this.subProp])
      this.$emit('approvalOpreateValueBack', this.form)
    })
  },
  mounted() {
    if (this.item.required) {
      this.agreeRule = [{ required: true, message: '请选择审批通过', trigger: ['blur', 'change'] }]
    }
  },
  methods: {
    changeRadio() {
      if (this.form.isAgree) {
        this.$set(this.form, this.subProp, '')
      }
      this.$emit('approvalOpreateValueBack', this.form)
    },
    changeSelectData() {
      this.$emit('approvalOpreateValueBack', this.form)
    }
  }
}
</script>
