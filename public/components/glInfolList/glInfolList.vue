<template>
  <div class="gl-detail-list">
    <div class="base-info" v-if="col === '2'">
      <ul class="info-list list-left">
        <template v-for="(item, index) in list">
          <li
            v-if="index % 2 === 0"
            :key="index">
              <Render :render="contentItem" :data="item"/>
          </li>
        </template>
      </ul>
      <div class="list-right" v-if="list.length > 1">
        <ul class="info-list">
          <template v-for="(item, index) in list">
            <li
              v-if="index % 2 !== 0"
              :key="index">
                <Render :render="contentItem" :data="item"/>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <ul class="info-list" v-else>
      <li
        v-for="(item, index) in list"
        :key="index">
          <Render :render="contentItem" :data="item"/>
      </li>
    </ul>
  </div>
</template>
<script>
  import Render from './render'
  export default {
    name: 'glInfolList',
    components: {
      Render
    },
    props: {
      col: {
        type: String,
        default: '1'
      },
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        contentItem: (h, item) => {
          const setContent = (item) => {
            if (item.format) {
              // 兼容 数组值， 多选框
              if (Array.isArray(item.value)) {
                return item.value.map(v => item.format(v)).join(',')
              }
              return item.format(item.value)
            } else if (item.render) {
              return <Render render={item.render} data={item} />
            } else {
              return item.value
            }
          }
          return (
            <div class="list-item">
              <div class="title">{item.label}</div>
              <div class="content">{setContent(item)}</div>
            </div>
          )
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .gl-detail-list{
    margin-bottom: 20px;
    .base-info{
      display: flex;
      align-items: flex-start;
      .list-left{
        margin-right: 20px;
      }
      .list-right{
        width: 100%;
      }
    }
  }
  .info-list{
    width: 100%;
    max-width: 500px;
    border: 1px solid #dddee1;
    li{
      // height: 36px;
      // line-height: 35px;
      text-align: center;
      &:not(:last-child) {
        border-bottom: 1px solid #dddee1;
      }
      .list-item{
        display: flex;
      }
      .title{
        box-sizing: border-box;
        width: 150px;
        padding: 10px 0;
        margin-bottom: 0;
        border-right: 1px solid #dddee1;
        background-color: #f8f8f9;
      }
      .content{
        flex: 1;
        padding: 10px 5px;
        word-break: break-all;
      }
    }
  }
</style>
