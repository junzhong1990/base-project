import { getRoutes } from '@/utils/common'

const routes = [
  {
    path: '/home/instrumenPanel',
    // redirect: '/home/instrumenPanel',
  },
]

export default routes.concat(getRoutes(require.context('./', false, /\.js$/), './index.js'))
