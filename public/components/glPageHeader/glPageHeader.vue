<template>
  <div class="gl-page-header">
    <span class="ptitle">{{title}}</span>
    <span class="back-btn" @click="goBack" v-if="gobackShow">
      <img :src="gobackimg" />
      <span class="ptxt">{{gobackText}}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'glPageHeader',
  props: {
    title: {
      type: String,
      default: '详情'
    },
    gobackText: {
      type: String,
      default: '返回'
    },
    gobackimg: {
      type: String,
      default: require('../../assets/image/goback.png')
    },
    gobackShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goBack() {
      if (this.$listeners.fn) {
        this.$listeners.fn()
        return
      }
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.gl-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 45px;
  margin-bottom: 25px;
  border-bottom: 1px solid #e6e9ee;
  span {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
  }
  .ptitle {
    font-weight: 600;
    color: #567cdb;
    border-bottom: 2px solid #567cdb;
  }
  .back-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #6d737a;
    cursor: pointer;
    .ptxt {
      padding-left: 8px;
    }
  }
}
</style>
