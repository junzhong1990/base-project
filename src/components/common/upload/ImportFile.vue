<!--
上传组件（点击后为模态对话框，可查上传记录）
-->

<template>
  <div>
    <el-button icon="el-icon-upload" @click="dialogModal = true">{{btnName}}</el-button>

    <el-dialog class="upload-modal" :visible.sync="dialogModal" width="800px">
      <!--<Dialog class="upload-modal" title="上传附件" :visible.sync="dialogModal" width="800px">-->
      <div slot="title">
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
          <el-tab-pane label="选择附件" name="first" v-if="uploadVisiable">
            <!--:before-remove="beforeRemove"-->
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

            <el-form :model="form" class="mt12">
              <el-form-item label="附件模板" :label-width="'90px'">
                <span style="color: rgb(43, 133, 228);cursor: pointer;" @click="downloadTemp">点击下载</span>
              </el-form-item>
              <el-form-item label="附件描述" :label-width="'90px'">
                <el-select v-model="form.statisYear">
                  <el-option v-for="item in statisYearList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
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
  import storage from "@/utils/storage"
  export default {
    name: 'ModalUpload',
    props: {
      disabled: {
        type: Boolean,
        default: true
      },

      type: {
        type: Array,
        default: () => {
          return ['jpg', 'bmp', 'png'] // 文件支持类型,默认支持图片
        }
      },

      btnName: {
        type: String,
        default: '导入'
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
        statisYearList: [
          {
            label: '2020',
            value: '2020'
          },
          {
            label: '2019',
            value: '2019'
          },
          {
            label: '2018',
            value: '2018'
          },
          {
            label: '2017',
            value: '2017'
          },
          {
            label: '2016',
            value: '2016'
          },
        ],
        curUser: '',
        videoFlag: false,
        videoUploadPercent: 0,
        form: {
          statisYear: '2020'
        },
        activeName: 'first',
        loading: false,
        dialogImageUrl: '',
        dialogImgVisible: false,
        dialogModal: false,
        filesArr: [],
        fileList: [],
        originImg: ''
      }
    },
    watch: {

    },
    methods: {
      async downloadTemp() {
        let res = await this.$api.downloadTemplate({
          responseType: 'blob'
        })
        window.scOpen(res.blob, '环境数据')


        // var newTab = window.open(`http://10.8.0.144:8600/api/v1/station/stationEnvironmentInfo/downloadTemplate?token=${storage.get("token")}`)

        // const res = await this.$api.downloadTemplate({
        // })
        // console.log(res) // 返回结果
        // // 这里尤其需要注意, '\ufeff' 用于解决乱码问题, blob可以解决数据量大导致网络失败.
        // const blob = new Blob(['\ufeff' + res], { type: 'text/csv;charset=utf-8' })
        // const url = window.URL.createObjectURL(blob)
        // // 通过创建a标签实现
        // const link = document.createElement('a')
        // link.href = url
        // // 对下载的文件命名, 如果后端返回名称出现乱码, 需要后端编码一下.
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)

      },
      filesChange(file) {
        console.log(file)
        // this.filesArr = file
        this.checkFile()
      },
      // 检查文件格式是否符合要求
      checkFile() {
        return new Promise(((resolve, reject) => {
          let arr = this.filesArr = this.$refs.upload.uploadFiles
          if (!this.$refs.upload.uploadFiles.length) {
            this.$Message('请先选择文件', 'warning')
            resolve(false)
          }
          arr.forEach(async file => {
            if (file.size && file.size / 1000 > this.maxSize) {
              this.$Message('文件容积太大，限制' + (this.maxSize / 1000) + 'MB', 'warning')
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
                this.$Message(`文件类型只支持: ${str}`, 'warning')
                resolve(false)
              }
            }
          })
        }))
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
          let formData = new FormData();
          this.filesArr.forEach((val, key) => {
            console.log(val)
            formData.append('files[]', val.raw)
          })
          formData.append('statisYear', this.form.statisYear)
          const res = await this.$api.importStationEnvironmentInfo({
            data: formData
          })
          this.loading = false
          if (res.code == 0) {
            this.form.statisYear = '2020'
            this.fileList = []
            this.filesArr = []
            this.$message.success('上传成功')
            this.dialogModal = false
            // 上传结果
            this.$emit('uploadResult')
          } else {
            // this.$Message(res.msg, 'warning')
            this.$message.error(res.msg)
          }

        }
      },

      handleExceed(files, fileList) {
        if (this.isMultiple) {
          this.$Message(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`, 'warning')
        } else {
          this.$Message(`当前限制选择 1 个文件`, 'warning')
        }
      },
      handleTabsClick(tab) {
        if (tab.index == 1) {
          this.getHistory()
        }
      },

      uploadVideoProcess(event, file, fileList) {
        console.log(event)
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0)
      }

    },
    mounted() {

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
