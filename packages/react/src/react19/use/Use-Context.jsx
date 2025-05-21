import { use,createContext,useState } from 'react';
const AdminContext = createContext("");

export default  function MyComponent() {
  return (
    /* React 19开始，提供 context 不再需要 .Provider 后缀 */
    <AdminContext value="1">
        <KanbanCard />
    </AdminContext>
  );
}

function KanbanCard() {
  const [username, setUsername] = useState('BOSS');
  // use(AdminContext) 以在三目运算中使用
  const isAdmin = (username === 'BOSS') ? "true" : use(AdminContext);
  return (
      <div>
        <h2>react19 use context</h2>
        <p>isAdmin: {isAdmin}</p>
        <button onClick={() => {
          setUsername("employee");
        }}>设置</button>
      </div>
  );
}
