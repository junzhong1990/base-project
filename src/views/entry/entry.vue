<template>
  <div class="entry-container">
    <div class="entry-hd">
      <div class="hd-logo">
        <span class="ct" @click="toHome('homePage')">
          <span class="logo-box">
            <glSvgIcon iconClass="logo" style="font-size: 36px"/>
          </span>
          <strong class="name">{{title}}</strong>
        </span>
      </div>
      <admin-info></admin-info>
    </div>
    <div class="entry-bd">
      <ul class="entry-list">
        <li v-for="(item) in entryList" :key="item.id" @click="jumpTo(item)">
          <dl>
            <dt :class="[item.ico]"></dt>
            <dd><strong>{{item.name}}</strong></dd>
          </dl>
        </li>
      </ul>
    </div>
    <lock-mask></lock-mask>
  </div>
</template>

<script>
import adminInfo from '@/components/main/adminInfo'
import lockMask from '@/components/main/lockMask'
import { mapMutations, mapGetters } from 'vuex'
import * as userCache from '@/utils/userCache'
export default {
  name: 'entry',
  components: {
    adminInfo,
    lockMask
  },
  data() {
    return {
      title: '运营管理平台'
    }
  },
  computed: {
    ...mapGetters(['entryList'])
  },
  mounted() {
    // this.getAreaData()
  },
  methods: {
    ...mapMutations(['SET_DSSRESOURCECODE']),
    // 跳转到首页
    toHome(code) {
      if (!this.entryList.length) return
      let item = this.entryList.find(v => v.code === code)
      if (item) {
        this.jumpTo(item)
      }
    },
    // 跳转到某个子系统
    async jumpTo(item) {
      const res = await this.$api.autResourcesDetail({data: { id: item.id }})
      if (res && res.code === 0) {
        let path = res.data.uriList[0].url
        console.log('item', item)
        if (item.code === 'dss') {
          // 如果是跳转到统计分析，存一下默认跳转的路由
          this.SET_DSSRESOURCECODE({
            code: 'dashboardChild',
            text: '仪表盘'
          })
        }
        this.$router.push({ path: path })
        userCache.setNowModel(item)
      }
    },
    // 请求数据
    async getAreaData() {
      let res = await this.$api.sysRegion({ })
      if (res && res.code === 0) {
        // 清空children
        sessionStorage.setItem('area', JSON.stringify(res.data))
        // this.areaList = res.data
      }
    }
  }
}
</script>


<style lang="less">
  @import './less/entry.less';

  // .entry-container
  // .entry-bd
  // .entry-list {
  //   background-color: #4D8CEE;
  // }

  // .entry-container
  // .entry-bd
  // .entry-list {
  //   background-color: #64d572;
  // }
  .entry-container{
    // 图标
    .icon-home{
      background: url(./img/home.png);
    }
    .icon-station{
      background: url(./img/station.png);
    }
    .icon-system{
      background: url(./img/system.png);
    }
    .icon-statistics{
      background: url(./img/statistics.png);
    }
    .icon-patrol{
      background: url(./img/patrol.png);
    }
    .icon-repair{
      background: url(./img/repair.png);
    }
    .icon-storage{
      background: url(./img/storage.png);
    }
    .icon-train{
      background: url(./img/train.png);
    }
    .icon-marketing{
      background: url(./img/marketing.png);
    }
    .icon-monitor{
      background: url(./img/monitor.png);
    }
    .icon-video{
      background: url(./img/video.png);
    }
  }
</style>
