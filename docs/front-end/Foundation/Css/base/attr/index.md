<script setup>
import AnimationComposition from '../components/animation/animation-composition.vue'
import AnimationTimingFunctionAttr from '../components/animation/animation-timing-function-attr.vue'
import AnimationTimingFunctionSteps from '../components/animation/animation-timing-function-steps.vue'
import AnimationFillMode from '../components/animation/animation-fill-mode.vue'
import AnimationDirection from '../components/animation/animation-direction.vue'
import accentColor from '../components/background/accent-color.vue'
</script>

# css
## 属性
### cursor
```css
/* 关键字值 */
cursor: pointer;
cursor: help;
cursor: wait;
cursor: crosshair;
cursor: not-allowed;
cursor: zoom-in;
cursor: grab;
cursor: auto;
/* 使用 URL，并提供一个关键字值作为备用 */
cursor: url(hand.cur), pointer;
/* URL 和 xy 的坐标偏移值，最后提供一个关键字值作为备用 */
cursor:
  url(cursor1.png) 4 12,
  auto;
cursor:
  url(cursor2.png) 2 2,
  pointer;
/* 全局属性 */
cursor: inherit;
cursor: initial;
cursor: unset;
```
### rem / em / rpx &I
- rpx
  - rpx（responsive pixel）是小程序特有的单位，它将所有屏幕的宽度都抽象为 750rpx。
  - 在 750rpx 宽度的屏幕上，1rpx = 1px。
  - 小程序会根据实际屏幕宽度，自动将 rpx 单位转换为对应的像素值，从而实现自适应。
- rem
  - rem 是 "root em" 的缩写，它相对于 HTML 根元素（`<html>`）的字体大小 。
  - 这意味着，无论元素嵌套多深，1rem 始终等于根元素的字体大小。
- em
  - em 是一个相对长度单位，它相对于当前元素的字体大小 。
  - 如果当前元素没有设置字体大小，则 em 单位会继承父元素的字体大小。
- vw
  - vw（viewport width）是相对于视口宽度的百分比单位。1vw 等于视口宽度的 1%
- vh
  - vh（viewport height）是相对于视口高度的百分比单位。1vh 等于视口高度的 1% 。
- px
  - px（pixel）是 CSS 中最基本的长度单位，代表屏幕上的一个物理像素点。
参考：
- [cursor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)
### 选择器
- base
  - .class
  - #id
  - *
- Pseudo-classes（伪类）
  - not
    - div:not(.test)
    - div:not(p)
  - first
    - :fist-letter
    - :fist-line
    - :fist-child
    - :fist-of-type
  - last
    - :last-child
    - :last-of-type
  - nth
    - :nth-child(n)
    - :nth-of-type(n)
    - :nth-last-child(n)
    - :nth-last-of-type(n)
  - only
    - :only-child
    - :only-of-type
  - a
    - :link
    - :visited
    - :active
    - :hover
    - :target
  - input（开发中使用较少）
    - :focus
    - :enabled
    - :disabled
    - :checked
    - :in-range
    - :out-of-range
    - :read-only
    - :read-write
    - :optional
    - :required
    - :valid
    - :invalid
  - content
    - :before
    - :after
    - :lang
    - :empty
    - ::selection
    - :root
- element
  - ele 元素
  - ele,ele 并集
  - ele ele 子以及后代
  - ele \> ele 子
  - ele ~ ele 兄弟
  - ele + ele 相邻之后的
- attibute
  -  `[attribute]`
  -  `[attribute=value]`
  -  `[attribute~=value]` 包含
  -  `[attribute|=value]` 前缀 -
  -  `[attribute^=value]` 开头
  -  `[attribute$=value]` 结尾
  -  `[attribute*=value]` 全部
  -
