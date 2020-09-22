<template>
  <div>
    <el-upload
      ref="upload"
      action=""
      :class="uploadClass"
      :drag="isDrag"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="filesChange"
      :on-exceed="filesExceed"
      :file-list="fileList"
      :limit="limit"
      :list-type="listType"
      :auto-upload="false">
        <!-- 拖拽 -->
        <div v-if="isDrag">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>
        <!-- 照片墙 -->
        <template v-else-if="listType === 'picture-card'">
          <i class="el-icon-plus"></i>
        </template>
        <!-- 手动上传按钮组 -->
        <div v-else>
          <el-button slot="trigger" type="primary">{{pictureName}}</el-button>
          <el-button style="margin-left: 10px;" type="success" @click.stop.prevent="submitUpload" :disabled="!fileIsReady">上传到服务器</el-button>
        </div>
        <div slot="tip" class="el-upload__tip">只能上传{{type.join('/')}}文件，且不超过500kb</div>
    </el-upload>
    <el-dialog  
      :visible.sync="dialogVisible"
      title="查看图片">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'singleUpload',
  props: {
    pictureName: {
     type: String,
      default: '选取文件'
    },
    // 文件支持类型，默认支持图片
    type: {
      type: Array,
      default: () => {
        return ['jpg', 'png', 'bmp']
      }
    },
    // 是否拖拽
    isDrag: {
      type: Boolean,
      default: true
    },
    // 限制个数
    limit: {
      type: Number,
      default: 1
    },
    // 上传的文件列表
    fileList: {
      type: Array,
      default: () => []
    },
    // 文件列表的类型，默认 图片列表缩略图
    listType: {
      type: String,
      default: 'picture'
    },
    // 上传class
    uploadClass: {
      type: String,
      default: ''
    },
    // 是否自动上传
    isAuto: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // fileList: [],
      fileArr: [],
      fileIsReady: false,
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    // 文件超出限制数量的时候，提示
    filesExceed() {
      this.$message.warning(`最多只能上传${this.limit}个文件`)
    },
    // 每次文件变化的时候，进行文件校验
    filesChange() {
      this.fileArr = this.$refs.upload.uploadFiles
      let index = this.fileList.length
      this.beforeUpload(this.fileArr[index].raw)
    },
    // 移除操作
    async handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileIsReady = false
      if (this.fileList.length) {
        this.fileList.pop()
      }
      this.$emit('removeFile', file)
      if (file.id) {
        await this.$api.deleteFile({data: {id: file.id}})
      }
    },
    // 预览操作
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件上传的时候，进行校验
    async beforeUpload(file) {
      console.log(file)
      this.fileIsReady = await this.checkFile(file)
      // 直接调用接口
      if (this.isAuto && this.fileIsReady) {
        this.submitUpload(this.isAuto)
      }
      return this.fileIsReady
    },
    // 验证文件大小和格式
    checkFile(file) {
      return new Promise((resolve, reject) => {
        if (file.size / 1000 > 500) {
          this.$message.warning('文件容积太大')
          resolve(false)
        } else {
          let index = file.name.lastIndexOf('.') + 1
          let fileSuffix = file.name.substr(index)
          if (this.type.includes(fileSuffix)) {
            resolve(true)
          } else {
            this.$message.warning(`文件类型只支持：${this.type.join(',')}`)
            resolve(false)
          }
        }
      })
    },
    // 上传附件到服务器
    async submitUpload() {
      let flag = this.isAuto
      if (!this.isAuto) {
        flag = await this.checkFile(this.fileArr[0].raw)
      }
      if (flag) {
        let formData = new FormData()
        this.fileArr.forEach((val, key) => {
          formData.append('file', val.raw)
        })
        const res = await this.$api.uploadFileServiceApi({
          data: formData
        })
        if (res && res.code === 0) {
          this.$message.success('上传成功')
          this.fileIsReady = false
          // this.fileList = []
          // 上传结果
          this.$emit('uploadResult', res.data)
        } else {
          // this.$message.warning(res.msg)
        }
      }
    }
  }
}
</script>
<style lang="less">
  .picture-card-6042{
    .el-upload--picture-card{
      width: 60px;
      height: 42px;
      line-height: 42px;
      i{
        font-size: 16px;
      }
    }
    .el-upload-list__item{
      width: 60px;
      height: 42px;
      line-height: 42px;
    }
    .el-upload-list__item-actions{
      font-size: 12px;
    }
  }
</style>
