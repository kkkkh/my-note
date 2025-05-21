import Suspense from "./Suspense"
import UseSuspense from "./Use-Promise"
import UseContext from "./Use-Context"
function App() {
  return (
    <>
      <div>
        <Suspense></Suspense>
        <UseSuspense></UseSuspense>
        <UseContext></UseContext>
      </div>
    </>
  )
}

export default App
