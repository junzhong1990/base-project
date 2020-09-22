

<template>
  <div class="collection">
    <!--    展示统计分析的区域切换-->
    <glSvgIcon class="opr-icon"  iconClass="aixin" @click="openDialog"/>

    <span class="opr-icon" @click="openDialog" >收藏</span>


    <el-dialog
      title="收藏"
      :visible.sync="markDialog"
      :append-to-body="true"

    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="名称" prop="name">
          <el-input type="text" v-model.trim="ruleForm.name" maxlength="20" ></el-input>
        </el-form-item>

        <el-form-item>
          <el-row class="el-form-item sc-edit-btn">
            <el-button type="primary" v-prevent="1000" size="medium" @click="submit">保 存</el-button>
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
        markDialog: false,
        ruleForm: {},
        rules: {
          name: [
            { required: true, message: "请输入名称", trigger: 'blur' },
          ],
        },
      }
    },
    computed: {

      ...mapGetters(['dssPageParam', 'dssMenu', 'dssResourceCode']),

    },

    created() {
      console.log('收藏初始化---待联调后删除', this.dssPageParam, this.dssMenu)

    },
    methods: {
      ...mapMutations(['SET_DSSMENU', ]),
      openDialog() {
        this.$set(this.ruleForm, 'name', this.dssResourceCode.text)
        this.markDialog = true
        console.log('当前页面的dssResourceCode', this.dssResourceCode)
      },
      async getStatisticsMenu() {
        let collectionMenu = []
        let res1 = await this.$api.selectFavorites({  })
        if (res1 && res1.code == 0 && res1.data.length > 0) {
          let childObj = {}
          res1.data.forEach(d => {
            let key = d.groupId
            if(!childObj[key]) {
              childObj[key] = {
                id: key,
                code: 'group' + key,
                text: d.groupName,
                children: []
              }
            }
            childObj[key].children.push(d)
          })
          collectionMenu =  [{
            id: 'fa_0000',
            code: 'bookmark',
            text: '收藏夹',
            children: Object.values(childObj)
          }]
        }
        this.SET_DSSMENU(
          collectionMenu
        )
      },
      submit() {
        console.log('当前 dssPageParam', this.dssPageParam)
        this.$refs.ruleForm.validate( async (valid) => {
          if (valid) {
            let data = {
              comments: '',
              favoritesGroupName: '默认',
              favoritesGroupPid: 0, // 确认一下默认的 id 值
              name: this.ruleForm.name,
              param: JSON.stringify(this.dssPageParam),
              url: this.dssResourceCode.code + '&&fa' + new Date().valueOf()
            }
            let res = await this.$api.addFavorites({ message: '新增成功', data})
            if (res && res.code === 0) {
              this.getStatisticsMenu()
            }

            this.markDialog = false
          }
        })

      },
    }
  }
</script>

<style lang="less">
  .collection {
    position: absolute;
    top: 2px;
    right: 30px;
    display: inline-block;
    .opr-icon {
      font-size: 14px;
      color: #666;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }


  }

</style>
