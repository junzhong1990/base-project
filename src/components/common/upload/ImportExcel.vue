<template>
  <div class="import-tmp">
    <el-button
      icon="el-icon-upload"
      @click="dialogModal = true"
      :style="btnStyle"
      :disabled="allowUpload"
      class="uploadButton"
    >{{btnLabel}}</el-button>
    <el-dialog class="upload-modal" title="上传附件" :visible.sync="dialogModal" width="800px">
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="选择附件" name="first">
          <template v-if="conf.tooltips && conf.tooltips.length">
            <div class="mt12" v-for="(item, index) in conf.tooltips" :key="index">{{item}}</div>
          </template>
          <template v-else>
            <div class="mt12">提示：一次只能导入一个文件，支持文件格式{{type.join('、')}}</div>
            <div class="mt10 mb12" v-if="isShowTemplate">
              附件模板：
              <a @click="download" style="color: #2b85e4;cursor: pointer;">点击下载导入模板</a>
            </div>
          </template>
          <!-- <div v-if="showAreaSelect">
            所在区域:
            <div style="display: inline-block;width: 150px;">
              <AreaCascader :stage="1" :selectstageFlag="true" :allFlag="true"
                            @sendToAreaSelect="getValFromAreaCascader"></AreaCascader>
            </div>
          </div>-->
          <!-- <div v-if="showSelect" style="margin-bottom: 8px">
            {{selectTitle}}:
            <div style="display: inline-block;width: 150px;">
              <el-select v-model="uploadObj.content.year" style="width:200px" transfer>
                <el-option v-for="item in selectList" :value="item.value" :key="item.value" :label="item.label"></el-option>
              </el-select>
            </div>
          </div>-->
          <el-upload
            class="confirm-upload mt12"
            action
            ref="upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :multiple="isMultiple"
            :limit="!isMultiple ? 1 : limit"
            :auto-upload="false"
          >
            <el-button slot="trigger" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">
              <slot name="warnTxt"></slot>
            </div>
          </el-upload>
        </el-tab-pane>
        <!-- <el-tab-pane label="查看记录" name="second" v-if="showRecord">
          <el-table stripe :data="hisList" height="250" border v-show="!detailFlag" style="width: 100%">
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column prop="status" label="导入状态" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.importStatus">成功</span>
                <span v-else>失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="detail" label="导入详情">
              <template slot-scope="scope">
                <span @click="toDetail(scope.row)" style="color: #2b85e4;cursor: pointer;">详情</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="导入日期"></el-table-column>
            <el-table-column prop="createByName" label="导入人"></el-table-column>
          </el-table>
          <div v-show="detailFlag" style="min-height: 200px">
            <p style="font-size: 14px;margin-bottom: 10px;">{{detailTime}}
              <span style="float: right;">
              <el-button size="small" type="primary" @click="detailFlag=false">返回列表</el-button>
            </span>
            </p>
            <div v-html="detailContent"></div>
          </div>
        </el-tab-pane>-->
      </el-tabs>
      <!--底部按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModal = false">关 闭</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitUpload"
          v-if="activeName=='first'"
        >确认上传</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
// import AreaCascader from '@/components/areaCascader/AreaCascader'
// import { Upload } from 'element-ui'

