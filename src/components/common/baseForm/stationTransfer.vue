<template>
<!--转让流程专用
第一个是下拉框，下拉框如果是 no 的话出现必须选择框
是否原址转让字段，如果是否的话出现转让后地址这个必选input框,

站点原址转让联动框：
选择这个表单的时候 类型编码 需要填两个值:stationTransfer,address，
类型名称也要填两个:是否原址转让,转让后地址
-->

  <div class="">


    <el-form-item
      :label="mainTitle"
      :prop="item.readOnly ? '' : item.prop"
      :class="{'siding':item.type=='minMax'}"
    >
      <el-select
        :filterable="item.filterable"
        :disabled="item.readOnly"
        v-model="form[mainProp]"
        :placeholder="`请选择${mainTitle}`"
        :class="item.class"
      >
        <el-option
          v-for="(items,index) in item.options"
          :key="index"
          :label="items.label"
          @click.native="changeSelectMain()"
          :value="items.value"
          :disabled="items.disabled"
        ></el-option>
      </el-select>
    </el-form-item>


    <el-form-item
      :label="subTitle"
      :prop="item.readOnly ? '' : subProp"
      :class="{'siding':item.type=='minMax'}"
      v-if="showInput"

    >
      <el-input
        :disabled="item.readOnly"
        v-model="form[subProp]"
        :placeholder="`请输入${subTitle}`"
        :maxlength="item.maxlength"
        @blur="getValue"

      ></el-input>
    </el-form-item>

  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'stationTransfer',
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
        mainTitle: '',
        subTitle: '',
        mainProp: '',
        subProp: '',
        form: {},
        showInput: false,
      }
    },
    watch: {
      firstStageValue(val) {

      }
    },
    methods: {
      getValue() {
        console.log(' this.form',  this.form)
        this.$emit('stationTransferValueBack', this.form)
      },
      changeSelectMain() {
        this.$emit('stationTransferValueBack', this.form)
        if (this.form[this.mainProp] === 'no') {
          this.showInput = true
          let backRule = {}
          backRule[this.subProp] = {
            message: `${this.subTitle}不能为空`,
            required: true,
            trigger: ['blur']
          }
          this.$emit('setRules', 'add', backRule)
        } else {
          this.showInput = false
          this.$emit('setRules', 'delete', this.subProp)
        }

      },

    },
    async mounted() {

    },
    created() {
      console.log('this.item.prop', this.item, this.item.field)
      this.mainProp = this.item.field.split(',')[0]
      this.subProp = this.item.field.split(',')[1]

      this.mainTitle = this.item.title.split(',')[0]
      this.subTitle = this.item.title.split(',')[1]
      if (this.item.towItemValueObj) {
        this.form = this.item.towItemValueObj
        this.changeSelectMain()
      }
    }
  }
</script>

<style lang="less">

</style>
