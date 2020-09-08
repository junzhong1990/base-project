/**
 * 自定义指令
 */
// 过渡时间 单位 为ms
const durationTime = 200

function createSlideArrow () {
  let span = document.createElement('span')
  span.setAttribute('name', 'arrow')
  span.className = 'el-icon-arrow-right'
  span.style.display = 'block'
  span.style.color = '#666'
  span.style.padding = '0px 10px 0 10px'
  span.style.transition = `all ${durationTime / 1000}s`
  return span
}
export default {
  directives: {
    slideToggle: {
      bind (el, binding) {
        let elKey = el.attributes.name.value
        let timerStr = `t_${elKey}`
        clearTimeout(window[timerStr]) // 清除定时器
        if (!binding.value.hasOwnProperty(elKey)) return
        let slideToggleHandle = el.children.slideToggleHandle
        let slideToggleWrap = el.children.slideToggleWrap
        if (!slideToggleHandle || !slideToggleWrap) return
        slideToggleHandle.style.cursor = 'pointer'
        if (!slideToggleHandle.lastElementChild.children['arrow']) {
          slideToggleHandle.lastElementChild.appendChild(createSlideArrow())
        }
        let slideArrow = slideToggleHandle.lastElementChild.children['arrow']
        slideToggleWrap.style.transition = `all ${durationTime / 1000}s`
        slideToggleWrap.style.overflow = 'hidden'
        let slideStatus = binding.value[elKey]
        slideToggleWrap.style.display = slideStatus ? 'block' : 'none'
        slideArrow.style.transform = slideStatus ? 'rotate(90deg)' : 'rotate(0deg)'
        slideToggleHandle.addEventListener('click', function () {
          slideToggleWrap.style.display = 'block'
          if (slideStatus) {
            slideToggleWrap.style.height = slideToggleWrap.scrollHeight + 'px'
            setTimeout(() => {
              slideToggleWrap.style.height = 0
            }, 0)
          } else {
            slideToggleWrap.style.height = 0
            setTimeout(() => {
              slideToggleWrap.style.height = slideToggleWrap.scrollHeight + 'px'
            }, 0)
            window[timerStr] = setTimeout(() => {
              slideToggleWrap.style.height = null
            }, durationTime)
          }
          slideStatus = !slideStatus
          slideArrow.style.transform = slideStatus ? 'rotate(90deg)' : 'rotate(0deg)'
        }, false)
      },
    }
  }
}
