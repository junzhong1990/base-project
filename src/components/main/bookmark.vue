
<template>
  <div class="statistics-mark-div">
    <!--    展示统计分析的区域切换-->
    <el-popover
      placement="bottom"
      trigger="hover"
      popper-class="set-popover">
      <span slot="reference" class="opr-icon el-icon-star-off" @click="openDialog"></span>
      <div class="set-popover-text">
        <span class="set-popover-text" @click="markDialog = true" >整理收藏夹</span>
      </div>
    </el-popover>
    <el-dialog
      title="整理收藏夹"
      :visible.sync="markDialog"
      :append-to-body="true"
      width="80%"
    >
      <ToolList :tools="tools" />
      <TableBody
        :tableData="tableData"
        :column="columnTitle"
        >
        <el-table-column slot="options" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editCollection(scope.row)">重命名/移动到</el-button>
            <el-button type="text" @click="deleteCollection(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </TableBody>
    </el-dialog>

    <el-dialog
      title="重命名/移动到"
      :visible.sync="editFavorites"
      :append-to-body="true"
    >
      <el-form
        ref="favoritesForm"
        :rules="rules"
        :model="favoritesForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model.trim="favoritesForm.name" maxlength="20" ></el-input>
        </el-form-item>
        <el-form-item label="分组" prop="groupId" >
          <el-select v-model="favoritesForm.groupId" placeholder="请选择" >
            <el-option v-for="item in groupList" :key="item.value"
                       :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-row class="el-form-item sc-edit-btn">
            <el-button type="primary" v-prevent="1000" size="medium" @click="submitFavorites">保 存</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="groupForm.title"
      :visible.sync="editGroupName"
      :append-to-body="true"
    >
      <el-form
        ref="groupForm"
        :rules="rules"
        :model="groupForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model.trim="groupForm.name" maxlength="20" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-row class="el-form-item sc-edit-btn">
            <el-button type="primary" v-prevent="1000" size="medium" @click="submitGroup">保 存</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex'
  export default {
    data() {
      return {
        childObj: {},
        editFavorites: false,
        favoritesForm: {},
        groupList: [],
        tableData: [],
        columnTitle: [
          {
            label: '名称',
            prop: 'text'
          },
        ],
        tools: [],
        nowGroup: {},
        editGroupName: false,
        markDialog: false,
        groupForm: {},
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
        },
      }
    },
    computed: {
      ...mapGetters(['dssPageParam', 'dssMenu', 'dssResourceCode'])
    },
    created() {
    },
    methods: {
      ...mapMutations(['SET_DSSMENU', 'SET_DSSPAGEPARAM']),
      deleteCollection(item) {
        console.log('item', item)
        this.$common
          .showConfirm()
          .then(async () => {
            let res = await this.$api.deleteFavorites({
              message: '删除成功',
              data: {
                id: item.favoritesId
              }
            })
            console.log(res)
            if (res && res.code === 0) {
              this.openDialog()
            }
          })
          .catch(() => {})
      },
      editCollection(item) {
        this.favoritesForm = item
        this.$set(this.favoritesForm, 'name', item.text)
        this.$set(this.favoritesForm, 'groupId', item.groupId + '')
        console.log('item', item, this.favoritesForm)
        this.editFavorites = true
      },
      async submitFavorites() {
        console.log('this.favoritesForm', this.favoritesForm)
        let favoritesGroupName = this.groupList.find(group => group.value === this.favoritesForm.groupId).label
        let data = {
          favoritesGroupName,
          name: this.favoritesForm.name,
          id: this.favoritesForm.favoritesId,
          favoritesGroupPid: 0,
          comments: this.favoritesForm.comments,
          param: this.favoritesForm.param,
          url: this.favoritesForm.code,
        }
        let res = await this.$api.addFavorites({ message: '修改成功', data})
        if (res && res.code === 0) {
          this.editFavorites = false
          this.openDialog()
        }
      },
      async getStatisticsMenu() {
        let collectionMenu = []
        let res1 = await this.$api.selectFavorites({})
        if (res1 && res1.code === 0 && res1.data.length > 0) {
          let childObj = {}
          res1.data.forEach(d => {
            let key = d.groupId
            if (!childObj[key]) {
              childObj[key] = {
                id: key,
                code: 'group' + key,
                text: d.groupName,
                children: []
              }
            }
            childObj[key].children.push(d)
          })
          collectionMenu = [{
            id: 'fa_0000',
            code: 'bookmark',
            text: '收藏夹',
            children: Object.values(childObj)
          }]
          this.childObj = childObj
        }
        this.SET_DSSMENU(
          collectionMenu
        )
      },
      typeSelect(val) {
        this.nowGroup = this.groupList.find(group => group.value === val)
        console.log('下拉框切换', val, this.nowGroup)
        this.tableData = this.childObj[Number(this.nowGroup.value)] ? this.childObj[Number(this.nowGroup.value)].children : []
      },
      addGroup() {
        this.groupForm = {
          api: 'addFavoritesGroup',
          title: '新增分组'
        }
        this.$set(this.groupForm, 'name', '')
        this.editGroupName = true
      },
      editGroup() {
        if (this.nowGroup.label === '默认') {
          this.$message.warning('默认分组无法修改')
          return
        }
        this.groupForm = {
          api: 'updateFavoritesGroup',
          title: '修改分组',
          id: this.nowGroup.value
        }
        this.$set(this.groupForm, 'name', this.nowGroup.label)
        this.editGroupName = true
      },
      async getGroup() {
        let res = await this.$api.selectFavoritesGroup({})
        if (res && res.code === 0) {
          this.groupList = res.data.map(group => {
            return {
              label: group.name,
              value: group.id + '',
            }
          })
        }
      },
      deleteGoup() {
        if (this.nowGroup.label === '默认') {
          this.$message.warning('默认分组无法删除')
          return
        }
        this.$common
          .showConfirm()
          .then(async () => {
            let res = await this.$api.deleteFavoritesGroup({
              message: '删除成功',
              data: {
                id: Number(this.nowGroup.value)
              }
            })
            console.log(res)
            if (res && res.code === 0) {
              this.openDialog()
            }
          })
          .catch(() => {})
      },
      async openDialog() {
        this.markDialog = true
        await this.getGroup()
        this.nowGroup = this.groupList[0]
        this.tools = [
          {
            label: '分组',
            type: 'select',
            prop: 'group',
            defaultValue: this.nowGroup.value,
            options: this.groupList,
            func: (val) => this.typeSelect(val)
          },
          {
            label: '添加分组',
            func: () => this.addGroup()
          },
          {
            label: '修改分组名称',
            func: () => this.editGroup()
          },
          {
            label: '删除分组',
            func: () => this.deleteGoup()
          },
        ]
        await this.getStatisticsMenu()
        this.tableData = this.childObj[Number(this.nowGroup.value)] ? this.childObj[Number(this.nowGroup.value)].children : []
      },
      async submitGroup() {
        let data = {
          groupName: this.groupForm.name,
          id: this.groupForm.id,
          pid: 0
        }
        let res = await this.$api[this.groupForm.api]({message: `${this.groupForm.title}成功`, data})
        if (res && res.code === 0) {
          this.editGroupName = false
          this.openDialog()
        }
      },
    }
  }
</script>

<style lang="less">
  .statistics-mark-div {
    display: inline-block;
    .opr-icon {
      font-size: 22px;
      color: #666;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
