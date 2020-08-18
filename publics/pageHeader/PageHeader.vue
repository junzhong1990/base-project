<template>
  <div class="page-header">
    <span class="ptitle">{{title}}</span>
    <span class="back-btn" @click="goBack">
      <img :src="gobackimg" />
      <span class="ptxt">{{gobackText}}</span>
    </span>
  </div>
</template>
<script>
export default {
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
      default : require('./gobackimg.png')
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
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 45px;
    margin-bottom: 25px;
    border-bottom: 1px solid #E6E9EE;
    span {
      height: 28px;
      line-height:28px;
      font-size:14px;
      font-family:PingFangSC-Semibold,PingFang SC;
    }
    .ptitle {
      font-weight:600;
      color:#567CDB;
      border-bottom: 2px solid #567CDB;
    }
    .back-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      color:#6D737A;
      cursor: pointer;
      .ptxt{
        padding-left: 8px;
      }
    }
  }
</style>