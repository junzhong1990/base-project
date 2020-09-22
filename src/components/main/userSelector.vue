<!--用户选择-->
<template>
  <el-dialog append-to-body
    title="选择收信人"
    :visible.sync="show"
    :close-on-click-modal="false"
    width="700px"
    @closed="$emit('update:showDialog', false)"
  >
    <el-row>
      <el-col :span="12">
        <p class="col-title">选择机构</p>
        <el-tree :data="insList"
          :props="{
            label: 'text',
            key: 'id',
            children: 'children'
          }"
          ref="insTree"
          node-key="id"
          :expand-on-click-node="false"
          :default-expanded-keys="insExpandedKeys"
          @node-click="insNodeClick"
        >
        </el-tree>
      </el-col>
      <el-col :span="12">
        <p class="col-title">选择用户</p>
        <el-tree :data="userDepartmentList"
          :show-checkbox="true"
          :props="{
            label: 'userName',
            key: 'userId',
            children: 'children'
          }"
          ref="userTree"
          node-key="userId"
          :key="userCheckedKeys.length"
          :default-checked-keys="userCheckedKeys"
          :default-expanded-keys="userExpandedKeys"
        >
        </el-tree>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="show = false">取 消</el-button>
      <el-button size="small" type="primary" @click="enter(false)">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
export default {
  name: 'userSelector',
  props: {
    id: '',
    userCheckedKeys: {
      default: () => []
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog,
      insList: [],
      insExpandedKeys: [],
      userDepartmentList: [],
      userExpandedKeys: [],
    }
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
  },
  created() {
    this.getInsList()
  },
  methods: {
    // 获取用户机构列表
    async getInsList() {
      const res = await this.$api.QueryUserAndInsTree()
      if (res && res.code === 0) {
        this.insList = res.data || []
        this.insExpandedKeys = [res.data[0].id]
      }
    },
    // 获取机构下部门与人员列表
    async getAssigneeUserList(insId) {
      // 切换机构保存已选中用户节点
      this.$nextTick(() => {
        this.enter(true)
      })
      const res = await this.$api.getAssigneeUserList({
        data: {
          insId,
          isShowChild: 0
        }
      })
      if (res && res.code === 0) {
        this.userDepartmentList = JSON.parse(JSON.stringify(res.data || []).replace(/text/g, 'userName'))
      }
    },
    insNodeClick(data, node) {
      console.log('insNodeClick', data, node)
      this.getAssigneeUserList(data.id)
    },
    // 克隆对象
    clone(object) {
      return JSON.parse(JSON.stringify(object))
    },
    // tree转一维数组
    treeTransArr(nodes, childrenAlias = 'children') {
      let result = []
      if (Array.isArray(nodes)) {
        for (let i = 0, l = nodes.length; i < l; i++) {
          result.push(nodes[i])
          if (Array.isArray(nodes[i][childrenAlias]) && nodes[i][childrenAlias].length > 0) {
            result = result.concat(this.treeTransArr(nodes[i][childrenAlias]))
          }
          delete nodes[i][childrenAlias]
        }
      }
      return result
    },
    // 确认选择（包含父节点）
    enter(showDialog) {
      const nodeArr = this.treeTransArr(this.clone(this.userDepartmentList))
      const ref = this.$refs.userTree
      const checkedNodes = ref.getCheckedNodes().concat(ref.getHalfCheckedNodes())
      console.log('checkedNodes', checkedNodes)
      // 获取未选中节点
      const cc = this.clone(checkedNodes)
      const uncheckedNodes = nodeArr
      for (let i = 0; i < uncheckedNodes.length; i++) {
        cc.forEach(_item => {
          delete _item.children
          if (JSON.stringify(uncheckedNodes[i]) === JSON.stringify(_item)) {
            uncheckedNodes.splice(i, 1)
            i -= 1
          }
        })
      }
      this.$emit('checked', {
        checkedNodes,
        uncheckedNodes
      })
      this.show = showDialog || false
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.el-dialog__body{
    padding: 20px;
    font-size: 13px;
    .col-title{
      margin-bottom: 15px;
    }
    .el-tree{
      max-height: 400px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 6px;
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #7a7a7a;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        background   : #ededed;
      }
    }
  }
</style>