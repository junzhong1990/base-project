<template>
  <div class="qrcode-box">
    <div :id="qrcodeId"></div>
  </div>
</template>
<script>
  import QRCode  from 'qrcodejs2'
  export default {
    name: 'glQrcode',
    props: {
      text: {
        type: String,
        default: ''
      },
      width: {
        type: [Number, String],
        default: 200
      },
      height: {
        type: [Number, String],
        default: 200
      },
      styleConfig: {
        type: Object
      },
      correctLevel: {
        type: String,
        default: 'H'
      }
    },
    data() {
      return {
        qrcodeId: `qrcode${Date.now()}`,
        qrcode: null
      }
    },
    watch: {
      text: {
        handler(newVal) {
          console.log(newVal)
          if (newVal) {
            this.redrawQRCode()
          }
        }
      }
    },
    mounted() {
      this.createQRCode()
    },
    methods: {
      // 生成二维码
      createQRCode() {
        const qrcode = new QRCode(this.qrcodeId, {
          width: this.width,
          height: this.height,
          text: this.text || 'QRCode',   // 二维码内容
          ...this.styleConfig,
          // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#000000',   // 背景色
          // foreground: '#ffffff'    // 前景色
          correctLevel : QRCode.CorrectLevel[this.correctLevel]
        })
        this.qrcode = qrcode
      },
      // 重新生成新的二维码
      redrawQRCode() {
        if (this.qrcode) {
          this.qrcode.clear()
          this.qrcode.makeCode(this.text)
        }
      },
      // 下载二维码
      downQRCode() {
        this.$nextTick(_ => {
          let img = document.getElementById(this.qrcodeId).getElementsByTagName('img')[0]
          let a = document.createElement('a')
          a.href = img.src
          a.style.display = 'none'
          a.setAttribute('download', '二维码.png')
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .qrcode-box{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
