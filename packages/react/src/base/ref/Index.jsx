import { useRef } from 'react';

function Test1() {
  const myRef = useRef(0);

  return (<div>
    <button onClick={() => {
      myRef.current++;
      // 不会触发组件重新渲染
      console.log(myRef.current);
    }}>设置</button>
  </div>);
}
function Test2() {
  // 通过 ref 操作 DOM
  const myRef = useRef(null);
  return (<div>
    <div ref={myRef}>111</div>
    <button onClick={() => {
      myRef.current.innerText = "222";
    }}>设置</button>
  </div>);
}
export default function App () {
  return (
    <>
      <h2>ref</h2>
      <Test1></Test1>
      <Test2></Test2>
    </>
  );
};

