import ajax from '@/utils/ajax.js'
// import { uploadURL, sysBaseURL } from '@/api/baseConfig'

// 操作日志
export default {
  // 商户销售统计列表
  mcAllList: (options = {}) => ajax.post('/group/reportForm', options),
}
