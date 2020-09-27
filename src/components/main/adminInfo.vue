<template>
  <div class="user-admin">
    <!-- 切换按钮 -->
    <!-- <router-link class="opr-icon iconfont icon-shouye" tag="span" :to="{name: 'situation'}" v-if="showSituation"></router-link> -->
    <statisticsManageArea v-if="showStatisticsManage" />
    <bookmark v-if="showStatisticsManage" />
    <span class="opr-icon" @click="jumpTo('homePage')" v-if="showSituation" v-show="$store.state.device == 'desktop'">
      <glSvgIcon iconClass="home" />
    </span>
    <router-link class="opr-icon icon-tab" tag="span" :to="{name: 'entry'}" v-if="showEntry" v-show="$store.state.device == 'desktop'">
      <glSvgIcon iconClass="iconSort" />
    </router-link>
    <!-- 系统设置 -->
    <el-popover
      placement="bottom"
      trigger="hover"
      v-show="$store.state.device == 'desktop'"
      popper-class="set-popover">
      <span slot="reference" class="opr-icon" @click="jumpTo('system')">
        <glSvgIcon iconClass="setting" style="font-size:20px" />
      </span>
        <div class="set-popover-text">
          <span @click="jumpTo('system')">系统设置</span>
        </div>
    </el-popover>
    <!-- 全屏切换 -->
    <span class="opr-icon" @click="fullScreen(null)" v-if="!isFull" v-show="$store.state.device == 'desktop'">
      <glSvgIcon iconClass="fullscreen" />
    </span>
    <span class="opr-icon" @click="exitFullScreen" v-else v-show="$store.state.device == 'desktop'">
      <glSvgIcon iconClass="exitFullScreen" />
    </span>
    <!-- 锁住按钮 -->
    <span class="opr-icon" @click="lock" v-show="$store.state.device == 'desktop'">
      <glSvgIcon iconClass="lock" style="font-size:18px" />
    </span>
    <!-- 通知 -->
    <!--<span class="opr-icon" @click="showMessageDock = true">-->
      <!--<glSvgIcon iconClass="ring" />-->
    <!--</span>-->
    <!-- 退出 -->
    <span class="opr-icon" @click="logoutConfirm" v-show="$store.state.device == 'desktop'">
      <glSvgIcon iconClass="turnoff" />
    </span>
    <span class="el-dropdown-link">
      <span class="user-info">
        <el-popover placement="bottom" width="320" trigger="click">
          <!--<span slot="reference">-->
          <!--<span class="avatar">-->
          <!--<img v-if="loginInfo.avatar" :src="loginInfo.avatar" @error="loginInfo.avatar = ''" />-->
          <!--<i v-else class="iconfont icon-touxiang"></i>-->
          <!--</span>-->
          <!--<span class="user-name">{{loginInfo.userName}}</span>-->
          <!--</span>  -->
          <span slot="reference">
            <span class="avatar">
              <!-- <i class="iconfont icon-touxiang"></i> -->
              <glSvgIcon iconClass="touxiang" style="font-size:32px" />
            </span>
            <span class="user-name">{{loginInfo.userName}}</span>
          </span>
          <el-card class="box-card user-info-content">
            <div slot="header" class="clearfix">
              <span>用户信息</span>
              <el-button
              style="float: right; padding: 0;"
              type="text"
              @click="showUserSettings = true"
              >用户设置</el-button>
            </div>
            <div class="info-item">
              <span class="title">用户账号：</span>
              {{loginInfo.account}}
            </div>
            <div class="info-item">
              <span class="title">手机号码：</span>
              {{loginInfo.mobile}}
            </div>

          </el-card>
        </el-popover>
      </span>
    </span>
    <!-- 用户设置 -->
    <el-dialog
       title="用户设置"
       top="8vh"
       :visible.sync="showUserSettings"
       :append-to-body="true"
       :close-on-click-modal="false"
       width="800px"
    >
      <user-settings @enter="showUserSettings = false"></user-settings>
    </el-dialog>

    <!-- 站内信 -->
    <!--<message-dock :showDialog.sync="showMessageDock"></message-dock>-->
  </div>
</template>

<script>
// import moment from 'moment'
import {mapGetters, mapActions, mapMutations} from 'vuex'
// import storage from '@/utils/storage'
import windowScreen from '@/utils/windowScreen'
// import messageDock from './messageDock'
import userSettings from './userSettings'
import statisticsManageArea from './statisticsManageArea'
import bookmark from './bookmark'
import {Notification} from 'element-ui'
import * as userCache from '@/utils/userCache'

