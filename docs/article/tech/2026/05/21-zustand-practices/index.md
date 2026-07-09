---
title: 【React】Zustand 的常用模式与踩坑
date: 2026-05-21
tags:
  - front-end
  - react
  - zustand
---
# React 里 Zustand 的常用模式与踩坑

> 面向中大型 React 应用：多域状态、列表性能、持久化、命令式副作用。  
> 写法之外，补充 **每个 API 在解决什么问题**——没用过也能知道「为什么要上这一套」。

## 0、Zustand 是什么（和 useState / Context 差在哪）

**Zustand** 是一个轻量全局状态库：在 React 组件树**外面**放一个 store，任意组件用 hook 订阅其中一部分；更新 store 时，**只有订阅了变化部分的组件**会重渲染。

| 方式 | 适合 | 常见痛点 |
| --- | --- | --- |
| `useState` | 单个组件内部 | 状态要传给很多层 → props 钻取 |
| Context | 主题、locale 等低频全局 | value 一变，所有 consumer 都渲染 |
| Zustand | 多页面共享、高频局部更新、非组件里也要读 | 需要自己设计分域和订阅粒度 |

下文所有技巧，本质都是：**少渲染、少钻取、副作用路径清晰**。

---

## 1、何时拆多个 store

### 解决什么问题

把所有状态塞进一个 store，等价于「全局大对象」：改字号可能触发列表重渲染；把 token 和 UI 临时态写在一起，持久化时很难取舍。

### 按什么拆

按 **「谁、因为什么、改了这块状态」** 分域，而不是按页面名随意拆：

| 类型 | 典型内容 | 变更来源 | 为何单独放 |
| --- | --- | --- | --- |
| 权威数据 | 列表、派生视图、当前项下标 | 接口、编辑、播放进度 | 唯一真相，别处只读或走 action |
| 会话/UI | 选中、浮层锚点、待处理信号 | 点击、自动跟随 | 刷新即丢或不该进持久化 |
| 用户配置 | 布局、字号、开关 | 设置面板 | 常要 **刷新后仍保留** → 见 persist |
| 命令总线 | 进度条显示值 + `seek` 等 | 按钮 | UI 发命令，真正执行在别的层 |
| 认证等 | token、用户 | 登录、拦截器 | 横切，生命周期与业务 UI 不同 |

**原则**：会话层 **不复制** 权威层已有字段；改列表只走 `setItems` 一类入口，避免两处数据不一致。

---

## 2、创建 store

### 2.1 基础 `create` —— 只在内存里活的状态

**是什么**：`create` 返回一个 hook（如 `useSessionStore`）和 `getState` / `setState`；数据默认在**当前标签页内存**里，刷新页面就没了。

**为了什么用**：

- 当前选中了哪一行、浮层开没开——**会话态**，不必存硬盘  
- 命令槽位（见 §4.2）——只是函数引用，不能 JSON 化  
- 从接口拉来的列表——权威数据在内存，由接口再次加载恢复  

```ts
import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  selection: null,
  syncSelection: ({ itemId, selection }) =>
    set((s) => ({
      currentItemId: itemId,
      ...(selection !== undefined ? { selection } : {}),
    })),
}))
```

**何时不用裸 `create`**：用户希望「下次打开还是上次字号 / 主题」→ 需要 **persist**。

---

### 2.2 `persist` —— 把 store 同步到 localStorage

**是什么**：`persist` 是 Zustand 的**中间件**，包在 `create` 外面。每次 state 变化，把指定字段 **序列化进浏览器 localStorage**（key 由 `name` 决定）；下次打开页面再 **反序列化读回来**。

**为了解决什么**：

- 用户调好的字号、布局、开关 → **刷新、关标签再开仍保留**  
- 不必自己写 `useEffect` + `localStorage.getItem/setItem` + 和 store 双向同步  

**不解决什么**：

- 不能替代后端：换设备、清缓存就没了  
- 不适合存 token 敏感信息（localStorage 可被 XSS 读到，要另做安全策略）  
- `Map`、`Set`、函数 **不能直接 JSON**，硬 persist 会坏（见 §5）  

