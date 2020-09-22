<template>
  <div class="detail-list-component">
    <h3 class="mb20 content-title" v-if="isShowTitle">
       {{ title }}
    </h3>
    <div v-if="separate != '1'">
      <div class="detail-list mt20 mr20">
        <div class="detail-line" v-for="(item, index) in detailList" v-if="index % 2 === 0" :key="item">
          <div class="detail-left" :style="{ width: itemWidth }">
            <div class="keyName">
              {{ item[keyName] }}
            </div>
            <div class="valueName">
              {{ item[valueName] }}
            </div>
          </div>
        </div>
      </div>
      <div class="detail-list mt20 mb20">
        <div class="detail-line" v-for="(item, index) in detailList" v-if="index % 2 != 0" :key="item">
          <div class="detail-left" :style="{ width: itemWidth }">
            <div class="keyName">
              {{ item[keyName] }}
            </div>
            <div class="valueName">
              {{ item[valueName] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="detail-list mt20 mr20">
        <div class="detail-line" v-for="(item) in detailList"  :key='item'>
          <div class="detail-left" :style="{ width: itemWidth }">
            <div class="keyName">
              {{ item[keyName] }}
            </div>
            <div class="valueName">
              {{ item[valueName] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
  export default {
    name: 'DetailList',
    props: {
      detailList: { //
        type: Array,
        default: function () {
          return []
        }
      },
      separate: { // 详情横向分段，1-一行1条信息；2-一行2条信息；
        type: String,
        default: '1'
      },
      // 标题
      title: { // 名称
        type: String,
        default: '基本信息'
      },
      // leftwidth
      itemWidth: {
        type: String,
        default: '100%'
      },
      // 标题显示与隐藏--By:严凤
      isShowTitle: {
        type: Boolean,
        default: true
      },
      // 名称的keyName
      keyName: { // 名称
        type: String,
        default: 'name'
      },
      // 内容的 Key
      valueName: { // 内容
        type: String,
        default: 'value'
      }
    },
    watch: {
      detailList(val) {
        // console.log(val)
        // console.log('detailList变化', this.detailList, val)
      }
    },
    data() {
      return {}
    },
    methods: {
      formatList () {
      }
    },
    mounted() {
      // console.log('this.detailList', this.detailList)
    }
  }

</script>

<style lang="less">
  .detail-list-component {
    .detail-list{
      font-size: 14px;
      color: #606266;
      max-width: 520px;
      float: left;
      .detail-line {
        display: flex;
        justify-content: space-between;
        min-height: 20px;
        flex-wrap: wrap;
        .detail-left {
          display: flex;
          justify-content: center;
          /*width: 48%;*/
          .keyName {
            min-width: 165px;
            background-color: #f8f8f9;
            min-height: 20px;
            border: 1px solid #dddee1;
            padding: 10px;
            text-align: right;
          }
          .valueName {
            min-width: 350px;
            border: 1px solid #dddee1;
            min-height: 20px;
            flex: 1;
            padding: 10px;
            text-align: left;
            border-left: none ;
            word-break: break-all;
          }
        }
      }
      .detail-line + .detail-line {
        .keyName {
          border-top: none;
        }
        .valueName {
          border-top: none;
        }
      }
    }
    .content-title{
      border-bottom: 1px solid #e8eaec;
      padding: 14px 16px;
      line-height: 20px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
    .clear{
      clear: both;
    }
  }
</style>
