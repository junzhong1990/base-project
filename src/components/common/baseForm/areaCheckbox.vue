<template>
  <div class="areaCheckbox">
    <!-- 输入域-->
    <el-input
      v-model="form[subProp]"
      type="textarea"
      :maxlength="item.maxlength?item.maxlength:'500'"
      disabled
      :autosize="{ minRows: 1, maxRows: 1}"
      :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
    ></el-input>
    <div>
      <AreaTree
        ref="areaTree"
        @result="areaResult"
        :defaultCheckArr="form[mainProp].split(',')"
        :disabled="item.readOnly"
      ></AreaTree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'areaCheckbox',
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
      mainProp: '',
      subProp: '',
      form: {}
    }
  },
  created() {
    if (this.item.field.indexOf(',') != -1) {
      this.mainProp = this.item.field.split(',')[0]
    } else {
      this.mainProp = this.item.field
    }
    this.subProp = this.item.field.split(',')[1]
    if (this.item.towItemValueObj) {
      this.form = this.item.towItemValueObj
      this.$emit('areaCheckboxVauleBack', this.form)
    } else {
      this.form[this.mainProp] = ''
    }
  },
  async mounted() {
    this.eventBus.$on('areaCheckboxChange', (allForm) => {
      this.$set(this.form, 'isAllCity', allForm.isAllCity)
      this.$set(this.form, 'regionCodes', allForm.regionCodes)
      this.$set(this.form, 'regionNames', allForm.regionNames)
      this.$emit('areaCheckboxVauleBack', this.form)
    })
  },
  methods: {
    async areaResult(regionCode) {
      console.log(regionCode)
      console.log(this.$refs.areaTree.selectDataArr)
      // 营销活动，加如有重庆，isAllCity为1  否则为0  加个字段
      if (regionCode.split(',').includes('50')) {
        this.$set(this.form, 'isAllCity', 1)
      } else {
        this.$set(this.form, 'isAllCity', 0)
      }
      let arr = []
      this.$refs.areaTree.selectDataArr.forEach((val, i) => {
        arr.push(val.name)
      })
      this.$set(this.form, this.mainProp, regionCode)
      this.$set(this.form, this.subProp, arr.join(','))
      this.$emit('areaCheckboxVauleBack', this.form)
    }
  }
}
</script>

<style lang="less">
</style>