```ts
export const usePrefsStore = create<PrefsState & PrefsActions>()(
  persist(
    (set) => ({
      fontSize: 14,
      layout: 'inner' as const,
      setFontSize: (v) => set({ fontSize: v }),
      setLayout: (v) => set({ layout: v }),
    }),
    {
      name: 'user-prefs',
      skipHydration: true,
      partialize: (s) => ({ fontSize: s.fontSize, layout: s.layout }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PrefsState>
        return {
          ...current,
          fontSize: typeof p.fontSize === 'number' ? p.fontSize : current.fontSize,
          layout: p.layout ?? current.layout,
        }
      },
    },
  ),
)
```

**配置项在干什么**（看懂「为了什么」）：

| 选项 | 作用 | 典型原因 |
| --- | --- | --- |
| `name` | localStorage 的 key | 多 store 时要不同名，避免互相覆盖 |
| `partialize` | 白名单：只持久化列出的字段 | 删除模式、草稿 Map 等 **不应** 下次自动打开 |
| `merge` | 读盘后与内存默认值怎么合并 | 修旧版本脏数据、强制 `new Map()` |
| `skipHydration` | 首屏**先**用代码里的默认值，**暂不**读盘 | 见下：SSR / hydration |

**`skipHydration` + `rehydrate()` 是为了什么**：

- Next 等 **服务端先渲染一版 HTML**（用默认字号 14）  
- 客户端若立刻从 localStorage 读出字号 20 → 和服务端 HTML 不一致 → React 报 **hydration mismatch**  
- 做法：store 声明 `skipHydration: true`，首屏大家都用默认值；**挂载后**再 `usePrefsStore.persist.rehydrate()` 从盘里灌入——用户可能闪一下默认值，但不错乱 SSR  

```tsx
useEffect(() => {
  usePrefsStore.persist.rehydrate()
}, [])
```

---

## 3、订阅与性能

> 本节按 API 分条：每条只讲**该 API 解决什么 + 怎么写**。与某条 API 无直接关系的坑，统一放在 **§6 踩坑汇总**。

### 先理解：hook 订阅在干什么

写 `useStore((s) => s.count)` 时，组件相当于告诉 Zustand：**只要 `count` 变了（且 selector 返回值变了），就叫我重渲染**。

没写 selector、整 store 订阅 → store 里**任意字段**变都会重渲染——长列表里这是灾难。

---

### 3.1 细粒度 selector

```ts
const isActive = useListStore((s) => s.activeIndex === index)
```

**为了什么**：每行只关心「我是不是当前行」，返回 `true/false`。  
`activeIndex` 从 3→4 时，只有 index 3、4 的组件结果从 `true↔false` 变化；其它行前后都是 `false`，Zustand 用 `Object.is` 比较后 **不触发渲染**。

更完整的反例与改法见 **§6.2**。

---

### 3.2 `useShallow` —— 一次取多个字段，又不要被「新对象」坑

**问题从哪来**：selector 若写成：

```ts
// ❌ 每次 render 都 new 一个对象，Zustand 认为「变了」→ 组件每次都重渲染
const { items, activeIndex } = useListStore((s) => ({
  items: s.items,
  activeIndex: s.activeIndex,
}))
```

即使 `items`、`activeIndex` 的值没变，外层 `{}` 引用也变 → Zustand 默认用 `Object.is(上次整个对象, 这次整个对象)` → **每次都重渲染**。

```ts
import { useShallow } from 'zustand/react/shallow'

function ListContainer() {
  // ✅ 只有 items 或 activeIndex 真变时才重渲染
  const { items, activeIndex } = useListStore(
    useShallow((s) => ({
      items: s.items,
      activeIndex: s.activeIndex,
    })),
  )

  return (
    <ul>
      {items.map((item, i) => (
        <li key={item.id} data-active={i === activeIndex}>
          {item.title}
        </li>
      ))}
    </ul>
  )
}
```

**何时用**：父组件需要 2 个以上字段，且想写在一个 selector 里。  
**替代**：拆成两次订阅，不用 shallow 也行：

```ts
const items = useListStore((s) => s.items)
const activeIndex = useListStore((s) => s.activeIndex)
```
#### `useShallow` 在比较什么（不是只比 key 名）

**`useShallow`**：对 selector **返回的那个对象**做**浅比较**——对**每一个属性名**，用 `Object.is` 比较**上一次和这一次该属性上的值**；全部相同才视为「没变」，避免因每次 `return { ... }` 都是新对象而误触发重渲染。

