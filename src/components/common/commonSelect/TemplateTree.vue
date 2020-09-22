<template>
  <div class="treeCheckbox">
    <Tree :data="data3" @check-change="checkEvent" :load="loadData" show-checkbox ref="tree"></Tree>
  </div>
</template>
<script>
  export default {
    name: 'treeCheckbox',
    data() {
      return {
        disabled: false,
        areas: '', // 区域选择显示的值  邓州市，邓州市，邓州市
        areaIds: '', // 区域选择传的值 411900000000，411900000000，411900000000
        msg: '',
        stationSum: [], // 站点对应上一级的数据集合
        data3: [
          {
            title: 'parent',
            loading: false,
            children: []
          }
        ]
      }
    },
    props: {
      // 控制地市、县区的级数
      level: {
        type: String,
        default: 'third'
      }
    },
    methods: {
      clear() {
        this.getData()
        this.areas = ''
        this.areaIds = ''
      },
      loadData(item, callback) {
        this.postJson('ids', {
          apiCode: 700007,
          content: {
            regionCode: item.id
          }
        }).then(res => {
          if (res.code === '0') {
            let data = []
            res.content.stations.forEach((val, i) => {
              data.push({
                parentCode: item.id,
                parentName: item.title,
                title: val,
                children: []
              })
            })
            callback(data)
            if (res.content.stations.length === 0) {
              Message.warning('该区域下没有站点！')
            }
          }
        })
      },
      // 处理勾选事件，（需要最尾端站点数据加载出来才能进行勾选触发统计）
      checkEvent(data, dataSelf, dataChildren) {
        let arrChecked = this.$refs.tree.getCheckedNodes()
        // 区域选择-存储区域title的数组
        let areaTitleArr = []
        // 区域选择-存储区域id的数组
        let areaIdArr = []
        arrChecked.forEach((val, i) => {
          // 将勾选的区域title、id存入到数组
          areaTitleArr.push(val.label)
          areaIdArr.push(val.id)
        })
        this.areas = areaTitleArr.join(',')
        this.areaIds = areaIdArr.join(',')
        // this.stationSum = arr
      },
      // 请求区域树数据
      getData() {
        this.postJson('account', {
          apiCode: 100027,
          content: {
            // showLevel: 'third',
            showLevel: this.level,
            status: 'on'
          }
        }).then(res => {
          if (res.code === '0') {
            let data = res.content.regionTree.children
            this.data3 = []
            data.forEach((val, i) => {
              if (val.children) {
                this.data3.push({
                  label: val.name,
                  id: val.id,
                  children: []
                })
                val.children.forEach((vall, ii) => {
                  this.data3[i].children.push({
                    label: vall.name,
                    id: vall.id,
                    children: []
                  })
                })
              } else {
                this.data3.push({
                  label: val.name,
                  id: val.id
                })
              }
            })
          }
        })
      }
    },
    beforeMount() {
      this.getData()
    }
  }
</script>

<style lang="scss">
</style>