- 参考
  - [css 选择器](https://www.runoob.com/cssref/css-selectors.html)
### 伪类
:where()
```css
/* Selects any paragraph inside a header, main
   or footer element that is being hovered */
:where(header, main, footer) p:hover {
  color: red;
  cursor: pointer;
}
/*
  与以下的效果相同
  与scss嵌套类似
*/
header p:hover,
main p:hover,
footer p:hover {
  color: red;
  cursor: pointer;
}
```
- 对比
  - :where() 和 :is() 的不同之处在于，
  - :where() 的优先级总是为 0
  - :is() 的优先级是由它的选择器列表中优先级最高的选择器决定的。
### will-change
- 提示浏览器即将发生的变换，让浏览器提前做好优化准备
- 使用不当会导致性能问题
```css
will-change: transform;
```
### backdrop-filter
为一个元素后面区域添加图形效果（如模糊或颜色偏移）
因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明
```css
backdrop-filter: blur(10px);
backdrop-filter: invert(80%);
```
参考：
- [backdrop-filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backdrop-filter)
### background
#### accent-color 勾选框背景色

<accent-color></accent-color>

参考:
- [accent-color](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/accent-color)
#### background-clip 设置字体颜色渐变
```css
.gradient-text {
  background: linear-gradient(90deg, #ff6a00, #ee0979);
  -webkit-background-clip: text; /* Chrome / Safari */
  background-clip: text;
  color: transparent;
}
```
### animation &I
```css
/* @keyframes duration | easing-function | delay |
iteration-count | direction | fill-mode | play-state | name */
animation: 3s ease-in 1s 2 reverse both paused slidein;
/* @keyframes duration | easing-function | delay | name */
animation: 3s linear 1s slidein;
/* two animations */
animation:
  3s linear slidein,
  3s ease-out 5s slideout;
```
- animation-name 指定一个或多个 @keyframes at-rule 的名称
  ```css
  animation-name: none;
  animation-name: test_05;
  animation-name: -specific;
  animation-name: sliding-vertically;
  ```
- animation-duration 完成一个动画周期所需的时间
  ```css
  animation-duration: auto; /* Default */
  animation-duration: 6s;
  animation-duration: 120ms;
  ```
- animation-timing-function 设置动画在每个周期的持续时间内如何进行
  ```css
  animation-timing-function: ease;
  animation-timing-function: ease-in;
  animation-timing-function: ease-out;
  animation-timing-function: ease-in-out;
  animation-timing-function: linear;
  animation-timing-function: step-start;
  animation-timing-function: step-end;

  /* Function values */
  animation-timing-function: cubic-bezier(0.1, 0.7, 1, 0.1);
  animation-timing-function: steps(4, end);

  /* Steps Function keywords */
  animation-timing-function: steps(4, jump-start);
  animation-timing-function: steps(10, jump-end);
  animation-timing-function: steps(20, jump-none);
  animation-timing-function: steps(5, jump-both);
  animation-timing-function: steps(6, start);
  animation-timing-function: steps(8, end);
  ```

  <AnimationTimingFunctionAttr />

  <AnimationTimingFunctionSteps />

- animation-delay 开始执行动画之前等待的时间量
  ```css
  animation-delay: 3s;
  animation-delay: 0s;
  animation-delay: -1500ms;
  ```
- animation-iteration-count 在停止前播放的次数
  ```css
  /* 关键字值 */
  animation-iteration-count: infinite;

  /* 数字值 */
  animation-iteration-count: 3;
  animation-iteration-count: 2.4;
  ```
- animation-play-state 设置动画是运行还是暂停
  ```css
  animation-play-state: running;
  animation-play-state: paused;
  ```

- [animation-fill-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 执行之前和之后如何将样式应用于其目标
  ```css
  animation-fill-mode: none; /* 第一帧 原始状态，最后一帧 原始状态*/
  animation-fill-mode: forwards; /* 第一帧 原始状态，最后一帧 动画结束状态*/
  animation-fill-mode: backwards; /* 第一帧 动画开始状态，最后一帧 原始状态*/
  animation-fill-mode: both; /* 第一帧 动画开始状态，最后一帧 动画结束状态*/
  ```

  <AnimationFillMode />

- animation-direction 设置动画是应正向播放、反向播放还是在正向和反向之间交替播放
  ```css
  animation-direction: normal;
  animation-direction: reverse;
  animation-direction: alternate;
  animation-direction: alternate-reverse;
  ```

  <AnimationDirection />

- @keyframes
  ```css
  @keyframes slidein {
    from {
      transform: translateX(0%);
    }

    to {
      transform: translateX(100%);
    }
  }
  ```
- animation-composition
  - 动画属性相同 重叠如何计算：（原属性translateX(30px)，keyframes 40% translateX(100px)
    - replace 将原属性替换到
    - add 保持原属性状态，再叠加
    - accumulate 将原属性和新属性，计算总值

  <AnimationComposition />

### animation 实践
#### 无限循环之间的间隔
- 如果你想在每轮动画之间有一个“静止间隔”，可以在关键帧中 增加一段不变化的状态。
- animation-delay 只在动画第一次开始前生效。
```css
@keyframes pulse {
  0% { opacity: 0; }
  50% { opacity: 1; }
  80%, 100% { opacity: 1; } /* 80%-100%之间不变化 = 间隔 */
}
```
```html
<div class="animate-pulse-slow">淡入淡出</div>
```
```css
@layer utilities {
  .animate-pulse-slow {
    animation: pulse 3s infinite;
  }
}
```

- 参考
  - [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)
  - [@keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)
  - [animation-composition](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-composition)
