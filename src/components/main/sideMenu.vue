<template>
  <div class="sideMenu-container">
    <el-row class="tac">
      <el-col class="menu-group">
        <el-menu ref="elMenu" :default-active="$route.query.faFlag || $route.query.activeName || $route.meta.parentName || $route.name" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :unique-opened="true">
          <li class="menu-logo" @click="jumpTo('homePage')" v-if="showLogo">
            <span class="ct">
              <span :class="['logo-box',isCollapse ? 'iscoll' : '']">
                <glSvgIcon iconClass="logo" style="font-size: 36px" />
              </span>
              <span class="name">{{sysName}}</span>
            </span>
          </li>
          <li class="menu-wrapper" :style="{ top: (!showLogo ? 0 : 60) + 'px' }">
            <menu-tree :menuData="menuList"></menu-tree>
            <menu-tree v-if="showStatisticsManage" :menuData="dssMenu"></menu-tree>
          </li>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import menuTree from './menuTree'
// import storage from '@/utils/storage'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import * as userCache from '@/utils/userCache'

export default {
  name: 'sideMenu',
  components: {
    menuTree
  },
  data() {
    return {
      sysName: '',
      isCollapse: false,
      menuList: null
    }
  },
  computed: {
    ...mapGetters(['entry', 'routerTags', 'menuData', 'dssMenu', 'entryList']),
    showStatisticsManage() {
      return this.$route.path.includes('/statisticsManage')
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    }
  },
  created() {
    this.setSysName()
    this.getList()
  },
  mounted() {
    this.eventBus.$off('refreshMenu')
    this.eventBus.$off('menuCollapse')
    this.eventBus.$on('menuCollapse', (value) => {
      this.isCollapse = value
    })
    this.eventBus.$on('refreshMenu', (v) => {
      this.getList()
      this.setSysName()
    })
  },
  methods: {
    ...mapMutations(['SET_DSSRESOURCECODE', 'SET_DSSMENU']),
    ...mapActions(['clearRouterTags']),
    async getStatisticsMenu() {
      let collectionMenu = []
      let res1 = await this.$api.selectFavorites({})
      if (res1 && res1.code === 0 && res1.data.length > 0) {
        let childObj = {}
        res1.data.forEach((d) => {
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
        collectionMenu = [
          {
            id: 'fa_0000',
            code: 'bookmark',
            text: '收藏夹',
            children: Object.values(childObj)
          }
        ]
      }
      this.SET_DSSMENU(collectionMenu)
    },
    // 获取菜单列表
    async getList() {
      const self = this
      // let modelData = userCache.getNowModel()
      // let modelData = {
      //   id: '67',
      //   pid: 0,
      //   name: '首页',
      //   code: 'homePage',
      //   ico: 'icon-home',
      //   formId: '',
      //   type: 0,
      //   webUrl: '/home/homePage'
      // }
      // 设置顶级菜单
      // self.menuList = [
      //   {
      //     id: modelData.id,
      //     code: modelData.code,
      //     name: modelData.name,
      //     iconCls: modelData.ico,
      //     type: modelData.type,
      //     children: []
      //   }
      // ]
      // 请求菜单信息
      // let data = {
      //   pid: modelData.id
      // }
      let menuTreeDic = JSON.parse(
        sessionStorage.getItem('menuTreeDic') || '{}'
      )
      // self.menuList = result.data
      self.menuList = [
        {
          id: '4',
          pid: 0,
          name: '日志管理',
          code: 'logManage',
          ico: 'logManage',
          formId: '',
          type: 0,
          // webUrl: "/home/userManage/userList",
          children: [
            {
              id: '4-1',
              pid: 1,
              name: '操作日志',
              code: 'logManage',
              ico: 'logManage',
              formId: '',
              type: 1,
              webUrl: '/home/logManage'
            }
          ]
        },
        {
          id: '5',
          pid: 0,
          name: '帮助文档',
          code: 'helpFiles',
          ico: 'helpFiles',
          formId: '',
          type: 0,
          // webUrl: "/home/userManage/userList",
          children: [
            {
              id: '5-1',
              pid: 1,
              name: '开发者须知',
              code: 'devNeedKnow',
              ico: 'devNeedKnow',
              formId: '',
              type: 1,
              webUrl: '/home/devNeedKnow'
            }
          ]
        },
      ]
      let n = 0
      // 菜单过滤
      let filter = function (treeData) {
        for (let i = 0, len = treeData.length; i < len; i++) {
          treeData[i].text = treeData[i].name
          // 最顶层菜单添加class
          if (n === 0) {
            treeData.map((item) => {
              item.className = 'top-menu-item'
            })
          }
          let children = treeData[i].children || []
          if (!children && children.length === 0) {
            return
          }
          n++
          // 删除图标(最上级以下全部清除)
          if (n > 0) {
            children.map((item) => {
              delete item.iconCls
            })
          }
          // 过滤按钮、已冻结菜单
          // treeData[i].children = children.filter(item => {
          //   if (item.type !== 4 && item.status === 1) {
          //     return true;
          //   }
          // });
          if (!children.length) {
            menuTreeDic[treeData[i].code] = treeData[i]
          }
          filter(children)
        }
        window.sessionStorage.setItem(
          'menuTreeDic',
          JSON.stringify(menuTreeDic)
        )
      }
      filter(self.menuList)
      // !(function filter(treeData) {
      //   for (let i = 0, len = treeData.length; i < len; i++) {
      //     treeData[i].text = treeData[i].name
      //     // 最顶层菜单添加class
      //     if (n === 0) {
      //       treeData.map(item => { item.className = 'top-menu-item' })
      //     }
      //     let children = treeData[i].children || []
      //     if (!children && children.length === 0) {
      //       return
      //     }
      //     n++
      //     // 删除图标(最上级以下全部清除)
      //     if (n > 0) {
      //       children.map(item => { delete item.iconCls })
      //     }
      //     // 过滤按钮、已冻结菜单
      //     // treeData[i].children = children.filter(item => {
      //     //   if (item.type !== 4 && item.status === 1) {
      //     //     return true;
      //     //   }
      //     // });
      //     if (!children.length) {
      //       menuTreeDic[treeData[i].code] = treeData[i]
      //     }
      //     filter(children)
      //   }
      //   window.sessionStorage.setItem('menuTreeDic', JSON.stringify(menuTreeDic))
      // })(self.menuList)
      // let result = await this.$api.getUserResources({ data })
      // if (result && result.code == 0) {
      //   // self.menuList = result.data
      //   self.menuList = [
      //     {
      //       id: "81",
      //       pid: 0,
      //       name: "网点管理",
      //       code: "station",
      //       ico: "icon-station",
      //       formId: "",
      //       type: 0,
      //       webUrl: "/home/stationManage",
      //     }
      //   ]
      //   let n = 0
      //   // 菜单过滤
      //   !(function filter(treeData) {
      //     for (let i = 0, len = treeData.length; i < len; i++) {
      //       treeData[i].text = treeData[i].name
      //       // 最顶层菜单添加class
      //       if (n === 0) {
      //         treeData.map(item => {item.className = 'top-menu-item'})
      //       }
      //       let children = treeData[i].children || []
      //       if (!children && children.length == 0) {
      //         return
      //       }
      //       n++
      //       // 删除图标(最上级以下全部清除)
      //       if (n > 0) {
      //         children.map(item => {delete item.iconCls})
      //       }
      //       // 过滤按钮、已冻结菜单
      //       // treeData[i].children = children.filter(item => {
      //       //   if (item.type !== 4 && item.status === 1) {
      //       //     return true;
      //       //   }
      //       // });
      //       if (!children.length) {
      //         menuTreeDic[treeData[i].code] = treeData[i]
      //       }
      //       filter(children)
      //     }
      //     window.sessionStorage.setItem('menuTreeDic', JSON.stringify(menuTreeDic))
      //   })(self.menuList)
      // }
      if (this.showStatisticsManage) {
        this.getStatisticsMenu()
      }
    },
    handleOpen(key, keyPath) { },
    handleClose(key, keyPath) { },
    select(index, indexPath) { },
    async jumpTo(code) {
      console.log(code)
      if (!this.entryList.length) return
      let item = this.entryList.find((v) => v.code === code)
      const res = await this.$api.autResourcesDetail({ data: { id: item.id } })
      if (res && res.code === 0) {
        let path = res.data.uriList[0].url
        const modelData = userCache.getNowModel()
        if (modelData.id !== item.id) {
          this.$router.push({ path: path.indexOf('/') ? `/${path}` : path })
          userCache.setNowModel(item)
          this.clearRouterTags()
          this.getList()
          this.eventBus.$emit('refreshHeaderTitle', item)
          this.$nextTick((_) => {
            this.setSysName()
          })
        }
      }
    },
    setSysName() {
      // console.log(this.$route)
      const sysNameRoute = this.$route.path.split('/')[2]
      const str =
        {
          stationManage: '站点管理系统'
        }[sysNameRoute] || '管理系统'
      this.sysName = `${str}`
    }
  }
}
</script>

<style lang="less">
.sideMenu-container {
  float: left;
  text-align: left;
  height: 100%;
  overflow: hidden;
  background-color: #001d41;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
  .menu-wrapper {
    position: absolute;
    left: 0;
    top: 64px;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background-color: transparent;
    }
    .el-menu-item,
    .el-submenu__title {
      background-color: transparent;
      height: 50px;
      line-height: 50px;
    }
    .el-submenu .el-menu-item {
      height: 44px;
      line-height: 44px;
    }
  }
  .el-row,
  .menu-group,
  .el-menu {
    height: 100%;
  }
  .el-menu-item,
  .el-submenu__title {
    color: rgba(255, 255, 255, 0.6);
    .svg-icon {
      color: rgba(255, 255, 255, 0.6);
    }
    &:hover {
      // background-color: #1b3054;
      background-color: #003370;
    }
  }
  .top-menu-item .iconfont {
    margin-right: 3px;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    width: 24px;
    text-align: center;
    display: inline-block;
  }
  .el-menu-item:focus {
    background-color: transparent;
  }
  .el-menu {
    border-right: none;
    width: 260px;
    background-color: transparent;
    .el-menu-item.is-active {
      color: #fff;
      background-color: #2064b9;
      font-size: 15px;
      &:focus {
        background-color: #2064b9;
      }
      .svg-icon {
        color: #fff;
      }
    }
    &.el-menu--collapse {
      width: 64px;
      .el-submenu__title {
        .el-submenu__icon-arrow {
          display: none;
        }
      }
      .submenu-title {
        .title {
          display: none;
        }
      }
      .menu-logo {
        .ct {
          width: auto;
        }
        .iconfont {
          font-size: 24px;
        }
        .name {
          display: none;
        }
      }
    }
    // .is-opened {
    //   .el-menu {
    //     // background-color: #303750;
    //   }
    // }
  }

  .menu-logo {
    color: #ffffff;
    line-height: 64px;
    font-size: 0;
    text-align: center;
    background-color: #002553;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    .ct {
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      word-break: keep-all;
      white-space: nowrap;
      display: inline-block;
      vertical-align: top;
      width: 100%;
      text-align: left;
    }
    .name {
      font-size: 18px;
      display: inline-block;
      vertical-align: top;
      word-break: keep-all;
      margin-left: 7px;
    }
    .logo-box {
      background-color: #fff;
      width: 36px;
      height: 36px;
      line-height: 36px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      text-align: center;
    }
    .logo-box.iscoll {
      margin-left: 0px;
    }
    .iconfont {
      color: #e60012;
      font-size: 28px;
    }
  }

  .el-submenu__title {
    .el-submenu__icon-arrow {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .top-menu-item {
    &.is-opened {
      background-color: #001733;
      > .el-submenu__title {
        position: relative;
        color: #fff;
        .iconfont,
        .svg-icon,
        .el-submenu__icon-arrow {
          color: #fff;
        }
      }
    }
  }
}
</style>
