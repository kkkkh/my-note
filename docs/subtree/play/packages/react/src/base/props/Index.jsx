
function App() {
  const todoList = [
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-2', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
  ];
  const KanbanCard = ({ title, status }) => {
    return (
      <li className="kanban-card">
        <span className="card-title">{title}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="card-status">{status}</span>
      </li>
    );
  };
  const KanbanColumn = ({ title, children }) => {
    return (
      <section>
        {title}
        {children}
      </section>
    );
  };
  const handleAdd = () => {
    console.log('handleAdd');
  };
  const showAdd = false;
  const MyComponent = ({ prop1, prop2, booleanProp, onClick }) => (
    <div>
      <span>prop1文本：{prop1}，  </span>&nbsp;
      <span>prop2数字：{prop2}，</span>&nbsp;
      <span>booleanProp：{booleanProp ? 'true' : 'false'}，</span>&nbsp;
      <button onClick={onClick}>Click me</button>
    </div>
  )
  return (
    <div className="App">
      {/* title 传递一个组件 */}
      <KanbanColumn title={
        <>
          待处理<button onClick={handleAdd}
            disabled={showAdd}>&#8853; 添加新卡片</button>
        </>
      }>
        <ul>
          {/* props 传递 一个对象*/}
          { todoList.map((props,index) => <KanbanCard {...props} key={index} />) }
        </ul>
      </KanbanColumn>
      <h2>我的组件</h2>
      {/* props 传递各种类型的值 */}
      <MyComponent prop1="我的" prop2={123} booleanProp={false}
      onClick={(evt) => {console.log('clicked',evt)}} ></MyComponent>
    </div>
  );
}
export default App;
