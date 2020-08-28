/**
 * @desc 重写Clickoutside指令
 * */ 

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick = void 0
let seed = 0

const on = (function() {
  return function(element, event, handler) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false)
    }
  }
})()

on(document, 'mousedown', e => (startClick = e))

// 判断是否有ctx
on(document, 'mouseup', e => {
  nodeList.forEach(node => {
    node[ctx] && node[ctx].documentHandler(e, startClick)
  })
})

// 是否在特殊限定范围内
function ifInExact (exactElms, target1, taget2) {
  for (let i = 0; i < exactElms.length; i++) {
    let elm = exactElms[i]
    if (elm.contains(target1) || elm.contains(taget2) || elm === target1) return true
  }
  return false
}

// 是否有特殊限定范围
function ifHasExact (exactArea) {
  if (!exactArea) return false
  return document.getElementsByClassName(exactArea)
}

function createDocumentHandler(el, binding, vnode) {
  return function (mouseup = {}, mousedown = {}) {
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
      (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))) return
    
    // 如果是有特殊限定范围的，则进行判断当前点击是否在 限定范围内
    const exactElms = ifHasExact(el[ctx].exactArea)
    if (exactElms && ifInExact(exactElms, mouseup.target, mousedown.target)) return

    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName](mouseup.target)
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

export default {
  bind(el, binding, vnode) {
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
      exactArea: el.getAttribute('exact')
    }
  },
  update(el, binding, vnode) {
    // 更新时如果没有ctx，补上ctx
    if (!el[ctx]) {
      const id = seed++
      el[ctx] = {
        id,
        documentHandler: createDocumentHandler(el, binding, vnode),
        methodName: binding.expression,
        bindingFn: binding.value,
        exactArea: el.getAttribute('exact')
      }
    }
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
    el[ctx].exactArea = el.getAttribute('exact')
  },
  unbind(el) {
    let len = nodeList.length
    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx] && nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}
