import ajax from '@/utils/ajax.js'
import { messageURL, flowURL, sysBaseURL } from '@/api/baseConfig'

// 请务必注释每个接口所属名称
export default {
  // 获取区域树
  sysRegion: (options = {}) => ajax.get('/api/v1/system/sysRegion/tree', {
    ...options,
    baseURL: sysBaseURL,
  }),
  // 发布站内消息
  publishNotice: (options = {}) => ajax.post('/api/v1/notice/website/publishNotice', {
    ...options,
    baseURL: messageURL,
  }),
  // 查询消息详情
  queryNoticeWebsiteReceiveDetail: (options = {}) => ajax.get('/api/v1/notice/website/queryNoticeWebsiteReceiveDetail', {
    ...options,
    baseURL: messageURL,
  }),
  // 查询站内消息分页信息
  queryNoticeWebsiteReceivePageInfo: (options = {}) => ajax.post('/api/v1/notice/website/queryNoticeWebsiteReceivePageInfo', {
    ...options,
    baseURL: messageURL,
  }),
  // 流程数量统计
  getFlowCount: (options = {}) => ajax.get('/flowCountApi/flowCount', {
    ...options,
    baseURL: flowURL,
  }),
  // 日历数量统计
  getCalendarCount: (options = {}) => ajax.post('/flowCountApi/calendar', {
    ...options,
    baseURL: flowURL,
  }),
  // 待办数据
  querySpecifiedDateTodo: (options = {}) => ajax.post('/flowCountApi/querySpecifiedDateTodo', {
    ...options,
    baseURL: flowURL,
  }),
  // 获取站点相关流程信息-用于业务统计查询
  getStationFlowInfo: (options = {}) => ajax.post('/flowCountApi/getStationFlowInfo', {
    ...options,
    baseURL: flowURL,
  }),
  // 业务办理统计
  businessStatistics: (options = {}) => ajax.post('/flowCountApi/businessStatistics', {
    ...options,
    baseURL: flowURL,
  }),
  // 业务办理统计导出
  businessSexportExcel: (options = {}) => ajax.post('/flowCountApi/exportExcel', {
    ...options,
    baseURL: flowURL,
  }),
  // 业务搜索
  searchStationFlowBizInfo: (options = {}) => ajax.post('/api/v1/station/station/searchStationFlowBizInfo', {
    ...options,
    baseURL: sysBaseURL,
  }),
}
