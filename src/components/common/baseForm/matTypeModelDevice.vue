<template>
  <div>
    <!-- { label: '设备类型与型号联动', value: 'matTypeModelDevice' }, -->
    <el-form-item label="设备类型" :prop="mainProp">
      <el-select
        v-model="form[mainProp]"
        :disabled="item.readOnly">
          <el-option
            v-for="(col,index) in options[mainProp]"
            :key="index"
            :label="col.label"
            @click.native="changeType(col)"
            :value="col.value"
            :disabled="col.disabled"
          ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备型号" :prop="subProp">
      <el-select
        v-model="form[subProp]"
        :disabled="item.readOnly">
          <el-option
            v-for="(col,index) in options[subProp]"
            :key="index"
            :label="col.label"
            @click.native="changeModel(col)"
            :value="col.value"
            :disabled="col.disabled"
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
      mainProp: '',
      subProp: '',
      form: {},
      options: {}
    }
  },
  created() {
    let fields = this.item.field.split(',')
    console.log(this.item)
    this.mainProp = fields[0]
    this.subProp = fields[1]
    this.$set(this.options, this.mainProp, [])
    this.$set(this.options, this.subProp, [])
    this.$set(this.form, this.mainProp, this.item.towItemValueObj[this.mainProp] || '')
    this.$emit('matTypeModelDeviceBack', this.form)
  },
  async mounted() {
    this.queryMatTypeDevice()
    if (this.item.towItemValueObj[this.mainProp]) {
      await this.queryMatModelDevice()
      this.$set(this.form, this.subProp, this.item.towItemValueObj[this.subProp] || '')
      this.$emit('matTypeModelDeviceBack', this.form)
    }
  },
  methods: {
    changeType() {
      this.$set(this.form, this.subProp, null)
      this.$emit('matTypeModelDeviceBack', this.form)
      this.queryMatModelDevice()
    },
    changeModel() {
      this.$emit('matTypeModelDeviceBack', this.form)
    },
    async queryMatTypeDevice() {
      const res = await this.$api.queryMatTypeDeviceParam({})
      if (res && res.code === 0) {
        this.options[this.mainProp] = res.data
      }
    },
    async queryMatModelDevice() {
      const res = await this.$api.queryMatModelDeviceParam({data: {
        matTypeId: this.form[this.mainProp]
      }})
      if (res && res.code === 0) {
        this.options[this.subProp] = res.data
      }
    }
  }
}
</script>
