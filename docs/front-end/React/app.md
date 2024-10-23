# React
## React 原理
### Component
- 拆分
    - 拆分时需要你理解业务和交互，
    - 设计组件层次结构（Hierarchy），
    - 以关注点分离（Separation Of Concern）原则检验每次拆分
- 组件层次结构：
    - 比组件化更进一步的概念是组件层次结构（Hierarchy），指父类子类之间的继承关系
    - React 并没有用类继承的方式扩展现有组件（类组件继承 React.Component类，但类组件之间没有继承关系），所以在 React 中提到 Hierarchy，一般都是指组件与组件间的层次结构