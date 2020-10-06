<!--
  表单上传组件（右侧带‘确认上传’按钮）
-->
<template>
  <div>
    <img  v-if="showUrl && showImgFlag" :src="showUrl"/>
    <el-upload class="confirm-upload" action="" ref="upload" :on-change="filesChange" :on-preview="handlePreview" :on-remove="handleRemove" :on-exceed="handleExceed" :before-remove="beforeRemove" :file-list="fileList" :multiple="isMultiple" :limit="!isMultiple?1:limit" :auto-upload="false">
      <el-button class="mr10" slot="trigger" type="primary">选取文件</el-button>
      <el-button type="success" v-if="confirmBtn" :loading="loading" @click="submitUpload">确认上传</el-button>
      <!-- 扩展的按钮 -->
      <slot name="exBtn"></slot>
      <!-- 说明 -->
      <div class="warnText mt10" v-if="showWarnText">
        <p>
          文件类型必须为： {{type.join(',')}}{{type.length > 1 ? '其中的一种' : ''}}，不超过
          <span>{{ maxSize/1000 }} MB</span>
        </p>
      </div>
      <slot name="warnText"></slot>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ConfirmUpload',
    props: {
      // 文件大小，默认100M 单位:kb
      maxSize: {
        type: [Number, String],
        default: 100000
      },
      // 默认图片
      imageFile: {
        type: String,
        default: ''
      },

      // 文件支持类型,默认支持图片
      type: {
        type: Array,
        default: () => {
          return ['jpg', 'bmp', 'png', 'ico', 'gif']
        }
      },
      showWarnText: {
        type: Boolean,
        default: true
      },
      showImgFlag: {
        type: Boolean,
        default: true
      },
      // 文件限制数量，默认最大只能传1个
      limit: {
        type: [Number, String],
        default: 1
      },
      // 是否能多附件上传，默认单文件上传
      isMultiple: {
        type: Boolean,
        default: false
      },
      // 确认上传按钮展示与否，默认不展示
      confirmBtn: {
        type: Boolean,
        default: true
      },
      // 服务端上传接口名称
      apiCode: {
        type: [Number, String],
        default: ''
      },
      // 服务上传接口配置
      api: {
        type: [Object],
        default: function() {
          return {}
        }
      }
    },
    watch: {
      imageFile: function (val) {
        this.showUrl = this.imageFile
      }
    },
    data() {
      return {
        showUrl: '',
        loading: false,
        dialogImageUrl: '',
        dialogVisible: false,
        filesArr: [],
        fileList: [
          // {
          //   name: 'food.jpeg',
          //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          // },
          // {
          //   name: 'food2.jpeg',
          //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          // }
        ]
      }
    },
    methods: {
      /*
       * 表单直接上传图片信息方法（base64编码方式）开始
       * */
      // 选择图片先做校验
      filesChange() {
        this.checkFile()
      },
      // 文件base64转换
      getBase64String(file) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          let fileResult = ''
          reader.readAsDataURL(file[0].raw)
          // 开始
          reader.onload = function() {
            fileResult = reader.result
          }
          // 失败
          reader.onerror = function() {
            reject(new Error(false))
          }
          // 结束
          reader.onloadend = function() {
            resolve(fileResult)
          }
        })
      },
      // 组件数据传出
      async emitImgsFun(val) {
        // 转码
        let base64Data = await this.getBase64String(val)
        // 传出base64格式数据
        this.$emit('ImageInfoBase64Data', base64Data)
        // 传出file格式数据(后台暂不支持)
        // this.$emit('ImageInfo',val)
      },
      /*
       * 表单直接上传图片信息方法（base64编码方式） 结束
       * */
      // 检查文件格式是否符合要求
      checkFile() {
        return new Promise((resolve, reject) => {
          let arr = this.filesArr = this.$refs.upload.uploadFiles
          if (!this.$refs.upload.uploadFiles.length) {
            this.$common.showMsg('请先选择文件')
            resolve(false)
          }
          let checkFileSuffix = this.type
          let fileSuffix = []
          let fileSize = []
          arr.forEach(file => {
            let name = file.name
            let index = name.lastIndexOf('.') + 1
            fileSuffix.push(name.substr(index).toLowerCase()) // 获取每一个文件的后缀
            fileSize.push(file.size) // 获取每一个文件的大小
          })
          console.log(checkFileSuffix)
          console.log(fileSuffix)
          console.log(fileSize)
          let flag = true
          // 先判断所有文件的格式是否都正确
          fileSuffix.forEach(suffix => {
            if (!checkFileSuffix.includes(suffix)) {
              flag = false
              this.$common.showMsg('文件类型只支持：' + this.type.join(','))
              resolve(false)
            }
          })
          if (flag) {
            // flag没有被改变，说明所有文件的格式都符合要求，现在再来判断每一个文件的大小
            fileSize.forEach(size => {
              if (size && size / 1000 > this.maxSize) {
                flag = false
              }
            })
            // flag依旧没有被改变，说明所有文件不仅格式符合要求，大小也在范围内
            if (flag) {
              // 获取图片信息，传给父组件
              this.emitImgsFun(this.filesArr)
              resolve(true)
            } else {
              this.$common.showMsg('文件容积太大')
              resolve(false)
            }
          } else {
            resolve(false)
          }
        })
      },
      // 上传附件
      async submitUpload(cb) {
        const isPass = await this.checkFile()
        console.log(isPass)
        if (isPass) {
          this.loading = true
          let formData = new FormData()
          formData.append('file', this.filesArr[0].raw)

          const res = await this.$api.uploadFileServiceApi({
            data: formData
          })
          if (res.code === 0) {
            this.loading = false
            this.$common.showMsg('上传成功', 'success')
            this.filesArr = []
            this.showUrl = res.data.outerUrl
            this.$emit('uploadResult', res.data.id, res.data.outerUrl)
          } else {
            this.$common.showMsg('上传失败')
          }
        } else {
          // 校验失败
          this.$emit('checkRes', 'fail')
        }
      },
      // 删除附件事件处理（本地操作）
      beforeRemove(file, fileList) {
        this.$confirm(`确定要删除${file.name}? `, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 传出处理事件监听
            this.$emit('imgRemove', true)
          })
          .catch(() => {})
        // return this.$confirm(`确定移除 ${ file.name }?`)
      },
      // 删除附件（服务器删除）
      async handleRemove(file, fileList) {
        // 如果文件已经是上传到服务器，才需要进行删除
        console.log('删除成功')
        this.showUrl = ''
        this.$emit('uploadResult', '')
      },
      handlePreview(file) {
        if (!file || !file.url) {
          return
        }
        // 如果文件的图片的话，点击之后可以预览
        if (['png', 'jpg', 'jpeg'].includes(file.name.split('.')[1])) {
          this.dialogImageUrl = file.url
          this.dialogVisible = true
        }
      },
      handleExceed(files, fileList) {
        if (this.isMultiple) {
          this.$common.showMsg(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`)
        } else {
          this.$common.showMsg('当前限制选择 1 个文件')
        }
      },
      clear() {
        this.fileList = []
      },
      // 浏览上传至服务器返回的图片
      showImg(url) {
        this.dialogImageUrl = url
        this.dialogVisible = true
      }
    },
    mounted() {

    }
  }
</script>

<style>
  .confirm-upload {
    max-width: 500px;
  }
  .warnText {
    color: red;
    font-size: 12px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .mt10 {
    margin-top: 10px;
  }
</style>
