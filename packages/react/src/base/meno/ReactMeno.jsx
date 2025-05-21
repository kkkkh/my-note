import React, { useState } from 'react';

// 普通子组件，每次父组件渲染都会被重新渲染
const Child = ({ count, id }) => {
  console.log('Child render', id);
  return <div>Child count: {count} id: {id}</div>;
};

// 使用 React.memo 包裹后，props 相同不重新渲染
const MemoizedChild = React.memo(Child);

function App () {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <div>
      <h2>react.memo</h2>
      <button onClick={() => setCount(count + 1)}>count + 1</button>
      {/* 关键点：点击button，count2不会重新渲染MemoizedChild*/}
      <button onClick={() => setCount2(count2 + 1)}>count2 + 1</button>
      <MemoizedChild count={count} id={1} />
      <Child count={count2} id={2} />
    </div>
  );
}

export default App;
