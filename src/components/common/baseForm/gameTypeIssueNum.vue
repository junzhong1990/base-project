<template>
  <!--注销票专用
根据游戏类型获取游戏期号，只有在发起流程的时候使用
处理的话不要用这个组件，用 select 和 input 组件

类型：游戏类型
编码：gameId
数据类型：调用接口
/api/v1/station/station/queryGameType
  -->

  <div class>
    <el-form-item
      :label="mainTitle"
      :prop="item.readOnly ? '' : item.prop"
      :class="{'siding':item.type=='minMax'}"
    >
      <el-select
        :filterable="item.filterable"
        :disabled="item.readOnly"
        v-model="form[mainProp]"
        :placeholder="item.placeholder?`${item.placeholder}`:`请选择${mainTitle}`"
        :class="item.class"
        clearable
        @change="selectChange"
      >
        <el-option
          v-for="(items,index) in item.options"
          :key="index"
          :label="items.label"
          :value="items.value"
          :disabled="items.disabled"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      :label="subTitle"
      :prop="item.readOnly ? '' : subProp"
      :class="{'siding':item.type=='minMax'}"
    >
      <el-input
        disabled
        v-model="form[subProp]"
        placeholder="根据游戏类型自动获取"
        :maxlength="item.maxlength"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'gameTypeIssueNum',
  components: {},
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
      form: {}
    }
  },
  watch: {},
  methods: {
    async selectChange(val) {
      console.log('值变化', val)
      // 值为空的时候如何处理
      if (val === '') {
        this.form.issueNum = ''
      } else {
        let data = {
          gameId: this.form[this.mainProp]
        }
        let res = await this.$api.queryGameIssue({ data })
        if (res && res.code == 0) {
          this.$set(this.form, 'issueNum', res.data)
        }
      }

      this.$emit('gameTypeIssueNumValueBack', this.form)
    }
  },
  async mounted() {},
  created() {
    this.mainProp = this.item.field.split(',')[0]
    this.subProp = this.item.field.split(',')[1]

    this.mainTitle = this.item.title
    this.subTitle = '游戏期号'
  }
}
</script>

<style lang="less">
</style>
