<template>
  <div class="home-container">
    <div v-if="$store.state.device === 'mobile' && $store.state.menuOpen" class="drawer-bg" @click="handleClickOutside" />
    <sideMenu v-if="$store.state.device == 'desktop' || $store.state.menuOpen" :class="{ openMenu: $store.state.menuOpen }"></sideMenu>
    <div class="right-container">
      <adminHeader></adminHeader>
      <div class="main" id="main" ref="main">
        <div ref="mainBody" class="main-body" :class="[{fullHeight:isFullHeight},fsMode.className]">
            <div class="card">
              <!-- <collection v-if="showStatisticsManage" /> -->
              <keep-alive >
                <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" class="cardBody"></router-view>
              </keep-alive>
              <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" class="cardBody"></router-view>
            </div>
        </div>
      </div>
    </div>
    <RightPanel v-if="showSettings">
      <Settings />
    </RightPanel>
  </div>
</template>

<script>
  import RightPanel from '@/components/common/rightPanel'
  import { keepAlive } from '@/utils/cache'
  import sideMenu from '@/components/main/sideMenu'
  import adminHeader from '@/components/main/adminHeader'
  import Settings from './settings/index'
  import { mapGetters, mapMutations, mapState } from 'vuex'
  // import store from '@/store'
  // import collection from './collection'
  // const { body } = document
  const WIDTH = 992 // refer to Bootstrap's responsive design
  export default {
    name: 'home',
    components: {
      sideMenu,
      adminHeader,
      RightPanel,
      Settings
      // collection
    },
    data() {
      return {
        isFullHeight: false,
        includes: keepAlive.includes,
        setFullHeightRouters: [
          'addProcess',
          'editProcess'
        ]
      }
    },
    computed: {
      ...mapGetters(['fsMode', 'menuShowFlag']),
      ...mapState({
        showSettings: state => state.settings.showSettings,
      }),
      // showStatisticsManage() {
      //   return this.$route.path.includes('/statisticsManage')
      // },
    },
    beforeRouteLeave (to, from, next) {
      if (to.name === 'entry' || to.name === 'login') {
        // this.clearRouterTags()
      }
      next()
    },
    created() {
      this.setFullHeight(this.setFullHeightRouters)
    },
    mounted() {
      this.resize()
      window.addEventListener('resize', () => {
        this.resizeTimer && clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(this.resize, 500)
      })
    },

    methods: {
      ...mapMutations(['SET_MENUSHOW', 'SET_MENUOPEN']),
      // 设置路由高度自适应main-body
      setFullHeight(routerNames) {
        if (routerNames.indexOf(this.$route.name) > -1) {
          this.isFullHeight = true
        } else {
          this.isFullHeight = false
        }
      },
      isMobileEvent() {
        const rect = document.body.getBoundingClientRect()
        return rect.width - 1 < WIDTH
      },
      // 窗口变化设置相关区域高度
      resize() {
        const isMobile = this.isMobileEvent()
        this.SET_MENUSHOW(isMobile ? 'mobile' : 'desktop')
        console.log(isMobile)
        this.eventBus.$emit('menuCollapse', isMobile)
        if (!isMobile) {
          this.eventBus.$emit('desktopMenu')
        }
        try {
          const header = document.querySelector('.header-container')
          const headHeight = header.offsetHeight
          this.$refs.main.style.height = `${document.documentElement.clientHeight - headHeight}px`
        } catch (error) {
          // 未能获取 .header-container
        }
      },
      handleClickOutside() {
        // this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        console.log(this.$store.state.menuOpen)
        this.SET_MENUOPEN(false)
      }
    }
  }
</script>

<style lang="less">
@import './less/home.less';
</style>
