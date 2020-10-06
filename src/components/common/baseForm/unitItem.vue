<template>
  <div style="display: inline-block">
    <span>
      <el-input
        v-model.number="number"
        placeholder
        style="width: 50px;"
        :disabled="disabled"
        @blur="numChange"
      ></el-input>
      <em style="font-style: normal;padding: 0 3px;">{{unitItem.matTypeUnit}}</em>
    </span>
    <span v-if="unitItem.child && JSON.stringify(unitItem.child) != '{}'">
      <unit-item :unitItem="unitItem.child" :tableIndex="tableIndex" :disabled="disabled"></unit-item>
    </span>
  </div>
</template>
<script>
export default {
  name: 'unitItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    tableIndex: {
      type: Number,
      default: 0
    },
    firstStage: {
      type: Boolean,
      default: false
    },
    unitItem: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    number(val) {
      let backItem = Object.assign({}, this.unitItem, { matAmount: val })
      this.eventBus.$emit('unitItem', backItem, this.tableIndex)
    }
  },
  data() {
    return {
      number: ''
    }
  },
  async mounted() {
    this.number = this.unitItem.matAmount
  },
  methods: {
    numChange(val) {
      console.log(this.number)
      const test = /(^[0-9]\d*$)/.test(this.number) ? true : false
      console.log(test)
      if (!test) {
        this.$message.warning('数量只能为数字')
        this.number = 0
      }
    }
  }
}
</script>