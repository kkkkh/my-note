## React Router &I
- 基于浏览器 History API 实现客户端路由控制
  - React Router 利用现代浏览器的 History API（history.pushState、history.replaceState 和 popstate 事件） 来实现路由的变化，而不导致页面的完全刷新。
  - 当调用导航方法（比如 `<Link>` 的跳转或者编程式跳转）时，React Router 会调用 pushState 或 replaceState 修改浏览器地址栏的 URL。
  - 浏览器不会重新加载页面，而是触发 popstate 事件，通知 React Router 当前的地址发生了变化。
  - React Router 监听这些变化，将路由匹配映射到对应组件，然后触发 React 重新渲染对应页面。
- 路由匹配机制
  - 当前浏览器地址（location.pathname）和定义好的路由表（Route 配置），执行匹配操作
  - 匹配规则包括静态路径匹配、动态路径参数（如 /user/:id）、通配符等。
  - 匹配到某一路由后，返回对应的 React 组件进行渲染。
  - 支持嵌套路由，递归匹配嵌套的 Route。
- 路由状态的存储与传递
  - React Router 使用 React Context 来存储和共享路由相关状态
  - BrowserRouter 组件在顶层创建 Context，内部监听浏览器历史变化，把当前 location 对象传递给子组件。
  - 子组件（如 Route、Link）通过 useLocation、useNavigate、useParams 等 hook 或组件方式访问路由上下文，做渲染或导航动作。
### 路由控制原理
| 路由类型        | 实现方式                                           | 特点                          |
|-----------------|---------------------------------------------------|-------------------------------|
| Browser Router  | history.pushState / history.replaceState + popstate 事件 | 无刷新 URL 跳转         |
| Hash Router     | URL 的 window.location.hash + hashchange 事件     | 利用 URL hash 实现路由更新    |
| Memory Router   | 内存状态维护，模拟历史堆栈                        | 不依赖 URL，客户端（浏览器或 React Native）、测试环境  |
| Static Router   | 静态路由,位置由外部传入                           | 适合静态内容，无动态交互，服务器端渲染（SSR）环境    |

### 模式

- Declarative
  - 最基础的使用方式，路由与组件之间的关联是静态和声明式的，数据加载与副作用需要手动控制
  ```jsx
  import { BrowserRouter } from "react-router";
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  ```
- Data
  - 在 Declarative 的基础上，增加了专门的 数据加载（loader）、表单提交（action）和错误处理 的机制。
  - loader 和 action 函数让路由可以在导航时提前加载和提交数据，且支持挂起（pending）状态，避免了路由组件内部自行进行数据请求的繁琐。
  - 实现了路由驱动的数据管理模式，不只是页面渲染，还包括数据的获取和更新。
  ```jsx
  import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router";
  let router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      loader: loadRootData,
    },
  ]);
  ReactDOM.createRoot(root).render(
    <RouterProvider router={router} />
  );
  ```
- Framework
  - 在 Data 模式的基础上，结合完整的编译时类型支持、模块化路由结构、代码拆分（code splitting）、SSR（服务端渲染）、静态预渲染等框架级能力。
  - 提供更丰富的开发体验和自动化支持，适用于大型复杂应用和框架集成。
  - 例如利用 Vite 插件或类似技术，实现基于文件系统的路由自动注册、类型安全的参数传递等。
  ```jsx
  // routes.tsx
  import { index, route } from "@react-router/dev/routes";

  export default [
    index("./home.tsx"),
    route("products/:pid", "./product.tsx"),
  ];
  ```
  ```jsx
  // product.tsx
  import { Route } from "+./types/product.tsx";
  export async function loader({ params }: Route.LoaderArgs) {
    let product = await getProduct(params.pid);
    return { product };
  }

  export default function Product({
    loaderData,
  }: Route.ComponentProps) {
    return <div>{loaderData.product.name}</div>;
  }
  ```
- 参考
  - [picking-a-mode](https://reactrouter.com/start/modes)
  - [api--mode-availability-table 每种模式对api的支持](https://reactrouter.com/start/modes#api--mode-availability-table)
