import { useRef, useEffect } from 'react';

// react19 ref可以像其他 props 一样，直接在函数组件参数里定义，无需再调用forwardRef。
function NewCardInput({ title, onChange, onKeyDown, ref }) {
  return (
    <input type="text" value={title} ref={ref}
      onChange={onChange} onKeyDown={onKeyDown} />
  );
}

export default function App() {
  const inputElem = useRef(null);
  useEffect(() => {
    setTimeout(() => inputElem.current.focus(), 100);
  }, []);
  // debugger
  console.log(_.partition([1, 2, 3, 4], (n) => n % 2));
  function handleChange() {
    console.log("change");
  }
  function handleKeyDown() {
    console.log("keydown");
  }

  return (
    <div>
      <h2>react19 ref</h2>
      <NewCardInput ref={inputElem} onChange={handleChange} onKeyDown={handleKeyDown} />
    </div>
  );
}
