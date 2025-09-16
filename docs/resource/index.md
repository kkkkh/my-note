- electron 
- react
- ts
- 常见算法
- ethers
- geekhour 后端体系纳入





整体：
深入理解MVVM框架，理解源码，深入理解react渲染机制、生命周期、hooks组件



整合：
1、加一个reat项目：高阶组件、常用hooks背熟
https://github.com/brillout/awesome-react-components
eslint

2、将之前的项目进行整合
vue：体现不出技术的删掉，增加技术难度、将对应场景的技术搞通过
状态管理
性能优化：vite:rollup打包优化

3、electron 也需要加码整合
再增加1-2的强度

4、monorep的管理：pnpm 和 workspace 引入

熟悉 Monorepo 项目管理，熟练使用 pnpm workspaces 进行依赖管理和代码共享。
精通 Monorepo 架构，能够使用 pnpm workspaces 有效管理多项目依赖关系，提升开发效率和代码复用率。
具备 Monorepo 项目实践经验，熟练使用 pnpm workspaces 管理项目依赖，实现代码共享和统一构建，解决多项目协同开发中的依赖冲突和版本管理问题。
在 [项目名称] 项目中，采用 Monorepo 架构，使用 pnpm workspaces 管理多个 React 组件库和应用，实现了高效的代码共享和统一的版本管理。
熟悉 Monorepo 架构，能够使用 pnpm workspaces 解决多项目依赖管理和代码共享问题，提升团队协作效率和代码质量。


vite 工程化：

问题： 传统构建工具（如 Webpack）在大型项目中构建速度慢，HMR (热模块替换) 延迟高，严重影响开发效率。
解决方案： 引入 Vite 作为构建工具，利用其基于 ES modules 的按需编译和原生 ESM 的 HMR，显著提升了构建速度和 HMR 响应速度。

问题： 项目依赖关系复杂，构建配置繁琐，难以维护。
解决方案： 使用 Vite 简化了构建配置，利用其开箱即用的 TypeScript 支持和插件机制，实现了更清晰、更易维护的构建流程。

问题： 项目打包体积过大，影响页面加载速度。
解决方案： 通过 Vite 的 Rollup 构建优化、代码分割 (Code Splitting) 和 Tree Shaking 等功能，有效减小了打包体积，提升了页面加载速度。

问题： 项目需要支持多种环境（开发、测试、生产），不同环境的配置差异大，管理困难。
解决方案： 利用 Vite 的环境变量和条件编译功能，实现了不同环境的灵活配置，简化了环境管理。


https://developer.mozilla.org/zh-CN/docs/Web/API/Event/Event
https://chatgpt.com/c/68b50998-95cc-8328-8ab9-4e3829fde8f6


play vue2 与 mynote 整合 √
vue3 指令加入 √
play vue3 与 mynote 整合 √
按需加载 √
histoire √

https://devv.ai/zh/search/eqkl4p4badxc vue-demi postinstall


play 
- 需要将页面常用功能迁移：右击、验证控制等
- electron的核心功能
- 开源库的使用代码
- play electron 与 mynote 整合

nodejs stream 继续整理
https://chatgpt.com/c/68b952c8-9850-832d-a1da-2a26c691234a
大文件的上传 流式上传

play vue2 插件 i18n + scanner i18n 插件 整理
微前端 vue2+vue3+react
搭建网站
vxe-table 前端渲染



2、音频模式：我还想给文字，加一个展示效果，第一种效果比如说的一句话，往上走，新说的话，展示在最下方；
3、视频模式1：类似做的一些视频，说过一句话，文字展示出来，然后90度旋转，展示新的一句话；
4、视屏模式2：根据音频中的对话，生成动画人物，然后让视频与音频对应上，这个应该是比较复杂的，不是一个步骤生成，可以帮我梳理下实现思路，要满足以下1、要生成音频中人物，2、要对人物中场景描述内容，生成对应的动画场景，比如场景是我们家门口有两颗大树，那么动画中就展示一个房子，旁边放两个大树,帮我找找这种实现的比较成熟的案例；
总之帮我问梳理一下，给出建议和实现思路，要比较成熟的，不想在这个耗费太多试错的时间
