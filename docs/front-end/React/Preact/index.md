---
outline: deep
---
## Preact
通过一个轻量的 preact/compat Preact 层实现 100% 兼容 React。
## Preact 与 react 区别（更倾向于原生）
- 合成事件系统区别：
  - react 与 React 的主要差别是 Preact 并没有实现一个为了大小和性能而去实现合成事件系统（synthetic event system）。
  - Preact 是使用浏览器标准 addEventListener 去注册事件函数，这意味着 Preact 中的事件名称和行为都是和原生 JavaScript/ DOM 行为一致的。
  - 参考 MDN's Event Reference 来了解所有的 DOM 事件句柄.
- 标准浏览器事件的工作方式与 React 中事件的工作方式非常相似，但有一些细微的差别。在 Preact 中：
  - 事件不会冒泡到 `<Portal>` 组件
  - 在表单输入中时应当使用标准的 onInput 来代替 React 的 onChange (仅当不使用 preact/compat 的时候)
  - 应当用 onDblClick 来代替 React 的 onDoubleClick (仅当不使用 preact/compat 的时候)
  - `<input type="search">` 应当使用 onSearch，因为在 IE11 上 "x" 按钮并不支持 onInput
- 另一个显著的区别是 Preact 更严格地遵循 DOM 规范。支持像任何其他元素一样的自定义元素，并且支持区分大小写的自定义事件名称（就像它们在 DOM 中一样）。

## 其他独有
- es6
- Component.render() 中的参数
- 原始 HTML attribute/property 名称
- Preact 按原样应用 SVG 属性
- 使用 onInput 而不是 onChange
...
