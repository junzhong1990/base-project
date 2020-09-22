// 游戏开发者

// 测试
const instrumenPanel = () => import('@/views/instrumenPanel/instrumenPanel')

export default [
  /* 示例说明 */
  // {
  //   path: 'demo',
  //   name: 'demo',
  //   component: demo,
  //   meta: {
  //     parentName: '', // 当左侧菜单匹配不到当前路由时(菜单无对应激活状态),请设置该属性值(菜单可激活的父级路由名称)
  //     title: '路由说明'
  //   }
  // },

  /* 仪表盘 */
  {
    path: 'instrumenPanel',
    name: 'instrumenPanel',
    meta: {
      title: '仪表盘',
    },
    component: instrumenPanel,
  },

  /* 默认路由转发 */
  { path: '/home/instrumenPanel', redirect: '/home/instrumenPanel' },
]
