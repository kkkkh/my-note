---
outline: deep
---
<script setup>
import AnimationComposition from './components/animation/animation-composition.vue'
import AnimationTimingFunctionAttr from './components/animation/animation-timing-function-attr.vue'
import AnimationTimingFunctionSteps from './components/animation/animation-timing-function-steps.vue'
import AnimationFillMode from './components/animation/animation-fill-mode.vue'
import AnimationDirection from './components/animation/animation-direction.vue'
import accentColor from './components/background/accent-color.vue'
</script>

# css
## 布局
### 布局模式
- 块布局：用来布置文件。块布局包含以文档为中心的功能，例如 浮动元素或将其放置在多列上的功能。
- 行内布局：用来布置文本。
- 表格布局：用来布置表格。
- 定位布局：用来对那些与其他元素无交互的定位元素进行布置。
- 弹性盒子布局：用来布置那些可以顺利调整大小的复杂页面。flex
- 网格布局：用来布置那些与一个固定网格相关的元素。grid
### 盒模型 &I
- CSS 基础框盒模型（盒子模型、盒模型或框模型）
  - 浏览器的渲染引擎会根据标准之一的 CSS 基础框盒模型进行布局
  - 每个盒子由四个部分（或称区域）组成，其效用由它们各自的边界：
    - 内容边界 Content edge：
      - 如果 box-sizing 为 content-box（默认），则内容区域的大小可明确地通过 width、min-width、max-width、height、min-height 和 max-height 控制。
    - 内边距边界 Padding Edg
      - padding-top、padding-right、padding-bottom、padding-left，和简写属性 padding 控制。
    - 边框边界 Border Edge
      - 边框的粗细由 border-width 和简写的 border 属性控制
      - 如果 box-sizing 属性被设为 border-box，那么边框区域的大小可明确地通过 width、min-width, max-width、height、min-height，和 max-height 属性控制。
      - 假如框盒上设有背景（background-color 或 background-image），背景将会一直延伸至边框的外沿（默认为在边框下层延伸，边框会盖在背景上）。此默认表现可通过 CSS 属性 [background-clip ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip)来改变。
    - 外边框边界 Margin Edge
      - margin-top、margin-right、margin-bottom、margin-left，和简写属性 margin 控制
      - 在发生外边距合并的情况下，由于盒之间共享外边距，外边距不容易弄清楚
- IE 盒模型
  - box-sizing: "content-box"
    - width = 内容的宽度
    - height = 内容的高度
  - box-sizing: "border-box"（这是当文档处于 Quirks 模式 时 Internet Explorer 使用的盒模型。）
    - width = border + padding + 内容的宽度
    - height = border + padding + 内容的高度
- 参考
  - [box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)
  - [掌握外边距折叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)
  - [盒模型、盒子](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/Box_model)
### BFC 区块格式化上下文（Block Formatting Context） &I
- 可以把 BFC 想象成一个独立的容器，容器内部的元素按照一定的规则进行布局，并且容器内部的元素不会影响到容器外部的元素
- 触发条件
  - 文档的根元素（`<html>`）。
  - 浮动元素（即 float 值不为 none 的元素）。
  - 绝对定位元素（position 值为 absolute 或 fixed 的元素）。
  - display：inline-block、table-cell、table-caption、table、table-row、table-row-group 、table-header-group、table-footer-group、inline-table
  - overflow 值不为 visible 或 clip 的块级元素。
  - display 值为 flow-root 的元素。
  - contain: layout、content 或 paint 的元素。
  - display: flex 或 inline-flex、grid 或 inline-grid
  - 等
