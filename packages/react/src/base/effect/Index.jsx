import { useEffect, useState } from 'react';

export default function App () {
  const [state, setState] = useState(0);
  console.log('render')
  debugger
  useEffect(() => {
    console.log('useEffect');
  });

  useEffect(() => {
    console.log('useEffect1', state);
  }, [state]);

  useEffect(() => {
    console.log('useEffect2', state);
    return () => {
      console.log('useEffect2 return');
    };
  }, [state]);

  return <>
    <div>Effect</div>
    <button onClick={() => setState(state + 1)}>setState</button>
  </>;
}
