/**
 * @desc 数据字典获取
 * @remark initState(vm) 顺序：props > methods > data > computed > watch
*/
import store from '@/store'

const getData = () => {
  let data = window.sessionStorage.getItem('dicData')
  if (data && data !== 'undefined' && data !== 'null') {
    data = JSON.parse(data)
  } else {
    data = store.getters.dicStore
  }
  // window.__lookup__ = data
  return data
}

/**
 * @desc 扁平化树结构数据的字典
 * @remark 针对嵌套children的数据，将所有层级的{label, value} 组装成一个数组
 * @param {Array} list 
*/
const flatDic = list => {
  const arr = []
  !(function flatArr(v) {
    v.forEach(item => {
      arr.push(item)
      if (item.children) {
        flatArr(item.children)
      }
    })
  }(list))
  return arr
}

// console.log(getData())

export default {
  methods: {
    // 使用：this.lookUpOptions('stationPerson.salesStatus')
    lookUpOptions: (key) => {
      return (window.__lookup__ || getData())[key]
    },
    // 使用： this.lookup('stationPerson.salesStatus', v)
    lookup: (key, val) => {
      const dicArr = (window.__lookup__ && window.__lookup__[key]) || getData()[key] || []
      let obj = (dicArr.some(v => v.children) ? flatDic(dicArr) : dicArr).find(v => v.value == val)
      return obj ? obj.label : val
    }
  }
}
