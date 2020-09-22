<template>
    <div class="commonSelect" style="width: 400px;">
        <!-- 单选输入框 -->
        <el-input @focus="eventChange" v-model="saveObj.resName" v-if="!multiple"></el-input>
        <!-- 多选文本域 -->
        <el-input @focus="eventChange" v-model="saveObj.resName" v-if="multiple" type="textarea"></el-input>
        <!-- 传递参数 -->
        <el-input v-model="saveObj.resIds" type="hidden" style="position: absolute;"></el-input>
        <!-- 弹框选择 -->
        <el-dialog width="60%" @on-cancel="nocheck" @on-ok="check"
                   :visible.sync="templateGroupFlag"
                   :title="title">
            <!-- 列表选择 -->
            <TemplateTable ref="template"
                    :showPowerSearch="showPowerSearch"
                    :multiple="multiple"
                    :searchApi="searchApi"
                    :itemList="itemList"
                    :columnTitle="columnTitle"
                    :checkedItems="checkedItems"></TemplateTable>
            <!-- 树形选择 -->
            <!--<TemplateTree></TemplateTree>-->
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="nocheck">取 消</el-button>
                <el-button type="primary" @click="check">确 定</el-button>
            </div>
        </el-dialog>
        <!--多项选择-->
    </div>
</template>

<script>
  import TemplateTable from './TemplateTable'
  // import TemplateTree from './TemplateTree'
  export default {
    name: 'CommonSelect',
    components: {
      TemplateTable,
      // TemplateTree
    },
    props: {
      // 选择框标题
      title: {
        type: String,
        default: '选择列表项'
      },
      // 选择列表请求接口
      searchApi: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // 选择列表是否允许查询
      showPowerSearch: {
        type: Boolean,
        default: true
      },
      // 选择列表查询字段
      itemList: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 选择列表属性
      columnTitle: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 选择列表是否多选
      multiple: {
        type: Boolean,
        default: true
      },
      // 存在数组
      checkedItems: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        templateGroupFlag: false, // 弹框显示标志
        saveObj: {} // 存放数据对象
      }
    },
    methods: {
      // 显示Dialog
      eventChange() {
        this.templateGroupFlag = true
      },
      // 选择
      check() {
        if (!this.multiple) {
          // 单选 返回选择行对象，取id(传参)与name(展示)
          if (this.$refs.template.chooseRes) {
            this.$set(this.saveObj, 'resName', this.$refs.template.chooseRes.name)
            this.$set(this.saveObj, 'resIds', this.$refs.template.chooseRes.id)
          }
        } else {
          // 多选 返回选择行对象数组，取id(传参)与name(展示)，格式：String并逗号隔开
          if (this.$refs.template.checkedItems.length > 0) {
            let tempResName = []
            let tempResIds = []
            this.$refs.template.checkedItems.forEach(item => {
              tempResName.push(item.name)
              tempResIds.push(item.id)
            })
            this.$set(this.saveObj, 'resName', tempResName.join(','))
            this.$set(this.saveObj, 'resIds', tempResIds.join(','))
          }
        }
        this.$emit('CommonSelectRes', this.saveObj)
        this.templateGroupFlag = false
      },
      // 取消
      nocheck() {
        this.$set(this.saveObj, 'resName', '')
        this.$set(this.saveObj, 'resIds', '')
        this.$emit('CommonSelectRes', this.saveObj)
        this.templateGroupFlag = false
      },
    }
  }
</script>

<style lang="less">
</style>
