/**
 * @desc 前端定义数据枚举
*/
const autoList = [
  {
    name: 'sex',
    description: '性别数组',
    data: [
      { label: '男', value: 0 },
      { label: '女', value: 1 },
      { label: '保密', value: 2 },
    ],
  },
  {
    name: 'sysUserType',
    description: '用户类型',
    data: [
      { label: '中心用户', value: 2 },
      { label: '分中心用户', value: 3 },
      { label: '区域经理', value: 4 },
      { label: '业主', value: 5 },
    ],
  },
  {
    name: 'education',
    description: '学历数组',
    data: [
      { label: '小学', value: 1 },
      { label: '初中', value: 2 },
      { label: '中专', value: 3 },
      { label: '中技', value: 4 },
      { label: '高中', value: 5 },
      { label: '大专', value: 6 },
      { label: '本科', value: 7 },
      { label: '硕士', value: 8 },
      { label: '博士', value: 9 },
      { label: '其他', value: 10 },
    ],
  },
  {
    name: 'formType',
    description: '动态表单选项',
    data: [
      { label: '下拉选择框', value: 'select' },
      { label: '文本输入框', value: 'input' },
      { label: '文本输入域', value: 'textarea' },
      { label: '日期选择', value: 'date' },
      { label: '日期范围', value: 'daterange' },
      { label: '时间选择', value: 'datetime' },
      { label: '时间范围', value: 'datetimerange' },
      { label: '复选框', value: 'checkbox' },
      { label: '单选框', value: 'radio' },
      { label: '级联选择', value: 'cascader' },
      { label: '区域级联选择', value: 'address' },
      // {label: '开关按钮', value: 'switch'},
      { label: '附件上传', value: 'upload' },
      { label: '双下拉选择框', value: 'selectTwo' },
      { label: '双输入框', value: 'inputTwo' },
      { label: '站点原址转让联动框', value: 'stationTransfer' },
      { label: '游戏类型游戏期号联动框', value: 'gameTypeIssueNum' },
      { label: '游戏权限列表', value: 'gamePermissions' },
      { label: '游戏兑奖金额权限业务-原权限', value: 'gameCashItem' },

      { label: '双输入框经纬度', value: 'inputTwoLngLat' },
      { label: '加载站点', value: 'loadStation' },
      { label: '加载最近站点', value: 'loadNearestStation' },
      { label: '加载停机站点', value: 'loadStopStation' },
      { label: '新增站点渠道选择', value: 'newStationAgent' },
      { label: '新增站点区域,区域经理', value: 'areaAdmin' },

      { label: '站点销售费率', value: 'loadStationRate' },
      { label: '站点销售权限', value: 'stationRight' },
      { label: '中奖彩票明细', value: 'winDetail' },
      // {label: '建站物品列表', value: 'newStationGoods'},
      { label: '建站物品列表', value: 'newStationGoodsList' },
      { label: '建站代销费率表', value: 'newStationRate' },
      { label: '建站设备列表', value: 'newStationDevice' },
      //   仓储流程相关
      { label: '仓储采购入库物品列表', value: 'storeGoodsList' },
      { label: '仓储报损物品列表', value: 'storeDamageGoodsList' },
      { label: '仓储调拨物品列表', value: 'storeAllocationGoodsList' },
      //   培训流程相关
      { label: '培训课程课件上传', value: 'trainUpload' },
      { label: '培训课程题目选择', value: 'trainCourseSelect' },
      //   营销流程相关
      { label: '活动区域', value: 'areaCheckbox' },
      //   统计分析相关
      { label: '快速设置时间', value: 'dateRangeFast' },
      { label: '年份选择', value: 'year' },
      { label: '月份选择', value: 'month' },
      { label: '统计分析多选框', value: 'checkBoxAll' },
      //   统计分析相关 baseform 不适用，formset 使用
      { label: '统计分析下拉多选框', value: 'selectMult' },
      { label: '统计分析下拉框联动组件', value: 'selectLinkage' },
      { label: '统计分析单选框联动组件', value: 'radioLinkage' },
      { label: '统计分析区域单选可选择任何一级', value: 'areaMixtureRadio' },
      { label: '统计分析区域多选只可多选同一级', value: 'areaMultiple' },
      { label: '统计分析起止框', value: 'inputRange' },
      { label: '统计分析联动双下拉框', value: 'DoubleSelect' },
      { label: '统计分析单框模糊搜索', value: 'oneInputSearch' },

    ],
  },
  {
    name: 'validatorNameList',
    description: 'value规则需要跟 rules.js 内的方法名称对应',
    data: [
      { label: '邮箱', value: 'email' },
      { label: '银行卡号', value: 'checkBankNo' },
      { label: '身份证号', value: 'checkIdCard' },
      { label: '整数', value: 'checkInteger' },
      { label: '金额', value: 'checkMoney' },
      { label: '数字且最多保留两位小数', value: 'donationAmount' },
      { label: '验证经度', value: 'checkLng' },
      { label: '验证纬度', value: 'checkLat' },
      { label: '数字', value: 'numberVal2' },
      { label: '名称--中英文', value: 'checkPeopleName' },
      { label: '手机号与座机号', value: 'checkPhoneAndMobile' },
    ],
  },
  {
    name: 'userType',
    data: [
      { label: '系统用户', value: 0 },
      { label: '超级管理员', value: 1 },
      { label: '巡查员', value: 2 },
      { label: '业主', value: 3 },
      { label: '销售员', value: 4 },
    ],
  },
  {
    name: 'departmentLevel',
    data: [
      { label: '职员', value: '0' },
      { label: '领导', value: '1' },
    ],
  },
  {
    name: 'regionLevel',
    data: [
      { label: '普通人员', value: '0' },
      { label: '负责人', value: '1' },
    ],
  },
  {
    name: 'autResourcesType',
    data: [
      // 0-菜单，1-按钮，2页面，3模块，4页签，5url
      { label: '菜单', value: 0 },
      { label: '按钮', value: 1 },
      { label: '页面', value: 2 },
      { label: '模块', value: 3 },
      { label: '页签', value: 4 },
      { label: 'url', value: 5 },
    ],
  },
  {
    name: 'autUriList',
    data: [
      {
        label: '请求后台',
        value: 0,
      },
      {
        label: '页面跳转',
        value: 1,
      },
    ],
  },
  {
    name: 'advList',
    data: [
      {
        label: '否',
        value: 'no',
      },
      {
        label: '是',
        value: 'yes',
      },
    ],
  },
  {
    name: 'commonSenseTypeList',
    data: [
      {
        label: '玩法介绍',
        value: 'playIndroduction',
      },
      {
        label: '游戏介绍',
        value: 'gameIndroduction',
      },
      {
        label: '兑奖指南',
        value: 'cashGuide',
      },
      {
        label: '管理条例',
        value: 'manageRules',
      },
      {
        label: '新闻资讯',
        value: 'news',
      },
    ],
  },
  {
    name: 'autSystemType',
    description: '业务系统类型',
    data: [
      {
        label: '普通',
        value: 1,
      },
      {
        label: '内置',
        value: 0,
      },
    ],
  },
  {
    name: 'questionType',
    description: '业务系统类型',
    data: [
      {
        label: '单选题',
        value: 'radio',
      },
      {
        label: '多选题',
        value: 'checkbox',
      },
    ],
  },
  {
    name: 'autDataAuthType',
    description: '数据权限类型选择',
    data: [
      {
        label: '自定义',
        value: 1,
      },
      {
        label: '默认',
        value: 0,
      },
    ],
  },
  {
    name: 'dataDicStatus',
    description: '数据字典停启用',
    data: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ],
  },
  {
    name: 'dataDicType',
    description: '数据字典停允许删除',
    data: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ],
  },
  {
    name: 'institutionType',
    description: '机构管理-机构类别',
    data: [
      {
        label: '部门',
        value: 0,
      },
      {
        label: '内部机构',
        value: 1,
      },
      {
        label: '外部机构',
        value: 2,
      },
    ],
  },
  {
    name: 'barType',
    description: '条码格式',
    data: [
      {
        label: '无条码',
        value: 'nonebar',
      },
      {
        label: '商品码',
        value: 'goodsbar',
      },
      {
        label: '序列码',
        value: 'seqbar',
      },
    ],
  },
]

/**
 * @desc 转换为key-value形式
*/
const staticDic = autoList.reduce((o, cur) => {
  o[cur.name] = cur.data
  return o
}, {})

export default {
  // 获取下拉列表方法
  getList: (item) => {
    return staticDic[item] || []
  },
  // 根据值获取label显示展示
  getData: (item, val) => {
    /* eslint-disable */
    const obj = (staticDic[item] || []).find(v => v.value == val)
    return obj ? obj.label : val
  },
}
