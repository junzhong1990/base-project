<template>
  <div class="header-container">
    <div class="top-bd">
      <!-- <i class="menu-collapse el-icon-s-fold" :class="{isCollapse: isCollapse}" @click="menuCollapse"></i> -->
      <span class="menu-collapse" :class="{isCollapse: isCollapse}">
        <glSvgIcon iconClass="menuCollapse" style="font-size:18px"  @click="menuCollapse" />
      </span>
      <span class="headline">{{title}}</span>
      <admin-info></admin-info>
    </div>
    <page-tags></page-tags>
  </div>
</template>
<script>
// import storage from '@/utils/storage'
import pageTags from './pageTags'
import adminInfo from './adminInfo'
import { getNowModel } from '@/utils/userCache'
// import {mapGetters} from 'vuex'
export default {
  name: 'adminHeader',
  components: {
    adminInfo,
    pageTags
  },
  data() {
    return {
      isCollapse: false,
      title: ''
    }
  },
  mounted() {
    this.title = getNowModel().name || '业务管理'
    this.eventBus.$on('refreshHeaderTitle', v => {
      this.title = v.name || '业务管理'
    })
  },
  methods: {
    menuCollapse() {
      const self = this
      if (self.isCollapse) {
        self.eventBus.$emit('menuCollapse', false)
        self.isCollapse = false
        return
      }
      self.eventBus.$emit('menuCollapse', true)
      self.isCollapse = true
    }
  }
}
</script>

<style lang="less" scoped>
  .header-container{
    position: relative;
    z-index: 9;
    text-align: left;
    /*box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);*/
    background: #fff;
    .top-bd{
      background-color: #fff;
      height: 64px;
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
    }
    .headline{
      display: inline-block;
      // vertical-align: top;
      line-height: 64px;
      font-size: 18px;
      color: #6D737A;
    }
    .menu-collapse{
      display: inline-block;
      line-height: 64px;
      padding-left: 24px;
      padding-right: 10px;
      font-size: 24px;
      transition: all 0.3s ease 0s;
      color: #6D737A;
      cursor: pointer;
      &:hover{
        color: #1082E6;
      }
      &.isCollapse{
        padding-left: 10px;
        padding-right: 24px;
        transform: rotate(-180deg) translateY(-4px);
      }
    }
  }
</style>

