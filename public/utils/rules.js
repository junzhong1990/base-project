
export default {
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
