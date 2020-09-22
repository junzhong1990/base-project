<template>
  <div>
    <!--<Tree-->
       <!--ref="tree"-->
       <!--accordion-->
       <!--:data="data2"-->
       <!--show-checkbox-->
       <!--node-key="id"-->
       <!--:default-expanded-keys="[2, 3]"-->
       <!--:default-checked-keys="[5]"-->
       <!--:props="defaultProps"-->
       <!--@check="handleCheck"-->
       <!--@check-change="handleCheckChange">-->
    <!--</Tree>-->
    <el-tree :data="data2" node-key="id" :props="defaultProps"  show-checkbox @node-click="handleNodeClick" @check-change="getCheckedNodes" :default-expanded-keys="openArr" ref="areaTree" :default-checked-keys="defaultCheckArr"></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectDataArr: [],
      openArr: ['-1'], // 默认展开的节点id
      data2: [
        {
          id: '-1',
          label: '所有区域',
          children: []
        }
      ],
      data3: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 2-1-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      props: {
        label: 'name',
        children: 'zones'
      },
      defaultCheck: []
      // 存在选择到的那些名字集合 []
      // names: [],
      // 存放选择到的那些ID集合 []
      // ids: [],
      // 存放选择到的所有对象： [{id:xx, name:yyy}]
      // data_choosed: []
    }
  },
  props: {
    api: {
      type: Object,
      default: () => {
        return {
          apiCode: 100027,
          content: {
            showLevel: 3,
            status: 'on'
          }
        }
      }
    },
    defaultCheckArr: {
      type: Array,
      default: function () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getCheckedNodes(data, checked, indeterminate) {
      this.selectDataArr = this.$refs.areaTree.getCheckedNodes()
      console.log(data)
      console.log(checked)
      console.log(indeterminate)
      console.log(this.$refs.areaTree.getCheckedNodes())
      let arr = this.$refs.areaTree.getCheckedNodes()
      let regionCode = []
      arr.forEach((val, i) => {
        regionCode.push(val.code)
      })
      this.$emit('result', regionCode.join(','))
    },
    emitResult(regionCode) {
      this.$emit('result', regionCode)
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.disabled) {
        return
      }
      if (!data.children) {
        this.emitResult(data.id)
      }
    },
    dealidtocode(arr) {
      console.log(this.disabled)
      arr.forEach((val, i) => {
        val.id = val.code
        val.disabled = this.disabled
        if (val.children && val.children.length > 0) {
          this.dealidtocode(val.children)
        }
      })
    },
    async init_area_data() {
      let res = await this.$api.sysRegion({ })
      if (res.code === 0) {
        // 清空children
        console.log('res.data', res.data)
        let arr = res.data
        this.dealidtocode(arr)
        this.data2 = arr
      }
    }
  },
  beforeMount() {
    console.log(this.defaultCheckArr)
    // 获取Tree数据
    this.init_area_data()
  }
}
</script>
