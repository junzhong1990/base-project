/**
 * 获取全路由
 * @param {Array} context 数组
 * @param {Object} ignore 字符
 */
export const getRoutes = (context, ignore) => {
  const children = []
  context.keys().forEach(key => {
    if (key !== ignore) {
      try {
        let arr = context(key).default
        if (arr && arr.length) {
          children.push(...arr)
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
  return children
}

/**
 * @param {任意值} val 判断是不是空值
 */
export const isNUll = val => {
  return typeof val === 'object' && !val
}


export const isEmpty = val => val === '' || val === null || val === undefined

