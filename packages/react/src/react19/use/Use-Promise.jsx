import { use, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function Contacts({ contactsPromise }) {
  const contacts = use(contactsPromise);
  return (
    <ul>
      {contacts.map(contact => (
        <li key={contact.id}>{contact.name}</li>
      ))}
    </ul>
  );
}

function App() {
  const [contactsPromise] = useState(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '张三' },
          { id: 2, name: '李四' },
          { id: 3, name: '王五' }
        ]);
      }, 2000);
    });
  });
  return (
    <>
      <h2>react19 use promise</h2>
      <ErrorBoundary fallback={<div>加载失败</div>}>
        <Suspense fallback={<div>读取中1...</div>}>
          <Suspense fallback={<div>读取中2...</div>}>
            <Contacts contactsPromise={contactsPromise} />
          </Suspense>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default App
