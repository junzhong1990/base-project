<template>
  <div ref="editor"></div>
</template>
<script>
  import defaultMenus from './defaultMenus'
  export default {
    name: 'glEditor',
    props: {
      value: String,
      menus: {
        type: Array,
        default: () => (defaultMenus)
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      value (val, old) {
        if (val !== old) {
          this.editor.txt.html(val)
        }
      },
      disabled (val) {
        this.editor.$textElem.attr('contenteditable', !val)
      }
    },
    methods: {
      init () {
        import(/* webpackChunkName: "public-wangeditor" */ 'wangeditor').then(E => {
          this.editor = new E.default(this.$refs.editor)
          this.editor.customConfig.menus = this.menus
          this.editor.customConfig.onchange = (html) => {
            this.$emit('input', html)
          }
          this.editor.create()
          this.editor.$textElem.attr('contenteditable', !this.disabled)
          this.editor.txt.html(this.value)
        })
      }
    }
  }
</script>
