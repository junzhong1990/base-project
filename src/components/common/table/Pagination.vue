<template>
  <div class="pagination" :class="setClass">
    <el-pagination @current-change="handleCurrentChange"
                 :current-page.sync="currentPage"
                 :page-size="pageSize"
                 background
                 :layout="layout"
                 :total="totalCount">
    </el-pagination>
  </div>
</template>
<script>
// import {mapMutations, mapState} from 'vuex'

export default {
  props: {
    totalCount: {
      type: Number,
      default: 10
    },
    pageSize: {
      type: Number,
      default: 10
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next,jumper'
    }
  },
  data() {
    return {
      setClass: 'abd',
      currentPage: 1
    }
  },
  mounted() {
    this.init()
    // this.handleCurrentChangeForIE()
    this.setClass = 'owner-class-' + parseInt(Math.random() * 100000)
  },
  methods: {
    async init() {
      this.eventBus.$on('pageInit', (val) => {
        // console.log('分页初始化', val)
        this.currentPage = val
      })
    },
    handleCurrentChangeForIE() {
      let parentDom = document.getElementsByClassName(this.setClass)[0]
      let dom = parentDom.getElementsByClassName('el-pagination__editor')[0]
      let dom1 = dom.getElementsByTagName('input')[0]
      dom1.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
          // this.handleCurrentChange(parseInt(dom1.value))
          this.currentPage = parseInt(dom1.value)
          this.eventBus.$emit('pagechange', parseInt(dom1.value))
        }
      })
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      // this.setCurrentPage(val)
      // this.currentPage = val
      this.eventBus.$emit('pagechange', val)
    }
    // ...mapMutations({
    //   setCurrentPage: 'SET_CURRENTPAGE'
    // })
  },
  beforeDestroy() {
    this.eventBus.$off('pageInit')
    this.eventBus.$off('pagechange')
  }
}
</script>
<style lang="less">
  .pagination {
    text-align: right;
    padding: 10px 0 0px;
  }

  /* 重置样式，尽量和iview_ui样式靠拢 */
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background-color: #fff;
    color: #606266;
    border-radius: 4px;
    border: 1px solid #f1f1f1;
    font-weight: normal;
  }
</style>