常见误解：**不是**「只看看对象里有哪些 key」；**而是** key 要对上，且**每个 key 的 value** 都要 `Object.is` 相等。

```ts
// 伪代码：浅比较在干什么
function shallowEqual(prev, next) {
  const keys = Object.keys(prev)
  if (keys.length !== Object.keys(next).length) return false
  for (const key of keys) {
    if (!Object.is(prev[key], next[key])) return false // 比的是 value，不是 key 字符串
  }
  return true
}
```

| 上一次 selector 结果 | 这一次 | 浅比较 | 组件会因 shallow 重渲染？ |
| --- | --- | --- | --- |
| `{ items: arr1, activeIndex: 3 }` | `{ items: arr1, activeIndex: 3 }` | 每个 value 都 `Object.is` 相等 | **否** |
| `{ items: arr1, activeIndex: 3 }` | `{ items: arr1, activeIndex: 4 }` | `activeIndex` 变了 | **是** |
| `{ items: arr1, activeIndex: 3 }` | `{ items: arr2, activeIndex: 3 }` | `items` 引用变了 | **是** |

**「浅」的含义**：只比**第一层**每个属性的值；若 `items` 是数组，**不会**深入比数组里每个元素。所以 `items` 若是新数组、内容相同但引用不同（`arr2 !== arr1`），仍算「变了」。

---

### 3.3 `useStoreWithEqualityFn` —— selector 返回对象时的「自定义相等」

**问题**：即使按行过滤，selector 仍可能 `return { start, end }`，每次都是新对象 → 默认 `Object.is` 永远不相等 → **每行都渲染**。

```tsx
// ❌ 每次 selector 都 return 新对象 → 列表每一行都会重渲染
function ListRow({ item }: { item: { id: string } }) {
  const range = useSessionStore((s) => {
    const sel = s.selection
    if (!sel || sel.itemId !== item.id) return undefined
    return { start: sel.start, end: sel.end }
  })
  // ...
}
```

**是什么**：多传第三个参数，自定义「怎样算 selector 结果没变」。

```tsx
import { useStoreWithEqualityFn } from 'zustand/traditional'

type Range = { start: number; end: number }

function rangeEqual(a: Range | undefined, b: Range | undefined) {
  if (a === b) return true
  if (!a || !b) return false
  return a.start === b.start && a.end === b.end
}

function ListRow({ item }: { item: { id: string } }) {
  const range = useStoreWithEqualityFn(
    useSessionStore,
    (s): Range | undefined => {
      const sel = s.selection
      if (!sel || sel.itemId !== item.id) return undefined
      return { start: sel.start, end: sel.end }
    },
    rangeEqual,
  )

  return <div data-range={range ? `${range.start}-${range.end}` : ''}>{item.id}</div>
}
```

**何时用**：列表子项需要对象片段（选区、坐标、样式对象），且不能用原始值代替。  
**从哪 import**：`zustand/traditional`（依赖 `use-sync-external-store`，个别项目要单独装包）。

---

### 3.4 多个独立 selector

```ts
// ❌ 无 selector：store 里任意字段变都会重渲染本组件
const store = usePrefsStore()

// ✅ 只订用到的字段；action 引用通常稳定，几乎不额外渲染
const fontSize = usePrefsStore((s) => s.fontSize)
const setFontSize = usePrefsStore((s) => s.setFontSize)
```

```tsx
function FontToolbar() {
  const fontSize = usePrefsStore((s) => s.fontSize)
  const incr = usePrefsStore((s) => s.incrFontSize)
  const decr = usePrefsStore((s) => s.decrFontSize)

  return (
    <div>
      <button type="button" onClick={decr}>A-</button>
      <span>{fontSize}px</span>
      <button type="button" onClick={incr}>A+</button>
    </div>
  )
}
```

**为了什么**：避免 `usePrefsStore()` 无参——那会订阅**整个 store**，以后加 `lineHeight` 也会拖垮本组件。

---

### 3.5 `getState()` —— 读/写但不「订阅」

**是什么**：`useXxxStore.getState()` 拿当前快照；在回调里调 `getState().someAction()` **不会**让当前组件因为这次写入而订阅 store。

**① 点击一次写多个字段**（不必为每个 setter 各订阅一遍）：

