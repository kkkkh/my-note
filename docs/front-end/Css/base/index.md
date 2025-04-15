---
outline: deep
---
# css base
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

## 样式
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
参考：
- [cursor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)



