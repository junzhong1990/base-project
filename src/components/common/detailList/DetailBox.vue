<template>
  <div class="detailBox">
    <div class="newDetail">
      <el-collapse v-model="activeNames">
        <el-collapse-item :name="name">
          <template slot="title" style="position: relative;">
            <span style="font-weight: 900;font-size: 14px;">{{title}}</span>
            <i class="collapse-caret el-icon-arrow-right" style="color: #567CDB;font-size: 18px;padding-left: 10px;" v-if="activeNames.length === 0"></i>
            <i class="collapse-caret el-icon-arrow-down" style="color: #567CDB;font-size: 18px;padding-left: 10px;" v-if="activeNames.length > 0"></i>
            <span v-if="activeNames.length === 0" style="color:#5470DE;position: absolute;right: 45px;">展开</span>
            <span v-if="activeNames.length > 0" style="color:#5470DE;position: absolute;right: 45px;">收起</span>
          </template>
          <div class="content">
            <div class="content-detail" v-if="detailList.length > 0">
              <el-col :span="sepNum" v-for="(item, key) in detailList" :key="key">
                <span class="detailWord">{{item.name}}：{{item.value}}</span>
              </el-col>
            </div>
            <slot name="box" v-else></slot>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DetailList',
    props: {
      // 标题
      title: { // 名称
        type: String,
        default: '基本信息'
      },
      name: {
        type: String,
        default: '1'
      },
      detailList: { //  对象数组， value name
        type: Array,
        default: function () {
          return []
        }
      },
      separate: { // 详情横向分段，1-一行1条信息；2-一行2条信息；3-一行3条信息；
        type: String,
        default: '2'
      }
    },
    watch: {
    },
    data() {
      return {
        activeNames: ['1'],
        sepNum: 12
      }
    },
    methods: {
      formatList () {
      }
    },
    mounted() {
    },
    beforeMount() {
      if (this.separate === '1') {
        this.sepNum = 24
      } else if (this.separate === '3') {
        this.sepNum = 8
      } else {
        this.sepNum = 12
      }
    }
  }

</script>

<style lang="less">
  .detailBox {
    .newDetail{
      margin: 5px 0px;
      .el-collapse{
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        overflow: hidden;
        .el-collapse-item__header{
          padding: 0 15px 0 10px;
          /*background-color: #f5f5f5;*/
          /*border-bottom: 1px solid #e4e4e4;*/
          height: 47px;
          line-height: 44px;
          position: relative;
          i{
            color: #5470DE;
          }
        }
        .el-collapse-item__content{
          padding-bottom: 5px;
        }
        .content{
          font-size: 12px;
          .content-detail{
            .el-col{
              .detailWord{
                padding-left: 10px;
                line-height: 36px;
              }
            }
          }
        }
      }
    }
  }
</style>
