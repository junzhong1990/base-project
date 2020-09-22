import '@babel/polyfill'
import Vue from 'vue'
import xss from 'xss'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/'
import ElementUI from 'element-ui'
import '@/assets/scss/element-variables.scss'
import '@/assets/less/app.less'
import '@/assets/less/common.less'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import i18n from '@/components/i18n'
import rules from '@/utils/rules'
import storage from '@/utils/storage'
import dataEnum from '@/utils/dataEnum' // 数据枚举
import common from '@/utils/common' // 通用处理方法
import mixins from '@/utils/mixins' // 全局mixins
import '@/assets/icon' // 图标库

import AreaTree from '@/components/common/areaCascader/AreaTree'
// import BaseForm from '@/components/common/baseForm/baseForm'
import CommonCascader from '@/components/common/commonCascader/CommonCascader'
import CommonSelect from '@/components/common/commonSelect/CommonSelect'
import QueryForm from './components/common/queryForm/queryForm'
import TablePage from '@/components/common/table/TablePage'
import TableBody from '@/components/common/table/TableBody'
import DetailBox from '@/components/common/detailList/DetailBox'
import DetailList from '@/components/common/detailList/DetailList'
import AreaCascader from '@/components/common/areaCascader/AreaCascader'
import CheckboxRadio from '@/components/common/checkboxRadio/CheckboxRadio'
import Chart from '@/components/common/chart/Chart'
import AreauserSelect from '@/components/common/areauserSelect/AreauserSelect'
import SvgStep from '@/components/common/svgStep/SvgStep'
import ModalUpload from '@/components/common/upload/ModalUpload'
import ConfirmUpload from '@/components/common/upload/ConfirmUpload'
import StationSelect from '@/components/common/stationSelect/StationSelect'

import glStore from '@/frontend/public/components'
Vue.use(glStore)

// Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.mixin(mixins) // 注册全局mixins

Vue.config.productionTip = false
Vue.prototype.$api = api // 请求接口
Vue.prototype.$rules = rules
Vue.prototype.$dataEnum = dataEnum // 通用枚举
Vue.prototype.$common = common // 通用方法
Vue.prototype.eventBus = new Vue()
Vue.prototype.$ELEMENT = { size: 'middle' }

Vue.component('AreaTree', AreaTree) // 区域树
Vue.component('CommonCascader', CommonCascader) // 下拉级联选择
Vue.component('CommonSelect', CommonSelect) // 模态框选择
Vue.component('QueryForm', QueryForm) // 查询列表
Vue.component('TablePage', TablePage) // 列表页组件
Vue.component('TableBody', TableBody) // 列表内容区
Vue.component('DetailList', DetailList) // 详情外壳
Vue.component('DetailBox', DetailBox) // 详情外壳
Vue.component('AreaCascader', AreaCascader) // 区域选择级联
Vue.component('CheckboxRadio', CheckboxRadio) // 多选 单选 组件
Vue.component('Chart', Chart) // echarts组件
Vue.component('AreauserSelect', AreauserSelect) // 区域用户选择
Vue.component('SvgStep', SvgStep) // svg流程步骤图
// Vue.component('BaseForm', BaseForm) // 动态表单
Vue.component('ModalUpload', ModalUpload) // 带弹出框的附加上传
Vue.component('ConfirmUpload', ConfirmUpload) // 图片上传
Vue.component('StationSelect', StationSelect) // 站点选择组件

Object.defineProperty(Vue.prototype, '$xss', {
  value: xss,
})

// 防重复点击-自定义指令
Vue.directive('prevent', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 1000)
      }
    })
  },
})

// 按钮权限-自定义指令
Vue.directive('has', {
  inserted: function(el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el)
    }
    function permissionJudge(value) {
      // 此处this.$storage.get('menuBtnList')代表storage中储存的按钮菜单数据
      const list = storage.get('menuBtnList')
      for (const item of list) {
        if (item.permission === value) {
          return true
        }
      }
      return false
    }
  },
})

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')
