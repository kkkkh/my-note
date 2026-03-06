---
outline: deep
---

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
