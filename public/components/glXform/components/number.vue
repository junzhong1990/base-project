<template>
  <el-input :value="value"
            ref="xNumber"
            :step="currentStep"
            class="x-number"
            :type="getType()"
            :clearable="clearable"
            onmousewheel="return false"
            onkeypress="return (/[\d|\-|+|.]/.test(String.fromCharCode(event.keyCode || event.which)))"
            :maxlength="maxlength"
            :minlength="minlength"
            :disabled="disabled"
            :placeholder="disabled ? '' : placeholder"
            v-bind="$attrs"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange">
    <template v-if="symbol"
              slot="prepend">
      {{symbol}}
    </template>
    <template v-if="unit"
              slot="append">
      {{unit}}
    </template>
  </el-input>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'x-number',
    props: {
      value: [String, Number],
      symbol: String,
      unit: String,
      min: Number,
      max: Number,
      precision: Number,
      step: Number,
      minlength: Number,
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请输入数字'
      },
      clearable: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      maxlength () {
        return this.$attrs.maxlength || 15
      },
      currentStep () {
        let step = 1
        if (this.step) {
          step = this.step
        } else {
          if (this.precision) {
            step = '0.' + '0'.repeat(this.precision - 1) + '1'
          }
        }
        return step
      }
    },
    methods: {
      getType () {
        return String(this.value).includes('****') ? 'text' : 'number'
      },
      focus () {
        this.$refs.xNumber.focus()
      },
      handleChange (val) {
        let num = this.format(val)
        this.$emit('input', num)
        this.$emit('change', num)
      },
      handleBlur (e) {
        let val = e.target.value
        if (val === '') {
          this.handleChange('')
        }
        this.$emit('blur', e)
      },
      handleFocus (e) {
        this.$emit('focus', e)
      },
      handleInput (e) {
        this.$emit('input', e)
        this.$emit('change', e)
      },
      format (val) {
        let num = ''
        if (val && !isNaN(Number(val))) {
          num = Number(val)
          if (this.max !== undefined && num >= this.max) {
            num = this.max
          }
          if (this.min !== undefined && num <= this.min) {
            num = this.min
          }
          if (this.precision !== undefined) {
            num = num.toFixed(this.precision)
          }
        }
        if (num === this.value) {
          this.$refs.xNumber.currentValue = num
        }
        if (num === '') {
          this.$refs.xNumber.currentValue = ' '
          this.$nextTick(_ => {
            this.$refs.xNumber.currentValue = num
          })
        }
        return num
      }
    }
  }
</script>

<style lang="less">
  .x-number {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }
    .el-input__inner {
      line-height: 12px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 8px;
    }
  }
</style>
