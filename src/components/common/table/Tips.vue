<template>
  <span
    class="s-infotip"
    ref="tips"
    v-bind="$attrs"
    @mouseenter="tipMouseEnter"
    @mouseleave="tipMouseLeave"
    @click="tipClick">
      <i ref="tchild">{{content}}</i>
  </span>
</template>
<script>
  export default {
    name: 'sInfotip',
    props: {
      content: {
        type: [String, Number],
        default: ''
      },
      width: {
        type: [String, Number],
        default: 80
      }
    },
    methods: {
      tipClick() {
        this.$emit('tipClick')
      },
      tipMouseEnter () {
        if (!this.content) {
          return
        }
        this.$nextTick(() => {
          // 水平方向 width + 左右padding + 左右border-width
          let tw = this.$refs.tips.offsetWidth
          let pw = parseInt(this.width)
          let w = tw >= pw ? tw : pw
          let bw = tw >= pw ? 5 : (20 + (this.isIE() ? 22 : 0))
          // console.log(`tchidw：${this.$refs.tchild.offsetWidth}，tipsW：${tw}，pw：${pw}，w：${w}，bw：${bw}， w-b：${ w-bw}`)
          if (this.$refs.tchild.offsetWidth >= w - bw) {
            // 返回元素的大小及其相对于视口的位置
            const {left, top} = this.$refs.tips.getBoundingClientRect()
            this.showTips(left, top)
          }
        })
      },
      isIE() {
        return window.navigator.userAgent.indexOf('Trident') > -1
      },
      tipMouseLeave () {
        if (this.dom) {
          this.dom.style.display = 'none'
        }
      },
      showTips (left, top) {
        if (!this.dom) {
          this.dom = document.querySelector('#sTableTooltip')
          if (!this.dom) {
            this.dom = document.createElement('div')
            this.dom.id = 'sTableTooltip'
            document.body.appendChild(this.dom)
          }
        }
        this.dom.innerHTML = this.content
        // this.dom.style.left = left - 12 + 'px'
        this.dom.style.left = left + 'px'
        this.dom.style.top = top + 28 + 'px'
        this.dom.style.display = 'block'
      }
    },
    beforeDestroy () {
      if (this.dom && document.querySelector('#sTableTooltip')) {
        document.body.removeChild(this.dom)
      }
    },
    deactivated () {
      if (this.dom && this.dom.style.display === 'block') {
        this.dom.style.display = 'none'
      }
    }
  }
</script>

<style lang="less">
  .s-infotip {
    display: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // font-size: 12px;
    // color: #2f2f2f;
    cursor: default;
    i {
      font-style: normal
    }
  }
  #sTableTooltip {
    position: fixed;
    max-width: 500px;
    max-height: 300px;
    overflow: hidden;
    z-index: 9999;
    border-radius: 2px;
    border: 1px solid #bdbbbb;
    padding: 1px 6px;
    word-wrap: break-word;
    -webkit-transform-origin: center bottom 0;
    transform-origin: center bottom 0;
    // font-size: 12px;
    background-color: #f7f5f5;
  }
</style>
