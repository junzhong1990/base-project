<!--
汉王高拍仪
型号：H650/pro
-->
<template>
  <div class="gaopaiyi" :class="{gaopaiyi_disabled : isDisabled}" v-loading="loading">
    <div title="上传成功" v-show="'0'==res" class="icon-wrap ">
      <i class="el-icon-upload-success el-icon-check statusd check"></i>
    </div>
    <div title="上传失败" v-show="'1'==res" class="icon-wrap  close">
      <i class="el-icon-upload-success el-icon-warning statusd close"></i>
    </div>
    <div class="preview_img mb10">
      <img alt="" :src="base64str" :width="base64str ? maxWith : imgWidth" @click="showPic(base64str)">
    </div>
    <!--本地上传-->
    <el-upload ref="upload" accept="image/*" action=""
            :before-upload="handleUpload"
            :on-change="filesChange"
            :disabled="isDisabled"
            :show-file-list="false" :auto-upload="false" :multiple="false">
      <!--:limit="1"-->
      <el-button v-if="isEasyLoading" class="openCaptureBtn upload" :disabled="isDisabled" type="success">上传</el-button>
      <el-button v-else class="openCaptureBtn openfile" :disabled="isDisabled" type="ghost">本地</el-button>
    </el-upload>
    <el-button v-if="showing" @click="open1" class="openCaptureBtn upload" :disabled="isDisabled" type="ghost">打开</el-button>
    <el-button v-if="!isEasyLoading" @click="upload" class="openCaptureBtn upload" :disabled="isDisabled" type="success">上传到服务器</el-button>
    <!--点击导出，弹出框-->
    <el-dialog :visible.sync="showModalFlag" width="500" title="信息采集" :mask-closable="false">
      <!--<p slot="close" style="text-align:center; margin-top: 10px;display: none;">-->
      <!--<Icon type="close" color="#999"></Icon>-->
      <!--</p>-->
      <div class="demo-spin-article">
        <div class="">
          <object v-if="Capture" :id="Capture" style="width: 465px;height: 350px;" align="middle"
                  classid="clsid:6F47932E-3873-49B4-829B-04AF831A92B1"></object>
          <!--<object :id="idCard" style="width: 400px;height: 300px;" align="middle" v-if="isIdcard"
                  classid="clsid:AF7D4101-FADA-48BE-B240-F05F877FC95A"></object>-->
        </div>
        <!--<Spin size="large" fix v-show="spinShow">加载中...</Spin>-->
      </div>

      <div slot="footer">
        <el-button type="ghost" @click="cancel">关闭</el-button>
        <el-button type="primary" @click="takePic" :disabled="!isInitFinished">拍照</el-button>
      </div>

    </el-dialog>
    <el-dialog :visible.sync="filesFlag" title="图片预览" width="60%" class="prc">
      <img :src="img" style="width: 100%;"/>
      <div slot="footer" class="dialog-footer">
        <!--<Button type="ghost" @click="nocheck">关 闭</Button>-->
        <!--<Button type="primary" @click="downLoad">下 载</Button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>

  // import {Tag, Icon, Input, Button, Table, Modal, Spin, Upload} from 'iview'
  import {mapMutations} from 'vuex'

  export default {
    name: 'dataDicEdit',
    props: {
      // flowCode: {
      //   type: String,
      //   default: ''
      // },
      // flowNodeCode: {
      //   type: String,
      //   default: ''
      // },
      GpyIds: {
        // 索引Id
        type: String,
        default: ''
      },
      isShows: {
        // 是否显示高拍仪调起按钮
        type: Boolean,
        default: false
      },
      isIdcard: {
        type: Boolean,
        default: false
      },
      uploadConf: {
        type: Object,
        default: function () {
          return {}
        }
      },
      imgType: {
        type: String,
        default: ''
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      maxSize: {
        type: Number,
        default: 1024
      },
      isEasyLoading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        showing: false,
        spinShow: true,
        showModalFlag: false,
        filesFlag: false,
        Capture: '', // 实例id
        idx: 0, // 摄像头索引号
        base64str: '',
        isInitFinished: false,
        fileName: '', // 文件名
        filenameDir: '', // 文件路径
        imgWidth: '0%',
        maxWith: '100%',
        res: '',
        img: '',
        uploadObj: {
          apiCode: 200075,
          content: {imgStr: '', sysModule: 'flow', hostBizObj: 'flow_files', hostBizId: '1', remark: '', type: ''}
        }
      }
    },
    methods: {
      ...mapMutations({
        setGpy: 'SET_GPY'
      }),
      showPic(val) {
        // 预览大图
        this.img = val
        this.filesFlag = true
      },
      // 每次文件变化的时候，进行文件校验
      filesChange(file) {
        // console.log(file)
        // console.log(this.$refs.upload.uploadFiles)
        // this.handleUpload(this.$refs.upload.uploadFiles[0].raw)
        if (this.isEasyLoading) {
          this.loading = true
          // 只留一个按钮，点击上传即可直接上传
          this.handleUpload(file.raw).then(res =>{
            console.log(res)
            if (res) {
              let that = this
              setTimeout(() => {
                // console.log(this.base64str)
                that.upload()
              }, 2000)
            } else {
              this.loading = false
            }
          })
        } else {
          // 同时有本地、上传2个按钮
          this.handleUpload(file.raw)
        }
      },
      hideModal() {
        this.showModalFlag = false
      },
      clear() {
        this.base64str = ''
      },
      // 上传图片
      upload() {
        if (!this.fileName) {
          this.showMsg('请选择上传图片', 'error')
          return
        }
        // this.$emit('imgStr', {
        //   type: 'upload',
        //   data: this.base64str
        // })
        // const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadObj.content.hostBizId = this.uploadConf.hostBizId
        this.uploadObj.content.imgStr = this.base64str
        this.uploadObj.content.hostBizObj = this.uploadConf.hostBizObj
        this.uploadObj.content.type = this.imgType
        this.uploadObj.content.fileName = this.fileName
        this.postFile('common', this.uploadObj, []).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.showMsg('上传成功')
            // 上传结果
            this.$emit('imguploadResult', {
              imgType: this.imgType,
              type: 'upload',
              res: '0',
              url: res.content.showUrl
            })
            this.res = '0'
          } else {
            // 上传结果
            this.$emit('imguploadResult', {
              imgType: this.imgType,
              type: 'upload',
              res: '1',
              // url: res.content.showUrl
            })
            this.res = '1'
          }
          this.loading = false
        })
      },
      async open1() {
        // 先清除上次图片
        this.showModalFlag = true
        setTimeout(() => {
          this.Capture = 'nodeId' + parseInt(Math.random() * 10000)
        }, 100)
        setTimeout(() => {
          let timer = setInterval(() => {
            console.log('我是定时器')
            this.idx = this.isIdcard ? 1 : 0
            // alert(JSON.stringify(this.Capture))
            var domExit = document.getElementById(this.Capture)
            if (domExit) {
              clearInterval(timer)
              this.captureInit()
              this.spinShow = false
            }
          }, 100)
        }, 100)
      },
      cancel() {
        const gpy = this.epy
        if (this.isIdcard) {
          gpy.CloseDeviceEx(this.idx)
        } else {
          gpy.CloseDeviceEx(this.idx)
        }
        this.Capture = ''
        this.spinShow = true
        this.showModalFlag = false
      },
      takePic() {
        const gpy = this.epy
        // 设置文件名,文件路径
        let fileName = this.getdatestr()
        this.filenameDir = 'C:\\henan_H650P_' + this.idx + '_' + fileName + '.jpg'
        // 调用拍照
        this.epy.CaptureImage(this.idx, this.filenameDir)
        // 生成base64位
        const base64 = this.epy.GetBase64string(this.idx)
        // console.dir('base64:')
        // console.dir(base64)
        // this.base64str = `data:image/png;base64,${base64}`
        this.base64str = `data:image/png;base64,` + base64
        // console.dir('this.base64str:')
        // console.dir(this.base64str)
        this.$emit('imgStr', {
          type: 'preview',
          data: this.base64str
        })
        // 身份证拍摄读取信息
        if (this.imgType === 'flow_idcard') {
          // 2019-4-25 屏蔽此方法，用磁条感应获取身份证信息
          // this.readidcard()
        }
        // 关闭设备
        if (this.idx == 0) {
          gpy.CloseDeviceEx(0)
          console.log('gpy.CloseDeviceEx(0)')
        } else {
          gpy.CloseDeviceEx(1)
          console.log('gpy.CloseDeviceEx(1)')
        }
        this.spinShow = true
        this.showModalFlag = false
        // this.fileName = 'henan_H650Pro_' + this.idx + '_' + fileName + '.jpg'
        this.fileName = this.GpyIds + '.jpg'
        this.imgWidth = '100%'
        // 读取图片预览
        // this.handleUpload({name: 'henan_H650Pro_' + this.idx + '_' + fileName + '.jpg'})
      },
      readidcard() {
        const gpy = this.epy
        // 务必先调用读取证件方法
        if (gpy.ReadIDCard()) {
          let IDName = gpy.GetIDName() // 姓名
          let IDSex = gpy.GetIDSex() // 性别
          var date = new Date()
          let IDBirthYear = date.getFullYear() - gpy.GetIDBirthYear() // 年龄
          let IDNation = gpy.GetIDNation() // 民族
          let IDNum = gpy.GetIDNum() // 身份证号码
          let IDAddress = gpy.GetIDAddress() // 户籍地址
          console.log(IDName)
          this.$emit('IDcardInfo', {
            type: 'info',
            name: IDName.trim(),
            sex: IDSex.trim(),
            age: IDBirthYear,
            nation: IDNation.trim(),
            card: IDNum.trim(),
            address: IDAddress.trim()
          })
        } else {
          this.showMsg('读取身份证信息出错，请检查设备或重新拍摄身份证证件', 'error')
        }
      },
      getdatestr() {
        var date = new Date()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        var hour = date.getHours()
        var min = date.getMinutes()
        var sec = date.getSeconds()
        if (hour >= 0 && hour <= 9) {
          hour = '0' + hour
        }
        if (min >= 0 && min <= 9) {
          min = '0' + min
        }
        if (sec >= 0 && sec <= 9) {
          sec = '0' + sec
        }
        var currentdate = date.getFullYear() + month + strDate + hour + min + sec
        return currentdate.toString()
      },
      async captureInit() {
        const gpy = this.epy
        try {
          // const flag = this.isIdcard ? 'idCard' : 'Capture'
          // const Capture = this.Capture = document.getElementById(this.Capture) // 根据js的脚本内容，必须先获取object对象
          const Capture = document.getElementById(this.Capture) // 根据js的脚本内容，必须先获取object对象
          console.log(Capture)
          this.isInitFinished = await gpy.init(Capture)
          if (this.isInitFinished) {
            if (this.isIdcard) {
              // gpy.CloseDeviceEx(1)
              // 打开副摄像头
              gpy.OpenDevice(1)
            } else {
              // gpy.CloseDeviceEx(0)
              // 打开主摄像头
              gpy.OpenDevice(0)
            }
          }
        } catch (err) {
          console.log('控件加载失败，请检查控件或清理缓存重启浏览器。', 'error')
        }
      },
      async handleUpload(file) {
        this.fileIsReady = await this.checkFile(file)
        if (this.fileIsReady) {
          // let fileName = file.name
          let fileName = this.GpyIds + '.' + file.name.split('.')[1]
          this.fileName = fileName
          this.imgWidth = '100%'
          var reader = new FileReader()
          reader.readAsDataURL(file)
          let that = this
          reader.onload = function (e) {
            that.base64str = this.result
            that.res = '1'
          }
        }
        return this.fileIsReady
        // return false
      },
      // 验证文件大小和格式
      checkFile(file) {
        return new Promise((resolve, reject) => {
          if (file.size / 1024 > this.maxSize) {
            this.showMsg(`文件容积太大，最大不超过${this.maxSize/1024}M！`, 'warning')
            resolve(false)
          } else {
            let validFileName = ['jpg', 'bmp', 'png']
            let index = file.name.lastIndexOf('.') + 1
            let fileSuffix = file.name.substr(index).toLowerCase()
            if (validFileName.includes(fileSuffix)) {
              resolve(true)
            } else {
              this.showMsg('文件类型只支持： jpg, bmp, png', 'warning')
              resolve(false)
            }
          }
        })
      }
    },
    // components: {
    //   Tag,
    //   Icon,
    //   'IInput': Input,
    //   Button,
    //   Modal,
    //   Spin,
    //   Table,
    //   Upload
    // },
    mounted() {
      console.log(this.showing)
      console.log(this.isShows)
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        // this.isShows = true // 兼容IE处理方法
        this.showing = this.isShows // IE浏览器才受父组件传入的isShows控制,非IE浏览器一律不展示
      }
      console.log(this.showing)
    },
    activated: function () {
    },
    beforeMount() {
      // this.Capture = 'nodeId' + parseInt(Math.random() * 10000)
      // alert(this.Capture)
    }
  }
