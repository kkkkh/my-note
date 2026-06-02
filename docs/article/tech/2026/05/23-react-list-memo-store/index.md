---
title: 【React】 长列表 + Zustand：memo 与订阅粒度
date: 2026-05-23
tags:
  - frontend
  - react
  - zustand
---
# React 长列表 + Zustand：memo 与订阅粒度

> 问题：N 行列表 + 全局「当前行」高频变（播放、轮播、时钟）→ 容易 **每秒 N 次无效重渲染**。  
> 本文在用法之外说明：**重渲染是什么代价、`memo` 和 selector 各自解决哪一层问题**。

## 0、先建立直觉：什么叫「亏了」

React 某组件 **重渲染** = 该函数再执行一次，子树走 reconcile（对比 Virtual DOM）。

- 10 行列表、每秒「当前行」变 1 次 → 理想情况只动 **2 行**（上一行 + 下一行）的样式  
- 若 10 行每秒都 render → 一年播放里多做了大量 DOM  diff，滚动、取词、输入都会卡  

**两个独立杠杆**：

| 杠杆 | 解决什么 |
| --- | --- |
| **`memo(Row)`** | 父 render 了，但 **props 没变** 的行不要再深入 reconcile |
| **细粒度 store 订阅** | store 变了，但 **与本行无关** 的行连函数都不要白跑一遍 |

只用一个不够：父把 `activeIndex` 当 props 传给每行 → `memo` 救不了；子订阅整个 store → 没 `memo` 也会全刷。

---

## 1、反模式：父集中订阅再下传

```tsx
function ListContainer() {
  const activeIndex = useListStore((s) => s.activeIndex)
  const selection = useSessionStore((s) => s.selection)
  return items.map((item, i) => (
    <ListRow item={item} activeIndex={activeIndex} selection={selection} />
  ))
}
```

**为什么亏**：

1. `activeIndex` 一变 → **父**必 render（往往还要滚动，这合理）  
2. 每个子项都收到新的 `activeIndex` prop → 对 `memo` 来说「props 变了」→ **每一行都深入更新**  
3. 子项若再 `useSessionStore()` 无 selector → `selection` 无关字段变也全刷  

---

## 2、目标结构（各层在干什么）

```text
ListContainer
  ├─ 订阅：整表数据、当前下标（父级逻辑需要）
  ├─ effect：滚动、延迟定位、自动跟随
  └─ map → ListRow（memo）

ListRow
  ├─ 只订阅：activeIndex === index ? 等布尔
  ├─ 选区对象：useStoreWithEqualityFn + 按 itemId 过滤
  └─ 点击：getState() 写 store，不额外订阅
```

**父可以 render，子尽量不跟**——这是长列表性能的目标句式。

下面给一个「重构后」的最小示例（对应我在项目里落地的歌词行组件结构）：父容器订阅整表与 `activeIndex`，子行用 `memo` + 精细 selector，只在自己“变活跃/被点选/选区落在本行”时重渲染。

```tsx
// ListContainer：订阅整表 + activeIndex，负责滚动/跟随（只示意核心）
function ListContainer() {
  const { items, activeIndex } = useResourceStore(
    useShallow((s) => ({ items: s.items, activeIndex: s.activeIndex })),
  )

  return (
    <div>
      {items.map((item, i) => (
        <ListRow
          key={item.id}
          item={item}
          index={i}
        />
      ))}
    </div>
  )
}

// ListRow：memo + 只订阅“与自己有关”的 store 切片
const ListRow = memo(function ListRow({ item, index }: { item: Item; index: number }) {
  const isActive = useResourceStore((s) => s.activeIndex === index)
  const isClicked = useUiStore((s) => s.clickedIndex === index)

  // 选区：只关心落在本行的那段（用 selector 过滤 + equality，避免全局 activeWord 变化牵连整表）
  const selectedRange = useStoreWithEqualityFn(
    useUiStore,
    (s) => (s.activeWord?.itemId === item.id ? { start: s.activeWord.start, end: s.activeWord.end } : undefined),
    (a, b) => a?.start === b?.start && a?.end === b?.end,
  )

  const onClickCapture = (e: React.MouseEvent<HTMLElement>) => {
    // 点击：用 getState() 写 store，不把整行绑成受控组件
    const ui = useUiStore.getState()
    ui.setClickedIndex(index)
    ui.setActiveItemId(item.id)
    // ...getWordByClick(e, el) → ui.setActiveWord(...)
  }

  return (
    <div onClickCapture={onClickCapture} className={isActive || isClicked ? 'bg-amber-100' : ''}>
      <RowText item={item} selectedRange={selectedRange} />
    </div>
  )
})
```

---

## 3、`memo` 是什么、为了什么

```tsx
export default memo(ListRow)
```

**是什么**：对 props 做浅比较；与上次 render 的 props 全同 → **跳过**本组件及默认情况下子树的 reconcile。

**为了什么**：父因 `activeIndex` 重跑 `map` 时，**其它行的 `item`、`index`、回调引用未变** → 这些行不再做昂贵工作。

**何时没用**：

