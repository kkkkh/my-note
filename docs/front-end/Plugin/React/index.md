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
## ladle
Ladle 在 monorepo 根目录的基本配置
- 安装依赖
```bash
pnpm add -D @ladle/react vite @vitejs/plugin-react
pnpm add react react-dom
```
- 配置 vite.config.ts
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // 允许访问 packages 目录
      allow: ["./packages"],
    },
  },
});
```
- 配置 ladle.config.ts
```js
/** @type {import('@ladle/react').UserConfig} */
export default {
  outDir: "./docs",
  base: "/base/",
  stories: "./packages/**/src/**/*.stories.{js,jsx,ts,tsx,mdx}",
};
```
## Yup / Formik
```javascript
import * as Yup from "yup";
import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Field, Form } from 'formik';

const schema = Yup.object({
  firstName: Yup.string()
    .matches(/^[a-zA-Z0-9_]{3,15}$/, {
      message:"用户名只能包含字母、数字和下划线，长度3-15位",
      excludeEmptyString: true, // 忽略空字符串时不会触发正则验证
    })
    .required("用户名必填"),
});

const Basic = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
      }}
      validationSchema={schema}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <label htmlFor="firstName">First Name</label>
        <Field id="firstName" name="firstName" placeholder="Jane" />

        <label htmlFor="lastName">Last Name</label>
        <Field id="lastName" name="lastName" placeholder="Doe" />

        <label htmlFor="email">Email</label>
        <Field
          id="email"
          name="email"
          placeholder="jane@acme.com"
          type="email"
        />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  </div>
);

ReactDOM.render(<Basic />, document.getElementById('root'));
```
