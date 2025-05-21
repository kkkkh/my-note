// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    {/* React 18+ 严格模式（Strict Mode）导致的双重渲染 */}
    {/* <StrictMode> */}
      {/* 元数据 */}
    <title>React</title>
    <link rel="icon" href="/src/assets/react.svg" />
    <meta name="description" content="React base & react19" />
    <link rel="stylesheet" href="/src/assets/style/index.css" precedence="global" />
    {/* style */}
    {/* React 19 内建的<style>和<link>标签并没有对 CSS 代码做任何额外处理，这就意味着它们并不能控制 CSS 的作用域， */}
    {/* <style>之后要紧跟{，不能有空格，否则不生效 */}
    <style href="blue-text" precedence="colors">{` body { color:#fff; } `}</style>
    {/* href="blue-text" 相同的不生效 */}
    <style href="blue-text" precedence="colors">{` body { color: blue; } `}</style>
    <style href="text-1" precedence="text">{` div { background-color: #5288ec; } `}</style>
    {/* CSS 与上边的  <style href="blue-text" precedence="colors"分组一起，位置上移*/}
    <style href="text-2" precedence="colors">{` div { background-color: #591fc4; } `}</style>
    {/* precedence="background 没有找到相同的分组，不会提前，放置到最下边，生效 */}
    <style href="text-3" precedence="background">{` div { background-color: #591fc4; } `}</style>
    {/* script */}
    {/* 脚本不会自动执行。这是因为 React 为了安全和性能做了特殊处理，防止注入恶意脚本 */}
    <script>{ `alert("1")` }</script>
    <script>alert("2")</script>
    <script async src="/src/assets/js/index.js" onLoad={() => console.log('script loaded')} />
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
    {/* 子组件可以调用lodash的方法 */}
    <App />
    {/* </StrictMode> */}
  </>
)