- props 里内联 `onClick={() => ...}` → 每次新函数 → memo 认为变了  
- props 里 `{}` 或 `[]` 字面量 → 同上  
- 子组件内部粗订阅 store → props 没变，store 仍触发 render  

### 3.1 父级要稳定的 props

| Prop | 为何要稳 |
| --- | --- |
| `item` | 引用变才表示这行数据真变了 |
| 回调 | `useCallback` 固定引用，别在 map 里内联 |

---

## 4、子项自订阅：Zustand 在列表里解决什么

```tsx
const isActive = useListStore((s) => s.activeIndex === index)
```

**Context 的问题**：Provider 的 `value` 一变，**所有** `useContext` 消费者渲染——无法「只第 5 行关心第 5 行」。  

**Zustand + selector**：每行 hook 各自算 `activeIndex === index`；只有 true↔false 变化的行才重渲染。

`activeIndex` 4→5：约 **2 行** 更新，不是 N 行。

---

## 5、难点：对象 selector 与 `useStoreWithEqualityFn`

### 5.1 问题从哪来

要高亮 `{ start, end }`，selector 常写成：

```tsx
return { start: sel.start, end: sel.end }
```

在 JavaScript 里 **每次 `{ }` 都是新对象**。Zustand 默认用 `Object.is` 比较 selector 结果 → 永远不相等 → **N 行全渲染**。

这和「数据没变」无关，是 **引用相等** 的坑。

### 5.2 `useStoreWithEqualityFn` 是什么、为了什么

**是什么**：第三个参数自定义「怎样算没变」——例如只比 `start/end` 数值。

**为了什么**：在必须返回对象时，仍让 **只有相关行、相关字段变** 才触发 render。

再配合 `sel.itemId !== item.id` 时 `return undefined`，其它行连对象都不会新建。

### 5.3 点击用 `getState()` 为了什么

一次点击写 `focusedIndex`、`selection` 多个字段；用 `getState().setX()` **不必**为每个 action 订阅，也避免 render 路径里多读 store。

---

## 6、迭代过程（每步在修什么）

| 阶段 | 做法 | 仍亏在哪 | 修了什么 |
| --- | --- | --- | --- |
| A | 父订阅，props 下传 | 当前行一变，全列表 props 变 | — |
| B | 子 `memo`，仍传 `activeIndex` | 每行 props 仍变 | memo 启用了但无效 |
| C | 子内 `=== index` | 选区一变全刷 | 当前行频率问题 ✓ |
| D | 子订阅整个 `selection` | 任意选区变，全刷 | — |
| E | selector 返回新对象 | 引用每次都变 | — |
| F | equality + 按 id 过滤 | — | 选区也只动一行 ✓ |

---

## 7、React 列表其它概念（动机）

### 7.1 `key` 用稳定 id

**为了什么**：删中间一行、合并行时，下标会变但业务 id 不变；用下标当 key 会 **错复用 DOM**（状态串行）。  
`ref` 挂在外层包装 div，避免给 `memo` 子组件强加可变 ref 破坏比较。

### 7.2 虚拟列表何时上

**先**砍掉无效渲染；仍上千行 DOM 撑不住再用 `@tanstack/react-virtual`。  
虚拟列表解决 **DOM 数量**；memo/selector 解决 **更新次数**——两层问题。

### 7.3 配置 state 下沉

字号、主题放 prefs store，**谁用谁订阅**——避免「改字号 → 父列表给每行新 props → memo 全灭」。

---

## 8、父 render 了，子一定跟吗？

```tsx
const { items, activeIndex } = useListStore(useShallow(...))
```

父会重新执行 `items.map`，但：

1. 某行 props 未变 → `memo` 跳过该行 reconcile  
2. 子行自己的 store 订阅与父 **解耦** → 父 render ≠ 子 render  

编排逻辑（滚动、`pendingFocusIndex`、双 rAF）放父层：**只有容器需要知道全局下标**，不必拆到每一行。

---

## 9、和 Zustand 一文怎么配合

| 概念 | 在列表里的角色 |
| --- | --- |
| selector | 每行只订「和我有关」的布尔/对象 |
| `useShallow` | 父组件一次取 `items + activeIndex` |
| `useStoreWithEqualityFn` | 行内选区对象 |
| `getState` | 行点击写多字段 |
| persist | 与列表性能无直接关系；字号变更用配置下沉即可 |

---

## 10、自查清单

- [ ] 是否理解：父 render 可以接受，子 render 要节制？  
- [ ] `memo` 是否配上稳定 props？  
- [ ] 是否避免把 `activeIndex` 广播给每一行？  
- [ ] 对象 selector 是否有自定义 equal？  
- [ ] key 是否业务 id？  

---

## 11、总结

| 手段 | 为了什么 |
| --- | --- |
| `memo` | 父动了，props 没变的行别深入更新 |
| 按行 selector | store 动了，无关行别 render |
| `useStoreWithEqualityFn` | 必须返回对象时，别被引用相等坑死 |
| `getState` | 交互写 store 不白占订阅 |
| 配置下沉 | 改主题不拖垮整表 props |

长列表性能 = **少做无意义的 render 次数**，不是玄学，是两层闸门叠在一起。
