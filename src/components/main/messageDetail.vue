<template>
  <el-dialog
    append-to-body 
    title="消息详情"
    :visible.sync="show" 
    width="640px" 
    :close-on-click-modal="false"
    @closed="$emit('update:showDialog', false)"
  >
    <section>
      <h5>基本信息</h5>
      <base-info :infoList="messageData"></base-info>
    </section>
    <section>
      <h5>消息内容</h5>
      <article>
        {{msgContent}}
      </article>
    </section>
  </el-dialog>
</template>

<script>
export default {
  name: "messageDetail",
  props: {
    id: '',
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog,
      messageData: [
        { title: "标题", value: "", prop: "title" },
        { title: "收件人", value: "", prop: "receive" },
        { title: "发件人", value: "", prop: "sendUserName" },
        { title: "发送时间", value: "", prop: "createTime" },
      ],
      msgContent: '',
    };
  },
  watch: {
    showDialog(value) {
      this.show = value;
    },
    id(id) {
      this.getMessageDetail(id);
    },
  },
  methods: {
    // 查看站内信详情
    getMessageDetail(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getMessageDetail({ data });
        if (res && res.code == 0) {
          self.messageData.forEach((item)=>{
            item.value = res.data[item.prop]
            if(item.prop=='createTime') {
              item.value = this.$moment(item.value).format('YYYY-MM-DD HH:mm:ss')
            }
            this.msgContent = res.data.content;
          })
        }
      })(data);
    },
  }
};
</script>

<style lang="less" scoped>
  /deep/.el-dialog__body{
    padding: 10px 20px 20px;
    font-size: inherit;
    .base-info{
      padding: 10px 5px;
      .info-list .title {
        min-width: 5.5em;
      }
    }
    h5{
      font-size: 1.1em;
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid #e8eaec;
    }
    article{
      padding: 10px;
      line-height: 1.5;
    }
  }
</style>