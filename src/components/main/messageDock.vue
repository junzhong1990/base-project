<template>
  <el-dialog 
    class="msg-dock" 
    append-to-body 
    title="消息管理"
    :visible.sync="show" 
    :close-on-click-modal="false"
    width="800px" 
    @closed="closed"
  >
    <el-tabs v-model="activeName" @tab-click="tab">
      <el-tab-pane :label="tab.title" :name="tab.activeName" v-for="tab in tabConfig" :key="tab.activeName">
        <search-bar
          class="search-bar"
          v-if="tab.activeName != 'sendMsg'"
          @search="search"
          :options="searchOptions"
          :total="tab.total"
          labelWidth="5.5em"
          :showHandler="false"
          >
        </search-bar>
        <el-table :data="tab.list" style="width: 100%" v-if="tab.activeName != 'sendMsg'">
          <el-table-column label="序号" width="80" align="center">
            <template slot-scope="scope">
              <p>{{tab.pageSize * (tab.page - 1) + scope.$index + 1}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" min-width="140px">
            <template slot-scope="scope">
              <p class="msg-content">{{scope.row.title}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="消息内容" min-width="200px">
            <template slot-scope="scope">
              <p class="msg-content">{{scope.row.content}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="receive" label="接收人" min-width="110px" v-if="tab.activeName == 'sendedMsg'"></el-table-column>
          <el-table-column prop="sendUserName" label="发送人" min-width="110px" v-else></el-table-column>
          <el-table-column prop="createTime" label="发送时间" min-width="150px"></el-table-column>
          <el-table-column label="操作" min-width="100px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="detail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form :model="tab.form" :rules="rules" ref="form" label-width="80px" size="small" v-else>
          <el-form-item label="标题" prop="title">
            <el-input v-model="tab.form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="接收人" prop="receiveUserIdList">
            <div class="checked-tagList el-input el-input--small" @click="showUserSelector = true">
              <span class="placeholder" v-if="!receiveUserList.length">请选择接收人</span>
              <el-tag 
                size="mini" 
                type="info" 
                closable 
                v-for="(tag, index) in receiveUserList" 
                :key="index" 
                @close="() => removeUser(tag)"
              >
                {{tag.userName}}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="消息内容" prop="content">
            <el-input v-model="tab.form.content" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入" maxlength="300"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="cancel">取 消</el-button>
            <el-button type="primary" size="small" @click="submit">确 定</el-button>
          </el-form-item>
        </el-form>
        <table-paging
          style="margin-top: 20px;"
          v-if="tab.activeName != 'sendMsg'"
          :total="tab.total"
          :currentPage="tab.page"
          :pageSize="tab.pageSize"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
        ></table-paging>
      </el-tab-pane>
    </el-tabs>

    <message-detail :id="this.detailId" :showDialog.sync="showDetail"></message-detail>
    <user-selector 
      :showDialog.sync="showUserSelector"
      :userCheckedKeys="userCheckedKeys"
      @checked="userChecked"
    >
    </user-selector>

  </el-dialog>
</template>

<script>
import messageDetail  from './messageDetail'
import userSelector  from './userSelector'

export default {
  name: 'messageDock',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.showDialog,
      showDetail: false,
      showUserSelector: false,
      detailId: '',
      activeName: 'sendMsg',
      searchOptions: [
        {
          type: "input",
          prop: "title",
          value: "",
          title: "消息标题",
          options: []
        },
        // {
        //   type: "datepicker-range",
        //   prop: "date",
        //   value: "",
        //   title: "发送时间",
        // }
      ],
      receiveUserList: [],
      tabConfig: [
        {
          activeName: 'sendMsg',
          title: '发送消息',
          form: {
            title: '',
            receiveUserIdList: [],
            content: '',
          },
        },
        {
          activeName: 'sendedMsg',
          title: '已发送消息',
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          param: {
            type: 0,
          }
        },
        {
          activeName: 'recievedMsg',
          title: '已接收消息',
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          param: {
            type: 1,
          }
        },
      ],
      rules: {
        title: [
          {required: true, message: '标题不能为空', trigger: ['change','blur']},
        ],
        content: [
          { required: true, message: '消息内容不能为空', trigger: ['change','blur'] }
        ],
        receiveUserIdList: [
          { required: true, message: '收件人不能为空', trigger: ['change','blur'] }
        ],
      },
    }
  },
  watch: {
    'showDialog'(value) {
      this.show = value;
    },
    receiveUserList(list) {
      this.getTabConfig('sendMsg').form.receiveUserIdList = list.map(item => item.userId);
    },
  },
  computed: {
    userCheckedKeys() {
      return this.receiveUserList.map(item => item.userId);
    }
  },
  created () {

    
  },
  methods: {
    // 获取tab配置项
    getTabConfig(name) {
      return this.tabConfig.find(tab => tab.activeName == name);
    },
    // 站内信列表
    async getMessageList(config) {
      let res = await this.$api.getMessageList({
        data: {
          page: config.page,
          pageSize: config.pageSize,
          param: config.param
        }
      });
      if (res && res.code == 0) {
        res.data.records.forEach((item)=>{
          item.createTime = this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        })
        config.total = res.data.total;
        config.list = res.data.records || [];
      }
    },
    detail(item) {
      this.detailId = item.id;
      this.showDetail = true;
    },
    tab(tab) {
      switch(tab.name) {
        case 'sendedMsg': 
        case 'recievedMsg': 
          this.currentListConf = this.getTabConfig(tab.name);
          if (!this.currentListConf.list.length) {
            this.getMessageList(this.currentListConf);
          }
          break;
      }
    },
    // 搜索
    search(form) {
      this.currentListConf.param = {
        ...this.currentListConf.param,
        ...form
      };
      this.currentListConf.page = 1;
      this.getMessageList(this.currentListConf);
    },
    // 分页
    handleSizeChange(size) {
      this.currentListConf.pageSize = size;
      this.getMessageList(this.currentListConf);
    },
    handleCurrentChange(currentPage) {
      this.currentListConf.page = currentPage;
      this.getMessageList(this.currentListConf);
    },
    closed() {
      this.$emit('update:showDialog', false);
      this.receiveUserList = [];
      this.$refs.form[0].resetFields();
      this.activeName = 'sendMsg';
      this.tabConfig.forEach(item => {
        if (item.activeName != this.activeName) {
          item.list = [];
          item.page = 1;
          item.pageSize = 10;
          item.total = 0;
        }
      })
    },
    removeUser(user) {
      console.log('removeUser', user);
      this.receiveUserList.splice(this.receiveUserList.findIndex(item => item.userId=== user.userId), 1);
    },
    userChecked(data) {
      console.log('userCheckeds', data);
      const checkedNodes = data.checkedNodes.filter(item => item.userId);
      const uncheckedNodes = data.uncheckedNodes.filter(item => item.userId);
      let options = this.receiveUserList.concat(
        JSON.parse(JSON.stringify(checkedNodes).replace(/"text"/gm, '"userName"'))
      );
      // 去重
      let hash = {};
      options = options.reduce((item, next) => {
          hash[next.userId] ? '' : hash[next.userId] = true && item.push(next);
          return item
      }, []);
      // 删除已取消选择项
      for (let i = 0; i < options.length; i++) {
        uncheckedNodes.forEach(_item => {
          if (options[i] && _item.userId && options[i].userId === _item.userId) {
            options.splice(i, 1);
          }
        })
      }
      this.receiveUserList = options;
    },
    cancel() {
      this.show = false;
    },
    submit() {
      const refForm = this.$refs.form[0];
      refForm.validate(async valid => {
        if (valid) {
          let res = await this.$api.addMessage({
            message: '发送成功',
            data: refForm.model
          });
          if (res && res.code == 0) {
            this.show = false;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  components: {
    messageDetail,
    userSelector
  }
}
</script>

<style lang="less" scoped>
  .msg-dock{
    .search-bar{
      margin-top: -10px;
    }
    /deep/.tips-item{
      margin-top: 5px;
    }
    /deep/.el-dialog__body{
      padding: 15px 20px 20px;
      font-size: inherit;
      .el-form-item__label{
        font-size: 13px;
      }
      .el-table{
        font-size: inherit;
        td,th{
          padding: 7px 0;
          font-size: 13px;
        }
        .msg-content{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
        }
      }
    }
    .is-error{
      .checked-tagList{
        border-color: #F56C6C;
      }
    }
    .checked-tagList{
      min-height: 32px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      .placeholder{
        display: block;
        padding: 0 15px;
        color: #C0C4CC;
        line-height: 30px;
        height: 30px;
      }
      /deep/.el-tag{
        margin-bottom: 3px;
        margin-left: 3px;
      }
    }
  }
</style>

