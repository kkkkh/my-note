---
outline: deep
---
# css
## rem / em / rpx
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
