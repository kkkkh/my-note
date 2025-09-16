# react 实践总结
1、在 React 的开发模式下，useEffect 默认执行两次
 - nextjs 中配置 `reactStrictMode: false`
 - `<React.StrictMode>` 注释掉

2、`useEffect(() => {}，[a])` a没有变化，也触发一次


3、`useEffect(() => {console.log(b)}，[a])` 不把 count 放到依赖数组时，取到的是旧值？
- 因为 React 的函数组件里，闭包会捕获当时渲染时的变量值。
- useEffect/useCallback 的函数体里用到的 count 定义时的那一份（旧值），不会随着 count 变化而更新。
```js
const [count, setCount] = useState(0);
const [a, setA] = useState(0);
setTimeout(() => {
  setCount(1);
  setA(1);
}, 1000);
useEffect(() => {
  console.log(count);
}, [a]);

```
https://chatgpt.com/c/68c669b1-85ec-8332-ba84-edc58d2e98b3
https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView#block
https://devv.ai/zh/search/ey110ryh7uo0
https://github.com/mebtte/react-lrc?tab=readme-ov-file
https://github.com/frank-deng/js-lyrics
https://chatgpt.com/c/68c38e79-9bd0-832e-ae24-0a843b16ab91
