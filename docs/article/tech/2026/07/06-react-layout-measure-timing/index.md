---
title: 【React】布局变更后再测量：useLayoutEffect、双 rAF 与 commit 时机
date: 2026-07-06
tags:
  - front-end
  - react
---

# 布局变更后再测量：useLayoutEffect、双 rAF 与 commit 时机

> 问题：列表某行要**预留空间**，`fixed` 浮层又要**贴准该行**——只延后执行或只加 margin 都不够，浮层仍挡邻项或贴错位。  
> 本文说明：**先撑布局、等新 layout、再量几何**；双 rAF 与 `useLayoutEffect` 只是对齐「等 layout」的不同手段。

---

## 1、现象 / 痛点

典型 UI：

- 纵向列表，每一行是文档流里的 **Row**
- 点击或选中某行后，出现 **`position: fixed` 的 Toolbar**（或 Popover、浮动操作条）
- Toolbar 显示在 Row **上方或下方**，配置为 `top` / `bottom` 两种方向

两个独立问题：

1. **遮挡**：浮层脱离文档流，画在行与行之间的视觉空间里，会盖住上一行或下一行
2. **错位**：给锚定行加了 `margin` / `padding` 撑开空间后，Toolbar 仍按**加 margin 之前**的坐标定位

第二种尤其迷惑：代码里明明「延后了」「也加了 margin」，看起来都做了，结果还是对不上——因为 **延后执行 ≠ 等到新布局**，**加 margin ≠ 自动重新测量**。

---

## 2、根因：两条时间线没对齐

### 2.1 浏览器：layout 与 paint

一次宏任务里，浏览器大致顺序为：

```text
JS 执行 → style / layout 计算 → paint → composite
```

- `getBoundingClientRect()` 读的是 **当前 layout 快照**
- `requestAnimationFrame` 挂在 **下一帧绘制前**，与 React 的 commit **没有契约关系**

### 2.2 React：commit 与 hook 档位

React 一次更新的简化顺序：

```text
render（算 Fiber）
  → commit（把变更写到真实 DOM）
  → useLayoutEffect（同步，绘制前）
  → 浏览器有机会 paint
  → useEffect（异步，绘制后）
```

要点：

- `useLayoutEffect` **不是**监听 `resize` / `MutationObserver` 之类的事件
- 它钉在 **「本次 commit 已改 DOM、尚未 paint」** 的同步段
- 依赖数组决定 **哪几次 commit 之后**再跑，不是持续监听布局变化

### 2.3 正解顺序（全文不变量）

```text
① 撑布局：给锚定 Row 加 margin / padding / 占位，让邻项被顶开
② 等 layout：浏览器把 ① 算进盒模型
③ 重测定位：getBoundingClientRect() → 更新 fixed 浮层位置
```

口诀：**撑、等、量**——缺一步就错。

### 2.4 反模式（精简对照）

核心原则：

> **先撑开布局 → 等新 layout → 再量、再定位。**  
> 只「延后执行」或只「加 margin」都不够；**不能用变化前缓存的 `rect`**。

| 写法 | 做了什么 | 缺什么 | 结果 |
|------|----------|--------|------|
| **只双 rAF** | 晚几帧再定位 | 没撑布局；仍用旧 `rect` | 还挡邻项，还可能错位 |
| **只加 margin** | 行距开了 | 没在新 layout 下重测 | 浮层贴不准 |
| **加 margin + 立刻定位** | 两者都有 | 量得太早 / 用了旧 `rect` | 仍错位或闪一下 |
| **加 margin → 等 layout → 重测** ✓ | 三步齐全 | — | 邻项让位 + 贴得准 |

顺序图：

```text
✗ 常见错序：
  量 rect → 定位 → (可能) 加 margin     // 用的是旧几何

✓ 正序：
  加 margin → 等 layout → 再量 rect → 定位
              ↑ useLayoutEffect 或 双 rAF
```

**坏例子：只延后，不重测**

