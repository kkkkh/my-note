# styled-components
css in js 作为组件使用
```js
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  background-color: #0070f3;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;
export default function App() {
  return <Button>Click me</Button>;
}
```

<!--@include: ./compare.md-->

