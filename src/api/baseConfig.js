/**
 * @desc 公用配置
*/

// 不同环境请求地址设置
const envUrlSet = env => {
  env = env || 'development'
  return {
    proxyUrl: {
      development: '10.8.0.144',
      testing: '10.9.0.112',
      production: '192.168.0.1/prod/api',
    }[env],
    baseUrl: {
      development: '//10.13.1.75:10001/backstage',
      testing: '//10.9.0.112:8900',
      production: '//192.168.0.1/prod/api',
    }[env]
  }
}

const urlSet = envUrlSet(process.env.VUE_APP_MODE)

const runingIP = urlSet.proxyUrl

export const baseURL = urlSet.baseUrl

// 配置URL
export const sysBaseURL = `http://${runingIP}:8600`
export const dssURL = `http://${runingIP}:8300/`
export const uploadURL = `http://${runingIP}:8400`
export const reportURL = `http://${runingIP}:8610`
export const messageURL = `http://${runingIP}:8630`
export const flowURL = `http://${runingIP}:8900`

// 获取api
export const getApis = (context, ignore) => {
  return context.keys().reduce((modules, modulePath) => {
    if (modulePath !== ignore) {
      modules = { ...modules, ...(context(modulePath).default || {}) }
    }
    return modules
  }, {})
}
