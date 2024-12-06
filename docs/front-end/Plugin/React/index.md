---
outline: deep
---
# React plugin
## immutable
```js
const { Map } = require('immutable');
const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = Map({ a: 1, b: 2, c: 3 });
map1.equals(map2); // true
map1 === map2; // false
```
## immer
```jsx
import React from "react";
import { useImmer } from "use-immer";
function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useImmer([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
  ]);
  const handleSubmit = (title) => {
    setTodoList(draft => {
      draft.unshift({ title, status: new Date().toDateString() });
    });
  };
}
```
