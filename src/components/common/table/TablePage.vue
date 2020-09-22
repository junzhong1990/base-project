<template>
  <div class="table-page">

    <!--按钮组-->
    <div class="btn-groups">

      <!--外部按钮组-->
      <div class="btn-groups-left" :class="{'no-power-search':!showPowerSearch}">
        <div class="table-page-btn-groups">
          <slot name="before_btn_groups"></slot>
          <el-button
            v-if="showPowerSearch"
            icon="el-icon-search"
            id="query"
            @click="isCollapse = !isCollapse"
            :class="{'only-one-btn': onlyOneBtn, 'query-in-second': queryInSecond}">
              <span v-if="!showStatBtn">查询</span>
              <span v-if="showStatBtn">统计条件</span>
            </el-button>
          <slot name="btn_groups"></slot>
        </div>
      </div>

      <!--高级搜索 或 统计条件-->
      <div class="btn-groups-right" v-if="showPowerSearch">
        <!--<Button type="primary" @click="isCollapse=!isCollapse">-->
        <!--<span v-if="!showStatBtn">高级搜索</span>-->
        <!--<span v-if="showStatBtn">统计条件</span>-->
        <!--</Button>-->
      </div>

    </div>

    <!--高级搜索内容 或 统计条件内容-->
    <div>
      <el-card class="mb12" v-show="isCollapse" shadow="never">
        <div class="search-title">
          <span v-if="!showStatTitle">查询条件</span>
          <span v-if="showStatTitle">统计汇总条件</span>
        </div>
        <slot name="query"></slot>
      </el-card>
    </div>

    <!--额外信息-->
    <div>
      <slot name="TableHeader"></slot>
    </div>

    <!--表格-->
    <div>
      <slot name="TableSlot"></slot>
    </div>

    <!-- 报表 -->
    <div>
      <slot name="Report"></slot>
    </div>


    <!--分页-->
    <div>
      <Pagination :totalCount="totalCount*1" v-if="showPagination" :layout="layout"></Pagination>
    </div>


  </div>
</template>

<script>
  import Pagination from './Pagination'
  export default {
    components: {
      Pagination
    },
    data() {
      return {
        isCollapse: false,
        onlyOneBtn: false
      }
    },
    props: {
      queryInSecond: {
        type: Boolean,
        default: false
      },
      firstIsCollapse: {
        type: Boolean,
        default: false
      },
      showPowerSearch: {
        type: Boolean,
        default: true
      },
      totalCount: {
        type: [Number, String],
        default: 0
      },
      showPagination: {
        type: Boolean,
        default: true
      },
      showStatBtn: {
        type: Boolean,
        default: false
      },
      showStatTitle: {
        type: Boolean,
        default: false
      },
      layout: {
        type: String,
        default: 'total, prev, pager, next, jumper'
      }
    },
    mounted() {
      // 第一次渲染，假如搜索宽初始化为展开状态的话
      if (this.firstIsCollapse) {
        this.isCollapse = true
      }
      // 是否显示查询按钮
      if (this.showPowerSearch) {
        let divArr = document.getElementsByClassName('table-page-btn-groups')[0].getElementsByTagName('div')
        this.onlyOneBtn = !divArr.length
      }
      // console.log(this.onlyOneBtn)
    }
  }
</script>

<style lang="less">
/*列表页样式*/
.table-page {
  text-align: left;
  /* 顶部按钮组 */
  .btn-groups {
    display: flex;
    margin-bottom: 12px;
    #query {
      margin-right: 24px;
    }
    // #query {
    //   border-radius: 4px 0 0 4px;
    //   &.only-one-btn {
    //     border-radius: 4px;
    //   }
    //   &.query-in-second {
    //     border-radius: 0 4px 4px 0;
    //   }
    // }
    // & > .el-button {
    //   border-radius: 0;
    //   &:last-of-type {
    //     border-radius: 0 4px 4px 0;
    //   }
    // }
    // .el-button + .el-button {
    //   margin-left: -1px;
    // }
    /*左侧按钮组*/
    .btn-groups-left {
      flex: 1;
      .el-button-group {
        width: 100%;
      }
      #query + div {
        display: inline-block;
        // & > button:nth-of-type(1) {
        //   /*border-top-left-radius: 0;*/
        //   /*border-bottom-left-radius: 0;*/
        // }
      }
      // &.no-power-search {
      //   button:nth-of-type(1) {
      //     /*border-top-left-radius: 4px;*/
      //     /*border-bottom-left-radius: 4px;*/
      //   }
      // }
      .table-page-btn-groups {
        .el-button {
          margin-right: 24px;
        }
      }
    }
    /*高级搜索*/
    .btn-groups-right {
      width: 120px;
      text-align: right;
    }
  }
  .el-card{
    border: none;
  }
  .search-title{
    font-size: 18px;
    color: #282E43;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
</style>
