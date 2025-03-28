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
### 安全区
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
### rem / em / rpx

<!--@include: @/article/interview/css/index.md{6,21}-->

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



