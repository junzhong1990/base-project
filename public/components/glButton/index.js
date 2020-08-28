import Vue from 'vue'
// import store from '@/store'

// const auths = store.getters.auths || []

const auths = [
  '001',
  '002'
]

const glButton = Vue.component('gl-button', {
  functional: true,
  props: {
    auth: String
  },
  render (h, self) {
    const { attrs } = self.data
    if (attrs && self.props.auth) {
      attrs.auth = self.props.auth
      attrs.disabled = !auths.includes(self.props.auth) || attrs.disabled
    }
    return h('el-button', self.data, self.children)
  }
})

export default glButton
