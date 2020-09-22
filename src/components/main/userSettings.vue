<template>
  <div class="user-setting-comp">
    <base-form
      :formData="form"
      labelWidth="8em"
      ref="baseForm"
      :rules="rules"
      direction="right"
      @change="changeForm"
    ></base-form>
    <el-row class="btn-item">
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        @click="submit"
        :id="$route.name+'-setting-submit'"
      >提 交</el-button>
      <el-button size="medium" @click="resetForm" :id="$route.name+'-setting-reset'">重 置</el-button>
    </el-row>
  </div>
</template>

<script>
import baseForm from './baseForm'
import rules from '@/utils/rules'
import { getUserInfo } from '@/utils/userCache'
// const Base64 = require('js-base64').Base64

export default {
  name: 'userSetting',
  components: {
    baseForm
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      user: {
        avatar: require('@/assets/img/avatar.jpg'),
        institutionName: '',
        lastLoginTime: '2019-10-07',
        loginAddress: '深圳市',
        loginIp: '10.9.0.110',
        name: 'admin'
      },
      newPassword: '',
      param: {},
      loginInfo: {},
      oldAvatar: '',
      formData: null,
      form: [
        {
          title: '用户账号',
          type: 'input',
          prop: 'account',
          value: '',
          disabled: true
        },
        {
          title: '用户姓名',
          type: 'input',
          prop: 'name',
          value: '',
          disabled: true
        },
        {
          title: '手机号',
          type: 'input',
          prop: 'mobile',
          value: '',
          disabled: true
        },
        // {
        //   title: "邮箱",
        //   type: "input",
        //   prop: "email",
        //   value: "",
        //   disabled: true
        // },
        {
          title: '请输入旧密码',
          type: 'password',
          prop: 'oldPassword',
          value: '',
          placeholder: '请输入旧密码',
          icon: 'lock'
        },
        {
          title: '请输入新密码',
          type: 'password',
          prop: 'newPassword',
          value: '',
          placeholder: '请输入新密码',
          icon: 'lock'
        },
        {
          title: '请重复新密码',
          type: 'password',
          prop: 'rePassword',
          value: '',
          placeholder: '请重复新密码',
          icon: 'lock'
        }
      ],
      rules: {
        password: [
          {
            validator: rules.checkPwd,
            trigger: ['change', 'blur']
          }
        ],
        newPassword: [
          {
            validator: rules.checkPwd,
            trigger: ['change', 'blur']
          }
        ],
        rePassword: [
          {
            validator: rules.checkPwd,
            trigger: ['change', 'blur']
          },
          {
            validator: validatePass2,
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    formData: {
      handler(form) {
        if (
          form.password === '' &&
          form.newPassword === '' &&
          form.rePassword === ''
        ) {
          this.$nextTick(() => {
            this.$refs.baseForm.$refs.form.clearValidate()
          })
        }
      },
      deep: true
    }
  },
  created() {
    this.loginInfo = getUserInfo()
    this.oldAvatar = this.loginInfo.avatar
    this.param = {
      userPath: this.oldAvatar
    }
    this.form.forEach((item) => {
      if (item.prop in this.loginInfo) {
        item.value = this.loginInfo[item.prop]
      }
    })
  },
  mounted() {
    this.formData = this.$refs.baseForm.form
  },
  methods: {
    changeForm(val) {
      this.param = {
        ...this.param,
        ...val
      }
      delete this.param.rePassword
      this.param.type = Number(val.type)
      this.newPassword = val.newPassword
    },
    async save(data) {
      console.log(data)
      let res = await this.$api.modifyPwd({
        message: '修改密码成功,请重新登录',
        data
      })
      console.log(res)
      if (res && res.code === 0) {
        this.$router.push({
          name: 'login'
        })
      }
    },
    async submit() {
      const data = { ...this.param, type: 1 }
      if (data.password || data.newPassword || data.rePassword) {
        this.$refs.baseForm.validate((val) => {
          if (val === 'true') {
            this.save(data)
          }
        })
      } else {
        delete data.password
        delete data.newPassword
        delete data.rePassword
        this.save(data)
      }
    },
    resetForm() {
      this.$refs.baseForm.resetForm()
      this.param.userPath = this.oldAvatar
    },
  }
}
</script>

<style lang="less">
.user-setting-comp {
  .btn-item {
    padding: 20px 0;
    padding-left: 100px;
    text-align: right;
  }
}
</style>
