# Next.js
```bash
npx create-next-app@latest
```
## 服务器组件
- 服务器组件
  - 服务器组件就是只在服务器端运行的 React 组件，它完全在服务器端渲染，渲染结果会随着 SSR 渲染的 HTML 传递给客户端（即浏览器端）。
  - 并不是只有async 异步函数才能定义服务器组件。异步函数并不是服务器组件的特征，而是一个特性。
  - 服务器组件本身不会在浏览器端渲染（或重新渲染），也不会在浏览器端进行水合，甚至服务器组件的源代码都不会被打包进浏览器加载的 JS 中
  - 服务器组件可以跟客户端组件，也就是传统 React 组件配合使用
  - 你可以把服务器组件的子组件抽取到独立的文件中，在文件顶部加入'use client'指示符，这个文件所包含的组件就会被视为客户端组件，在这里你可以放心地使用各种 Hooks、事件处理函数，以及其他浏览器端的 JS 交互代码。
- 服务器组件与客户端组件之间可以通过 props 通信。
  - 服务器组件传递给客户端组件的 props 必须是可序列化（serializable）的数据类型，或者是 Promise（请回忆一下上节课的 use(Promise) ），甚至可以传递服务器 action 的函数引用。
  - 但因为服务器组件并不包含状态，使得它与客户端组件之间的通信基本是单向的。
  - 如果你希望通过客户端组件的交互影响服务器组件，通常需要借助路由。
- 服务端组件子组件
  - 服务器组件的子组件可以是服务器组件也可以是客户端组件。
- 客户端组件子组件
  - 在客户端组件所在文件中，用 import 语句导入的子组件、后代组件也都会自动被视为客户端组件。
  - 服务器组件传递给客户端组件的 props 除了前面列举的类型，还可以传递 React 元素（即 JSX），这里的元素并不限定是客户端组件还是服务器组件的元素
  - 这就带来了一种灵活的组件混合模式：通过 children prop，将服务器组件传递给客户端组件。
  ```jsx
  import ClientComponent from './ClientComponent.jsx';
  import ServerComponent from './ServerComponent.jsx';
  // Page默认为服务器组件
  export default function Page() {
    return (
      <ClientComponent>
        <ServerComponent />
      </ClientComponent>
    );
  }
  ```
## 服务器 Action
能被客户端组件调用的、在服务器端执行的 action。
如果表单 action 能直接在服务器端执行，那就可以省略服务器端 API，直接将表单数据保存到数据库里！

### contact

<<< @/submodule/play/packages/next/src/app/contact/page.jsx

### contactAction

<<< @/submodule/play/packages/next/src/app/contactAction/page.jsx

<<< @/submodule/play/packages/next/src/app/contactAction/actions.jsx

### pagination

<<< @/submodule/play/packages/next/src/app/pagination/page.jsx

<<< @/submodule/play/packages/next/src/app/pagination/paginationChild.jsx

<<< @/submodule/play/packages/next/src/app/pagination/actions.jsx

## turbopack
Next.js 新一代的打包器
- 特点
  - 开发环境更快 - 项目启动时更快，代码改动后的页面更新几乎是瞬间反应，提升开发反馈速度。
  - 增量编译 - 不用重新打包全部代码，只打包改动部分，节约时间和系统资源。
  - 多环境支持更好 - 可以同时高效地处理浏览器端和服务器端代码，适合 Next.js 的多端渲染特性。
  - 内置对 React Server Components 和 TypeScript 的优化支持，更适合现代 React 项目。
  - 多核并行处理 - 利用多核计算机优势，处理速度更快。
- 参考
  - [turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
