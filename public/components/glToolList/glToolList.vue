<template>
  <div class="gl-tool-list" :style="wrapStyle">
    <template
      v-for="(btn, i) in tools">
      <el-checkbox
        v-if="btn.type === 'checkbox'"
        :key="btn.label+i"
        :class="activeBtn === btn.label ? 'el-button--text is-active' : 'el-button--text'"
        :checked="typeof btn.default === 'function' ? btn.default() : btn.default"
        :disabled="btnDisabled(btn.disabled)"
        @change="val => otherClick(val, btn)">{{ btn.label }}
      </el-checkbox>
      <el-dropdown
        v-else-if="btn.type === 'menu'"
        :key="btn.label+i"
        :class="activeBtn === btn.label ? 'el-button--text is-active' : 'el-button--text'"
        :disabled="btnDisabled(btn.disabled)"
        :trigger="btn.trigger || 'click'"
        placement="bottom-start"
        @command="val => otherClick(val, btn)">
        <el-button :type="btn.type" icon="el-icon-arrow-down">
          {{btn.label}}
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(opt, j) in btn.options"
            :key="opt.key+j"
            :command="opt"
            :disabled="btnDisabled(btn.disabled)">{{opt.label}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-select
        v-else-if="btn.type === 'select'"
        v-model="modelOption[btn.prop]"
        :key="btn.label+i"
        :style="btn.style || {width:'150px'}"
        @change="val => otherClick(val, btn)">
          <el-option
            v-for="opt in btn.options"
            :value="opt.value"
            :key="opt.value"
            :label="opt.label">
          </el-option>
        </el-select>
      <el-button
        v-else
        :key="btn.label+i"
        :type="btn.type"
        :size="btn.size"
        :class="activeBtn === btn.label ? 'is-active' : ''"
        :icon="iconClass(btn)"
        :disabled="btnDisabled(btn.disabled)"
        @click="btnClick(btn)">{{btn.label}}
      </el-button>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'glToolList',
    props: {
      tools: Array,
      wrapStyle: Object,
      active: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        modelOption: {},
        activeBtn: ''
      }
    },
    created () {
      this.initProps()
    },
    watch: {
      tools () {
        this.initProps()
      }
    },
    methods: {
      initProps () {
        if (this.tools && this.tools.length) {
          this.tools.forEach(v => {
            if (!v.hasOwnProperty('show')) {
              v.show = true
            }
            if (v.type === 'select') {
              this.$set(this.modelOption, v.prop, v.defaultValue)
            }
          })
        }
      },
      btnDisabled (disabled) {
        return (typeof disabled === 'function') ? disabled() : !!disabled
      },
      iconClass (btn) {
        let cls = (typeof btn.class === 'function') ? btn.class() : (btn.class || '')
        let icon = btn.icon ? (/^icon\w+\s+icon-/.test(btn.icon) ? btn.icon : 'el-icon-' + btn.icon) : ''
        return `${cls} ${icon}`
      },
      btnClick (btn) {
        if (btn.type === 'link') {
          let route = (typeof btn.func === 'function') ? btn.func(btn) : btn.func
          this.$router.push(route)
        } else {
          btn.func && btn.func(btn)
        }
        if (this.active) {
          this.activeBtn = btn.label
        }
      },
      otherClick (val, btn) {
        btn.func && btn.func(val, btn)
        if (this.active) {
          this.activeBtn = btn.label
        }
      },
      clearActiveBtn () {
        this.activeBtn = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .gl-tool-list {
    display: inline-block;
    // height: 28px;
    // max-height: 28px;
    /deep/ .el-checkbox {
      // line-height: 28px;
      padding: 0 12px;
    }
    .el-button + .el-button{
      margin-left: 0;
    }
    .el-button{
      margin-right: 24px;
    }
    .is-active {
      color: #57a3f3;
      border-color: #f1f1f5;
      background-color: #f1f1f5;
    }
    // /deep/ .el-input{
    //   font-size: 12px !important;
    // }
  }
</style>
