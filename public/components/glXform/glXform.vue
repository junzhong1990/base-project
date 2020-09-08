<template>
  <div class="x-form-main">
    <el-form
      v-bind="$attrs"
      v-on="$listeners"
      :model="formData"
      :rules="formRules"
      :label-width="`${labelWidth}px`"
      v-on:update:model="update"
      ref="xform"
    >
    <div v-for="(classify, key) in classifications" :key="key" v-slideToggle="activeHide" :name="key">
      <h3 class="x-block-title x-form-title content_title" name="slideToggleHandle" v-if="classify">
        <div>
          {{classify}}
          <slot :name="key + '-title'"></slot>
        </div>
        <div>
          <slot :name="key + '-rightTools'"></slot>
        </div>
      </h3>
      <div name="slideToggleWrap">
        <slot :name="key + '-header'"></slot>
        <el-row>
          <el-col
            v-for="(item, index) in $attrs[key]"
            :key="index"
            :span="item.span || colSpan"
            :style="item.colStyle"
            v-show="setShow(item, formData[index])"
          >
            <el-form-item
              :style="formItemStyle"
              :prop="index"
              :label-width="`${item.labelWidth || labelWidth}px`"
              :label="typeof item.label === 'string' ? item.label : ''"
              :class="item.className"
            >
              <!-- label组件 -->
              <component
                slot="label"
                v-if="typeof item.label === 'object'"
                :is="item.label.tag || 'x-label'"
                :value="filter(item.label, item.label.value)"
                @input="labelChange(item.label, $event, index)"
                v-bind="item.label.$attrs"
                v-on="item.label.$on"
                :disabled="item.label.disabled"
              >
                <template v-if="item.label.options">
                  <el-option
                    v-for="(option, index) in getOptions(item.label.options)"
                    :key="index"
                    v-bind="item.label.optionAttrs"
                    v-on="item.label.optionOn"
                    :label="option.label"
                    :value="option.value">
                  </el-option>
                </template>
              </component>
              <!-- 输入框组件 -->
              <component
                v-if="item.type"
                :is="getComponent(item)"
                :value="filter(item, formData[index])"
                @input="inputChange(index, $event, item.getter)"
                v-bind="item.$attrs"
                v-on="item.$on"
                :disabled="setDisabled(item, formData)"
                :placeholder="setPlaceholder(item)"
                :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
                >
                <template v-if="item.type === 'select' && (item.options)">
                  <el-option
                    v-for="(option, index) in getOptions(item.options)"
                    :key="index"
                    v-bind="item.optionAttrs"
                    v-on="item.optionOn"
                    :label="option.label"
                    :value="option.value">
                  </el-option>
                </template>
              </component>
              <!-- 自定义slot -->
              <slot v-else-if="item.slot" :name="item.slot" :item="item"></slot>
              <!-- 自定义render -->
              <Render v-else-if="item.render" :render="item.render" :data="formData"></Render>
              <!-- 详情展示 -->
              <div v-else>
                {{ item.format ? item.format(formData, index) : filter(item, formData[index]) }}
              </div>
              <!-- 在输入框后添加元素 -->
              <template v-if="item.children">
                <template v-for="(col, index) in item.children">
                  <component
                    :key="index"
                    v-if="col.type"
                    class="form-item-after"
                    :is="getComponent(col)"
                    :value="filter(col, formData[index])"
                    @input="inputChange(index, $event, col.getter)"
                    v-bind="col.$attrs"
                    v-on="col.$on"
                    :disabled="setDisabled(col, formData)"
                    :placeholder="setPlaceholder(item)"
                    >
                  </component>
                  <Render v-else-if="col.render" :render="col.render" :data="formData" :key="index"></Render>
                </template>
              </template>
            </el-form-item>
          </el-col>
          <!-- 查询按钮 -->
          <el-col
            v-if="$attrs.button"
            :span="$attrs.button.span || colSpan"
            style="margin-left:24px">
            <el-button
              :type="$attrs.button.type || 'primary'"
              @click="$attrs.button.func"
              v-bind="$attrs.button.$attrs"
              v-on="$attrs.button.$on">
              {{$attrs.button.label}}
            </el-button>
          </el-col>
          <!-- 提交、重置 -->
          <el-col
            v-if="$attrs.buttons"
            :span="$attrs.buttons[0].span || colSpan"
            :style="{'margin-left':`${labelWidth}px`}">
            <el-button
              v-for="(item, index) in $attrs.buttons"
              :key="index"
              :size="item.size || 'medium'"
              :type="item.type"
              @click="item.func"
              v-bind="item.$attrs"
              v-on="item.$on">
              {{item.label}}
            </el-button>
          </el-col>
          <slot name="form-button"></slot>
        </el-row>
      </div>
      <slot :name="key + '-footer'"></slot>
    </div>
    </el-form>
  </div>