```tsx
function ListRow({ index, itemId }: { index: number; itemId: string }) {
  const onClick = useCallback(() => {
    const { setFocusedIndex, setSelection } = useSessionStore.getState()
    setFocusedIndex(index)
    setSelection({ itemId, start: 0, end: 5 })
  }, [index, itemId])

  return <button type="button" onClick={onClick}>选中</button>
}
```

**② axios 拦截器**（不是 React 组件，不能用 hook）：

```ts
import axios from 'axios'
import { useAuthStore } from './authStore'

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**③ 对比：hook 会订阅，getState 不会**

```ts
// 组件里要「跟着 token 变而重渲染」→ 用 hook
const token = useAuthStore((s) => s.accessToken)

// 拦截器 / 一次性回调里只要读当前值 → 用 getState
const token = useAuthStore.getState().accessToken
```

---

### 3.6 模块级函数跨 store

工具函数里不能 hooks，用各 store 的 `getState()` 拼出结果，保证和界面同一套数据。

```ts
export function resolveActiveItemIndex(): number {
  const currentItemId = useSessionStore.getState().currentItemId
  const items = useDataStore.getState().items
  return items.findIndex((x) => x.id === currentItemId)
}

// 在普通函数 / 另一个 store 的 action 里调用
export function submitCurrentItem() {
  const idx = resolveActiveItemIndex()
  if (idx < 0) return
  const item = useDataStore.getState().items[idx]
  return api.post('/submit', item)
}
```

---

## 4、架构模式（动机 + 示例）

### 4.1 派生数据集中在 store

**问题**：列表 100 行，每行自己 `items.find + tags.filter` → 100 份重复计算。  
**做法**：`setItems` / `setTags` 后调 `recomputeDerived()`，列表只读 `itemsWithTags`。

```ts
type DataStore = {
  items: Item[]
  tagsByItemId: Record<string, string[]>
  itemsWithTags: Array<Item & { tags: string[] }>
  setItems: (items: Item[]) => void
  setTags: (map: Record<string, string[]>) => void
  recomputeDerived: () => void
}

export const useDataStore = create<DataStore>((set, get) => ({
  items: [],
  tagsByItemId: {},
  itemsWithTags: [],

  recomputeDerived: () => {
    const items = get().items
    const tagsByItemId = get().tagsByItemId
    set({
      itemsWithTags: items.map((it) => ({
        ...it,
        tags: tagsByItemId[it.id] ?? [],
      })),
    })
  },

  setItems: (items) => {
    set({ items })
    get().recomputeDerived()
  },

  setTags: (map) => {
    set({ tagsByItemId: map })
    get().recomputeDerived()
  },
}))
```

---

### 4.2 命令总线：注册 handler，不存播放器实例

**问题**：把 `<video>` 实例塞进 store → 热切换、测试都麻烦。  
**做法**：store 只存槽位；媒体层 mount 时注册，unmount 注销；按钮只调 `seek(t)`。

```ts
type PlayerCmdStore = {
  currentTime: number
  seekHandler: ((t: number) => void) | null
  registerSeek: (fn: (t: number) => void) => void
  unregisterSeek: () => void
  seek: (t: number) => void
}

export const usePlayerCmdStore = create<PlayerCmdStore>((set, get) => ({
  currentTime: 0,
  seekHandler: null,
  registerSeek: (fn) => set({ seekHandler: fn }),
  unregisterSeek: () => set({ seekHandler: null }),
  seek: (t) => get().seekHandler?.(t),
}))
```

```tsx
// 媒体层：和 React 生命周期绑定
function MediaLayer({ videoRef }: { videoRef: RefObject<HTMLVideoElement> }) {
  useEffect(() => {
    const seek = (t: number) => {
      const el = videoRef.current
      if (el) el.currentTime = t
    }
    usePlayerCmdStore.getState().registerSeek(seek)
    return () => usePlayerCmdStore.getState().unregisterSeek()
  }, [videoRef])

  return null
}