export default {
  name: 'adminInfo',
  components: {
    // messageDock,
    userSettings,
    statisticsManageArea,
    bookmark
  },
  data() {
    return {
      ws: null,
      showMessageDock: false,
      showUserSettings: false,
      entryList: []
      // isFull: true,
      // loginInfo: {
      //   name: 'admin',
      //   userName: 'admin',
      //   mobile: '15422211123',
      //   account: 'admin',
      //   lastLoginTime: '2020-02-20',
      //   loginIp: '2020-02-20',
      //   avatar: a
      // }
    }
  },
  computed: {
    showSituation() {
      return this.$route.name !== 'situation'
    },
    showEntry() {
      return this.$route.name !== 'entry'
    },
    showStatisticsManage() {
      return this.$route.path.includes('/statisticsManage')
    },
    ...mapGetters(['isFull', 'fsMode', 'loginInfo'])
  },
  created() {
    this.watchScreen(
      () => {
        this.setFull(true)
        // this.isFull = true
      },
      () => {
        this.setFull(false)
        // this.isFull = false
      }
    )
    // this.getPidTree()
  },
  mounted() {
    // this.getSysDic()
  },
  methods: {
    ...mapMutations(['SET_DICSTORE', 'SET_ENTRYLIST']),
    // 设置数据字典
    async getSysDic() {
      const data = userCache.getDicData()
      if (data) {
        this.SET_DICSTORE(data)
        return
      }
      const res = await this.$api.sysDataDict()
      if (res && res.code === 0) {
        this.SET_DICSTORE(res.data)
        userCache.setDicData(res.data)
      }
    },
    async getPidTree() {
      let res = await this.$api.getUserResources({})
      if (res && res.code === 0) {
        this.entryList = res.data || []
        this.SET_ENTRYLIST(this.entryList)
      }
    },
    async jumpTo(code) {
      if (!this.entryList.length) return
      let item = this.entryList.find(v => v.code === code)
      const res = await this.$api.autResourcesDetail({data: { id: item.id }})
      if (res && res.code === 0) {
        let path = res.data.uriList[0].url
        this.$router.push({ path: path.indexOf('/') ? `/${path}` : path })
        const modelData = userCache.getNowModel()
        if (modelData.id !== item.id) {
          userCache.setNowModel(item)
          this.clearRouterTags()
          this.eventBus.$emit('refreshMenu', Date.now())
          this.eventBus.$emit('refreshHeaderTitle', item)
        }
      }
    },
    logoutConfirm() {
      this.$common.showConfirm()
        .then(() => {
          this.loginOut()
        })
        .catch(() => {
        })
    },
    async loginOut() {
      // this.$router.push({
      //   path: '/login'
      // })
      const res = await this.$api.getLogOut({
        message: '退出成功',
        data: {
          token: userCache.getToken()
        }
      })
      if (res && res.code === 0) {
        userCache.clear()
        Notification.closeAll()
        this.$router.push({
          path: '/login'
        })
        // return
      }
    },
    lock() {
      this.eventBus.$emit('lock', true)
    },
    fullScreen: windowScreen.fullScreen,
    exitFullScreen: windowScreen.exitFullScreen,
    watchScreen: windowScreen.watchScreen,
    // watchScreen(fullCb, exitCb) {
    //   window.addEventListener('resize', () => {
    //     const isFull = !!(document.webkitIsFullScreen || document.mozFullScreen ||
    //       document.msFullscreenElement || document.fullscreenElement
    //     )
    //     if (isFull) {
    //       fullCb()
    //     } else {
    //       exitCb()
    //     }
    //   })
    // }
    ...mapActions(['setFull', 'setFontSize', 'clearRouterTags'])
  }
}
</script>

<style lang="less" scoped>
  .user-admin {
    position: absolute;
    right: 2%;
    top: 15px;
    color: #666;
    .msg-tips {
      color: #2d8cf0;
      font-size: 12px;
      margin-right: 15px;
      cursor: pointer;
      .icon {
        font-size: 20px;
        color: #333333;
        font-weight: bold;
      }
    }
    .user-info {
      line-height: 32px;
      cursor: pointer;
    }
    .user-name {
      font-size: 14px;
    }
    .avatar {
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin: 0 5px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .iconfont {
        font-size: 32px;
        color: #bdbdbd;
      }
    }
    .opr-icon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 24px;
      font-size: 16px;
      color: #AEB5BE;
      cursor: pointer;
    }
    .icon-tab{
      transform: rotate(90deg);
    }
    .logout {
      margin-right: 30px;
    }

  }

  /deep/ .el-dialog__body {
    padding: 20px 40px;
  }

  /deep/ .user-setting-comp {
    /deep/ .el-form-item__label, /deep/ .el-form-item__content, /deep/ .el-input__inner {
      font-size: 13px;
    }
  }
</style>
<style lang="less">
  .user-info-content {
    &.el-card {
      background-color: transparent;
      border: none;
      box-shadow: none;
      margin: -10px;
      font-size: 13px;
      color: #999;
    }
    .el-button--text {
      font-size: 12px;
    }
    .el-card__header {
      padding: 10px 15px;
    }
    .el-card__body {
      padding: 10px 15px;
    }
    .info-item {
      line-height: 2;
      font-size: 12px;
      .title {
        color: #999;
        display: inline-block;
        vertical-align: top;
        width: 5.5em;
      }
      color: #333;
    }
  }

  .entry-container .entry-hd,
  .home-container .user-admin {
    .message-content {
      margin-right: 0;
      line-height: 0;
      .el-badge__content {
        line-height: 16px;
        border-radius: 50%;
        padding: 2px 2px;
        width: 22px;
        text-align: center;
        height: 22px;
      }
    }
  }

  .pb-20 {
    padding-bottom: 20px;
  }
  .set-popover{
    min-width: 80px !important;
    .set-popover-text{
      text-align: center;
      span{
        cursor: pointer;
      }
    }
  }
</style>
