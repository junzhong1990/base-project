<template>
  <div
    class="lock-mask"
    :style="{ width: width, height: height }"
    v-if="locked"
  ></div>
</template>

<script>
export default {
  name: 'lockMask',
  data() {
    return {
      locked: this.$glStorage.get('locked'),
      width: '4500px',
      height: '4500px'
    }
  },
  created() {
    if (this.locked) {
      this.width = '200px'
      this.height = '200px'
      this.$router.push({
        name: 'locking'
      })
    }
    this.eventBus.$off('lock')
    this.eventBus.$on('lock', (val) => {
      this.locked = true
      setTimeout(() => {
        this.width = '200px'
        this.height = '200px'
        setTimeout(() => {
          this.$router.push({
            name: 'locking'
          })
        }, 1500)
      }, 0)
    })
  }
}
</script>

<style lang="less" scoped>
.lock-mask {
  transition: all 1.5s ease-out 0s;
  border: 4500px solid #3f4852;
  width: 4500px;
  height: 4500px;
  border-radius: 100%;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  box-sizing: content-box;
  z-index: 999;
}
</style>