// 底栏：只发命令，不碰 DOM
function SeekBar() {
  return (
    <input
      type="range"
      onChange={(e) => usePlayerCmdStore.getState().seek(Number(e.target.value))}
    />
  )
}
```

---

### 4.3 信号字段：「待办」式副作用

**问题**：删了一行后立刻 `scrollIntoView(5)`，DOM 可能还没按新列表画完。  
**做法**：先写 `pendingFocusIndex`，容器 effect 里等 DOM 就绪再滚。

```ts
// store
type UiStore = {
  pendingFocusIndex: number | null
  requestFocus: (index: number) => void
  clearPendingFocus: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  pendingFocusIndex: null,
  requestFocus: (index) => set({ pendingFocusIndex: index }),
  clearPendingFocus: () => set({ pendingFocusIndex: null }),
}))
```

```tsx
function ListContainer() {
  const pending = useUiStore((s) => s.pendingFocusIndex)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (pending == null) return
    const idx = pending
    const run = () => rowRefs.current[idx]?.scrollIntoView({ block: 'center' })
    requestAnimationFrame(() => requestAnimationFrame(run))
    useUiStore.getState().clearPendingFocus()
  }, [pending])

  // 删行后：setItems(...) + requestFocus(5)
}
```

---

### 4.4 可选参数：省略 vs `null`

**问题**：自动流程更新当前项时，不想清空用户手选范围；点「清除」又要明确清空。

```ts
syncSelection: ({
  itemId,
  selection,
}: {
  itemId: string
  selection?: { start: number; end: number } | null
}) =>
  set(() => ({
    currentItemId: itemId,
    // 不传 selection → 保留原选区（自动跟随）
    // selection: null → 清空
    // selection: { ... } → 覆盖
    ...(selection !== undefined ? { selection } : {}),
  })),

// 自动跟随：只改 itemId，不动选区
useSessionStore.getState().syncSelection({ itemId: 'a' })

// 用户点清除
useSessionStore.getState().syncSelection({ itemId: 'a', selection: null })
```

---

### 4.5 配置下沉

**问题**：父列表给每行传 `fontSize` → 改设置 → 每行 props 变 → `memo` 失效。

```tsx
// ❌ 父组件订阅字号，传给每一行
function ListContainer() {
  const fontSize = usePrefsStore((s) => s.fontSize)
  return items.map((item) => <ListRow key={item.id} item={item} fontSize={fontSize} />)
}

