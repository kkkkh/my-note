
---
outline: deep
---
# sass
## 基础
```bash
#  --watch 标志监视单个文件或目录
sass --watch input.scss output.css
# 使用文件夹路径作为输入和输出，并用冒号分隔它们
sass --watch app/sass:public/stylesheets
```
- 两种语法
  - SCSS 语法 (.scss) 最常用。它是 CSS 的超集，这意味着所有有效的 CSS 也是有效的 SCSS。
  - 缩进语法（.sass）更不寻常：它使用缩进而不是大括号来嵌套语句，并使用换行符而不是分号来分隔它们。
### 变量
```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
```css
/* 编译结果 */
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```
### 嵌套
```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li { display: inline-block; }
  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```
```css
/* 编译结果 */
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```
### 部分文件
-  部分文件
   -  _partial.scss，不应将其生成为 CSS 文件
   -  Sass 部分与 @use 规则一起使用
### Modules 模块 _base.scss @use
```scss
// _base.scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;
body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
```scss
// styles.scss
@use 'base';
.inverse {
  background-color: base.$primary-color;
  color: white;
}
```
```css
/* 编译结果 */
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}

.inverse {
  background-color: #333;
  color: white;
}
```
### @mixin @include 
类似于函数调用
```scss
@mixin theme($theme: DarkGray) {
  background: $theme;
  box-shadow: 0 0 1px rgba($theme, .25);
  color: #fff;
}
.info {
  @include theme;
}
.alert {
  @include theme($theme: DarkRed);
}
.success {
  @include theme($theme: DarkGreen);
}
```
```css
.info {
  background: DarkGray;
  box-shadow: 0 0 1px rgba(169, 169, 169, 0.25);
  color: #fff;
}
.alert {
  background: DarkRed;
  box-shadow: 0 0 1px rgba(139, 0, 0, 0.25);
  color: #fff;
}
.success {
  background: DarkGreen;
  box-shadow: 0 0 1px rgba(0, 100, 0, 0.25);
  color: #fff;
}
```
### @extend 
可以让您从一个选择器到另一个选择器共享一组 CSS 属性
```scss
/* This CSS will print because %message-shared is extended. */
%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}
// This CSS won't print because %equal-heights is never extended.
// 占位符类是一种特殊类型的类，仅在扩展时才打印，可以帮助保持编译后的 CSS 整洁。
// 没有@extend，所以编译后不会生成
%equal-heights {
  display: flex;
  flex-wrap: wrap;
}
.message {
  @extend %message-shared;
}
.success {
  @extend %message-shared;
  border-color: green;
}
.error {
  @extend %message-shared;
  border-color: red;
}
.warning {
  @extend %message-shared;
  border-color: yellow;
}
```
### Operators
Sass 有一些标准数学运算符，例如 +、-、*、math.div() 和 %
```scss
@use "sass:math";
.container {
  display: flex;
}
article[role="main"] {
  width: math.div(600px, 960px) * 100%;
}
aside[role="complementary"] {
  width: math.div(300px, 960px) * 100%;
  margin-left: auto;
}
```
```css
.container {
  display: flex;
}
article[role=main] {
  width: 62.5%;
}
aside[role=complementary] {
  width: 31.25%;
  margin-left: auto;
}
```
### url()
```scss
$roboto-font-path: "../fonts/roboto";
@font-face {
    // This is parsed as a normal function call that takes a quoted string.
    src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2");
    font-family: "Roboto";
    font-weight: 100;
}
@font-face {
    // This is parsed as a normal function call that takes an arithmetic
    // expression.
    src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2");
    font-family: "Roboto";
    font-weight: 300;
}
@font-face {
    // This is parsed as an interpolated special function.
    src: url(#{$roboto-font-path}/Roboto-Regular.woff2) format("woff2");
    font-family: "Roboto";
    font-weight: 400;
}
```
```css
@font-face {
  src: url("../fonts/roboto/Roboto-Thin.woff2") format("woff2");
  font-family: "Roboto";
  font-weight: 100;
}
@font-face {
  src: url("../fonts/roboto/Roboto-Light.woff2") format("woff2");
  font-family: "Roboto";
  font-weight: 300;
}
@font-face {
  src: url(../fonts/roboto/Roboto-Regular.woff2) format("woff2");
  font-family: "Roboto";
  font-weight: 400;
}
```
### element() progid:...(), and expression()
[element()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/element) 函数在 CSS 规范中定义，由于其 ID 可以解析为颜色，因此需要特殊解析。
```scss
$logo-element: logo-bg;
.logo {
  background: element(##{$logo-element});
}
```
```css
.logo {
  background: element(#logo-bg);
}
```
### @at-root
```scss
@use "sass:selector";

@mixin unify-parent($child) {
  @at-root #{selector.unify(&, $child)} {
    @content;
  }
}

.wrapper .field {
  @include unify-parent("input") {
    /* ... */
  }
  @include unify-parent("select") {
    /* ... */
  }
}
```
```css
.wrapper input.field {
  /* ... */
}
.wrapper select.field {
  /* ... */
}
```
参考：[sass learn](https://sass-lang.com/guide/)
## At-Rules
### @use
- 成员
```scss
// src/_corners.scss
$radius: 3px;
@mixin rounded {
  border-radius: $radius;
}
```
```scss
// 1
// style.scss
@use "src/corners";
.button {
  @include corners.rounded;
  padding: 5px + corners.$radius;
}
```
```scss
// 2
// style.scss
@use "src/corners" as c;
.button {
  @include c.rounded;
  padding: 5px + c.$radius;
}
```
```scss
// 3
// style.scss
@use "src/corners" as *;

.button {
  @include rounded;
  padding: 5px + $radius;
}
```
- 私有成员
```scss
// src/_corners.scss
$-radius: 3px;
@mixin rounded {
  border-radius: $-radius;
}
```
```scss
// style.scss
@use "src/corners";
.button {
  @include corners.rounded;
  // This is an error! $-radius isn't visible outside of `_corners.scss`.
  padding: 5px + corners.$-radius;
}
```
- 使用 !default 标志定义变量 `@use <url> with (<variable>: <value>, <variable>: <value>)`
```scss
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
```
```scss
// style.scss
@use 'library' with (
  $black: #222,
  $border-radius: 0.1rem
);
```
```scss
// _library.scss
// 初始值
$-black: #000;
$-border-radius: 0.25rem;
$-box-shadow: null;

/// If the user has configured `$-box-shadow`, returns their configured value.
/// Otherwise returns a value derived from `$-black`.
@function -box-shadow() {
  @return $-box-shadow or (0 0.5rem 1rem rgba($-black, 0.15));
}
// 赋值操作
@mixin configure($black: null, $border-radius: null, $box-shadow: null) {
  @if $black {
    $-black: $black !global;
  }
  @if $border-radius {
    $-border-radius: $border-radius !global;
  }
  @if $box-shadow {
    $-box-shadow: $box-shadow !global;
  }
}
// 调用
@mixin styles {
  code {
    border-radius: $-border-radius;
    box-shadow: -box-shadow();
  }
}
```
```scss
// style.scss
@use 'library';
// 传值
@include library.configure(
  $black: #222,
  $border-radius: 0.1rem
);
// 调用
@include library.styles;
```
- 重新分配变量
```scss
// _library.scss
$color: red;
```
```scss
// _override.scss
@use 'library';
library.$color: blue;
```
```scss
// style.scss
@use 'library';
@use 'override';
@debug library.$color;  //=> blue
```
- module
  - module 加载
    - @use "variables" 将自动加载 variables.scss, variables.sass, or variables.css.
    - Sass 通过 URL（而不是文件路径）加载文件。这意味着您需要使用正斜杠，而不是反斜杠
    - 这也意味着 URL 区分大小写
  - Load Paths
    - @use "susy"来加载node_modules/susy/sass/susy.scss
    - 与其他一些语言不同，Sass 不要求您使用 ./ 进行相对导入。相对导入始终可用。
  - 部分文件
    - 仅作为模块加载而不是自行编译的 Sass 文件
    - _partial.scss，不应将其生成为 CSS 文件
  - 索引
    - 在文件夹中写入 _index.scss 或 _index.sass，则当您加载文件夹本身的网址时，将自动加载索引文件
    ```scss
    // foundation/_index.scss
    @use 'code';
    @use 'lists';
    ```
    ```scss
    // style.scss
    @use 'foundation';
    ```
- pkg: URL
  - @namespace/name
  - “exports”字段，条件为“sass”、“style”和“default”。这是今后包公开 Sass 入口点的推荐方法。
  ```json
  {
    "exports": {
      ".": {
        "sass": "styles/index.scss",
      },
      "./button.scss": {
        "sass": "styles/button.scss",
      },
      "./accordion.scss": {
        "sass": "styles/accordion.scss",
      }
    }
  }
  // or
  {
    "exports": {
      ".": {
        "sass": "styles/index.scss",
      },
      "./*.scss": {
        "sass": "styles/*.scss",
      },
    }
  }
  ```
- load css
```css
/* code.css */
code {
  padding: .25em;
  line-height: 0;
}
```
```scss
// style.scss
@use 'code';
```
- 与 @import 的区别：
  - @use 规则旨在取代旧的 @import 规则
  - @import 全局影响，@use 当前文件影响
    - @use 只使变量、函数和 mixin 在当前文件的范围内可用。它永远不会将它们添加到全局范围中。
    - 这样可以轻松找出 Sass 文件引用的每个名称的来源，并且意味着您可以使用较短的名称，而不会产生任何冲突风险。
  - @use 只加载每个文件一次。这可以确保您不会意外多次重复依赖项的 CSS。
  - @use 必须出现在文件的开头，并且不能嵌套在样式规则中。
  - 每条 @use 规则只能有一个网址。
  - @use 需要在其网址周围加上引号，即使使用缩进语法也是如此
### @forward
- 它使得跨多个文件组织 Sass 库成为可能，同时允许用户加载单个入口点文件。
- 规则
  - 该规则写作`@forward “<url>”`。它像 @use 一样在给定的 URL 加载模块，但它使已加载模块的公共成员可供模块的用户使用，就像它们是直接在模块中定义的一样。
  - 不过，这些成员在您的模块中不可用 - 如果您想要这些成员，您还需要编写一条 @use 规则。别担心，它只会加载模块一次！
  - 如果您确实在同一个文件中为同一模块同时编写了 @forward 和 @use，那么首先编写 @forward 总是一个好主意。
  - 这样，如果您的用户想要配置转发的模块，则先将配置应用到 @forward，再加载@use 且 无需任何配置。
- 与@use不同：
  - 用于将某个模块的内容转发到另一个模块。主要用于重新导出模块，供其他文件加载。
#### 案例
- 整合
```scss
// _variables.scss
$color-primary: blue;
$color-secondary: red;
// _mixins.scss
@mixin theme {
  background-color: $color-primary;
}
// index.scss
@forward 'variables';
@forward 'mixins';
// main.scss
@use 'index';
body {
  color: index.$color-primary;
  @include index.theme;
}
```
```scss
// src/_list.scss
@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
// bootstrap.scss
@forward "src/list";
// styles.scss
@use "bootstrap";
li {
  @include bootstrap.list-reset;
}
```
- @forward 可以选择为其转发的所有成员添加额外的前缀。
```scss
// src/_list.scss
@mixin reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
```
```scss
// bootstrap.scss
@forward "src/list" as list-*;
```
```scss
// styles.scss
@use "bootstrap";
li {
  @include bootstrap.list-reset;
}
```
- 控制可见性
```scss
// src/_list.scss
$horizontal-list-gap: 2em;
@mixin list-reset {
  margin: 0;
  padding: 0;
  list-style: none;
}
@mixin list-horizontal {
  @include list-reset;

  li {
    display: inline-block;
    margin: {
      left: -2px;
      right: $horizontal-list-gap;
    }
  }
}
```
```scss
// bootstrap.scss
@forward "src/list" hide list-reset, $horizontal-list-gap;
```
- 配置模块
```SCSS
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
```
```SCSS
// @forward 规则的配置可以在其配置中使用 !default 标志。
// 这允许模块更改上游样式表的默认值，同时仍然允许下游样式表覆盖它们。
// _opinionated.scss
@forward 'library' with (
  $black: #222 !default,
  $border-radius: 0.1rem !default
);
```
```SCSS
// style.scss
@use 'opinionated' with ($black: #333);
```
### @import
- scss 与 css @import不同
  - Sass 扩展了 CSS 的 @import 规则，能够导入 Sass 和 CSS 样式表，
  - 提供对 mixin、函数和变量的访问，并将多个样式表的 CSS 组合在一起。
  - 与普通 CSS 导入（要求浏览器在呈现页面时发出多个 HTTP 请求）不同，Sass 导入完全在编译期间处理。
  - Sass 导入与 CSS 导入具有相同的语法，只不过它们允许用逗号分隔多个导入，而不是要求每个导入都有自己的 @import。
- 废弃：
  - 从 Dart Sass 1.80.0 开始，@import 规则已被弃用，并将从 Dart Sass 3.0.0 的语言中删除。更喜欢 @use 规则。
  - 废弃原因：
    - @import 使所有变量、mixins 和函数都可以全局访问。这使得人们（或工具）很难判断任何内容的定义位置。
    - 由于一切都是全局的，图书馆必须为其所有成员添加前缀，以避免命名冲突。
    - @extend 规则也是全局的，这使得很难预测哪些样式规则将被扩展。
    - 每次 @imported 时都会执行每个样式表并发出其 CSS，这会增加编译时间并产生臃肿的输出。
    - 无法定义下游样式表无法访问的私有成员或占位符选择器。
    - 新的模块系统和@use规则解决了所有这些问题。
- 导入 纯css
  - 因为 @import 也在 CSS 中定义，所以 Sass 需要一种编译纯 CSS @imports 的方法，而无需在编译时尝试导入文件。
  - 为了实现这一目标，并确保 SCSS 尽可能成为 CSS 的超集，Sass 会将具有以下特征的任何 @import 编译为纯 CSS 导入：
    - 导入 URL 以 .css 结尾的位置。
    - 导入 URL 开头为 http:// 或 https:// 的位置。
    - 导入 URL 写为 url() 的位置。
    - 具有媒体查询的导入。
    ```scss
    @import "theme.css";
    @import "http://fonts.googleapis.com/css?family=Droid+Sans";
    @import url(theme);
    @import "landscape" screen and (orientation: landscape);
    ```
- 插值
  ```scss
  @mixin google-font($family) {
    @import url("http://fonts.googleapis.com/css?family=#{$family}");
  }
  @include google-font("Droid Sans");
  ```
- 导入和模块
  - 文件包含@use 和 @forward 区别
    - 包含 @use：当您导入包含 @use 规则的文件时，导入文件可以访问直接在该文件中定义的所有成员（甚至私有成员），但不能访问该文件已加载的模块中的任何成员。
    - 包含 @forward：但是，如果该文件包含 @forward 规则，则导入文件将有权访问转发的成员。这意味着您可以导入为与模块系统一起使用而编写的库。
    ```scss
    // _base.scss
    $black: #000 !default;
    // _use.scss
    @use "base";
    // test1.scss
    @import "use";
    // 不能访问 use.$black

    ```
    ```scss
    // _base.scss
    $black: #000 !default;
    // _forward.scss
    @forward "base";
    // test2.scss
    @import "forward";
    // 可以访问 forward.$black
    ```
  - 同一个scss文件（内部中可能带有@use规则）
    - 在多处@import,每一处都会包含在生成的样式表
    - 在多处@use，则不会存在这个情况
  - 兼容
    - 对 @use 有意义的 API 可能对 @import 没有意义，@use 默认为所有成员添加命名空间，以便您可以安全地使用短名称，但 @import 则不然，因此您可能需要更长的名称
    - 使用新的模块系统@use，您现有的基于 @import 的用户将会崩溃。
    - 为了使这更容易，Sass 还支持仅导入文件。如果您将文件命名为 `<name>.import.scss`，则只会为导入加载该文件
    ```scss
    // _reset.scss
    // Module system users write `@include reset.list()`.
    @mixin list() {
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }
    }
    ```
    ```scss
    // _reset.import.scss 专门支持旧@import
    // Legacy import users can keep writing `@include reset-list()`.
    @forward "reset" as reset-*;
    ```
  - 全局配置
    - 通过在首先加载该模块的 @import 之前定义全局变量来配置通过 @import 加载的模块
    ```scss
    // _library.scss
    $color: blue !default;
    a {
      color: $color;
    }
    // _library.import.scss
    @forward 'library' as lib-*;
    // style.sass
    $lib-color: green;
    @import "library";
    ```
    ```css
    a {
      color: green;
    }
    ```
- 总结：
  - @import
    - 将被导入文件的内容直接插入到调用点，导致样式的全局性。
    - 多次导入同一文件会重复其内容。
    - 不支持模块化，容易导致命名冲突。
    - 会在编译时加载文件，效率较低。
  - @use 的特点：
    - 提供命名空间隔离，避免命名冲突。
    - 加载的内容需要通过命名空间访问。
    - 文件只加载一次，无论在何处调用。
    - 支持配置共享变量和函数的显式定义，模块化设计更强。
    - 更高效，推荐用于新项目。

参考：
- [@at-root](https://sass-lang.com/documentation/at-rules/at-root/)
- [@import](https://sass-lang.com/documentation/at-rules/import/)
