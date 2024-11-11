---
outline: deep
---

## Dom

### event
#### 事件捕获、事件冒泡

#### keydown/keyup
- <s>keypress</s><font color=red>(已弃用)</font> 当按下产生字符或符号值的键时，将触发 keypress 事件
- keyup 事件在按键被松开时触发
- keydown 事件在按键被松开时触发
- 扫描枪触发就是 input事件 + keydown Enter事件（生成的条形码中包含英文，输入法是英文状态下，才会触发keydown/keyup事件）

```js
// 按回车键时
document.getElementById("app").addEventListener('keydown',(e)=>{
  console.log(e.code) //Enter
  console.log(e.key)//Enter
  // e.keyCode弃用
  console.log(e.keyCode)//13 
})
```
参考：
- [keyup_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/keyup_event)
- [KeyboardEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent)
- [vue2 按键修饰符](https://v2.cn.vuejs.org/v2/guide/events.html#%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)

