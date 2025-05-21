export default function FormButtons(props) {
  return (
    <button type="submit" disabled={props.pending}>
      {props.pending ? '提交中...' : '提交'}
    </button>
  );
}
