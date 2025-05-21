import { forwardRef, useRef, useEffect } from 'react';

// React 19 以前，ref 并不能直接声明为一个组件的 prop，而是需要借助 forwardRef API
const NewCardInput = forwardRef(function NewCardInput (props, ref) {
  const { title, onChange, onKeyDown } = props;
  return (
    <input type="text" value={title} ref={ref}
      onChange={onChange} onKeyDown={onKeyDown} />
  );
})

export default function KanbanNewCard () {
  const inputElem = useRef(null);
  useEffect(() => {
    setTimeout(() => inputElem.current.focus(), 100);
  }, []);

  function handleChange () {
    console.log("change");
  }
  function handleKeyDown () {
    console.log("keydown");
  }

  return (
    <div>
      <h2>forwardRef</h2>
      <NewCardInput ref={inputElem} onChange={handleChange} onKeyDown={handleKeyDown} />
    </div>
  );
}
