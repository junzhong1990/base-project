<template>
  <div class="login-container sc-card">
    <div class="mid">
      <div class="innerBox">
        <!--<img :src="logoImg" class="companyLogo"/>-->
        <div class="form-bd">
          <!--<img :src="titleImg" class="title"/>-->
          <div class="sc-edit-single">
            <div class="inputAll">
              <el-form ref="form" :model="form" :rules="rules">
                <el-form-item prop="account">
                  <el-input readonly @focus="e => {e.target.removeAttribute('readonly')}" prefix-icon="el-icon-user"
                            v-model.trim="form.account" placeholder="请输入用户账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input readonly @focus="e => {e.target.removeAttribute('readonly')}" prefix-icon="el-icon-lock"
                            type="password" v-model.trim="form.password" placeholder="请输入用户密码"
                            @keyup.enter.native="login"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <!-- <div style="display: flex; justify-content: flex-end;margin-bottom: 20px;margin-top: -12px;" @click="forget">忘记密码</div> -->
            <!--<onlineCtest></onlineCtest>-->
            <!--<PageHeader1-->
                <!--:title="'维修员详情'">-->
            <!--</PageHeader1>-->
            <div class="registerPwd">
              <el-row>
                <el-button class="btn" @click="login">{{$t('user.login')}}</el-button>
              </el-row>
              <el-radio-group v-model="language" size="mini">
                <el-radio v-for="item of lang" :label="item.value" :key="item.label" border>{{item.label}}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loginCopyright">
      <!--Copyright @ 2019 重庆福利彩票发行中心 All Rights Reserved-->
      Copyright @ 穗彩科技开发有限公司 2020
    </div>

  </div>
</template>

<script>
import storage from '@/utils/storage'
import rules from '@/utils/rules'
import * as userCache from '@/utils/userCache'
// import { mapMutations } from 'vuex'

export default {
  name: 'login',
  data() {
    return {
      language: 0,
      langList: ['zh', 'en', 'ko'],
      lang: [
        {
          label: this.$t('MESSAGE-ZH'),
          value: 0
        },
        {
          label: this.$t('MESSAGE-EN'),
          value: 1
        },
        {
          label: this.$t('MESSAGE-KO'),
          value: 2
        }
      ],
      logoImg: require('@/assets/img/companyLogo.png'),
      titleImg: require('@/assets/img/title.png'),
      menuBtnList: [],
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          {required: true, validator: rules.checkAccount, trigger: ['change', 'blur']}
        ],
        password: [
          {required: true, validator: rules.checkPwd, trigger: ['blur']}
        ]
      }
    }
  },
  watch: {
    language: function(val) {
      this.$i18n.locale = this.langList[val]
      // val === 0 ? (this.$i18n.locale = 'zh') : (this.$i18n.locale = 'en')
      this.$set(this.lang, 0, { label: this.$t('MESSAGE-ZH'), value: 0 })
      this.$set(this.lang, 1, { label: this.$t('MESSAGE-EN'), value: 1 })
      this.$set(this.lang, 2, { label: this.$t('MESSAGE-KO'), value: 2 })
    }
  },
  computed: {},
  async created() {
    let ticketObj = this.$route.fullPath.split('?')[1]
    if (ticketObj) {
      let ticketId = ticketObj.split('=')[1]
      let data = {
        ticketId
      }
      this.loginFunc(data)
    }
  },
  mounted() {
    // this.toHome()
    this.$i18n.locale === 'zh' ? (this.language = 0) : (this.language = 1)
  },
  methods: {
    // ...mapMutations(['SET_LOGININFO']),
    // 用户登录后，重新访问登录界面跳转到系统首页
    async toHome() {
      console.log(2)
      const userInfo = userCache.getUserInfo()
      if (userInfo.token) {
        userCache.setToken(userInfo.token)
        this.$nextTick(async() => {
          await this.getPidTree()
          this.$router.push({
            name: 'situation'
          })
        })
      }
    },
    // forget() {
    //   console.log(2)
    //   this.$confirm('忘记密码，请联系管理员?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // this.$message({
    //     //   type: 'success',
    //     //   message: '成功!'
    //     // })
    //   }).catch(() => {
    //     // this.$message({
    //     //   type: 'info',
    //     //   message: '已取消删除'
    //     // })
    //   })
    // },
    async getPidTree() {
      console.log('login获取 pid')
      let reslt = await this.$api.getUserResources({
      })
      if (reslt && reslt.code === 0) {
        if (reslt.data && reslt.data.length > 0) {
          // 设置父级资源的参数
          let entryList = reslt.data
          let shouyeItem = entryList.find(item => item.code === 'homePage')
          console.log('shouyeItem', shouyeItem)
          userCache.setNowModel(shouyeItem)
        }
      }
    },
    async loginFunc(data) {
      const res = await this.$api.getLogin({
        message: '登录成功',
        data
      })
      if (res && res.code === 0) {
        console.log(res)
        userCache.setToken(res.data)
        storage.set('lang', this.langList[this.language])
        this.$router.push({
          name: 'resourceManage'
        })
      }
    },
    login() {
      storage.set('lang', this.langList[this.language])
      this.$router.push({
        name: 'logManage'
      })
      // this.$refs.form.validate(async val => {
      //   if (val) {
      //     const data = {
      //       account: this.form.account,
      //       password: this.form.password
      //     };
      //     await this.loginFunc(data)
      //   }
      // })
    }
  }
}
</script>


<style lang="less" scoped>
  @import "./less/login.less";
</style>
