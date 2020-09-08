<template>
  <div>
    <el-input
      type="textarea"
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      @input="change">
    </el-input>
    <div v-if="showCount" style="position:relative;height:0;top:-30px;text-align:right;right:20px;color:#bfbfbf">
      <span style="color:#333">{{(value || '').length}}</span>
      /{{$attrs.maxlength}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    showCount: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    change (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