```tsx
function openToolbar(target: HTMLElement) {
  const rect = target.getBoundingClientRect()

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setToolbarPos({ top: rect.top - 40, left: rect.left }) // 仍是开函数时的 rect
    })
  })
}
```

**坏例子：先量、后撑、仍用旧 rect**

```tsx
function openToolbar(target: HTMLElement) {
  const rect = target.getBoundingClientRect() // 旧布局

  target.closest('[data-row]')?.classList.add('mt-10')

  setToolbarPos({ top: rect.top - 40, left: rect.left }) // 没用新几何
}
```

---

## 3、方案

### 3.1 文档流侧：锚定行预留空间

Toolbar 是 `fixed`，不占流；要在 **锚定 Row** 上撑开文档流，邻项才会让位。

```tsx
function Row({
  isAnchor,
  toolbarPlacement,
}: {
  isAnchor: boolean
  toolbarPlacement: 'top' | 'bottom'
}) {
  const reserveClass = isAnchor
    ? toolbarPlacement === 'top'
      ? 'mt-10'
      : 'mb-10'
    : ''

  return (
    <div data-row className={`p-1 ${reserveClass}`}>
      Row content
    </div>
  )
}
```

`isAnchor` 由「当前选中行 id / 下标 + Toolbar 是否打开」推导，与具体业务字段无关。

### 3.2 定位侧 A：`useLayoutEffect` + pending（推荐）

margin 由 React class 驱动时，与 commit 同帧对齐；在 **paint 前**重测，少闪一帧。

```tsx
type Pending = { target: HTMLElement; clientX?: number } | null

function useFloatingToolbar(placement: 'top' | 'bottom') {
  const [pending, setPending] = useState<Pending>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const anchorRef = useRef<Pending>(null)

  const openAt = useCallback((target: HTMLElement, clientX?: number) => {
    anchorRef.current = { target, clientX }
    setPending({ target, clientX }) // 只登记，不立刻量
  }, [])

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.target.getBoundingClientRect()
    const top =
      placement === 'top' ? rect.top - 40 : rect.bottom + 8
    const x = anchor.clientX ?? rect.left + rect.width / 2
    setPos({ top, left: x - 120 }) // 示意：按宽度居中
  }, [pending, placement])

  return { openAt, pos, active: pending !== null }
}
```

调用方仍可命令式 `openAt(target, clientX)`；定位逻辑收敛在 hook 内。

**`useEffect` vs `useLayoutEffect`（为何不用 effect 定位）**

```tsx
// 坏：paint 后才改位置 → 用户可能看到 Toolbar 跳一下
useEffect(() => {
  const rect = target.getBoundingClientRect()
  setPos({ top: rect.top - 40, left: rect.left })
}, [pending])

// 好：paint 前改好
useLayoutEffect(() => {
  const rect = target.getBoundingClientRect()
  setPos({ top: rect.top - 40, left: rect.left })
}, [pending])
```

### 3.3 定位侧 B：双 rAF + 回调内重测（最小 diff）

不引入 pending / layout effect 时，可在命令式函数里完成 **②③**；**`rect` 必须在 rAF 回调里重新读取**。

```tsx
function openToolbarAfterLayout(target: HTMLElement) {
  // ① 若 margin 由上一轮 React render 挂上，这里可省略
  target.closest('[data-row]')?.classList.add('mt-10')

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect() // 必须在回调里重测
      setToolbarPos({ top: rect.top - 40, left: rect.left })
    })
  })
}
```

双 rAF 常见写法：第一帧 style/DOM 变更进队，第二帧 layout 更稳（大列表重绘、结构突变后尤其明显）。它是 **② 的经验实现**，不能替代 ① 和 ③。

### 3.4 纯 DOM 最小 demo（无 React）

```html
<div id="row">Row</div>
<div id="bar" style="position:fixed">Toolbar</div>
<script>
  const row = document.getElementById('row')
  const bar = document.getElementById('bar')

  row.style.marginTop = '40px'
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const rect = row.getBoundingClientRect()
    bar.style.top = `${rect.top - 40}px`
  }))
</script>
```

