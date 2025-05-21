import React, { useState, useContext } from 'react';
const MyContext = React.createContext('没路用的初始值');

function MyComponent() {
  const [state1, setState1] = useState('文本');
  const handleClick = () => {
    setState1('更新文本');
  };
  return (
    <MyContext.Provider value={state1}>
      <ul>
        <MyChildComponent />
        <li><button onClick={handleClick}>更新state</button></li>
      </ul>
    </MyContext.Provider>
  );
}

function MyChildComponent() {
  return (
    <MyGrandchildComponent />
  );
}

function MyGrandchildComponent() {
  const value = useContext(MyContext);
  return (
    <>
      <h2>useContext</h2>
      <li>{value}</li>
    </>
  );
}

export default MyComponent;
