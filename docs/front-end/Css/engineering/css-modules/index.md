# css-modules
css 作为模块使用
```css
.button {
  padding: 8px 16px;
  background-color: #0070f3;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
```
```js
import React from 'react';
import styles from './Button.module.css';

export default function Button() {
  return <button className={styles.button}>Click me</button>;
}
```
<!--@include: ../styled-components/compare.md-->
