import React, { Suspense,useActionState } from 'react';

const FormButtons = React.lazy(() => import('./FormButtons.jsx'));


function App() {
  // 省略
  const [state, formAction, pending] = useActionState(
    async (currentState, formData) => {
      const contactName = formData.get('name');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { ...currentState, success: true, name: contactName + `+1` };
    }, {});
  return (
    <form action={formAction}>
      <input type="text" name="name" placeholder="联系人名称" />
      <Suspense fallback={<span>加载中...</span>}>
        <FormButtons />
      </Suspense>
      {pending && <p>提交中...</p>}
      {state.success && <p>您提交的联系人名称是：{state.name}</p>}
    </form>
  );
}
export default App;
