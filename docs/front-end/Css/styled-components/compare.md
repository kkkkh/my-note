| 特性         | CSS Modules                  | Styled Components            |
|--------------|------------------------------|------------------------------|
| 样式定义     | 单独 CSS 文件 .module.css    | JavaScript 模板字符串        |
| 作用域       | 默认局部作用域               | 自动 scoped，内联样式        |
| 动态样式支持 | 不支持，需通过类名切换实现  | 直接使用 JS 变量和条件       |
| 书写习惯     | 纯 CSS                       | CSS-in-JS                    |
| 依赖         | 仅构建工具支持               | 需安装 styled-components 库  |
| 体积         | 无额外运行时依赖             | 有运行时开销                 |
