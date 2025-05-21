import { useMemo, useState, useEffect } from "react"
export default function Meno () {
  const [count, setCount] = useState(1)
  const [count2, setCount2] = useState(1)
  const memo = useMemo(() => {
    console.log('useMemo')
    return count + 10
  }, [count])
  useEffect(() => {
    console.log('useEffect')
  }, [count])
  console.log('组件渲染')
  return (
    <>
      <h2>useMemo</h2>
      <div>Meno</div>
      <div>count:{count}</div>
      <div>count2:{count2}</div>
      <div>memo:{memo}</div>
      <button onClick={() => setCount(count + 1)}>count++</button>
      <button onClick={() => setCount2(count2 + 1)}>count2++</button>
    </>
  )
  // 打印结果
  // 首次渲染：useMemo 组件渲染 useEffect
  // 点击 count++：useMemo 组件渲染 useEffect
  // 点击 count2++：组件渲染
}
