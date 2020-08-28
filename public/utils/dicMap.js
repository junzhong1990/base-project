/** 
 * @desc 功能：字典（Map结构）
 * @remark 说明：字典是以[键，值]的形式来存储元素，字典也称作映射
 * */

export default class DicMap {

  constructor () {
    this.items = Object.create(null)
  }

  // 如果某个键值存在于这个字典中，则返回true，反之则返回false
  has (key) {
    return key in this.items
  }

  // 向字典中添加新元素
  set (key, value) {
		this.items[key] = value
  }

  // 通过使用键值来从字典中移除键值对应的数据值
	delete (key) {
		if (this.has(key)) {
			delete this.items[key]
			return true
		}
		return false
	}

  // 通过键值查找特定的数值并返回
	get (key) {
		return this.has(key) ? this.items[key] : undefined
	}

  // 将字典所包含的所有数值以数组形式返回
	values () {
		const values = []
		for (let k in this.items) {
			if (this.has(k)) {
				values.push(this.items[k])
			}
		}
		return values
  }
  
	// 将字典所包含的所有键名以数组形式返回
	keys () {
		return Object.keys(this.items)
  }
  
  // 获取字典中的所有元素
  getItems () {
		return this.items
  }
  
	// 移除字典中的所有项
	clear () {
		this.items = Object.create(null)
  }

	// 返回字典所包含元素的数量
	size () {
		return Object.keys(this.items).length
  }

}
