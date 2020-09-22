/**
 * @desc 导入所有路由文件
 * */
import instrumenPanel from './instrumenPanel'
import cms from './cms'

const mergeRoutes = (...args) => {
  return [].concat(...args)
}

export default mergeRoutes(
  instrumenPanel,
  cms
)
