import Vue from 'vue'

/* eslint-disable */
const glDialog = Vue.component('gl-dialog', {
  functional: true,
  render (h, self) {
    self.props.width = self.props.width || '360px'
    if (typeof self.props.width === 'number') {
      if (self.props.width > 1) {
        let width = self.props.width * 212 + (self.props.width - 1) * 8 + 48
        self.props.width = `${width > 1200 ? 1200 : width}px`
      } else {
        self.props.width = '360px'
      }
    }
    if (self.props.hasOwnProperty('view')) {
      self.props.customClass = 'gl-dialog-dynamic'
    }
    let directives = self.data.directives || []
    self.data.directives = [...directives, { name: 'drag' }]
    let onClose = self.listeners.close
    let $on = {
      close: () => {
        // 关闭时发送事件：解绑动态组件，解决再次打开时数据缓存的问题
        if (self.listeners['update:view']) {
          self.listeners['update:view'](null)
        }
        if (onClose) {
          onClose()
        }
      }
    }
    self.data.on = { ...self.data.on, ...self.listeners, ...$on }
    self.data.attrs = { ...self.data.attrs, ...self.props }
    return h(
      'el-dialog',
      self.data,
      self.children && self.children.map(t => {
        if (t.data && t.data.attrs) {
          t.data.attrs = { ...t.data.attrs, ...(t.componentOptions && t.componentOptions.propsData) }
        }
        if (t.data && t.data.on === undefined) {
          t.data.on = t.data.on || (t.componentOptions && t.componentOptions.listeners)
        }
        return h(
          (t.componentOptions && t.componentOptions.tag) || t.tag,
          t.data,
          t.children || (t.componentOptions && t.componentOptions.children)
        )
      })
    )
  }
})

export default glDialog
