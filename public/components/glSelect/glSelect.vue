<template>
  <el-select
    v-bind="$attrs"
    v-on="$listeners"
    :value="value">
      <el-option
        v-for="item in options"
        :key="item[valueKey]"
        :value="item[valueKey]"
        :label="formatLabel ? formatLabel(item) : item[labelKey]"
        :disabled="item.disabled">
      </el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'glSelect',
    props: {
      value: {
        type: [String, Number, Array]
      },
      options: {
        type: Array,
        default: () => ([])
      },
      formatLabel: {
        type: Function
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      labelKey: {
        type: String,
        default: 'label'
      }
    }
  }
</script>
