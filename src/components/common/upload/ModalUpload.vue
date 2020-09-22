<!--
上传组件（点击后为模态对话框，可查上传记录）
-->

<template>
  <div>
    <el-button type="primary" @click="dialogModal = true">{{btnName}}</el-button>

    <el-dialog class="upload-modal" :visible.sync="dialogModal" width="800px">
      <!--<Dialog class="upload-modal" title="上传附件" :visible.sync="dialogModal" width="800px">-->
      <div slot="title">
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
          <el-tab-pane label="选择附件" name="first" v-if="uploadVisiable">
            <!--:before-remove="beforeRemove"-->
            <!--:on-remove="handleRemove"-->
            <!--:on-preview="handlePreview"-->
            <el-upload
               class="confirm-upload"
               action=""
               ref="upload"
               :on-exceed="handleExceed"
               :on-change="filesChange"
               :file-list="fileList"
               :multiple="isMultiple"
               :limit="!isMultiple?1:limit"
               :on-progress="uploadVideoProcess"
               :auto-upload="false">
              <el-button slot="trigger" type="primary" :disabled="disabled">选取文件</el-button>
              <!--:http-request="(file)=>uploadOnsuccess(file,index)"-->

              <div slot="tip" class="el-upload__tip">
                <slot name="warnTxt">
                  <div v-if="type" style="text-indent: 22px;color: red;margin-top: 20px;">
                    要求上传 {{type.join('、')}} 格式，文件大小限制 {{ maxSize/1000 }}MB
                  </div>
                </slot>
              </div>
              <!--<el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent"-->
              <!--style="margin-top:30px;"></el-progress>-->
            </el-upload>

            <el-form :model="form" style="margin-top: 12px;">
              <el-form-item label="附件描述" :label-width="'90px'">
                <el-input v-model="form.comments"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="查看记录" name="second">
            <el-table stripe
                   :data="hisList"
                   height="250"
                   border
                   style="width: 100%">
              <el-table-column prop="name" label="附件名称" width="180"></el-table-column>
              <el-table-column prop="type" label="文件格式"></el-table-column>
              <el-table-column prop="comments" label="描述"></el-table-column>
              <!--<el-table-column prop="fileSize" label="文件大小"></el-table-column>-->
              <!--<el-table-column prop="downloadCount" label="下载次数"></el-table-column>-->
              <!--<el-table-column prop="createByName" label="上传人" width="120"></el-table-column>-->
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-button @click="download(scope.row)" type="text">下载</el-button>
                  <el-button @click="deleteFile(scope.row.id)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

        </el-tabs>
      </div>
      <!-- 固定写死不显示（只为了拿到图片的宽和高） -->
      <img id="originImg" :src="originImg" alt="" v-show="false">
      <!--底部按钮-->
      <div slot="footer">
        <el-button @click="dialogModal = false">关 闭</el-button>
        <el-button class="ml10"
                type="success"
                :loading="loading"
                @click="submitUpload" v-if="activeName=='first'">上传到服务器
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ModalUpload',
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    backIds: {
      type: [String, Array],
      default: ''
    },
    type: {
      type: Array,
      default: () => {
        return ['jpg', 'bmp', 'png'] // 文件支持类型,默认支持图片
      }
    },
    propName: {
      type: String,
      default: ''
    },
    btnName: {
      type: String,
      default: '打开上传'
    },
    uploadVisiable: {
      type: Boolean,
      default: true
    },
    maxSize: {
      type: [Number, String],
      default: 10000 // 文件大小，默认10M 单位:kb
    },
    api: {
      type: [Object],
      default: function () {
        return {}
      } // 上传的接口
    },
    limit: {
      type: [Number, String],
      default: 4 // 文件限制数量，默认最大只能传4个
    },
    isMultiple: {
      type: Boolean,
      default: false // 是否能多附件上传，默认单文件上传
    },
    checkImgSize: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      ids: [],
      curUser: '',
      videoFlag: false,
      videoUploadPercent: 0,
      form: {
        comments: ''
      },
      activeName: 'first',
      loading: false,
      dialogImageUrl: '',
      dialogImgVisible: false,
      dialogModal: false,
      filesArr: [],
      fileList: [],
      hisList: [],
      originImg: ''
    }
  },
  watch: {
    backIds: {
      handler(newValue, oldValue) {
        console.log(newValue)
        if (newValue.constructor === String) {
          this.ids = newValue.split(',')
        } else if (newValue.constructor === Array) {
          this.ids = newValue
        }
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    }
  },
  methods: {
    async download(row) {
      let res = await this.$api.downloadFile({data: {id: row.id}, responseType: 'blob'})
      let name = Math.random().toString().slice(2)
      if (row.name) {
        name = row.name.replace(/\./g, '')
      }
      window.scOpen(res.blob, name, null, `.${row.type}`)
    },
    filesChange(file) {
      console.log(file)
      // this.filesArr = file
      this.checkFile()
    },
    // 检查文件格式是否符合要求
    checkFile() {
      return new Promise((resolve, reject) => {
        let arr = this.filesArr = this.$refs.upload.uploadFiles
        if (!this.$refs.upload.uploadFiles.length) {
          this.$Message('请先选择文件', 'error')
          resolve(false)
        }
        arr.forEach(async file => {
          if (file.size && file.size / 1000 > this.maxSize) {
            this.$Message('文件容积太大，限制' + (this.maxSize / 1000) + 'MB', 'error')
            resolve(false)
          } else {
            console.log(this.checkImgSize)
            if (this.checkImgSize) {
              // 印章管理页面，增加对印章尺寸大小的校验
              let res = await this.checkImageSize(file.raw)
              if (res) {
              } else {
                this.$Message(`印章尺寸不符合要求，大小不得超过宽${this.checkImgSize.width}, 高${this.checkImgSize.height}`, 'error')
                this.$refs.upload.uploadFiles = []
                resolve(false)
              }
            }
            let checkFileName = this.type
            let name = file.name
            let index = name.lastIndexOf('.') + 1
            let fileName = name.substr(index).toLowerCase()
            if (checkFileName.includes(fileName)) {
              // return checkFileName.includes(fileName)
              resolve(true)
            } else {
              var str = this.type.join(',')
              this.$Message(`文件类型只支持: ${str}`, 'error')
              resolve(false)
            }
          }
        })
      })
    },
    checkImageSize(file) {
      return new Promise(resolve => {
        let _this = this
        var a = new FileReader()
        a.readAsDataURL(file)
        a.onload = function (e) {
          console.log(_this.checkImgSize)
          _this.originImg = e.target.result
          let dom = document.getElementById('originImg')
          setTimeout(() => {
            if (dom.width <= _this.checkImgSize.width && dom.height <= _this.checkImgSize.height) {
              console.log(dom.width)
              console.log(dom.height)
              resolve(true)
            } else {
              console.log(dom.width)
              console.log(dom.height)
              resolve(false)
            }
          }, 200)
        }
      })
    },
    // 上传附件
    async submitUpload(files) {
      // this.$refs.upload
      const isPass = await this.checkFile()
      console.log(isPass)
      if (isPass) {
        this.loading = true
        let formData = new FormData()
        this.filesArr.forEach((val, key) => {
          console.log(val)
          formData.append('files[]', val.raw)
        })
        formData.append('comments', this.form.comments ? this.form.comments : '')
        const res = await this.$api.testUpload({
          data: formData
        })
        console.log(res)
        this.loading = false
        if (res.code === 0) {
          this.form.comments = ''
          this.fileList = []
          this.filesArr = []
          this.$message.success('上传成功')
          let backIds = []
          res.data.forEach((val, i) => {
            backIds.push(val.data.id)
          })
          this.ids.push(...backIds)
          console.log(this.ids)
          // 上传结果
          this.$emit('uploadResult', this.ids.join(','), this.propName)
          // this.ids.push(res.data[0].data.id)
          // console.log(this.ids)
        } else {
          // this.$Message(res.msg, 'warning')
          this.$message.error(res.msg)
        }
        // 附件的描述
        // this.api.comments = this.form.comments
        // const res = await this.postFile('files', {
        //   apiCode: 200007,
        //   content: this.api
        // }, this.filesArr)
        // this.loading = false
        // if (res.code == 0) {
        //   this.form.comments = ''
        //   this.fileList = []
        //   this.filesArr = []
        //   this.$Message('上传成功')
        //   // 上传结果
        //   this.$emit('uploadResult', JSON.stringify(res.content.content))
        // } else {
        //   this.$Message(res.msg, 'warning')
        // }
      }
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }?`)
    // },
    // 删除附件
    async handleRemove(file, fileList) {
      // 如果文件已经是上传到服务器，才需要进行删除
      if (file.status === 'success') {
        const res = await this.postJson('common', {
          apiCode: 200006,
          content: {id: file.id}
        })
        this.loading = false
        if (res.code === 0) {
          this.fileList = []
          this.$Message('删除成功')
        } else {
          this.$Message(res.msg, 'error')
        }
      }
    },
    // handlePreview(file) {
    //   console.log(file)
    //   // 如果文件的图片的话，点击之后可以预览
    //   if (['png', 'jpg', 'jpeg'].includes(file.name.split('.')[1])) {
    //     this.dialogImageUrl = file.url
    //     console.log(file.url)
    //     this.dialogImgVisible = true
    //   }
    // },
    handleExceed(files, fileList) {
      if (this.isMultiple) {
        this.$Message(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`, 'error')
      } else {
        this.$Message('当前限制选择 1 个文件', 'error')
      }
    },
    handleTabsClick(tab) {
      if (tab.index === 1) {
        this.getHistory()
      }
    },
    async getHistory() {
      console.log(this.ids)
      if (this.ids.length === 0) {
        this.hisList = []
        return
      }
      if (this.ids === '') {
        return
      }
      const res = await this.$api.uploadList({
        data: {
          ids: this.ids.join(',')
        }
      })
      this.hisList = res.data
    },
    downFile(val) {
      window.open(val.row.outerUrl, 'blank')
      setTimeout(() => {
        this.getHistory()
      }, 200)
    },
    async deleteFile(id) {
      const flag = await this.$confirm('确定移除?')
      console.log(flag)
      if (flag === 'confirm') {
        const res = await this.$api.deleteFile({
          data: {
            id: id * 1
          }
        })
        if (res.code === 0) {
          // Array.prototype.remove = function(val) {
          //   var index = this.indexOf(val)
          //   if (index > -1) {
          //     this.splice(index, 1)
          //   }
          // }
          var index = this.ids.indexOf(id)
          if (index > -1) {
            this.ids.splice(index, 1)
          }
          // this.getHistory()
          // console.log(this.ids)
          // this.ids.remove(id)
          this.$message.success('删除成功！')
          console.log(this.ids)
          this.getHistory()
          this.$emit('uploadResult', this.ids.join(','), this.propName)
        }
        console.log(res)
        // const res = await this.postJson('common', {
        //   apiCode: 200006,
        //   sysModule: 'station',
        //   content: {id}
        // })
        // if (res.code == 0) {
        //   this.hisList = this.hisList.filter(file => {
        //     console.log(file)
        //     return file.id != id
        //   })
        //   this.$Message('删除成功')
        // }
      }
    },
    uploadVideoProcess(event, file, fileList) {
      console.log(event)
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0)
    }
    // uploadOnsuccess(file, index) {
    //   console.log(file)
    // }
  },
  mounted() {
    // console.log(this.backIds)
    // this.ids = this.backIds.split(',')
    if (this.backIds.constructor === String) {
      this.ids = this.backIds === '' ? [] : this.backIds.split(',')
    } else if (this.backIds.constructor === Array) {
      this.ids = this.backIds
    }
    this.$emit('uploadResult', this.ids.join(','), this.propName)
    this.eventBus.$on('fileUpload', (ids) => {
      this.ids = ids.split(',')
      // this.$emit('trainUploadValueBack', this.form, this.mainProp)
    })
  }
}
</script>

<style lang="less">
  .upload-modal {
    .el-dialog {
      .el-dialog__body {
        padding: 10px 15px;
      }
      .el-dialog__header {
        padding: 10px 20px 10px;
        /*border-bottom: 1px solid $border-color;*/
      }
      .el-tabs__nav-scroll {
        background: none;
      }
    }
  }
</style>
