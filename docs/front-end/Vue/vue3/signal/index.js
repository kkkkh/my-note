function createSignal(initialValue) {
  let value = initialValue
  const subscribers = new Set()

  return {
    get value() {
      // 依赖收集：如果当前有激活的副作用，订阅它
      if (activeEffect) {
        subscribers.add(activeEffect)
      }
      return value
    },
    set value(newValue) {
      if (newValue !== value) {
        value = newValue
        // 通知订阅者更新
        subscribers.forEach(fn => fn())
      }
    }
  }
}

let activeEffect = null

function effect(fn) {
  activeEffect = fn
  fn()         // 初始执行，触发依赖收集
  activeEffect = null
}


const count = createSignal(0)
const doubleCount = createSignal(0)

// 计算双倍的效果
effect(() => {
  debugger
  doubleCount.value = count.value * 2
  console.log('doubleCount updated:', doubleCount.value)
})

// 改变 count，会触发对应依赖 effect 执行
// doubleCount updated: 0
count.value = 1  
// 输出：doubleCount updated: 2
// 输出：doubleCount updated: 2
count.value = 2  
// 输出：doubleCount updated: 4
// 输出：doubleCount updated: 4
