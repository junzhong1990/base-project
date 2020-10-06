// 系统日志列表
const logManage = () => import(/* webpackChunkName: "logManage" */ '@/views/cms/logManage/logManage')

export default [
  {
    path: 'logManage',
    name: 'logManage',
    meta: {
      title: '操作日志',
    },
    component: logManage
  }
]