// ✅ 只有真正渲染字号的子组件订阅
function ListRowTitle({ item }: { item: Item }) {
  const fontSize = usePrefsStore((s) => s.fontSize)
  return <span style={{ fontSize }}>{item.title}</span>
}
```

---

## 5、persist 常见坑（现象 → 原因 → 示例修法）

| 现象 | 原因 | 修法在解决什么 |
| --- | --- | --- |
| hydration mismatch | 服务端用默认值渲染，客户端 persist 立刻读出不同值 | `skipHydration` 推迟读盘；挂载后 `rehydrate` 统一灌入 |
| `map.get is not a function` | JSON 没有 Map，盘里变成 `{}` | `partialize` 不存 Map；`merge` 里 `new Map()` 恢复类型 |
| 不该记住的模式被恢复 | 旧版 persist 了「删除模式」 | 白名单 + merge 强制关敏感开关 |

```ts
export const usePrefsStore = create()(
  persist(
    (set) => ({
      fontSize: 14,
      layout: 'inner' as const,
      editMode: false,
      draftIds: new Map<number, string[]>(),
      setFontSize: (v: number) => set({ fontSize: v }),
    }),
    {
      name: 'user-prefs',
      skipHydration: true,
      // 只持久化用户偏好，不持久化 Map、不持久化 editMode
      partialize: (s) => ({
        fontSize: s.fontSize,
        layout: s.layout,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<typeof current>
        return {
          ...current,
          fontSize: typeof p.fontSize === 'number' ? p.fontSize : current.fontSize,
          layout: p.layout ?? current.layout,
          editMode: false,
          draftIds: new Map(),
        }
      },
    },
  ),
)
```

```tsx
// 根布局或 GlobalInit：客户端挂载后再从 localStorage 灌入
'use client'
import { useEffect } from 'react'
import { usePrefsStore } from './prefsStore'

export function AppInit() {
  useEffect(() => {
    usePrefsStore.persist.rehydrate()
  }, [])
  return null
}
```

---

## 6、踩坑汇总

与上文各 API **无直接对应**、但在 Zustand + React 里常踩的坑，集中放这里；persist 专有问题见 **§5**。

### 6.1 `useMemo` 只依赖 store 里的 action，没依赖会变的 state

**现象**：字号滑块改了，由 `useMemo` 算出来的 className 不变。  
**原因**：`getTextSizeClass` 是稳定函数引用；`fontSize` 变了，但 memo 依赖数组没变，不会重算。

```ts
// ❌ 依赖里是函数引用，fontSize 变了也不会重算
const className = useMemo(
  () => usePrefsStore.getState().getTextSizeClass(0),
  [usePrefsStore.getState().getTextSizeClass],
)

// ✅ 订阅会变的 state，或不用 memo、直接在 render 里调
const fontSize = usePrefsStore((s) => s.fontSize)
const className = useMemo(
  () => usePrefsStore.getState().getTextSizeClass(0),
  [fontSize],
)
```

---

### 6.2 父组件订阅再 props 下传（和 §3.1 对照）

**现象**：已给子组件加 `memo`，列表仍随「当前项」全刷。  
**原因**：父组件 `useListStore(s => s.activeIndex)` 一变就 render，并把 `activeIndex` 传给每一行 → 每行 props 都变 → memo 无效。

```tsx
// ❌
function ListContainer() {
  const activeIndex = useListStore((s) => s.activeIndex)
  return items.map((item, i) => (
    <ListRow key={item.id} item={item} activeIndex={activeIndex} />
  ))
}

// ✅ 子项内 selector：见 §3.1
function ListRow({ index }: { index: number }) {
  const isActive = useListStore((s) => s.activeIndex === index)
  // ...
}
```

---

### 6.3 selector 返回新对象，却既不用 `useShallow` 也不用自定义 equal

**现象**：store 里只有一个字段变，订阅了「多字段对象 selector」的组件也狂刷。  
**原因**：每次 `() => ({ a, b })` 都是新引用。  
**修法**：§3.2 `useShallow`，或 §3.3 `useStoreWithEqualityFn`，或拆成多个标量 selector。

---

### 6.4 无参 `useStore()` 订阅整个 store

**现象**：改与当前 UI 无关的字段，组件也重渲染。  
**修法**：见 §3.4，只订用到的字段。

---

### 6.5 改同一业务状态的多条入口，副作用不一致

**现象**：拖进度条高亮对了，连播也对，但 seek 后高亮滞后。  
**原因**：`onTimeUpdate` 里更新了 `activeIndex`，`seek` 路径漏了同一段逻辑。  
**修法**：凡改「当前时间 / 当前项」的入口，列一张表对照，保证都触发同一 `syncActiveIndex`（或同类 action）。

```ts
// 示意：两条路径都要写
function onTimeUpdate(t: number) {
  usePlaybackStore.getState().setCurrentTime(t)
  useListStore.getState().syncActiveIndexFromTime(t)
}

function seek(t: number) {
  player.seek(t)
  usePlaybackStore.getState().setCurrentTime(t)
  useListStore.getState().syncActiveIndexFromTime(t) // 漏了这一行就会偏
}
```

---

## 7、与 React 协作（串联动机）

1. **长列表**：细订阅 + `memo`（另文）—— 否则全局「当前行」每秒变，百行全刷。  
2. **父列表多字段**：用 §3.2 `useShallow`，避免新对象引用陷阱。  
3. **多条入口副作用**：见 §6.5。  
4. **预览 diff ≠ 提交内容**：展示用算法，保存用最终文本（见 LCS 一文）。

---

## 8、自查清单

- [ ] 这块状态刷新后还要吗？要 → persist；不要 → 裸 create  
- [ ] persist 里有没有 Map/函数？是否 SSR 需要 skipHydration？  
- [ ] 列表是否订阅整 store 或「每次 new 对象」的 selector？  
- [ ] 事件/拦截器是否该用 `getState()` 而不是 hook？  
- [ ] 改时间的多条路径副作用是否一致？  
- [ ] 命令 handler 是否 register/unregister 成对？  

---

## 9、总结

- **create**：内存态，给会话和权威数据。  
- **persist**：把用户配置落到 localStorage，刷新不丢；要配 partialize / merge / 可选 rehydrate。  
- **selector / shallow / equality**：控制「谁因为什么重渲染」。  
- **getState**：写命令、非组件读数，不白订阅。  
- **分域 + 派生 + 信号字段 + 命令槽**：让数据流可读、列表能撑住频率。
