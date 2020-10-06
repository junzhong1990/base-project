// 开发者须知
const devNeedKnow = () => import(/* webpackChunkName: "devNeedKnow" */ '@/views/cms/helpFiles/devNeedKnow')


export default [
  {
    path: 'devNeedKnow',
    name: 'devNeedKnow',
    meta: {
      title: '操作日志',
    },
    component: devNeedKnow
  }
]
