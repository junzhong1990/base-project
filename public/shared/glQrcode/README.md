```vue
<template>
  <el-dialog
    :visible.sync="qrcodeVisible"
    title="二维码">
      <glQrcode :text="qrcodeText" />
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        qrcodeVisible: false,
        qrcodeText: ''
      }
    }
  }
</script>
```