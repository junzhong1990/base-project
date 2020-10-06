<template>
  <div class="locking-container">
    <div class="login-bd">
      <el-avatar class="avatar" :src="loginInfo.avatar" v-if="loginInfo.avatar"></el-avatar>
      <el-avatar icon="el-icon-user-solid" class="avatar" v-else></el-avatar>
      <div class="form-item">
        <el-input
          class="input-box"
          readonly
          @focus="e => {e.target.removeAttribute('readonly')}"
          v-model.trim="password"
          type="password"
          size="small"
          @keyup.enter.native="submit"
        ></el-input>
        <el-button class="enter-btn" icon="el-icon-right" size="small" @click="submit"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { Encrypt } from '@/utils/crypto'
import * as userCache from '@/utils/userCache'

export default {
  name: 'locking',
  data() {
    return {
      password: ''
    }
  },
  computed: {
    ...mapGetters(['loginInfo'])
  },
  created() {
    // this.loginOut()
    this.$glStorage.set('locked', true)
  },
  methods: {
    showMessage(msg) {
      this.$message.closeAll()
      this.$message.error(msg)
    },
    async loginOut() {
      const self = this
      const res = await self.$api.getLogOut()
      if (res && res.code === 0) {
      }
    },
    async submit() {
      if (!this.password.trim()) {
        this.showMessage('请输入密码')
        return
      }
      const res = await this.$api.getLogin({
        closeLoading: true,
        data: {
          account: this.loginInfo.account,
          password: this.password
        }
      })
      if (res && res.code === 0) {
        userCache.setToken(res.data.token)
        userCache.setUserInfo(res.data)
        this.$router.back()
        this.$glStorage.remove('locked')
      }
    }
  }
}
</script>


<style lang="less">
@import './less/locking.less';
</style>
