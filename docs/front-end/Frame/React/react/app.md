# react 实践总结
## 常见问题
### useEffect
#### useEffect 默认执行
- 默认执行两次
  - 在 React 的开发模式下，useEffect 默认执行两次
  - `<React.StrictMode>` 注释掉关闭
- 默认触发一次
  - `useEffect(() => {}，[a])` a没有变化，也触发一次
#### useEffect测试
- 基础测试：第二个参数依赖，返回清除函数，以及打印顺序
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/effect/Child1.jsx
:::
- 第二个参数没有传入，打印
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/effect/Child2.jsx
:::
### useCallback
#### useCallback 中useState 取到的是旧值
- `useCallback(() => {console.log(b)}，[a])` 不把 b 放到依赖数组时，取到的是旧值？
  - 因为 React 的函数组件里，闭包会捕获当时渲染时的变量值。
  - useCallback 的函数体里用到的 count 定义时的那一份（旧值），不会随着 count 变化而更新。
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/callBack/Child.jsx
:::
### useContext
- UseContext 基本使用
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/context/UseContext.jsx
:::
- 弹窗提示 基于UseContext的实现
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/context/Alert.tsx
-----------
<<< @/submodule/play/packages/react/src/base/context/AlertChild.jsx
:::
### forwardRef
- React 19 以前，ref 并不能直接声明为一个组件的 prop，而是需要借助 forwardRef API
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/forwardRef/Index.jsx
:::
### useMeno
- 基本使用
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/meno/UseMeno.jsx
:::
### React.Meno
- 基本使用
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/meno/ReactMeno.jsx
:::
### Props
- props各种传值
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/props/Index.jsx
:::
### useRef
- useRef基本使用
::: details 查看代码
<<< @/submodule/play/packages/react/src/base/ref/Index.jsx
:::
<!-- https://chatgpt.com/c/68c669b1-85ec-8332-ba84-edc58d2e98b3
https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView#block
https://devv.ai/zh/search/ey110ryh7uo0
https://github.com/mebtte/react-lrc?tab=readme-ov-file
https://github.com/frank-deng/js-lyrics
https://chatgpt.com/c/68c38e79-9bd0-832e-ae24-0a843b16ab91 -->
