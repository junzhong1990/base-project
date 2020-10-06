<template>
  <div class="checkboxRadio">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" v-if="checkboxOrRadio == 'checkbox' && checkAllFlag">全选</el-checkbox>
    <el-checkbox-group :disabled="disabled" class="crBox" v-model="checkGroup" v-if="checkboxOrRadio == 'checkbox'" @change="handleCheckedCitiesChange">
      <el-checkbox :label="item.value" :key="key" v-for="(item, key) in detailList">{{item.text}}</el-checkbox>
    </el-checkbox-group>
    <el-radio-group v-model="radioResult" v-if="checkboxOrRadio == 'radio'">
      <el-radio :label="item.value" :key="key" v-for="(item, key) in detailList">{{item.text}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    name: 'checkboxRadio',
    props: {
      checkboxOrRadio: { // 多选框 checkbox    单选框 radio
        type: String,
        default: 'checkbox'
      },
      detailList: { //  对象数组， value name
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否禁用
      disabled: {
        type: [Boolean, String],
        default: false
      },
      // 是否有全选
      checkAllFlag: {
        type: [Boolean, String],
        default: false
      },
    },
    watch: {
      checkGroup(val) {
        this.$emit('checkboxRadioResult', val.join(','))
      },
      radioResult(val) {
        this.$emit('checkboxRadioResult', val)
      }
    },
    data() {
      return {
        checkAll: false,
        isIndeterminate: false,
        checkGroup: [],
        radioResult: ''
      }
    },
    methods: {
      handleCheckAllChange(val) {
        let allChecked = []
        this.detailList.forEach((val, i) => {
          allChecked.push(val.value)
        })
        this.checkGroup = val ? allChecked : []
        console.log(val)
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        console.log('handleCheckedCitiesChange', value)
        let allChecked = []
        this.detailList.forEach((val, i) => {
          allChecked.push(val.value)
        })
        let checkedCount = value.length
        this.checkAll = checkedCount === allChecked.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < allChecked.length
      },
      // 清除功能
      clear() {
        this.checkGroup = []
        this.radioResult = ''
        this.$emit('checkboxRadioResult', '')
      },
    }
  }

</script>
<style lang="less">

</style>