</script>

<style lang="less" scoped>
  .gaopaiyi {
    width: 224px;
    width: 100%;
    height: auto;
    /*border: 1px solid #dddee1;
    border-radius: 4px;*/
    position: relative;
    overflow: hidden;
  }

  .icon-wrap {
    position: absolute;
    left: -24px;
    top: -12px;
    transform: translate(0px, 0px) rotate(-45deg);
    background: #13ce66;
    width: 80px;
    height: 28px;
    animation: fade_in;
  }

  .icon-wrap.close {
    background: wheat;
  }

  .statusd {
    position: absolute;
    left: 8px;
    top: 6px;
    text-indent: 2px;
    z-index: 999;
    font-weight: bold;
    /*background: #fff;*/
    padding: 3px 13px;
    /*border-radius: 0px 10px 10px 0px;*/
    color: white;
    opacity: .85;
    transform: rotate(45deg);
  }

  .close {
    color: #E6A23C;
  }

  @keyframes mymove {
    from {
      left: -10px;
      opacity: 0
    }
    to {
      left: 2px;
      opacity: .8
    }
  }

  .openCaptureBtn {
    right: 4px;
    bottom: 4px;
    &.upload {
      bottom: 40px;
    }
    &.openfile {
      bottom: 80px;
    }
  }

  .maskright {
    position: absolute;
    right: -105%;
    top: 0;
    background: red;
  }

  .idCard {
    width: 800px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
  }

  .open {
    position: absolute;
    right: 10px;
    bottom: 4px;
  }

  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .preview_img {
    width: 100%;
    min-height: 32px;
    height: auto !important;
    height: 32px;
    overflow: visible;
    margin-left: 0%;
    float: left;
    border: 1px solid #d5d5d5;
    border-radius: 4px;
    text-indent: 0px;
    box-sizing: border-box;
    line-height: 1px;
  }

  .preview_img img {
    /*padding: 5px;*/
    cursor: pointer;
  }

  .preview_img + div {
    display: inline-block;
    margin-right: 10px;
  }

  .ivu-upload {
    height: 0px !important;
    display: inline-block;
    text-indent: -6px;
    // width: 0px!important;
  }

  .gaopaiyi_disabled .preview_img {
    background-color: #f3f3f3;
    /*cursor: not-allowed;*/
    cursor: default;
  }

</style>