- 可以把 BFC 理解成一种手段，解决一些问题，可以给父元素、子元素、兄弟元素 设置 BFC 来解决一些问题
- 解决问题：
  - 清除浮动 (Clear floats)：通过将父容器设置为 BFC（ overflow: auto），可以使其自动包含内部的浮动元素，从而避免高度塌陷的问题。
    ```html
    <section>
      <div class="box">
        <div class="float">我是浮动的盒子！</div>
        <p>我是容器内的内容。</p>
      </div>
    </section>
    <section>、
      <!--
        如果使用它仅仅为了创建 BFC，你可能会遇到不希望出现的滚动条或阴影，需要注意。
        另外，对于后续的开发者，可能不清楚当时为什么使用 overflow，
        所以最好添加一些注释来解释为什么这样做。
      -->
      <div class="box" style="overflow:auto">
        <div class="float">我是浮动的盒子！</div>
        <p>我是 <code>overflow:auto</code> 容器内部的内容。</p>
      </div>
    </section>
    <!--
      使用 display: flow-root
      一个新的 display 属性的值，它可以创建无副作用的 BFC。在父级块中使用 display: flow-root 可以创建新的 BFC。
      给 <div> 元素设置 display: flow-root 属性后，<div> 中的所有内容都会参与 BFC，浮动的内容不会从底部溢出。
      你可以从 flow-root 这个值的名字上看出来，它创建一个新的用于流式布局的上下文，行为如同 root（在浏览器中是 <html>）元素。
    -->
    <section>
      <div class="box" style="display:flow-root">
        <div class="float">我是浮动的盒子！</div>
        <p>我是 <code>display:flow-root</code> 容器内部的内容。</p>
      </div>
    </section>
    ```
  - 要防止元素的内容环绕外部的浮动元素，应该直接给该元素设置 BFC
    ```html
    <section>
      <div class="float">试试重新调整这个外部浮动元素的大小</div>
      <div class="box"><p>普通</p></div>
    </section>
    <section>
      <div class="float">试试重新调整这个外部浮动元素的大小</div>
      <div class="box" style="display:flow-root">
        <p><code>display:flow-root</code></p>
        <p></p>
      </div>
    </section>
    ```
  - 通过创建 BFC，可以阻止相邻元素之间的 margin 重叠
    ```html
    <div style="margin-bottom: 20px;"></div>
    <div style="overflow: auto; margin-top: 30px;">
      <p>This is some text.</p>
    </div>
    ```
### position定位 &I
- relative 相对定位
  - 相对定位的元素是在文档中的正常位置偏移给定的值，但是不影响其他元素的偏移
- absolute 绝对定位
  - 相对定位的元素并未脱离文档流，而绝对定位的元素则脱离了文档流。
  - 在布置文档流中其他元素时，绝对定位元素不占据空间。
  - 绝对定位元素相对于最近的非 static 祖先元素定位
  - 当这样的祖先元素不存在时，则相对于 ICB（initial containing block，初始包含块，即`<html>`）
- fixed 固定定位
  - 固定定位与绝对定位相似，但元素的包含块为 viewport 视口。
  - 该定位方式常用于创建在滚动屏幕时仍固定在相同位置的元素。
- sticky 粘性定位
  - 粘性定位可以被认为是相对定位和固定定位的混合。
  - 元素在跨越特定阈值前为相对定位，之后为固定定位。
  ```css
  #one {
    /* 在 viewport 视口滚动到元素 top 距离小于 10px 之前，元素为相对定位
    之后，元素将固定在与顶部距离 10px 的位置，
    直到 viewport 视口回滚到阈值以下。 */
    position: sticky;
    top: 10px;
  }
  ```
- 参考：
  - [position](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/CSS_layout/Positioning)

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
#### accent-color

<accent-color></accent-color>

参考:
- [accent-color](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/accent-color)

## 动画
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

- 参考
  - [animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)
  - [@keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)
  - [animation-composition](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-composition)
## 自适应/适配
### @media
```css
@media print {
  body {
    font-size: 10pt;
  }
}
@media screen {
  body {
    font-size: 13px;
  }
}
@media screen, print {
  body {
    line-height: 1.2;
  }
}
@media only screen and (min-width: 320px) and (max-width: 480px) and (resolution: 150dpi) {
  body {
    line-height: 1.4;
  }
}
```
```css
/* 媒体查询第 4 版引入了一种新的范围语法，在测试接受范围的任何特性时允许更简洁的媒体查询： */
@media (height > 600px) {
  body {
    line-height: 1.4;
  }
}
@media (400px <= width <= 700px) {
  body {
    line-height: 1.4;
  }
}
```
参考：
- [@media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)
### 安全区 &I
- WebView 中的安全区域 CSS 属性
- 帮助开发者更好地适配各种设备的屏幕形状，确保 Web 内容始终可见，并提供一致的用户体验
```html
  <!-- 中设置 viewport-fit=cover，才能启用安全区域特性 -->
  <meta name="viewport" content="viewport-fit=cover">
```
```css
body {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```