export default {
  name: 'ImportExcel',
  components: {
    // AreaCascader,
    // Upload
  },
  props: {
    // selectList: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // },
    // selectTitle: {
    //   type: String,
    //   default: '选择框'
    // },
    // showSelect: {
    //   type: Boolean,
    //   default: false
    // },
    // showAreaSelect: {
    //   type: Boolean,
    //   default: false
    // },
    // showRecord: {
    //   type: Boolean,
    //   default: false
    // },

    conf: {
      type: Object,
      default: () => {
        return {
          tooltips: []
        }
      }
    },
    // btnStyle: '',
    btnStyle: {
      type: String,
      default: ''
    },
    //  提示文字
    maxSize: {
      type: [Number, String],
      default: 20000 // 文件大小，默认10M 单位:kb
    },
    // api: {
    //   type: [Object],
    //   default: function () {
    //     return {}
    //   } // 上传的接口
    // },
    // 上传接口
    // uploadApiCode: {
    //   type: String,
    //   default: ''
    // },
    // // 上传参数
    // offlineTrainId: {
    //   type: [Number, String],
    //   default: null
    // },
    // recordObj: {
    //   type: Object
    // },
    downloadOpts: {
      type: Object
    },
    uploadOpts: {
      type: Object,
      default: () => {
        return {
          apiCode: ''
        }
      }
    },
    // 文件支持类型
    type: {
      type: Array,
      default: () => {
        // return ['jpg', 'bmp', 'png']
        return ['xlsx', 'xls']
      }
    },
    // 文件限制数量，默认最大只能传4个
    limit: {
      type: [Number, String],
      default: 4
    },
    // 是否能多附件上传，默认单文件上传
    isMultiple: {
      type: Boolean,
      default: false
    },
    allowUpload: {
      type: Boolean,
      default: false
    },
    // 是否显示模板下载按钮
    isShowTemplate: {
      type: Boolean,
      default: true
    },
    // 按钮文字
    btnLabel: {
      type: String,
      default: '导入'
    },
    // 参数名称
    fileParam: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      // detailTime: '2018-07-04 15:12', // 详情时间
      // detailContent: '导入成功0条，导入失败1<br/>[][导入机顶盒[41010189]错误信息：所属站点编号不存在或者机顶盒编码已经存在。<br/>]', // 详情内容
      // detailFlag: false, // 展示详情还是table   false-table；true-detail
      // uploadObj: {
      //   apiCode: this.uploadApiCode,
      //   content: {
      //     offlineTrainId: this.offlineTrainId !== null ? this.offlineTrainId : ''
      //   }
      // },
      // form: {},
      activeName: 'first',
      loading: false,
      dialogImageUrl: '',
      dialogImgVisible: false,
      dialogModal: false,
      filesArr: [],
      fileList: [],
      hisList: []
    }
  },
  methods: {
    // getValFromAreaCascader(val) {
    //   console.log('我是从子组件获取的结果', val)
    //   const {
    //     regionCode,
    //     regionName
    //   } = val
    //   if (regionCode && regionName) {
    //     this.uploadObj.content = {
    //       regionCode,
    //       regionName
    //     }
    //   } else {
    //   }
    // },
    // toDetail(row) {
    //   console.log(row)
    //   this.detailTime = row.createDate
    //   this.detailContent = row.importDetail
    //   this.detailFlag = true
    // },
    // 下载附件模板
    async download() {
      let params = this.downloadOpts
      let res = await this.$api[params.apiCode]({
        data: params.data || {},
        responseType: 'blob'
      })
      window.scOpen(res.blob, params.fileName)
    },
    // 检查文件格式是否符合要求
    checkFile() {
      return new Promise((resolve, reject) => {
        let arr = (this.filesArr = this.$refs.upload.uploadFiles)
        if (!this.$refs.upload.uploadFiles.length) {
          this.$message.warning('请先选择文件')
          resolve(false)
        }
        arr.forEach((file) => {
          if (file.size && file.size / 1000 > this.maxSize) {
            this.$message.warning('文件容积太大')
            resolve(false)
          } else {
            let checkFileName = this.type
            let name = file.name
            let index = name.lastIndexOf('.') + 1
            let fileName = name.substr(index).toLowerCase()
            if (checkFileName.includes(fileName)) {
              return checkFileName.includes(fileName)
            } else {
              var str = this.type.join(',')
              this.$message.warning(`文件类型只支持: ${str}`)
              resolve(false)
            }
          }
        })
        resolve(true)
      })
    },
    // 上传附件
    async submitUpload() {
      const valid = await this.checkFile()
      if (valid) {
        this.loading = true
        let formData = new FormData()
        this.filesArr.forEach((val, key) => {
          console.log(this.fileParam)
          formData.append(this.fileParam, val.raw)
        })
        // 配置默认参数
        if (this.uploadOpts.content) {
          for (let v of Object.entries(this.uploadOpts.content)) {
            formData.append(v[0], v[1])
          }
        }
        // console.log(formData.get('data'))
        const res = await this.$api[this.uploadOpts.apiCode]({
          data: formData
        })
        this.loading = false
        if (res && res.code === 0) {
          this.fileList = []
          this.filesArr = []
          this.$message.success('上传成功')
          this.dialogModal = false
          // 上传结果
          this.$emit('uploadResult', res.data || [])
        }
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`)
    },
    // 删除附件
    async handleRemove(file, fileList) {},
    handlePreview(file) {
      // 如果文件的图片的话，点击之后可以预览
      if (['png', 'jpg', 'jpeg'].includes(file.name.split('.')[1])) {
        this.dialogImageUrl = file.url
        this.dialogImgVisible = true
      }
    },
    handleExceed(files, fileList) {
      if (this.isMultiple) {
        this.$message.warning(
          `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`
        )
      } else {
        this.$message.warning('当前限制选择 1 个文件')
      }
    },
    handleTabsClick(tab) {}
  }
}
</script>

<style lang="less">
.import-tmp {
  display: inline-block;
  // .el-dialog__footer {
  //   height: 55px;
  // }
  .confirm-upload {
    margin-top: 10px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .el-button:last-child {
    margin-right: 0 !important;
  }
}
.uploadButton {
  margin-right: 24px;
}
.upload-modal {
  .el-dialog {
    .el-dialog__body {
      padding: 10px 15px;
    }
    // .el-dialog__footer {
    //   padding: 10px 20px 10px; // zfSale 使用导入时候，关闭、确认上传按钮位置样式不对，固注释掉上方的padding，做了本修改
    // }
    .el-tabs__nav-scroll {
      background: none;
    }
  }
}
</style>
