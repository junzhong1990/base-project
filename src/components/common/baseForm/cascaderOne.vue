<template>
  <div class="select1-div">
    <el-cascader
        v-if="item.type=='cascader'"
        v-model="form[mainProp]"
        :value="item.value"
        :options="item.options"
        :props="item.setProps"
        :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
        :disabled="item.readOnly"
        @change="change"
    ></el-cascader>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'SelectLinkage',
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
        arr: [],
        mainProp: '',
        subProp: '',
        form: {},
        subData: [],
        sourceDataSubObject: {}
      }
    },
    watch: {
      firstStageValue(val) {

      }
    },
    methods: {
      findLable(arr, id) {
        arr.forEach((val, i) => {
          if (val.value == id) {
            this.form[this.subProp] = val.label
            this.$emit('cascaderVauleBack', this.form)
            return val.label
          } else {
            if (val.children && val.children.length > 0) {
              this.findLable(val.children, id)
            }
          }
        })
      },
      change(selectItem) {
        console.log(this.item)
        console.log(selectItem)
        this.$set(this.form, this.mainProp, selectItem[selectItem.length - 1])
        this.findLable(this.item.options, selectItem[selectItem.length - 1])
      }
    },
    async mounted() {
      console.log(this.item)
      if (this.item.value) {
        // this.form[this.mainProp] = this.item.value
        console.log(this.item.options)
        console.log(this.item.value)
      }
    },
    created() {
      this.arr = []
      if (this.item.field.indexOf(',') != -1) {
        this.mainProp = this.item.field.split(',')[0]
      } else {
        this.mainProp = this.item.field
      }
      this.subProp = this.item.field.split(',')[1]
      // if (this.item.value) {
      //   this.findLable(this.item.options, this.item.value)
      // }
      console.log(88888888888888)
      console.log(this.item.field)
      console.log(this.form)
      console.log(this.mainProp)
      console.log(this.subProp)
    }
  }
</script>

<style lang="less">

</style>
