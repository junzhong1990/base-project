```vue
<template>
  <el-dialog
    title="打印预览"
    :visible.sync="isPrint"
    :fullscreen="true">
    <glPrint :data="printData" @cancel="isPrint=false"></glPrint>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      isPrint: false,
      printData: {}
    }
  },
  methods: {
    handlePrint() {
      this.printData = {
        title: this.$route.meta.title,
        props: this.columnTitle,
        tableData: this.tableData,
        params: this.pageInfo
      }
    }
  }
}
</script>
```