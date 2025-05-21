import { useState } from 'react'
export default function App() {
  const [name, setName] = useState();
  const formAction = async (formData) => {
    const contactName = formData.get('name');
    // 模拟异步请求
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setName(contactName);
  };
  return (
    <>
    <h2>FormAction</h2>
    <form action={formAction}>
      <input type="text" name="name" placeholder="联系人名称" />
      <button type="submit">提交</button>
      {name && <p>您提交的联系人名称是：{name}</p>}
    </form>
    </>
  );
}
