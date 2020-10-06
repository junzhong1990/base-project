/**
 * @desc 导入所有路由文件
 * */
import cms from './cms'

const mergeRoutes = (...args) => {
  return [].concat(...args)
}

export default mergeRoutes(
  cms
)
