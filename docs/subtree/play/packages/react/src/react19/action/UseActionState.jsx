import { useActionState } from 'react';

function FormButtons(props) {
  return (
    <button type="submit" disabled={props.pending}>
      {props.pending ? '提交中...' : '提交'}
    </button>
  );
}

export default function App() {
  const [state, formAction, pending] = useActionState(
    async (currentState, formData) => {
      const contactName = formData.get('name');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...currentState, success: true, name: contactName + `+1` };
    }, {});
  return (
    <>
      <h2>useActionState</h2>
      <form action={formAction}>
        <input type="text" name="name" placeholder="联系人名称" />
        <FormButtons pending={pending} />
        {pending && <p>提交中...</p>}
        {state.success && <p>您提交的联系人名称是：{state.name}</p>}
      </form>
    </>
  );
}
