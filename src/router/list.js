import children from './entry'
const home = () => import(/* webpackChunkName: "home" */ '@/views/home/home')
const login = () => import(/* webpackChunkName: "login" */ '@/views/login/login')
const entry = () => import(/* webpackChunkName: "entry" */ '@/views/entry/entry')
const locking = () => import(/* webpackChunkName: "locking" */ '@/views/locking/locking')
// const iconList = () => import(/* webpackChunkName: "iconList" */ '@/views/homePage/icons/index')



export default [
  {
    path: '/',
    redirect: {
      path: '/login',
    },
  },
  {
    path: '/home',
    component: home,
    children,
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/entry',
    name: 'entry',
    component: entry,
  },
  {
    path: '/locking',
    name: 'locking',
    component: locking,
  },
  // {
  //   path: '/icons',
  //   name: 'icons',
  //   component: iconList
  // },
  // {
  //   path: '/formDemo',
  //   name: 'formDemo',
  //   component: formDemo
  // },
  // {
  //   path: '/gameCreate',
  //   name: 'gameCreate',
  //   component: gameCreate
  // }
]
