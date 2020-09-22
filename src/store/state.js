import storage from '@/utils/storage'
import { getUserInfo } from '@/utils/userCache'

const state = {
  dicStore: {},
  isFull: false,
  // 用户已登录数据
  loginInfo: getUserInfo() || {
    name: 'admin',
    userName: 'admin',
    mobile: '15422211123',
    account: 'admin',
    lastLoginTime: '2020-02-20',
    loginIp: '2020-02-20',
    avatar: require('@/assets/img/avatar.jpg'),
  },
  // 模块入口数据
  entry: {
    title: '业务管理3',
    extendAttach: 'businessManage'
  },
  routerTags: storage.session.get('routerTags') || [], // 路由标签列表
  fsMode: { index: 1, className: 'fs-b' }, // storage.get('fsMode') || {index: 1, className: 'fs-m'}, // 网页字体大小 0=>小 1=>中 2=>大
  rechargeList: [],
  menuData: null, // 菜单数据
  entryList: [], // 面板数据
  // 统计分析系统右上角区域切换所存储的区域对象
  dssArea: {},
  // 统计分析收藏夹内容
  dssMenu: {},
  // 统计分析收藏夹里面页面的参数
  dssPageParam: {},
  // 资源管理里面的资源名字，用于统计分析收藏夹页面跳转,获取的是当前页面还没解析过的 resourceCode
  dssResourceCode: '',
}

export default state
