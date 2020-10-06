import { getRoutes } from '@/frontend/public/utils/common'

const routes = [
  {
    path: '/home',
    redirect: '/home/logManage'
  }
]

export default routes.concat(getRoutes(require.context('./', false, /\.js$/), './index.js'))
