# css 工程化
## css 组件化 & 模块化体系
### CSS Modules
- 优点
  - 简单
  - 快
  - 不污染
  - 零运行时
  - 对 SEO 友好
- 缺点：
  - 样式逻辑化能力弱
  - 动态主题不方便
  - 在大型团队中，不如 Tailwind 快速统一风格
  - 不如 CSS-in-JS 可组合
### CSS-in-JS
- 框架
  - styled-components
  - emotion css
- 适用场景
  - 动态主题
  - 动态样式绑定
  - 深度 React 组件化体系
  - 可组合 UI 库
- 趋势
  - 逐步优化成编译时（zero runtime）方向
### 原子化 CSS / Utility-first
- 框架
  - TailwindCSS
  - UnoCSS
- 趋势
  - 一个 UI 原子化语言
  - 一个跨框架的工程规范
  - 一个衔接 Design Token 的工具

## css 架构层
- 特点
  - 不用框架、不用工具，只靠组织 CSS 的方法论来控制大型项目的复杂度。
  - 也就是工程化之前的“古典前端智慧”。
- css 缺点
  | 问题           | 表现                       |
  | ------------ | ------------------------ |
  | **全局作用域**    | 一个 className 改了，全站都可能受影响 |
  | **选择器层叠难控制** | specificity（优先级）越来越复杂    |
  | **难复用**      | 样式写一次一次用，导致重复            |
  | **团队协作困难**   | 各写各的，不同人命名、结构不同          |

- BEM（Block Element Modifier）
  - BEM（最流行、最成功的 CSS 架构体系）
  - 它解决 CSS 最大的问题：作用域定义得非常明确，可读性极强。
  - 1️⃣ Block（组件）：独立的模块
  ```css
  .card {}
  .nav {}
  ```
  - 2️⃣ Element（组件内部的部分）：用双下划线
  ```css
  .card__title {}
  .card__icon {}
  .card__footer {}
  ```
  - 3️⃣ Modifier（修饰状态）：用双连字符
  ```css
  .card--primary {}
  .card--small {}
  .card--disabled {}
  ```
  - ⭐ BEM 的核心优点
    - 不会与其他模块冲突
    - 可读性极强
    - IDE 自动提示友好
    - 大型项目可控可维护
    - 组件边界非常清晰（像 React 一样）
- OOCSS
  - OOCSS = Object Oriented CSS（面向对象的 CSS）
  - 1️⃣ 把样式拆成“结构（structure）”和“皮肤（skin）”
    - structure 定义布局、大小、位置
    - skin 定义外观：颜色、背景、边框
    ```css
    /* Structure */
    .card {
      padding: 1rem;
      border-radius: 8px;
    }

    /* Skin */
    .card-primary {
      background: #007bff;
      color: white;
    }

    .card-warning {
      background: orange;
      color: black;
    }
    ```
  - 2️⃣ 避免深层嵌套
  ```css
  /* Bad */
  .container .list .item .title {}

  /* Good */
  .item-title {}
  ```
- SMACSS
  - 📌 SMACSS = 文件结构 + 代码结构 + 命名规范 的全面解决方案
  - 1️⃣ Base（基础样式）
    - 最通用的 reset、标签样式：
    ```css
    a { text-decoration: none; }
    ```
  - 2️⃣ Layout（布局）：页面的主要框架。
    ```css
    .l-header {}
    .l-sidebar {}
    .l-content {}
    ```
  - 3️⃣ Module（模块样式）：命名带有 l-；页面自包含的 UI 模块
    ```css
    .module-card {}
    .module-list {}
    ```
  - 4️⃣ State（状态样式）：某个模块的不同状态。
    ```css
    .is-active {}
    .is-hidden {}
    .is-loading {}
    ```
  - 5️⃣ Theme（主题）：颜色、皮肤
    ```css
    .theme-dark {}
    .theme-light {}
    ```
- Atomic CSS（原子化思想）
  - 注意：不是 Tailwind，而是 早期的 Atomic CSS 思想。
  - 把每个 CSS 属性都原子化成一个 class。
  ```css
  .mt-1 { margin-top: 4px; }
  .p-2 { padding: 8px; }
  .text-center { text-align: center; }
  .bg-blue { background: blue; }
  ```
  - 特点
    - 高度复用
    - 不再写组件 CSS
    - className 非常长（因为要组合多个原子类）

## 设计系统层（更高层次）
- 这一层更偏工程大型项目：
  - Design Token
  - CSS Variables 全局主题
- UI 库（如 shadcn/ui、Ant Design、Material UI）
- 关注点是：主题、颜色体系、组件库规范、跨平台一致性。
