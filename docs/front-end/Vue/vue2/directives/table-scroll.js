export default {
  name: 'table-scroll',
  inserted(el, binding) {
    const header = el.querySelector('.el-table__header')
    const child = el.querySelector('.el-table__body')
    const childWrapper = el.querySelector('.el-table__body-wrapper')

    childWrapper.style.overflow = 'hidden'

    if (!child) {
      console.warn('v-table-scroll 需要类名为 el-table__body 的子元素')

      return
    }

    let translateY = 0
    let animationId = null
    let lastTime = 0
    let isActive = !!binding.value
    let maxScroll = 0

    function init() {
      child.style.transition = 'transform 1s linear'
      maxScroll = child.clientHeight - (el.clientHeight - header.clientHeight)
      lastTime = 0 // 重置计时
    }

    function stop() {
      if (animationId) {
        child.style.transition = 'none'
        translateY = 0
        child.style.transform = `translateY(${translateY}px)`
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }

    function step(timestamp) {
      if (!lastTime) lastTime = timestamp
      const elapsed = timestamp - lastTime

      if (isActive && elapsed >= 1000) {
        // 间隔1秒
        if (Math.abs(translateY) < maxScroll) { // 可以滚动
          translateY -= 10
          child.style.transform = `translateY(${translateY}px)`
          lastTime = timestamp
        } else if (maxScroll > 0) {// 不可以滚动 滚动到最底部
          stop()
          setTimeout(() => {
            init()
          }, 500)
        } else { // 不可以滚动 没有可滚动距离
          // 到底，停止动画
          cancelAnimationFrame(animationId)
          animationId = null

          return
        }
      }

      animationId = requestAnimationFrame(step)
    }

    function start() {
      if (!animationId) {
        init()
        animationId = requestAnimationFrame(step)
      }
    }

    if (isActive) start()

    el.__vScrollUp__ = {
      start,
      stop,
      setActive(active) {
        isActive = active
        if (active) {
          start()
        } else {
          stop()
        }
      },
    }
  },

  update(el, binding) {
    if (!el.__vScrollUp__) return

    if (binding.value !== binding.oldValue) {
      el.__vScrollUp__.setActive(!!binding.value)
    }
  },

  unbind(el) {
    if (el.__vScrollUp__) {
      el.__vScrollUp__.stop()
      delete el.__vScrollUp__
    }
  },
}
