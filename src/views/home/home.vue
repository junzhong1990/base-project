<template>
  <div class="home-container">
    <sideMenu></sideMenu>
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
  </div>
</template>

<script>
  import { keepAlive } from '@/utils/cache'
  import sideMenu from '@/components/main/sideMenu'
  import adminHeader from '@/components/main/adminHeader'
  import { mapGetters} from 'vuex'
  // import collection from './collection'

  export default {
    name: 'home',
    components: {
      sideMenu,
      adminHeader,
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
      ...mapGetters(['fsMode']),
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
      // 设置路由高度自适应main-body
      setFullHeight(routerNames) {
        if (routerNames.indexOf(this.$route.name) > -1) {
          this.isFullHeight = true
        } else {
          this.isFullHeight = false
        }
      },
      // 窗口变化设置相关区域高度
      resize() {
        try {
          const header = document.querySelector('.header-container')
          const headHeight = header.offsetHeight
          this.$refs.main.style.height = `${document.documentElement.clientHeight - headHeight}px`
        } catch (error) {
          // 未能获取 .header-container
        }
      },
    }
  }
</script>

<style lang="less">
@import './less/home.less';
</style>
