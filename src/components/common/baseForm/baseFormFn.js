import cascaderOne from './cascaderOne'
import selectOne from './selectOne'
import selectTwo from './selectTwo'
import inputTwo from './inputTwo'
import stationTransfer from './stationTransfer'
import gameCashItem from './gameCashItem'
import stationDevice from './stationDevice'
import DateQuery from './dateQuery'
import CheckBoxAll from './checkBoxAll'
import gameTypeIssueNum from './gameTypeIssueNum'
import gamePermissions from './gamePermissions'
import newStationAgent from './newStationAgent'
import storeGoodsList from './storeGoodsList'
import storeDamageGoodsList from './storeDamageGoodsList'
import trainUpload from './trainUpload'
import trainCourseSelect from './trainCourseSelect'
import areaCheckbox from './areaCheckbox'
import areaAdmin from './areaAdmin'
import newStationGoodsList from './newStationGoodsList'
import approvalOpreate from './approvalOpreate'
import stationCommission from './stationCommission'
import stationRightGame from './stationRightGame'
import stationRate from './stationRate'
import matTypeModelDevice from './matTypeModelDevice'
import stationLabels from './stationLabels'
import terminalDeviceList from './terminalDeviceList'
import bootTypeList from './bootTypeList'
import revokeTerminalList from './revokeTerminalList'

export default {
  components: {
    cascaderOne,
    selectOne,
    selectTwo,
    inputTwo,
    stationDevice,
    DateQuery,
    CheckBoxAll,
    stationTransfer,
    gameTypeIssueNum,
    gamePermissions,
    gameCashItem,
    newStationAgent,
    storeGoodsList,
    storeDamageGoodsList,
    trainUpload,
    trainCourseSelect,
    areaCheckbox,
    areaAdmin,
    newStationGoodsList,
    terminalDeviceList,
    approvalOpreate,
    stationCommission,
    stationRightGame,
    stationRate,
    matTypeModelDevice,
    stationLabels,
    bootTypeList,
    revokeTerminalList
  },
  methods: {
    hideFormItem(type) {
      return ![
        'stationTransfer',
        'gameCashItem',
        'gamePermissions',
        'gameTypeIssueNum',
        'newStationAgent',
        'storeGoodsList',
        'storeDamageGoodsList',
        'storeAllocationGoodsList',
        'trainUpload',
        'areaAdmin',
        'newStationGoodsList',
        'terminalDeviceList',
        'bootTypeList',
        'approvalOpreate',
        'newStationRate',
        'loadStationRate',
        'stationRight',
        'matTypeModelDevice',
        'revokeTerminalList',
      ].includes(type)
    },
    noAnyLevel(item) {
      return [
        'stationCategory',
        'nearestStationCategory'
      ].includes(item.field)
    },
    // 渠道类型为单站的时候，隐藏投注站类别字段
    hideStationCategory(item) {
      return { 'station-category': item.field === 'stationCategory' && this.form.channelType !== 'single' }
    },
    // 设置form表单的prop
    setProp(item) {
      const hasCode = ['loadStation', 'loadNearestStation', 'stationRight', 'loadStationRate', 'loadStopStation'].includes(item.type)
      const isCategory = item.field === 'stationCategory' && this.form.channelType !== 'single'
      return hasCode ? 'stationCode' : ((item.readOnly || isCategory) ? '' : item.prop)
    }
  }
}
