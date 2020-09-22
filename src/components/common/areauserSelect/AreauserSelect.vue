<template>
  <div class="area-user-select">
    <el-input
      v-if="showInput"
      ref="inputRef"
      type="textarea"
      :disabled="disabled"
      :placeholder="placeholder"
      :autosize="true"
      v-model="names"
      readonly
      @focus="openDialog">
    </el-input>
    <div class="area-u" style="position: relative;">
      <el-dialog title="选择用户" :visible.sync="dialogVisible" custom-class="userDialogBox" width="568px" :append-to-body="bodyFlag">
        <div class="areauserSelect">
          <div class="tree">
            <div class="tree_left">
              <div class="leftTreeBox">
                <el-tree ref="areaTree"
                      :data="areaList"
                      default-expand-all
                      @check="checkChange"
                      :props="areaProps"
                      node-key="id"
                      show-checkbox
                ></el-tree>
              </div>
            </div>
            <div class="tree_right">
              <div class="rightTreeBox">
                <!--单选-->
                <el-tree ref="userListTreeRadio"
                      :data="userListRadio"
                      v-if="!checkboxFlag"
                      :props="singleUserProps"
                      node-key="id"
                      @node-click="handleNodeClick"
                      :check-strictly="true"
                      :default-expanded-keys="defaultExpandedRadio"
                ></el-tree>
                <!--多选-->
                <el-tree ref="userListTree"
                      :data="userListCheckbox"
                      v-if="checkboxFlag"
                      @check-change="getUsersCheckedNodes"
                      :props="multiUserProps"
                      node-key="id"
                      show-checkbox
                      default-expand-all
                ></el-tree>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="checkboxFlag">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'areauserSelect',
  props: {
    userScopeObj: { // 选人范围相关
      type: Object,
      default: function () {
        return {}
      }
    },
    showInput: { // 是否有输入框
      type: Boolean,
      default: true
    },
    checkboxFlag: { // 右边是单选还是多选，true为多选
      type: Boolean,
      default: true
    },
    bodyFlag: { // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
      type: Boolean,
      default: true
    },
    disabled: { // 默认不禁止
      type: Boolean,
      default: false
    },
    placeholder: { // 提示语
      type: String,
      default: ''
    },
    regionId: { // 指定区域id
      type: String,
      default: ''
    },
  },
  data() {
    return {
      defaultExpandedRadio: [],
      dialogVisible: false,
      msg: '我是区域用户选择数据',
      checkL: '',
      userSelectId: '', // 单选框选中的id
      userSelectName: '', // 单选框选中的name
      userSelectCheckboxId: '', // 多选框选中的id
      userSelectCheckboxName: '', // 多选框选中的name
      userSelectCheckboxIdArr: [], // 多选框选中的id
      userSelectCheckboxNameArr: [], // 多选框选中的name
      areaList: [],
      userListRadio: [],
      userListCheckbox: [],
      singleUserProps: {
        children: 'children',
        label: 'name'
      },
      multiUserProps: {
        children: 'children',
        label: 'name',
      },
      areaProps: {
        // children: 'users',
        label: 'name'
      },
      names: '', // 组件 input 显示的名字
      ids: '', // 用户列表是多选的时候的初始化
      id: '' // 用户列表是单选的时候的初始化值
    }
  },
  beforeMount() {
    this.getData()
  },
  methods: {
    // 设置区域不可选
    setDisabled() {
      this.areaList[0].disabled = true
      this.areaList[0].children.forEach((item) => {
        item.disabled = true
      })
    },
    async openDialog() {
      console.log('openDialog', this.ids)
      await this.getData()

      // 判定是否是需要加入用户范围相关参数
      this.dialogVisible = true
      // 先清空所有选中项
      this.$nextTick(() => {
        this.$refs.userListTree.setCheckedKeys([])
        this.defaultExpandedRadio = []
      })
      this.$refs.inputRef.blur() // 模态框关闭后输入框失去焦点，兼容IE输入框闪烁标识穿模问题
      if (this.ids) {
        this.$nextTick(() => {
          let idsArr = this.ids.split(',').map((id) => Number(id))
          this.$refs.userListTree.setCheckedKeys(idsArr)
        })
      }
      if (this.id) {
        this.$nextTick(() => {
          this.defaultExpandedRadio = [this.id]
        })
      }
      if (this.regionId) {
        this.getRegionUser(this.regionId)
        this.setDisabled()
      }
    },
    ok() {
      this.names = this.userSelectCheckboxName
      this.ids = this.userSelectCheckboxId
      this.dialogVisible = false
      if (this.checkboxFlag) {
        // 多选
        this.$emit('selectResult', {
          id: this.userSelectCheckboxId,
          name: this.userSelectCheckboxName,
          id_arr: this.userSelectCheckboxIdArr,
          name_arr: this.userSelectCheckboxNameArr
        })
      } else {
        // 单选
        this.$emit('selectResult', {
          id: this.userSelectId,
          name: this.userSelectName
        })
      }
    },
    handleNodeClick(data) {
      if (data.type === 1) {
        this.userSelectId = data.id
        this.id = data.id
        this.userSelectName = data.name
        this.names = this.userSelectName
        this.dialogVisible = false
        // 单选
        this.$emit('selectResult', {
          id: this.userSelectId,
          name: this.userSelectName
        })
      }
    },
    // 判定hasCheckedItem这一项有没有在cancelNode这个对象已经这个对象的 children里面
    checkedIfIn(cancelNode, hasCheckedItem, checedType) {
      let childArr = cancelNode.children
      if (hasCheckedItem !== cancelNode[checedType]) {
        if (childArr && childArr.length > 0) {
          for (let i = 0; i < childArr.length; i++) {
            let childNode = childArr[i]
            let checedResult = this.checkedIfIn(childNode, hasCheckedItem, checedType)
            if (checedResult) {
              return true
            }
          }
        }
      } else {
        return true
      }
      return false
    },
    deleteCanceledCheckboxItem(cancelNode) {
      // 如果是取消选择，判定这个去取消的选项以及子项里面有没有在之前选中的列表里面，如果不在列表里面，依旧保存再之前的已选列表中
      let checkedIdArr = []
      this.userSelectCheckboxIdArr.forEach((hasCheckedId) => {
        // 判定当前这个数据是否在取消选择的对象里面
        let checkedResult = this.checkedIfIn(cancelNode, hasCheckedId, 'id')
        // 如果不存在那么就放入数组
        if (!checkedResult) {
          checkedIdArr.push(hasCheckedId)
        }
      })
      this.userSelectCheckboxIdArr = JSON.parse(JSON.stringify(checkedIdArr))
      let checkedNameArr = []
      this.userSelectCheckboxNameArr.forEach((hasCheckedName) => {
        // 判定当前这个数据是否在取消选择的对象里面
        let checkedResult = this.checkedIfIn(cancelNode, hasCheckedName, 'name')
        // 如果不存在那么就放入数组
        if (!checkedResult) {
          checkedNameArr.push(hasCheckedName)
        }
      })
      this.userSelectCheckboxNameArr = JSON.parse(JSON.stringify(checkedNameArr))
    },
    getUsersCheckedNodes(data, checked, indeterminate) {
      // console.log('多选选择框变动', data, checked, indeterminate)
      if (!checked) {
        this.deleteCanceledCheckboxItem(data, checked, indeterminate)
      }
      var checkedData = this.$refs.userListTree.getCheckedNodes()
      let idArr = []
      let nameArr = []
      checkedData.forEach((val, i) => {
        // type === 1判定是否是用户
        if (val.type === 1) {
          idArr.push(val.id)
          nameArr.push(val.name)
        }
      })

      this.userSelectCheckboxIdArr = Array.from(new Set(this.userSelectCheckboxIdArr.concat(idArr)))
      this.userSelectCheckboxNameArr = Array.from(new Set(this.userSelectCheckboxNameArr.concat(nameArr)))
      this.userSelectCheckboxId = this.userSelectCheckboxIdArr.join(',')
      this.userSelectCheckboxName = this.userSelectCheckboxNameArr.join(',')
    },
    async checkChange() {
      let idsOfRegion = ''
      let idsArrOfRegion = []
      let data = this.$refs.areaTree.getCheckedNodes()
      data.forEach((val, i) => {
        idsArrOfRegion.push(val.id)
      })
      idsOfRegion = idsArrOfRegion.join(',')
      this.getRegionUser(idsOfRegion)
    },
    async getRegionUser(ids) {
      console.log(ids)
      if (ids) {
        let res = await this.$api.getUserOfRegion({
          data: {
            regionId: ids
          }
        })
        if (res.code === 0) {
          // 清空children
          this.userListRadio = res.data
          this.userListCheckbox = res.data
        }
      }
    },
    // 初始化赋值，初始勾选--复选框
    setDataCheckBox(ids, names) {
      // 把所有checked 变成false
      // 把所有的勾选去掉
      // this.$refs.userListTree.setCheckedKeys(ids.split(','));
      console.log('初始化赋值', ids, names)
      this.ids = ids
      this.names = names
    },
    // 初始化赋值，初始勾选--单选框
    setDataRadio(id, name) {
      console.log('id', id, this.checkboxFlag, this.$refs)
      this.id = Number(id)
      // this.$refs.userListTreeRadio.setCheckedKeys([id]);
      this.names = name
    },
    // 子组件方法 重置
    clear() {
      this.getData()
      this.userSelectId = ''
      this.userSelectName = ''
      this.userSelectCheckboxId = ''
      this.userSelectCheckboxName = ''
      this.names = ''
      // 左边区域勾选清除
      this.areaList[0].checked = false
    },
    // 修改页面初始化userSelectId， userSelectName
    resetE(id, name) {
      this.userSelectId = id
      this.userSelectName = name
    },
    // 请求数据
    async getData() {
      let res = await this.$api.sysRegion({ })
      if (res.code === 0) {
        // 清空children
        console.log('res.data', res.data)
        this.areaList = res.data
      }
      let res2 = await this.$api.getUserOfRegion({
      })
      if (res2.code === 0) {
        // 清空children
        this.userListRadio = res2.data
        this.userListCheckbox = res2.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .area-user-select {
    .area-u{
      .el-dialog__wrapper{
        /*z-index: 3500!important;*/
      }
    }
  }
  .tree {
    display: flex;
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
    .tree_left {
      width: 260px;
      margin-right: 16px;
      .leftTreeBox {
        width: 232px;
        height: 280px;
        background: #f8f8f9;
        border: 1px solid #dddee1;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-top: 12px;
        padding-top: 10px;
        padding-left: 24px;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    .tree_right {
      width: 260px;
      .rightTreeBox {
        width: 234px;
        height: 280px;
        background: #f8f8f9;
        border: 1px solid #dddee1;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-top: 12px;
        padding-top: 10px;
        padding-left: 24px;
        overflow-y: auto;
      }
    }
    .el-tree {
      background: #f8f8f9;
    }
    .el-tree-node__label{
      cursor: default;
    }
    .el-tree-node__content{
      cursor: default;
    }
  }

</style>
