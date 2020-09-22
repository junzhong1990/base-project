<template>
<!--  双下拉框的暂时不支持数据来源是 url 的格式-->
  <!--  流程表单设置的时候类型编码要用,隔开-->
<!--  如果是数据源是固定的，格式如下-->
<!--  [{"label":"自助","value":"zizhu","subOptions":[{"label":"手持机","value":"shouchiji"},{"label":"普通","value":"putong"}]},{"label":"快开","value":"kuaikai","subOptions":[{"label":"中福店中店","value":"dianzhongdian"},{"label":"普通","value":"putong"}]},{"label":"便利","value":"bianli","subOptions":[{"label":"中福店中店","value":"dianzhongdian"},{"label":"手持机","value":"shouchiji"}]}]-->
<!--如果来源是数据字典-->
<!--  那么数据字典的 value 必须是其对应的另外一个数据字典值-->
  <div class="select2-div">
    <el-select
      :filterable="item.filterable"
      :disabled="item.readOnly"
      v-model="form[mainProp]"
      :placeholder="item.placeholder?`${item.placeholder}`:`请选择${item.title}`"
      :class="item.class"
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
    <el-select
      :filterable="item.filterable"
      :disabled="!form[mainProp] || item.readOnly"
      v-model="form[subProp]"
      :placeholder="item.placeholder?`${item.placeholder}`:`请选择`"
      :class="item.class"
    >
      <el-option
        v-for="(items,index) in subData"
        :key="index"
        :label="items.label"
        @click.native="changeSelect(items)"
        :value="items.value"
        :disabled="items.disabled"
      ></el-option>
    </el-select>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'selectTwo',
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
      changeSelectMain(selectItem,) {
        console.log('主值变化', selectItem)
        console.log('selectItem.value', selectItem.value)
        console.log('this.form[this.mainProp]', this.form[this.mainProp])

        this.$set(this.form, this.subProp, '')

        if (this.item.source === 'fixed') {

          this.subData = this.sourceDataSubObject[this.form[this.mainProp]]
        } else if (this.item.source === 'key') {
          this.subData = this.$store.state.dicStore[this.form[this.mainProp]]

        }
      },
      changeSelect(selectItem) {
        console.log('负值变化', selectItem)
        console.log('form', this.form)
        this.$emit('selectTwoVauleBack', this.form)
      },
    },
    async mounted() {

    },
    created() {
      this.mainProp = this.item.field.split(',')[0]
      this.subProp = this.item.field.split(',')[1]

      console.log('selectTwo 里面的 created', this.item)

      console.log('this.subData', this.subData)
      if (this.item.towItemValueObj) {
        this.form = this.item.towItemValueObj
      }
      // "[{"label":"固定数据","value":"fixed"},{"label":"数据字典","value":"key"},{"label":"调用接口","value":"url"}]"

      if (this.item.source === 'fixed') {
        this.item.options.forEach((obj) => {
          this.sourceDataSubObject[obj.value] = obj.subOptions
        })
        this.subData = this.sourceDataSubObject[this.form[this.mainProp]]
      } else if (this.item.source === 'key') {
        this.subData = this.$store.state.dicStore[this.form[this.mainProp]]

      }

    }
  }
</script>

<style lang="less">
  .select2-div {
    display: flex;
    justify-content: space-between;
  }
</style>
