import { version } from 'element-ui'
import * as filters from '../utils/filter'
import bus from '../utils/bus'
import rules from '../utils/rules'
import directives from '../directives'

import '../assets/less/index.less'

// 全局组件
// import './glDialog'
// import './glButton'

const getComponents = modulesFiles => {
  return modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    if (moduleName.split('/')[0] === value.default.name) {
      modules.push(value.default)
    }
    return modules
  }, [])
}

const components = getComponents(require.context('./', true, /.vue$/))

const setPrototype = (Vue) => {
  Vue.prototype.$bus = bus
  Vue.prototype.$rule = rules
  Vue.prototype.$filter = Object.keys(filters).reduce((s, key) => {
    Vue.filter(key, filters[key])
    s[key] = filters[key]
    return s
  }, {})

  Object.assign(Vue.prototype.$ELEMENT, { version })
}

const setDirective = (Vue) => {
  Object.keys(directives).forEach(v => Vue.directive(v, directives[v]))
}

const install = function (Vue) {
  window.$version = {
    vue: Vue.version,
    ele: version
  }
  components.filter(v => typeof v !== 'function').forEach(v => Vue.component(v.name, v))
  setPrototype(Vue)
  setDirective(Vue)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}


export default install
