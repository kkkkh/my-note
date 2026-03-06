# Zustand
## 常用方法
### 类似计算属性的
  - 使用 Selector 获取派生状态（推荐）
  ```js
  import create from "zustand";

  const useStore = create((set) => ({
    count: 1,
    price: 100,
  }));
  // 组件中使用 selector
  const total = useStore((state) => state.count * state.price);
  ```
  - 在 Store 中直接定义派生函数
  ```js
  const useStore = create((set, get) => ({
    count: 1,
    price: 100,
    total: () => get().count * get().price, // total 是一个函数
  }));
  // 使用
  const total = useStore((state) => state.total());
  ```
