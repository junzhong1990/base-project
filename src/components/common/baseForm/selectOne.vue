<template>
  <!--  流程表单设置的时候类型编码要用,隔开-->
  <!--  如果是数据源是固定的，格式如下-->
  <!--  [{"label":"自助","value":"zizhu"},{"label":"普通","value":"putong"}]-->
  <!--如果来源是数据字典-->
  <!--  那么数据字典的 value 必须是其对应的另外一个数据字典值-->
  <div class="select-one">
    <el-select
      :filterable="item.filterable"
      :disabled="item.readOnly"
      v-model="form[mainProp]"
      :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
      :class="item.class"
      :key="keyNum"
    >
      <el-option
        v-for="(items,index) in item.options"
        :key="index"
        :label="items.label"
        @click.native="changeSelectMain(items)"
        :value="items.value"
        :disabled="items.disabled"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    allForm: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      keyNum: 1,
      mainProp: '',
      subProp: '',
      form: {},
      subData: [],
      sourceDataSubObject: {}
    }
  },
  watch: {
    allForm: {
      handler(newValue, oldValue) {
        let obj = JSON.parse(JSON.stringify(newValue))
        this.$set(this.form, this.mainProp + '', obj[this.mainProp])
        this.keyNum++
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    }
  },
  created() {
    if (this.item.field.indexOf(',') != -1) {
      this.mainProp = this.item.field.split(',')[0]
    } else {
      this.mainProp = this.item.field
    }
    this.subProp = this.item.field.split(',')[1]
    if (this.item.value) {
      // console.log(23232323232332)
      this.form[this.mainProp] = this.item.value
      this.$emit('selectVauleBack', this.form, this.mainProp)
    } else {
      this.form[this.mainProp] = ''
    }
  },
  methods: {
    changeSelectMain(selectItem) {
      if (this.item.field.indexOf(',') != -1) {
        this.$set(this.form, this.subProp, selectItem.label)
      }
      if (this.item.source === 'fixed') {
        this.subData = this.sourceDataSubObject[this.form[this.mainProp]]
      } else if (this.item.source === 'key') {
        this.subData = this.$store.state.dicStore[this.form[this.mainProp]]
      }
      this.$emit('selectVauleBack', this.form, this.mainProp)
    }
  }
}
</script>

<style lang="less">
</style>
