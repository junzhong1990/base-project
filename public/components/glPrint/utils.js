/**
 * @desc 判断是否ie浏览器
 */
export function IEVersion() {
  var userAgent = navigator.userAgent
  // 判断是否IE<11浏览器
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
  // 判断是否IE的Edge浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var fIEVersion = parseFloat(RegExp['$1'])
    return fIEVersion <= 6 ? 6 : fIEVersion
  } else if (isEdge) {
    return 'edge'
  } else if (isIE11) {
    return 11
  } else {
    return -1
  }
}
