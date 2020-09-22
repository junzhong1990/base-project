// 引入各个模块接口
import homePage from './modules/homePage'
import cms from './cms'

// 合并接口
const mergeApi = (...args) => {
  return Object.assign({}, ...args)
}

export default mergeApi(
  homePage,
  cms
)

