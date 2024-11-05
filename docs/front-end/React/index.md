# React
## React 原理
### jsx
- jsx 语法糖
  - createElement (原有的React.createElement是为了类组件设计的)
    - 渲染的内容是用 React.createElement(component, props, ...children) 声明的，
    - JSX 正是createElement函数的语法糖，JSX 编译成由若干createElement函数组成的 JS 代码，然后才能在浏览器中正常执行
  - react/jsx-runtime
    - JSX被编译成了react/jsx-dev-runtime下的jsxDEV，在生产模式下则被编译成了react/jsx-runtime下的jsx或jsxs
- jsx优点：
  - JSX 提供的类 HTML/XML 的语法会让声明代码更加直观，在 IDE 的支持下，语法高亮更醒目，比起纯 JS（createElement） 也更容易维护
  - Java SSH（Spring+Struts2+Hibernate）技术栈, Struts2 用 XML 定义了一套名为标签库的 DSL（Domain-Specific Language，领域特定语言）,JSX 则直接利用了 JS 语句。很明显，JS 表达式能做的，JSX 都能做，不需要开发者再去学习一套新的 DSL。
  ```java
    <s:if test="showAdd">
        <div>KanbanNewCard ...</div>
    </s:if>
  ```
- jsx => JavaScript XML
  - React 元素有三种基本类型
    - React 封装的 DOM 元素，如 <div></div>、 <img /> ，这部分元素会最终被渲染为真实的 DOM；
    - React 组件渲染的元素，如<KanbanCard /> ，这部分元素会调用对应组件的渲染方法；
    - React Fragment 元素，<React.Fragment></React.Fragment> 或者简写成 <></>，这一元素没有业务意义，也不会产生额外的 DOM，主要用来将多个子元素分组。
  - 属性统一：React 封装的 DOM 元素将浏览器 DOM 整体做了一次面向 React 的标准化
    - React JSX 中就统一为 readOnly={true} 或 readOnly={false}
    - className="kanban-card" ，更多是因为 HTML 标签里的class 是 JS 里的保留字，需要避开
  - 子元素的类型包括：
    - 字符串，最终会被渲染成 HTML 标签里的字符串；
    - 另一段 JSX，会嵌套渲染；JS 表达式，会在渲染过程中执行，并让返回值参与到渲染过程中；
    - 布尔值、null 值、undefined 值，不会被渲染出来；
    - 以上各种类型组成的数组。
  - props
    - props 表达式的特殊用法：属性展开， 利用 JS ... 语法把 props 这个对象中的所有属性都传给 KanbanCard 组件。
  - 注释
    - JSX 里加注释，会发现 HTML 注释 根本没法通过编译，这时需要改用 {/* */}
  - 变迁
    - 两个大版本 v0.13 和 v0.14（你可以理解成 v13 和 v14）
    ```js
    const KanbanCard = React.createClass({
      render: function() {
        return (<div>KanbanCard ...</div>);
      }
    });
    ```
    - v0.13 中开始推广ES6 class的写法
    ```js
    class KanbanCard extends React.Component {
      render() {
        return (<div>KanbanCard {this.props.title}</div>);
      }
    }
    ```
    - v0.14，React 新加入了一种更为简化的无状态函数组件（Stateless Function Component）：还不能自己处理 state 状态
    ```js
    // ES6箭头函数
    const KanbanCard = (props) => {
      var title = props.title;
      return (<div>KanbanCard {title}</div>);
    };
    // 更简单的箭头函数+参数解构
    const KanbanCard = ({title}) => (
      <div>KanbanCard {title}</div>
    );
    ```
    - 高阶组件的方式补足函数组件缺失的功能
    ```js
    import { withState } from 'recompose';
    const enhance = withState('showAdd', 'setShowAdd', false);
    const KanbanColumn = enhance(({ showAdd, setShowAdd }) => (
      <section className="kanban-column column-todo">
        <h2>
          待处理
          <button onClick={() => setShowAdd(true)}>添加新卡片</button>
        </h2>
        <ul>
          { showAdd && <KanbanNewCard /> }
        </ul>
      </section>
    ));
    ```
  - 函数组件上位的原因包括：
    - React 的哲学 UI=f(state) ；
    - 更彻底的关注点分离（Separation Of Concerns）；
    - 函数式编程的影响；
    - React 内部实现的不断优化；
    - 开源社区的反哺。
  - 灵感
    - 他的灵感是es4里面的e4x，但原本的e4x因为涉及到语法和语义的定义，实现过于复杂所以被弃用。
    - 业界最贴近ES4规范的实现是Adobe Flash中的ActionScript 3语言，随着Flash技术的覆灭，ECMA毅然抛弃了ES4，转而发布了ES5
