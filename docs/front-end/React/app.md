# React
## React 原理
### Component
### 渲染机制
https://elm-lang.org/
Object.is
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt
https://emotion.sh/docs/introduction
https://developer.mozilla.org/zh-CN/docs/Glossary/Vendor_Prefix
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals#%E5%B8%A6%E6%A0%87%E7%AD%BE%E7%9A%84%E6%A8%A1%E6%9D%BF
- 几个问题：
    - 为什么我需要关心 React 组件的渲染机制？
    - 为什么数据变了，但组件没重新渲染？
    - 为什么数据没变，但组件也重新渲染了？
- 虚拟dom功能以及优点：
    - React 帮你节省了更多代码量，是作为 React 面向开发者的 API 与 React 内部实现对接的桥梁。
    - React 提供一系列算法和过程，过滤掉没有必要的 DOM API 调用，最终把f() 的成本降下来。
    - 虚拟 DOM 就是这些算法过程的中间模型，它远比 DOM API 轻量，跟最终的 DOM API 分摊成本后，保证 React 组件的渲染效率。
- 协调
    - 每次有 props、state 等数据变动时，组件会渲染出新的元素树，React 框架会与之前的树做 Diffing 对比，将元素的变动最终体现在浏览器页面的 DOM 中。这一过程就称为协调
- diffing 算法
    - 从根元素开始，React 将递归对比两棵树的根元素和子元素；
    - 对比不同类型的元素，如对比 HTML 元素和 React 组件元素，React 会直接清理旧的元素和它的子树，然后建立新的树；
    - 对比同为 HTML 元素，但 Tag 不同的元素，如从 \<a\> 变成 \<div\> ，React 会直接清理旧的元素和子树，然后建立新的树；
    - 对比同为 React 组件元素，但组件类或组件函数不同的元素，如从 KanbanNewCard 变成 KanbanCard ，React 会卸载旧的元素和子树，然后挂载新的元素树；
    - 对比 Tag 相同的 HTML 元素，如  <input type="text" value="old" /> 和 <input type="text" value="new" /> ，React 将会保留该元素，并记录有改变的属性，在这个例子里就是 value 的值从 "old" 变成了 "new" ；
    - 对比组件类或组件函数相同的组件元素，如 <KanbanCard title="老卡片" /> 和 <KanbanCard title="新卡片" /> ，React 会保留组件实例，更新 props，并触发组件的生命周期方法或者 Hooks。
    - 如果子元素形成一个列表，那么 React 会按顺序尝试匹配新旧两个列表的元素。`key`
- 触发
    - props 从组件外面传进来，
    - state 则是活跃在组件内部，
    - 至于 context ，在组件外面的 Context.Provider 提供数据，组件内部则可以消费 context 数据
    - 只要这三种数据之一发生了变化，React 就会对当前组件触发协调过程，最终按照 Diffing 结果更改页面。
- Fiber 协调引擎
    - 在 React 的早期版本，协调是一个同步过程，这意味着当虚拟 DOM 足够复杂，或者元素渲染时产生的各种计算足够重，协调过程本身就可能超过 16ms，严重的会导致页面卡顿
    - 而从 React v16 开始，协调从之前的同步改成了异步过程，这主要得益于新的 Fiber 协调引擎。从此在 React 中更贴近虚拟 DOM 的，是在 Fiber 协调引擎中的核心模型 FiberNode
    - FiberNode 
        - 依靠对元素到子元素的双向链表、子元素到子元素的单向链表实现了一棵树，
        - 这棵树可以随时暂停并恢复渲染，触发组件生命周期等副作用（Side-effect），
        - 并将中间结果分散保存在每一个节点上，
        - 不会 block 浏览器中的其他工作
### css
- CSS 与 JS 天生就是异构的，对于 React 的组件层次结构，CSS 很难做到一一对应。
- 此外，不同组件中样式的隔离也是必须的。
- CSS-in-JS
- emotion
- 你可能对 css `args` 这样的函数写法感到陌生，将` `定义的模板字面量（Template Literals）直接拼在函数名后面是 ES6 里新加入的语法，称作带标签的模版字符串（Tagged Templates）
