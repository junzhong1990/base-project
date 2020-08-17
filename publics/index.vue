<template>
  <div>
    <el-input v-model="test"></el-input>
    <el-button type="primary" @click="testClick">点击</el-button>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        test:''
      }
    },
    methods: {
      testClick(){
        this.test = '123456'
      }
    }
  }
</script>
