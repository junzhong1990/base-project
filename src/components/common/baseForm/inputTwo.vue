<template>
  <!--  流程表单设置的时候类型编码要用,隔开-->
  <div class="input-two">
    <el-input
      :disabled="item.type === 'inputTwoLngLat' ? true : (item.readOnly?item.readOnly:false)"
      v-model="form[mainProp]"
      :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
      :maxlength="item.maxlength"
      @blur="getValue"
    ></el-input>
    <el-input
      :disabled="item.type === 'inputTwoLngLat' ? true : (item.readOnly?item.readOnly:false)"
      v-model="form[subProp]"
      :placeholder="item.placeholder?`${item.placeholder}`:`请输入${item.title}`"
      :maxlength="item.maxlength"
      @blur="getValue"
    ></el-input>
    <div class="mapBtn" v-if="item.type === 'inputTwoLngLat'">
      <el-button
        type="primary"
        @click="lngLatFlag = true"
        :disabled="item.readOnly?item.readOnly:false"
      >坐标标注</el-button>
    </div>
    <el-dialog
      :visible.sync="lngLatFlag"
      width="70%"
      height="50%"
      class="prc"
      title="坐标标注"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="mapBox">
        <LngLat @setPoint="setPoint"></LngLat>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="lngLatFlag = false">取消</el-button>
        <el-button type="primary" @click="pointSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LngLat from './LngLat'
export default {
  name: 'inputTwo',
  components: {
    LngLat
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
      lngLatFlag: false,
      mainProp: '',
      subProp: '',
      form: {},
      lnglatArr: []
    }
  },
  created() {
    console.log(this.item)
    this.mainProp = this.item.field.split(',')[0]
    this.subProp = this.item.field.split(',')[1]
    if (this.item.towItemValueObj) {
      this.form = this.item.towItemValueObj
    }
    this.$emit('inputTwoValueBack', this.form)
    this.eventBus.$on('lnglat', (lng, lat) => {
      console.log(lng)
      this.$set(this.form, this.mainProp, lng)
      this.$set(this.form, this.subProp, lat)
    })
  },
  methods: {
    setPoint(arr) {
      console.log(arr)
      this.lnglatArr = arr
    },
    pointSave() {
      if (this.lnglatArr.length == 0) return
      this.form[this.mainProp] = this.lnglatArr[0] + ''
      this.form[this.subProp] = this.lnglatArr[1] + ''
      this.getValue()
      this.lngLatFlag = false
    },
    getValue(selectItem) {
      this.$emit('inputTwoValueBack', this.form)
    }
  }
}
</script>

<style lang="less" scoped>
.input-two {
  display: flex;
  justify-content: space-around;
  .mapBtn {
    padding-left: 10px;
  }
}
</style>
