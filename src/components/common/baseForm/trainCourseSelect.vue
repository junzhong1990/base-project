<template>
  <div class="trainCourseSelect">
    <el-button 
      @click="showQ"
      :disabled="item.readOnly?item.readOnly:false">
      选择题目
    </el-button>
    <div style="width: 900px;margin-top: 8px;">
      <TableBody
        maxHeight="500"
        :tableData="tableData"
        :column="columnTitle">
      </TableBody>
    </div>
    <el-dialog title="选择题目" :visible.sync="dialogVisible" width="80%">
      <div class="fenBox">
        <el-form-item label="设定单题分值">
          <el-input v-model="form[subProp]" @change="numChange"></el-input>
        </el-form-item>
      </div>
      <topicBankList
        ref="questions"
        v-if="dialogVisible"
        :hasCheckBox="true"
        :modal="false"
        :selectData="tableData"
        @selectionResult="selectionResult">
      </topicBankList>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseItems">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import topicBankList from '@/views/trainManage/courseManage/topicBankManage/topicBankList'
export default {
  name: 'trainCourseSelect',
  components: {
    topicBankList
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {},
      mainProp: '',
      subProp: '',
      dialogVisible: false,
      tableData: [],
      list: [],
      idArr: [],
      columnTitle: [
        {
          label: '题目类型',
          prop: 'questionType',
          options: [
            { label: '单选题', value: 'radio' },
            { label: '多选题', value: 'checkbox' }
          ]
        },
        {
          label: '题目',
          prop: 'questionContent',
          minWidth: 130
        },
        {
          label: '选项',
          prop: 'questionNoAndContent',
          minWidth: 130
        },
        {
          label: '正确答案',
          prop: 'questionAnswer'
        },
        {
          label: '所属课程类型',
          prop: 'courseTypeName'
        }
      ],
      firstList: []
    }
  },
  created() {
    let fields = this.item.field.split(',')
    this.mainProp = fields[0]
    this.subProp = fields[1]
    if (this.item.towItemValueObj) {
      this.form = this.item.towItemValueObj
    } else {
      this.$set(this.form, this.subProp, '2')
    }
    this.initList()
    console.log('trainUploadValueBack执行', this.form)
    this.$emit('trainUploadValueBack', this.form, this.mainProp)
    this.eventBus.$off('trainCourse')
    this.eventBus.$on('trainCourse', (ids, singleScore) => {
      this.$set(this.form, this.mainProp, ids)
      this.$set(this.form, this.subProp, singleScore)
      // 显示选中的值
      this.initList()
      console.log('监听器里面再次执行 trainUploadValueBack执行', this.form)
      this.$emit('trainUploadValueBack', this.form, this.mainProp)
    })
  },
  methods: {
    numChange() {
      // this.$emit('trainCourseSelectVauleBack', this.form)
    },
    async initList() {
      const ids = this.form[this.mainProp]
      if (ids) {
        let data = {
          ids,
          pageInfo: {
            pageNum: 1,
            pageSize: 10000
          }
        }
        const res = await this.$api.topicBankList({ data })
        if (res && res.code === 0) {
          this.tableData = res.data.list || []
          console.log('拿到显示的数据', this.tableData)
        }
      }
    },
    showQ() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.questions.setSelect(this.tableData)
      })
    },
    chooseItems() {
      let allIds = this.$refs.questions.tableData.map(v => v.id)
      let diffIds = this.tableData.map(v => v.id).filter(v => !~allIds.indexOf(v))
      let ids = this.idArr.concat(diffIds)
      let diffData = this.tableData.filter(v => diffIds.includes(v.id))
      this.tableData = JSON.parse(JSON.stringify(this.list)).concat(diffData)
      // this.form[this.mainProp] = JSON.parse(JSON.stringify(this.idArr)).join(',')
      this.form[this.mainProp] = ids.join(',')
      this.$emit('trainCourseSelectVauleBack', this.form, this.mainProp)
      this.dialogVisible = false
      // this.initList()
    },
    selectionResult(idArr, list) {
      this.list = list
      this.idArr = idArr
      // console.log(idArr)
      // console.log(list)
    }
  }
}
</script>

<style lang="less" scoped>
.trainCourseSelect {
  .fenBox {
    position: absolute;
    top: 75px;
    right: 12px;
    height: 50px;
  }
}
</style>
