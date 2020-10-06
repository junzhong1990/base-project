<template>
  <div>
    <el-form-item label="课件类型" :prop="mainProp">
      <el-select
        v-model="form[mainProp]"
        placeholder="请选择"
        @change="courseChange"
        :disabled="item.readOnly?item.readOnly:false"
      >
        <el-option
          v-for="item in dicList"
          :label="item.label"
          :key="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="培训课件" :prop="subProp">
      <ModalUpload
        :backIds="form[subProp]"
        @uploadResult="backFileId"
        :propName="''"
        :type="uploadType"
        :isMultiple="true"
        :btnFn="checkType"
        :disabled="item.readOnly?item.readOnly:false"
      >
        <div slot="warnTxt">
          <p v-if="uploadType.length > 0">提示：附件个数不能超过4个</p>
          <p v-if="uploadType.length > 0">类型：可用文件格式 {{ uploadType.join(',') }} 其中的一种</p>
        </div>
      </ModalUpload>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mainProp: '',
      subProp: '',
      form: {},
      uploadType: [],
      dicList: []
    }
  },
  created() {
    this.dicList = this.$store.state.dicStore['trainCourse.coursewareTypeDict']
      ? this.$store.state.dicStore['trainCourse.coursewareTypeDict']
      : this.$store.state.dicStore['trainCourseFileRel.fileType']
    // console.log('this.item', this.item)
    this.mainProp = this.item.field.split(',')[0]
    this.subProp = this.item.field.split(',')[1]
    if (this.item.towItemValueObj) {
      this.form = this.item.towItemValueObj
    }
    this.$emit('trainUploadValueBack', this.form)
    // 修改获取的详情值
    this.eventBus.$on('fileType', (val) => {
      this.$set(this.form, this.mainProp, val)
      this.setUploadType(val)
    })
  },
  methods: {
    backFileId(id, prop) {
      this.$set(this.form, this.subProp, id)
      this.$emit('trainUploadValueBack', this.form)
    },
    setUploadType(val) {
      this.uploadType = []
      if (val === 'doc') {
        this.uploadType.push('doc', 'docx')
      }
      if (val === 'pic') {
        this.uploadType.push('jpg', 'png', 'bmp', 'gif')
      }
      if (val === 'video') {
        // this.uploadType.push('avi', 'rmvb', 'mp4')
        this.uploadType.push('mp4')
      }
      if (val === 'voice') {
        this.uploadType.push('mp3')
      }
      // if (val === 'PDF') {
      //   this.uploadType.push('pdf')
      // }
    },
    // 课件类型改变
    courseChange(val) {
      this.setUploadType(val)
      this.$emit('trainUploadValueBack', this.form)
    },
    checkType() {
      if (!this.form[this.mainProp]) {
        this.$common.showMsg('请选择课件类型')
      }
      return !!this.form[this.mainProp]
    }
  }
}
</script>
<style lang="less" scoped>
</style>