</template>
<script>
import { registerComponent } from './common/utils'
// 自定义组件注册
import componentConfig from './common/register-component'
import directives from './common/directive'
export default (() => ({
  name: 'glXform',
  registerComponent,
  mixins: [componentConfig, directives],
  props: {
    // 表单分类
    classifications: {
      type: Object,
      default: () => ({data: ''})
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    formItemStyle: {
      type: Object,
      default: () => ({})
    },
    // 表单的label宽度
    labelWidth: {
      type: [Number, String],
      default () {
        return 80
      }
    },
    activeHide: {
      type: Object,
      default: () => ({})
    },
    // 表单的布局
    colSpan: {
      type: Number,
      default () {
        return 24
      }
    }
  },
  data () {
    const form = this.getForm()
    return {
      formRules: form.rules,
      formData: Object.assign({}, form.data, this.value),
    }
  },
  watch: {
    value: {
      handler (newVal) {
        let data = JSON.parse(JSON.stringify(newVal))
        this.clearValidate()
        this.formData = { ...this.formData, ...data }
        let rules = this.getForm().rules
        Object.keys(rules).forEach(key => {
          if (this.formRules[key] !== rules[key]) {
            this.$set(this.formRules, key, rules[key])
          }
        })
        Object.keys(this.formRules).forEach(key => {
          if (!rules[key]) this.$delete(this.formRules, key)
        })
      },
      deep: true
    },
  },
  methods: {
    getOptions (option) {
      if (Array.isArray(option)) {
        return option
      } else {
        return [{label: '', value: ''}]
      }
    },
    getForm() {
      let data = {}
      let rules = {}
      Object.keys(this.classifications).forEach((key) => {
        Object.entries(this.$attrs[key]).forEach(([k, v]) => {
          data[k] = v.value || ''
          if (v.rules) {
            rules[k] = typeof v.rules === 'function' ? v.rules() : v.rules
          }
        })
      })
      return {
        data,
        rules
      }
    },
    getForms () {
      return this.$refs.xform
    },
    // 清除校验
    clearValidate () {
      this.getForms().clearValidate()
    },
    // 重置
    resetFields () { // 重置
      this.getForms().resetFields()
    },
    // 校验
    async validate (callback) {
      let result = false
      try {
        await this.getForms().validate()
        result = this.formData
      } catch (e) {
        result = false
      }
      if (typeof callback === 'function') callback(result)
      return result
    },
    filter (item, val) {
      if (item.filter) {
        return this.$filter[item.filter](val)
      }
      return val
    },
    update (value = {}) {
      this.formData = value
      this.$emit('input', value)
      this.$emit('change', value)
    },
    labelChange (label, value, key) {
      label.value = value
      if (label.$on && label.$on.change && typeof label.$on.change === 'function') {
        label.$on.change(value, key, label)
      }
    },
    inputChange (key, value, getter) {
      let val = value
      if (typeof getter === 'function') {
        let n = getter(value, this.formData[key])
        if (n !== undefined) {
          this.$nextTick(() => {
            this.updateFormData(key, n)
            this.$emit('input', this.formData)
          })
        }
      }
      this.updateFormData(key, val)
      this.$emit('input', this.formData)
    },
    updateFormData (key, value) {
      this.$set(this.formData, key, value)
    },
    setDisabled (col, data) {
      if (col.disabled && typeof col.disabled === 'function') {
        return col.disabled(data)
      }
      return !!col.disabled
    },
    setShow (col, data) {
      if (col.show && typeof col.show === 'function') {
        return col.show(data)
      }
      if (!col.hasOwnProperty('show')) {
        return true
      }
      return !!col.show
    },
    setPlaceholder (col) {
      if (col.$attrs && col.$attrs.hasOwnProperty('placeholder')) {
        return col.$attrs.placeholder
      }
      return {
        select: `请选择${col.label}`,
        input: `请输入${col.label}`,
        number: `请输入${col.label}`
      }[col.type] || ''
    }
  }
}))()
</script>
<style lang="less" scoped>
.x-form-main {
  .x-form-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  // /deep/ .el-form-item__label {
  //   display: inline-flex;
  //   align-items: center;
  //   justify-content: flex-end;
  //   height: 28px;
  //   line-height: 14px;
  //   padding-right: 4px;
  //   font-size: 12px;
  //   color: #333;
  // }
  /deep/ .el-form-item__content{
    position: relative;
  }
  .el-select{
    width: 100%;
  }
  .el-button--default{
    margin-left: 24px;
  }
  .form-item-after{
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
