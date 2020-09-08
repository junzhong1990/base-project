export default {
  functional: true,
  props: {
    value: [String]
  },
  render (h, self) {
    return h(
      'span',
      Object.assign({
        class: 'x-label-click',
        domProps: {
          innerHTML: self.props.value
        }
      }, self.data),
      self.children,
    )
  }
}