---

## 4、权衡：怎么选

| 场景 | 更倾向 |
|------|--------|
| margin / class 由 React 驱动，Toolbar 在同一棵组件树 | **`useLayoutEffect` + pending** |
| 非 React 改 DOM，或第三方命令式 API | **双 rAF / ResizeObserver** |
| 列表结构突变后再定位（删行、合并块） | 等 DOM 稳定后再走 ②③（双 rAF 或 effect 依赖数据更新） |
| 先验证「撑开 + 重测」思路 | **双 rAF + 回调内重测**，再视闪烁升级到 layout effect |
| 布局持续变化（动画、窗口 resize） | **ResizeObserver** 触发重测 |

```tsx
useLayoutEffect(() => {
  const row = rowRef.current
  if (!row) return

  const ro = new ResizeObserver(() => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.top - 40, left: rect.left })
  })
  ro.observe(row)
  return () => ro.disconnect()
}, [activeRowId])
```

**侵入性**（实现成本，不是对错）：

- 只比「延后定位」：**双 rAF 改动更小**，塞进现有 `openAt` 即可
- 比「少闪、与 React commit 对齐」：**layout effect 更贴语义**
- margin 部分两种方案都要做，省不了

**`setTimeout(0 / 16)`**：走宏任务，与 paint 无契约，Tab 后台还会节流，不如 rAF 或 layout effect 可预期。

---

## 5、落地清单

- [ ] 锚定 Row 在 Toolbar 打开时加 `margin-top` 或 `margin-bottom`（与 `placement` 一致）
- [ ] 行号 / 锚点用**单一来源**（如 `activeItemId`），不要混用「播放当前行」与「用户点选行」两个下标
- [ ] 定位函数**不要**在入口缓存最终使用的 `rect`
- [ ] 在 layout effect 或双 rAF **回调内** `getBoundingClientRect()` 再 `update()`
- [ ] Toolbar 关闭时去掉 margin class，`active` 变 false 即恢复行距
- [ ] 快速连续 `openAt` 不同行时，用 ref 存最新 anchor，避免旧回调覆盖新位置
- [ ] 首次打开时浮层未挂载、宽度为 0：用兜底宽度，挂载后再 `update()` 一次

---

## 6、常见坑与修法

| 坑 | 修法 |
|----|------|
| 只在 `setReference` 外包双 rAF，仍用外层 `rect` | 回调内**重新** `getBoundingClientRect()` |
| margin 用 React class，但定位与 `setState` 同同步块立刻量 | 改 `useLayoutEffect`，或 pending + 下一轮 effect |
| `zustand` 写 store 与 hook `setState` 分两轮 render | effect 依赖要覆盖「margin 已挂上」那次 commit；或先 store 再 `openAt` |
| 合并 / 删行后 DOM 未就绪 | 数据更新后再 `openAt`；必要时多等一帧 DOM |
| 只撑布局，浮层仍挡字 | 检查 margin 是否加在**锚定 Row**，高度是否 ≥ Toolbar + offset |
| 纯 `element.style` 改 margin，无 React 更新 | 不会触发 layout effect；用 rAF 或 ResizeObserver |

---

## 7、小结

浏览器规定 **layout / paint** 何时发生；React 在 **commit 同步段**里安排：**改 DOM → layout effect → 再交给浏览器画**。

「布局变更后再测量」的正解是：

```text
撑布局 → 等 layout → 再量几何 → 再定位
```

`useLayoutEffect` 与双 rAF 都是对齐 **「等 layout」** 的接口：前者跟 **React commit**，后者跟 **浏览器帧**。它们不能互相替代，也不能跳过撑布局与重测。

自检三问：

1. 测量前是否改了文档流？  
2. 测量是否在**新 layout**之后？  
3. 是否复用了变化前的 `rect` 闭包？  

三问都过，浮层才不挡邻项、也不贴飞。
