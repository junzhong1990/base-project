<template>
  <div class="base-info">
    <ul class="info-list">
      <li
        class="info-item"
        v-for="(item, index) in infoList"
        :key="index"
        v-show="item.show == false ? item.show : true"
      >
        <span class="title">{{ item.title }}：</span>
        <p
          class="content"
          v-html="
            (item.value === null ? '' : $xss(item.value)) + (item.unit || '')
          "
        ></p>
      </li>
      <slot></slot>
    </ul>
    <slot name="msg-content"></slot>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  props: {
    infoList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="less">
.base-info {
  color: #666;
  font-size: 12px;
  padding: 15px;
  .info-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .info-item {
      width: 33.33%;
      line-height: 1.5;
      padding: 10px 5px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .title {
      float: left;
      min-width: 7em;
      color: #606266;
      border-bottom: 0;
    }
    .content {
      // overflow: hidden;
      color: #999999;
      word-break: break-all;
      strong {
        font-size: 24px;
      }
    }
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  /* IE10 */
  .info-list .content {
    max-width: 75%;
    display: block;
  }
}
</style>
