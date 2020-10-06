<template>
  <div class="check-box-all">
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <div class="margin-div"></div>
    <el-checkbox-group v-model="checkedItems" @change="handleCheckedItemsChange">
      <el-checkbox
        v-for="arrItem in allArr"
        :label="arrItem.value"
        :key="arrItem.value"
      >{{arrItem.label || arrItem.text}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'CheckAll',
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
      options: [],
      checkAll: false,
      checkedItems: [],
      optionsValueArr: [],
      allArr: [],
      isIndeterminate: false
    }
  },
  watch: {
    item: {
      handler(newValue, oldValue) {
        // console.log('监听 item', newValue, oldValue)
        if (this.item.options) {
          this.allArr = this.item.options
          this.optionsValueArr = this.allArr.map((option) => option.value)
        }
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    }
  },
  created() {
    this.options = this.item.options
    console.log('this.item', this.item)
    console.log('this.options', this.options)
  },
  methods: {
    valueBack() {
      let obj = {}
      obj[this.item.prop] = this.checkedItems.join(',')
      this.$emit('checkAllValueBack', obj)
    },
    handleCheckAllChange(val) {
      this.checkedItems = val ? this.optionsValueArr : []
      this.isIndeterminate = false
      this.valueBack()
    },
    handleCheckedItemsChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.optionsValueArr.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.optionsValueArr.length
      console.log('checkedItems', this.checkedItems)
      this.valueBack()
    }
  }
}
</script>

<style lang="less" scoped>
.check-box-all {
  display: flex;
  justify-content: flex-start;
  .margin-div {
    margin-left: 10px;
  }
}
</style>
