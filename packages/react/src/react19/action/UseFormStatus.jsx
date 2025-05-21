import { useFormStatus } from 'react-dom';
import { useState } from 'react'

function FormButtons() {
  // useFormStatus
  // 可以返回最近的表单提交的状态信息
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  );
}

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
    <h2>useFormStatus</h2>
    <form action={formAction}>
      <input type="text" name="name" placeholder="联系人名称" />
      <FormButtons />
      {name && <p>您提交的联系人名称是：{name}</p>}
    </form>
    </>
  );
}
