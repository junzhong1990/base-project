/**
 * @desc 公用配置
*/

const getSameUrl = ip => {
  return {
    station: `http://${ip}:8600`,
    dss: `http://${ip}:8300/`,
    upload: `http://${ip}:8400`,
    report: `http://${ip}:8610`,
    message: `http://${ip}:8630`,
    flow: `http://${ip}:8900`,
    channel: `http://${ip}:9100`
  }
}

// 不同环境请求地址设置
const envUrlSet = env => {
  env = env || 'development'
  const runingIp = {
    development: '10.8.0.144',
    testing: '10.9.0.112',
    production: '0.0.0.1'
  }[env]
  const sameUrl = getSameUrl(runingIp)
  return {
    runingIp,
    baseUrl: {
      development: '//10.8.0.144:8900',
      testing: '//10.9.0.112:8900',
      production: 'flow'
    }[env],
    proxyUrl: {
      development: sameUrl,
      testing: sameUrl,
      production: {
        station: 'station',
        dss: 'dss',
        upload: 'files',
        report: 'report',
        message: 'message',
        flow: 'flow',
        channel: 'channel'
      }
    }[env]
  }
}

const urlSet = envUrlSet(process.env.VUE_APP_MODE)

export const baseURL = urlSet.baseUrl

// 配置URL
export const sysBaseURL = urlSet.proxyUrl.station
export const dssURL = urlSet.proxyUrl.dss
export const uploadURL = urlSet.proxyUrl.upload
export const reportURL = urlSet.proxyUrl.report
export const messageURL = urlSet.proxyUrl.message
export const flowURL = urlSet.proxyUrl.flow
export const channelURL = urlSet.proxyUrl.channel

// 获取api
export const getApis = (context, ignore) => {
  return context.keys().reduce((modules, modulePath) => {
    if (modulePath !== ignore) {
      modules = { ...modules, ...(context(modulePath).default || {}) }
    }
    return modules
  }, {})
}
