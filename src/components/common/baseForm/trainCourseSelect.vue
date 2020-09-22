<!--
-->
<template>
  <div class="trainCourseSelect">
    <el-button  @click="showQ" :disabled="item.readOnly?item.readOnly:false">选择题目</el-button>
    <div style="width: 900px;margin-top: 8px;">
      <TableBody
          :tableData="tableData"
          v-if="tableData.length > 0"
          :column="columnTitle"></TableBody>
    </div>
    <el-dialog  title="选择题目" :visible.sync="dialogVisible" width="80%">
      <div class="fenBox">
        <el-form-item label="设定单题分值">
          <el-input v-model="form[subProp]" @change="numChange"></el-input>
        </el-form-item>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseItems">确 定</el-button>
      </div>
    </el-dialog>
    <div style="height: 0px;overflow: hidden;">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'trainCourseSelect',
    components: {
    },
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        form: {
        },
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
              {label: '单选题', value: 'radio'},
              {label: '多选题', value: 'checkbox'}
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
    watch: {
      item: {
        handler(newValue, oldValue) {
          console.log('深度监听 item 的值', newValue)
        },
        // 深度监听 监听对象，数组的变化
        deep: true
      }
    },
    methods: {
      numChange() {
        // this.$emit('trainCourseSelectVauleBack', this.form)
      },
      initList(list) {
        this.firstList = list
        let isarr = this.form[this.mainProp] ? this.form[this.mainProp].split(',') : []
        this.tableData = []
        list.forEach((val, i) => {
          if (isarr.includes(val.id + '')) {
            this.tableData.push(val)
          }
        })
      },
      showQ() {
        this.dialogVisible = true
      },
      chooseItems() {
        this.tableData = JSON.parse(JSON.stringify(this.list))
        this.form[this.mainProp] = JSON.parse(JSON.stringify(this.idArr)).join(',')
        this.$emit('trainCourseSelectVauleBack', this.form, this.mainProp)
        this.dialogVisible = false
      },
      selectionResult(idArr, list) {
        this.list = list
        this.idArr = idArr
        console.log(idArr)
        console.log(list)
      }
    },
    mounted() {
    },
    created() {
      console.log(this.item)
      this.mainProp = this.item.field.split(',')[0]
      this.subProp = this.item.field.split(',')[1]
      if (this.item.towItemValueObj) {
        this.form = this.item.towItemValueObj
      } else {
        this.$set(this.form, this.subProp, '2')
      }
      this.$emit('trainUploadValueBack', this.form, this.mainProp)
      this.eventBus.$on('trainCourse', (ids, singleScore) => {
        this.$set(this.form, this.mainProp, ids)
        this.$set(this.form, this.subProp, singleScore)
        this.initList(this.firstList)
        this.$emit('trainUploadValueBack', this.form, this.mainProp)
      })
    },
  }
</script>

<style lang="less">
.trainCourseSelect{
  .fenBox{
    height: 50px;
    position: absolute;
    right: 12px;
    top: 75px;
  }
}

</style>