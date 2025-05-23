---
outline: deep
---
# 设计模式
## JavaScript设计模式与开发实践
[源代码下载地址](https://www.ituring.com.cn/book/1632)
<script setup>
/*
@include: @/front-end/DesignPatterns/md/1、单例模式.md
@include: @/front-end/DesignPatterns/md/2、策略模式.md
@include: @/front-end/DesignPatterns/md/3、代理模式.md
@include: @/front-end/DesignPatterns/md/4、迭代器模式.md
@include: @/front-end/DesignPatterns/md/5、订阅发布者模式.md
@include: @/front-end/DesignPatterns/md/6、命令模式.md
@include: @/front-end/DesignPatterns/md/7、组合模式.md
@include: @/front-end/DesignPatterns/md/8、模板方法模式.md
@include: @/front-end/DesignPatterns/md/9、享元模式.md
@include: @/front-end/DesignPatterns/md/10、职责链模式.md
@include: @/front-end/DesignPatterns/md/11、中介者模式.md
@include: @/front-end/DesignPatterns/md/12、装饰者模式.md
@include: @/front-end/DesignPatterns/md/13、状态模式.md
@include: @/front-end/DesignPatterns/md/14、适配器模式.md
*/
import { data as posts } from './index.data.mts'
console.log(posts)
import Content from '@/components/Content.vue'
</script>
<Content :posts="posts" />

## 架构设计模式
### mvc
- 组成部分
  - Model（模型）
    - 负责业务数据和业务逻辑的处理。它是应用的核心，管理数据状态和业务规则。
  - View（视图）
    - 负责界面展示，直接与用户交互。它只关心怎么显示数据，不处理数据本身。
  - Controller（控制器）
    - 充当“协调者”，接受用户输入（如点击、提交表单）、处理请求，调用 Model 更新数据，再更新 View。

- 工作流程
  - 用户操作 View。
  - Controller 接收操作，调用 Model 更改数据。
  - Model 更新数据状态，通知 View。
  - View 重新渲染，展示最新数据。

- php CI (一种理解)
  - 数据更改：
    - 更改数据 ModelA
    - 更改数据 ModelB
    - 更改数据 ModelC
    - 更改数据 ModelD
  - view 调用Controller
  - 调用Controller 接收用户操作
    - 调用Controller1 更改数据ModelA/ModelB
    - 调用Controller2 更改数据ModelC/ModelD

- 代码示例
  ```jsx
  import React, { useState } from 'react';
  // Model：保存数据
  const Model = {
    tasks: [],
    add(task) {
      this.tasks.push(task);
    },
    getAll() {
      return this.tasks;
    }
  };
  // Controller：操作 Model 并更新 View
  function Controller({ updateView }) {
    function addTask(task) {
      if (!task) return;
      Model.add(task);
      updateView(Model.getAll());
    }
    return { addTask };
  }
  // View：负责渲染 UI
  export function MVC() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');

    const controller = Controller({ updateView: setTasks });

    return (
      <div>
        <h2>MVC 简易版</h2>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={() => {
          controller.addTask(input);
          setInput('');
        }}>添加</button>
        <ul>
          {tasks.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    );
  }
  ```

### mvvm  &I
- 组成部分
  - Model（模型）
    - 与 MVC 中相同，负责数据和业务逻辑。
  - View（视图）
    - 负责 UI 展示，与用户交互。
  - ViewModel（视图模型）
    - 是 View 和 Model 之间的桥梁。View 通过数据绑定直接与 ViewModel 交互，ViewModel 负责处理来自 View 的命令、转换 Model 的数据供 View 使用。

- 工作流程
  - View 和 ViewModel 通过双向数据绑定相连。
  - 用户操作 View，数据自动同步到 ViewModel。
  - ViewModel 更新数据，Model 同步变化。
  - Model 变化，ViewModel 也自动更新，进而驱动 View 重渲染。

- 特点
  - 双向绑定是 MVVM 最重要的特点，减少手动 DOM 操作。
  - View 变动立即反映到 ViewModel，数据变动也即时反映到视图。
  - ViewModel 更像数据和行为的抽象层，代码更简洁。

- 例子
  - Vue.js、Angular（2+）和 Knockout.js 等框架大多用 MVVM 或类似思想实现。

- 代码示例
  ```jsx
  // Model.js
  import React, { useState } from 'react';
  const TaskModel = {
    tasks: [],
    addTask(task) {
      this.tasks.push(task);
    },
    getTasks() {
      return this.tasks;
    }
  }
  // useTaskViewModel.js
  function useTaskViewModel() {
    // tasks 与 Model 和 view 粘合
    const [tasks, setTasks] = useState(TaskModel.getTasks());

    function addTask(task) {
      if (!task) return;
      TaskModel.addTask(task);
      setTasks([...TaskModel.getTasks()]);
    }

    return { tasks, addTask };
  }
  // View：只负责渲染和响应用户
  // View.js
    export function TodoList() {
      const { tasks, addTask } = useTaskViewModel();
      const [input, setInput] = useState('');

      return (
        <div>
          <input value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={() => { addTask(input); setInput(''); }}>添加</button>
          <ul>{tasks.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      );
    }
  ```
### MVP（Model-View-Presenter）
### MVI（Model-View-Intent）
