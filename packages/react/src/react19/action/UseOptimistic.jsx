import { useActionState, useOptimistic } from 'react'

function FormButtons(props) {
  return (
    <button type="submit" disabled={props.pending}>
      {props.pending ? '提交中...' : '提交'}
    </button>
  );
}

function App() {
  const [state, formAction, pending] = useActionState(
    async (currentState, formData) => {
      const contactName = formData.get('name');
      addOptimistic(contactName);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...currentState, success: true, name: contactName + `+2` };
    }, {}
  );
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (currentState, optimisticValue) => ({
      ...currentState, name: optimisticValue
    })
  );
  return (
    <>
    <h2>useOptimistic</h2>
    <form action={formAction}>
      <input type="text" name="name" placeholder="联系人名称" />
      <FormButtons pending={pending} />
      <p>您提交的联系人名称是：{optimisticState.name}
        {pending ? (<span>(提交中...)</span>) : (
          state.success && <span>(提交成功!)</span>
        )}
      </p>
    </form>
    </>
  );
}

export default App