### Component
- 拆分
    - 拆分时需要你理解业务和交互，
    - 设计组件层次结构（Hierarchy），
    - 以关注点分离（Separation Of Concern）原则
- 组件层次结构：
    - 比组件化更进一步的概念是组件层次结构（Hierarchy），指父类子类之间的继承关系
    - React 并没有用类继承的方式扩展现有组件（类组件继承 React.Component类，但类组件之间没有继承关系），所以在 React 中提到 Hierarchy，一般都是指组件与组件间的层次结构
- 真·子组件（Sub-components）的设计模式，
  - 代表性的组件库有Semantic UI React、Recharts
  ```jsx
  // Semantic UI React
  <Message icon>
    <Icon name='circle notched' loading />
    <Message.Content>
      <Message.Header>
        Just one second
      </Message.Header>
      We're fetching that content for you.
    </Message.Content>
  </Message>
  ```
- props
  - children: 这个属性一般不需要显式地传值，在闭合标签内部加入子元素即可，子元素会自动作为 children 传给标签对应的组件
- 基本原则：
  - 单一职责（Single Responsibility）原则。
  - 关注点分离（Separation of Concern）原则。
  - 一次且仅一次（DRY, Don’t Repeat Yourself）原则。
  - 简约（KISS，Keep It Simple & Stupid）原则。
- React 没有组件树（Component Tree），只有元素树（Element Tree）
### 生命周期
- 组件生命周期并不等同于类组件的生命周期方法
- 类组件生命周期
  - 挂载（Mounting）、更新（Updating）、卸载（Unmounting）
  - 错误处理（Error Handling）阶段、render() 方法
```js
class LegacyKanbanCard extends React.Component {
  constructor(props) {
    super(props);
    // ...省略
  }
  componentDidMount() {
    // ...省略
  }
  // ...其他生命周期方法
  componentWillUnmount() {
    // ...省略
  }
  render() {
    return (<div>KanbanCard {this.props.title}</div>);
  }
}
```
https://juejin.cn/post/7208129482095165501

## React实践
### babel 
- [babel try it](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.18.4&externalPlugins=&assumptions=%7B%7D) 

### React 常用代码
```jsx
function App() {
  const todoList = [
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ];
  const KanbanCard = ({ title, status }) => {
    return (
      <li className="kanban-card">
        <div className="card-title">{title}</div>
        <div className="card-status">{status}</div>
      </li>
    );
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
      </header>
      <main className="kanban-board">
        <section className="kanban-column column-todo">
          <h2>待处理</h2>
          <ul>
            {/* props 传递 */}
            { todoList.map(props => <KanbanCard {...props} />) }
          </ul>
        </section>
      </main>
    </div>
  );
}
export default App;
```
```jsx
<KanbanColumn className="column-todo" title={
  <>
    待处理<button onClick={handleAdd}
      disabled={showAdd}>&#8853; 添加新卡片</button>
  </>
}>
```

### 比较旧的一些教程
- 阮一峰 React 入门实例教程 https://www.ruanyifeng.com/blog/2015/03/react.html
- React Router http://react-guide.github.io/react-router-cn/docs/Introduction.html
- 分享 50 个完整的 React Native 项目 https://www.jianshu.com/p/470606826b12
- 阮一峰 Redux 入门教程（一）：基本用法 https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html
- redux-saga https://redux-saga-in-chinese.js.org/docs/introduction/BeginnerTutorial.html
