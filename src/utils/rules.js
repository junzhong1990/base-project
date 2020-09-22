// 表单验证规则 for ElementUI
export default {
  // 流程表单，特殊组件，值为数组 必填校验
  specialRequire: (rule, value, callback) => {
    const _value = value
    if (!_value || _value.length === 0) {
      return callback(new Error(`${rule.name}不能为空`))
    }
    callback()
  },
  // 为空

  checkEmpty: (rule, value, callback) => {
    const _value = String(value).trim()
    if (_value === '') {
      return callback(new Error(rule.message))
    }
    callback()
  },
  // 余额下限为非负数
  userCredit: (rule, value, callback) => {
    const _value = value
    const title = rule.name || '余额下限'
    if (_value && _value !== 0 && (!Number(_value) || Number(_value) < 0)) {
      return callback(new Error(title + '必需为非负数'))
    }
    if (_value > 999999999999.99) {
      return callback(new Error(title + '不能超过12位数'))
    }
    callback()
  },

  // 输入框为数字（可选）
  numberVal2: (rule, value, callback) => {
    const _value = value
    const test = !!(/(^[0-9]\d*$)/.test(_value))
    if (_value && !Number(test)) {
      return callback(new Error('请输入正确非负整数'))
    }
    callback()
  },
  // 输入框为数字（必选）
  numberVal: (rule, value, callback) => {
    const _value = value
    const test = !!(/^\d+(\.\d{0,2})?$/g.test(_value))
    if (!_value) {
      // callback();
      // return callback(new Error(`单价不能为空`));
    }
    if (!Number(test)) {
      return callback(new Error('单价必须为数字且最多保留两位小数'))
    }
    callback()
  },
  // 渠道编码（必选）
  checkChannelCode: (rule, value, callback) => {
    const _value = value
    const test = !!(/(^[0-9]\d*$)/.test(_value))
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (_value.length < 4) {
      return callback(new Error(`${rule.name}请输入四位数字`))
    }
    if (!Number(test)) {
      return callback(new Error(`${rule.name}必须为数字`))
    }
    callback()
  },
  // 渠道编码（必选）
  checkChannelTenCode: (rule, value, callback) => {
    const _value = value
    const test = !!(/(^[0-9]\d*$)/.test(_value))
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!Number(test)) {
      return callback(new Error(`${rule.name}必须为数字`))
    }
    if (_value.length < 10) {
      return callback(new Error(`${rule.name}请输入十位数字`))
    }
    callback()
  },
  // 输入框为单价（必选）
  unitPriceVal: (rule, value, callback) => {
    const _value = value
    const test = !!(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(_value))
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!Number(test)) {
      return callback(new Error(`${rule.name}必须为数字`))
    }
    callback()
  },
  // 数字必填的
  checkEmptyNumber: (rule, value, callback) => {
    const _value = value
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (_value && !test) {
      return callback(new Error(`${rule.name}必须输入数字`))
    }
    callback()
  },
  // 只能输入正整数
  checkPositiveInteger: (rule, value, callback) => {
    const _value = value
    const test = /(^[1-9][0-9]*$)/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (_value && !test) {
      return callback(new Error(`${rule.name}必须为正整数`))
    }
    callback()
  },
  // 负责人
  checkPrincipal: (rule, value, callback) => {
    const _value = value && String(value).trim()
    if (!_value) {
      callback()
      // return callback(new Error('负责人不能为空'));
    }
    callback()
  },
  // 用户账号
  checkAccount: (rule, value, callback) => {
    const _value = value && String(value).trim()
    if (!_value) {
      return callback(new Error('用户账号不能为空'))
    }
    callback()
  },
  // 用户密码
  checkPwd: (rule, value, callback) => {
    if (String(value).indexOf(' ') > -1) {
      return callback(new Error('密码不能含有空格'))
    }
    const _value = value && String(value).trim()
    const test = !!(/^[a-zA-Z0-9!@#$%~^&_+=-]{6,16}$/g).test(_value)
    if (!_value) {
      return callback(new Error('密码不能为空'))
    }
    if (!test) {
      return callback(new Error('仅支持6-16位数字英文大小写或特殊字符'))
    }
    callback()
  },
  // 用户密码
  checkPassword: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^[a-zA-Z0-9!@#$%^&_+=-]{6,16}$/g
    if (!_value) {
      callback()
      // return callback(new Error('密码不能为空'));
    }
    if (_value && !reg.test(_value)) {
      return callback(new Error('仅支持6-16位数字英文大小写或特殊字符'))
    }
    callback()
  },
  // 手机号
  checkPhone: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error('手机号不能为空'));
    }
    if (!test) {
      return callback(new Error('请输入正确的手机号'))
    }
    callback()
  },
  // 手机号与座机号
  checkPhoneAndMobile: (rule, value, callback) => {
    console.log(rule)
    console.log(value)
    const _value = value && String(value).trim()
    const test = /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(_value) || /^0\d{2,3}-\d{7,8}$/g.test(_value)
    if (!_value) {
      console.log(rule.name)
      console.log(rule.title)
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`请输入正确的${rule.name}`))
    }
    callback()
  },
  // 座机号码（必填）
  checkMobile: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^0\d{2,3}-\d{7,8}$/g.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`请输入正确的${rule.name}`))
    }
    callback()
  },
  // 座机号码（选填）
  checkNonMobile: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^0\d{2,3}-\d{7,8}$/g.test(_value)
    if (_value && !test) {
      return callback(new Error(`请输入正确的${rule.name}`))
    }
    callback()
  },
  // 邮箱
  email: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z\d]{2,4}$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error('邮箱不能为空'));
    }
    if (!test) {
      return callback(new Error('邮箱格式不正确'))
    }
    callback()
  },
  // 邮箱
  checkEmail: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z\d]{2,4}$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error('邮箱不能为空'));
    }
    if (!test) {
      return callback(new Error('邮箱格式不正确'))
    }
    callback()
  },
  // 邮箱（可选）
  checkUnEmail: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z\d]{2,4}$/.test(_value)
    if (_value && !test) {
      return callback(new Error('邮箱格式不正确'))
    }
    callback()
  },

  // 邮箱（可选）
  checkUnEmail2: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[comnet]{2,4}$/.test(_value)
    if (_value && !test) {
      return callback(new Error('邮箱格式不正确'))
    }
    callback()
  },
  // 邮箱（必填）
  checkRequireEmail: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z\d]{2,4}$/.test(_value)
    if (!_value) {
      return callback(new Error('邮箱不能为空'))
    }
    if (!test) {
      return callback(new Error('邮箱格式不正确'))
    }
    callback()
  },
  // 机构编号
  checkInstStr: (rule, value, callback) => {
    const _value = value && String(value).trim()
    if (!_value) {
      callback()
      // return callback(new Error('机构编号不能为空'));
    }
    callback()
  },
  // 银行卡号
  checkBankNo: (rule, value, callback) => {
    // 先判断，是否符合规则
    const _value = value && String(value).trim()
    if (!_value) {
      callback()
      // callback(new Error('银行卡号不能为空'))
    } else {
      if (/^([1-9]{1})(\d{15}|\d{18})$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的银行卡号'))
      }
    }
  },
  // 身份证校验
  checkIdCard: (rule, value, callback) => {
    const _value = value && String(value).trim()
    if (!_value) {
      callback()
      // callback(new Error('身份证号不能为空'))
    } else {
      // 18位身份证号码校验正则
      let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      // 15位身份证号码校验正则
      let regs = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/
      if (reg.test(_value) || regs.test(_value)) {
        callback()
      } else {
        callback(new Error('请输入正确的身份证号码'))
      }
    }
  },

  // 整型验证
  checkInteger: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^[1-9-]*[1-9][0-9]*$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(rule.emptyMessage));
    }
    if (!test) {
      // return callback(new Error(rule.errorMessage));
      return callback(new Error('只能输入整数'))
    }
    callback()
  },
  // 数字 字母 下划线 减号
  checkCode: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[a-zA-Z0-9_-]*$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入数字，字母，下划线或-`))
    }
    callback()
  },
  // 金额必须为正数
  checkMoney: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/g
    if (_value === '') {
      callback()
    }
    if (_value < 0) {
      return callback(new Error('金额不能为空且不小于0'))
    }
    if (!reg.test(_value)) {
      return callback(new Error('金额必须是数字'))
    }
    callback()
  },
  // 数字且最多保留两位小数点 限制不能大于100（可选）
  unDonationAmount: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^\d+(\.\d{0,2})?$/g
    if (_value && !reg.test(_value)) {
      return callback(new Error(`${rule.name}必须为数字且最多保留两位小数`))
    }
    if (_value > 100) {
      return callback(new Error(`${rule.name}不能超过100`))
    }
    callback()
  },
  // 数字且最多保留两位小数点 限制不能大于100（必填）
  donationLimitRate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^\d+(\.\d{0,2})?$/g
    if (!_value && _value !== 0) {
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!reg.test(_value)) {
      return callback(new Error(rule.message || `${rule.name}必须为数字且最多保留两位小数`))
    }
    if (_value > 100) {
      return callback(new Error(`${rule.name}不能超过100`))
    }
    callback()
  },
  // 数字且最多保留两位小数点 限制不能大于12 代销费率（必填）
  agentSellRate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^\d+(\.\d{0,2})?$/g
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!reg.test(_value)) {
      return callback(new Error(`${rule.name}必须为数字且最多保留两位小数`))
    }
    if (_value > 12) {
      return callback(new Error(`${rule.name}不能超过12`))
    }
    callback()
  },
  // 数字且最多保留两位小数点 限制不能大于12 代销费率（可选）
  unAgentSellRate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^\d+(\.\d{0,2})?$/g
    if (_value && !reg.test(_value)) {
      return callback(new Error(`${rule.name}必须为数字且最多保留两位小数`))
    }
    if (_value > 12) {
      return callback(new Error(`${rule.name}不能超过12`))
    }
    callback()
  },
  // 数字且最多保留两位小数点（可选）
  unAmount: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^\d+(\.\d{0,2})?$/g
    if (_value && !reg.test(_value)) {
      return callback(new Error(rule.message || `${rule.name}必须为数字且最多保留两位小数`))
    }
    callback()
  },
  // 数字且最多保留两位小数点（必填）
  donationAmount: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /^\d+(\.\d{0,2})?$/g.test(_value)
    if (!_value && _value !== 0) {
      // return callback(new Error(`${rule.name}不能为空`));
      callback()
    }
    if (!reg) {
      return callback(new Error(`${rule.name}必须为数字且最多保留两位小数`))
    }
    callback()
  },

  // 搜索范围的金额必须为正数
  searchMoney: (rule, value, callback) => {
    const _value = value && String(value).trim()
    // const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/g
    if (_value < 0) {
      return callback(new Error('金额须大于0'))
    }
    // if(!reg.test(_value)){
    //   return callback(new Error('捐款金额必须是数字'));
    // }
    callback()
  },
  // URL验证
  checkUrl: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!/^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error('请输入URL地址'));
    }
    if (!test) {
      return callback(new Error('URL地址输入有误'))
    }
    callback()
  },
  // 验证经度
  checkLng: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[-+]?(0?\d{1,2}\.\d{6}|1[0-7]?\d{1}\.\d{6}|180\.0{6})$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error('经度不能为空'));
    }
    if (!test) {
      return callback(new Error('请输入-180~180范围且包括6位小数点的经度'))
    }
    callback()
  },
  // 验证纬度
  checkLat: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[-+]?([0-8]?\d{1}\.\d{6}|90\.0{6})$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error('纬度不能为空'));
    }
    if (!test) {
      return callback(new Error('请输入-90~90范围且包括6位小数的纬度'))
    }
    callback()
  },

  unDAmounts: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const reg = /(^[1-9]\d*$)/
    if (!_value && rule.required === 'true') {
      // return callback(new Error(`请输入数值`));
    }
    if (_value && !reg.test(_value)) {
      return callback(new Error('值必须为正整数'))
    }
    if (_value > 100) {
      return callback(new Error('值不能超过100'))
    }
    callback()
  },
  // 输入框可选(数字)
  unNumberCheck: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!_value && rule.required === 'true') {
      // return callback(new Error(`请输入数值`));
    }
    if (!test && value) {
      return callback(new Error('值必须为正整数'))
    }
    // if (rule.name == '大奖数量') {
    //   if (_value && (value > 1000 || value <= 0)) {
    //     return callback(new Error(`值必须在1到1000之间`));
    //   }
    // } else if(rule.name == '年任务设置'){
    //   if(value <=20000000){
    //     return callback(new Error(`值必须大于20000000`));
    //   }
    //   if(value >=1000000000){
    //     return callback(new Error(`值必须小于1000000000`));
    //   }

    // }
    // else {
    //   if (_value && value >= 100000000 ) {
    //     return callback(new Error(`值必须小于100000000`));
    //   }
    // }

    callback()
  },
  // 输入框必填(数字)
  numberCheck: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(rule.message || new Error(`${rule.name}必须为正整数`))
    }
    callback()
  },
  // 输入框考核分值
  numberScore: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (_value > 100) {
      return callback(new Error(`${rule.name}不能大于100`))
    }
    if (!test) {
      return callback(new Error(`${rule.name}必须为正整数`))
    }
    callback()
  },
  // 输入框天数数字
  numberDate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (_value > 365) {
      return callback(new Error(`${rule.name}不能超过365天`))
    }
    if (!test) {
      return callback(new Error(`${rule.name}必须为正整数`))
    }
    callback()
  },
  // 输入框必填(数字) %
  numberRate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}必须为正整数`))
    }
    if (_value > 100) {
      return callback(new Error(`${rule.name}不能大于100%`))
    }
    callback()
  },
  // 输入框可选(数字) %
  unNumberRate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^[1-9]\d*$)/.test(_value)
    if (!test && _value) {
      return callback(new Error(`${rule.name}必须为正整数`))
    }
    if (_value > 100) {
      return callback(new Error(`${rule.name}不能大于100%`))
    }
    callback()
  },

  // 小数或数字
  checkPointOrPercent: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = !!(/(^\d+[.]*\d*%?$)/.test(_value))
    if (!test && value) {
      return callback(new Error('值必须为百分比数字或小数'))
    }
    callback()
  },
  // 小数或数字
  checkPointRate: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /(^\d+[.]*\d*%?$)/.test(_value)
    if (!test && _value) {
      return callback(new Error(`${rule.name}必须为数字或小数`))
    }
    if (_value > 100) {
      return callback(new Error(`${rule.name}不能超过100`))
    }
    callback()
  },
  // 名称--中英文数字
  checkName: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[A-Za-z0-9-_\u4e00-\u9fa5]+$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入中英文，数字或-_组合`))
    }
    callback()
  },
  // 名称--中英文数字(可选)
  checkNonName: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[A-Za-z0-9-_\u4e00-\u9fa5]+$/.test(_value)
    if (_value && !test) {
      return callback(new Error(`${rule.name}只能输入中英文，数字或-_组合`))
    }
    callback()
  },
  // 名称--中英文
  checkPeopleName: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[A-Za-z\u4e00-\u9fa5]+$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入中英文`))
    }
    callback()
  },
  // 名称--中英文（必填）
  checkRequireName: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[A-Za-z\u4e00-\u9fa5]+$/.test(_value)
    if (!_value) {
      return callback(new Error(`${rule.name}不能为空`))
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入中英文`))
    }
    callback()
  },
  // 名称--中英文（非必填）
  validName: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[A-Za-z\u4e00-\u9fa5]+$/.test(_value)
    if (!_value) {
      callback()
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入中英文`))
    }
    callback()
  },
  // 正整数
  checkPositive: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[1-9][0-9]*$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入正整数`))
    }
    callback()
  },
  // 正整数（可选）
  checkUnPositive: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[1-9][0-9]*$/.test(_value)
    if (_value && !test) {
      return callback(new Error(`${rule.name}只能输入正整数`))
    }
    callback()
  },
  // 数字包括0
  checkNumber: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[0-9]*$/.test(_value)
    if (!_value && _value !== 0) {
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入数字`))
    }
    callback()
  },
  // 整数包括0（可选）
  checkNonNumber: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[0-9]*$/.test(_value)
    if (_value && !test) {
      return callback(new Error(`${rule.name}只能输入数字`))
    }
    callback()
  },
  checkSelect: (rule, value, callback) => {
    const _value = value
    if (_value.length === 0) {
      return callback(new Error(`${rule.name}不能为空`))
    }
    callback()
  },
  // 指定大厅输入
  checkChannelNo: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^\d{10}(;\d{10})*$/g.test(_value)
    if (!_value) {
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}需按规范输入`))
    }
    callback()
  },
  // 游戏编码
  checkGameCode: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[_A-Za-z0-9#]+$/.test(_value)
    if (!_value) {
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入英文，数字和#`))
    }
    callback()
  },
  // 只能输入中文
  checkIsChinese: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[\u4e00-\u9fa5]+$/gi.test(_value)
    if (!_value) {
      // return callback(new Error(`${rule.name}不能为空`));
    }
    if (!test) {
      return callback(new Error(`${rule.name}只能输入中文`))
    }
    callback()
  },
  // 不能输入中文
  checkNoChinese: (rule, value, callback) => {
    const _value = value && String(value).trim()
    const test = /^[\u4e00-\u9fa5]+$/gi.test(_value)
    if (test) {
      return callback(new Error(`${rule.name}不能输入中文`))
    }
    callback()
  },
  // 输入正确的年份
  checkYear: (rule, value, callback) => {
    // /^\d{4}$/
    const _value = value && String(value).trim()
    const test = /^([1-2]\d{3})$/.test(_value)
    if (!_value) {
      callback()
      // return callback(new Error(`${rule.name}不能为空`))
    }
    if (!test) {
      return callback(new Error(`请输入正确的${rule.name}`))
    }
    callback()
  },
  // 不能特殊字符
  special: (val) => {
    if (!Array.isArray(val) && new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", 'gim').test(val)) {
      return true
    };
    return false
  },
  /**
   * 简单必填字段验证规则
   * @param {string} str
   * @param {string} trigger
   * @param {boolean} required
   */
  str (str, required = false, trigger = 'blur') {
    return [{ required: required, message: str, trigger: trigger }]
  }
}
