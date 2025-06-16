---
outline: deep
---
<script setup>
import PropsIndex from '@play/vue/src/components/Props/Index.vue'
</script>

# vue2
## 应用
### v-model和.sync
####  v-model
```html
<input v-model="searchText">
相当于
<input v-bind:value="searchText" v-on:input="searchText = $event">
```
#### 组件绑定 v-model
```html
<custom-input v-model="searchText"></custom-input>
相当于
<custom-input v-bind:value="searchText" v-on:input="searchText = $event"></custom-input>
```
```js
Vue.component("custom-input", {
    // 默认
    // model: {
    //     prop: "value",
    //     event: "input",
    // },
    props: ["value"],
    template: `
        <input
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        >
    `,
});
```
#### 组件绑定 type="checkbox"
```html
<base-checkbox v-model="lovingVue"></base-checkbox>;
相当于
<base-checkbox v-bind:checked="lovingVue" v-on:change="lovingVue = $event"></base-checkbox>;
```
```js
Vue.component("base-checkbox", {
    model: {
        //重新定义了v-model
        prop: "checked",
        event: "change",
    },
    props: {
        checked: Boolean,
        //来自v-bind:checked="lovingVue"
    },
    template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `,
});
```
#### .sync 修饰符
- 是在 v-model 基础上的升级：
- v-model 为\$emit('input', $event.target.value)
- async 为 this.\$emit('update:title',value)
```html
<text-document v-bind:title.sync="doc.title"> </text-document>
相当于
<text-document :title.sync="doc.title"> </text-document>
相当于
<text-document v-bind:title="doc.title" v-on:update:title="doc.title = $event"></text-document>
```
```js
this.$emit("update:title", value);
```
### event
#### .native
- 1、在一个组件的根元素上直接监听一个原生事件，使用.native修饰符
```vue
<!-- 父组件 -->
<base-input v-on:focus.native="onFocus"></base-input>
```
- 2、focus事件绑定到了label元素上
```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```
- 3、focus不会触发，如果想要focus生效，可以将focus事件绑定到input上
```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```
- 4、如果绑定的是click.native/keyup.native事件，则会触发，对 \<input>click和keyup事件，会冒泡到\<label>上
```vue
<base-input v-on:keyup.native="onKeyup" v-on:click.native="onKeyup"></base-input>
```
### props
#### vue2
- vitepress 不支持vue2组件的展示
<!-- <PropsIndexVue2 /> -->

  <<< @/submodule/play/packages/vue2/src/components/Props/Index.vue

- 直接修改props，响应式更新父组件

  <<< @/submodule/play/packages/vue2/src/components/Props/Child.vue

- watch 监听 props 变化，更新localForm，输入更新，调用emit update 更新父组件

  <<< @/submodule/play/packages/vue2/src/components/Props/Child2.vue

- computed formValue get中接受 props form，set中捕捉不到，watch formValue变化，调用emit update 更新父组件

  <<< @/submodule/play/packages/vue2/src/components/Props/Child3.vue

- computed 单个form的属性，set可以捕捉到

  <<< @/submodule/play/packages/vue2/src/components/Props/Child4.vue

#### vue3

- 代码展示

  <PropsIndex />

  <<< @/submodule/play/packages/vue/src/components/Props/Index.vue

  <<< @/submodule/play/packages/vue/src/components/Props/Child.vue

## 模板

### watch
```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: 'someMethod',
      immediate: true
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```
### 渲染函数 & JSX
```js
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```
### 自定义指令
```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```
```html
<input v-focus>
```
#### 钩子函数
一个指令定义对象可以提供如下几个钩子函数 (均为可选)：
- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind：只调用一次，指令与元素解绑时调用。

#### 钩子函数参数
指令钩子函数会被传入以下参数：
- el：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含以下 property：
  - name：指令名，不包括 v- 前缀。
  - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

#### 样例
```html
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
```
```js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})
new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```
<div>
name: "demo"<br>value: "hello!"<br>expression: "message"<br>argument: "foo"<br>modifiers: {"a":true,"b":true}<br>vnode keys: tag, data, children, text, elm, ns, context, fnContext, fnOptions, fnScopeId, key, componentOptions, componentInstance, parent, raw, isStatic, isRootInsert, isComment, isCloned, isOnce, asyncFactory, asyncMeta, isAsyncPlaceholder
</div>

## 指令 以及 属性
### v-show和v-if &I
- 对比
  - v-if 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。
  - v-if 也是惰性的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。
  - 相比之下，v-show 简单许多，元素无论初始条件如何，始终会被渲染，只有 CSS display 属性会被切换。
- 场景
  - 如果需要频繁切换，则使用 v-show 较好；
  - 如果在运行时绑定条件很少改变，则 v-if 会更合适。
### data &I
- data 是函数
  - 保证每个组件实例都有自己独立的数据副本（组件复用）
  - 如果 data 是一个对象，那么所有组件实例将会共享同一个数据对象，这会导致状态污染和不可预测的行为（避免数据共享）
### nextTick &I
- 核心原理：异步更新队列
  - 数据变更： 当你修改 Vue 组件中的响应式数据时，Vue 会侦听到这些变化。
  - 更新队列： Vue 不会立即更新 DOM，而是将这些更新放入一个队列中。
  - 批量更新： 在同一个事件循环中，无论你修改了多少次数据，Vue 只会执行一次 DOM 更新。它会将队列中的所有更新合并，然后一次性应用到 DOM 上。
  - nextTick： nextTick 允许你等待这个队列中的所有更新完成后再执行你的代码。
- nextTick 的作用：
  - 访问更新后的 DOM： 由于 Vue 的异步更新机制，如果你在数据修改后立即访问 DOM，可能无法获取到最新的 DOM 状态 。nextTick 确保你的代码在 DOM 更新完成后执行，从而可以访问到最新的 DOM 状态 。
  - 等待所有组件更新： nextTick 确保不仅当前组件的 DOM 更新完成，而且所有子组件的 DOM 也都更新完成。
  nextTick 的实现：
- Vue 的 nextTick 内部使用了以下策略，按照优先级顺序：
  - Promise.then： 如果浏览器支持 Promise，则使用 Promise.then。
  - MutationObserver： 如果浏览器支持 MutationObserver，则使用 MutationObserver。MutationObserver 可以在 DOM 发生变化时异步执行回调函数。
  - setTimeout： 如果以上都不支持，则使用 setTimeout(callback, 0)。
  - 这些策略的共同目标是：将回调函数放入事件循环的下一个 "tick" 中执行，确保在 DOM 更新完成后执行。
### 优化 &I
- v-if 和 v-show
  - `v-if` 组件销毁/重建
  - `v-show` 组件隐藏（切换 CSS `display`）
  - 一般情况下使用 `v-if` 即可，普通组件的销毁、渲染不会造成性能问题
  - 如果组件创建时需要大量计算，或者大量渲染（如复杂的编辑器、表单、地图等），可以考虑 `v-show`
- v-for 使用 key
  - `key` 可以优化内部的 diff 算法。注意，遍历数组时 `key` 不要使用 `index` 。
- computed 缓存
  - `computed` 可以缓存计算结果，`data` 不变则缓存不失效。
- keep-alive
  - `<keep-alive>` 可以缓存子组件，只创建一次。通过 `activated` 和 `deactivated` 生命周期监听是否显示状态。
  - 局部频繁切换的组件，如 tabs
  - 不可乱用 `<keep-alive>` ，缓存太多会占用大量内存，而且出问题不好 debug
- 异步组件
  - 对于体积大的组件（如编辑器、表单、地图等）可以使用异步组件
  - 拆包，需要时异步加载，不需要时不加载
  - 减少 main 包的体积，页面首次加载更快
  - vue3 使用 `defineAsyncComponent` 加载异步组件
- 路由懒加载
  - 对于一些补偿访问的路由，或者组件提交比较大的路由，可以使用路由懒加载。
- SSR
  - SSR 让网页访问速度更快，对 SEO 友好。
  - 但 SSR 使用和调试成本高，不可乱用。例如，一个低代码项目（在线制作 H5 网页），toB 部分不可用 SSR ， toC 部分适合用 SSR 。
- 其他问题：
- 全局事件、自定义事件要在组件销毁时解除绑定
  - 内存泄漏风险
  - 全局事件（如 `window.resize`）不解除，则会继续监听，而且组件再次创建时会重复绑定
- Vue2.x 中，无法监听 data 属性的新增和删除，以及数组的部分修改 —— Vue3 不会有这个问题
  - 新增 data 属性，需要用 `Vue.set`
  - 删除 data 属性，需要用 `Vue.delete`
  - 修改数组某一元素，不能 `arr[index] = value` ，要使用 `arr.splice` API 方式
- Vue 不能检测以下数组的变动：
  - 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
  - 当你修改数组的长度时，例如：vm.items.length = newLength
  ```js
  var vm = new Vue({
    data: {
      items: ['a', 'b', 'c']
    }
  })
  vm.items[1] = 'x' // 不是响应性的
  vm.items.length = 2 // 不是响应性的
  ```
  - 两种方式都可以实现和 `vm.items[indexOfItem] = newValue` 相同的效果
  ```js
  // Vue.set
  Vue.set(vm.items, indexOfItem, newValue)
  // Array.prototype.splice
  vm.items.splice(indexOfItem, 1, newValue)
  ```
  - 解决第二类问题，你可以使用 splice：
  ```js
  vm.items.splice(newLength)
  ```
- scroll
  - 路由切换时，页面会 scroll 到顶部。例如，在一个新闻列表页下滑到一定位置，点击进入详情页，在返回列表页，此时会 scroll 到顶部，并重新渲染列表页。所有的 SPA 都会有这个问题，并不仅仅是 Vue 。
  - 在列表页缓存数据和 `scrollTop`
  - 返回列表页时（用 Vue-router [导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)，判断 `from`），使用缓存数据渲染页面，然后 `scrollTo(scrollTop)`
### 虚拟dom &I
- 虚拟 DOM 是一个存在于内存中的 JavaScript 对象，它是真实 DOM 的抽象
- 最终需要更新真实 DOM，当真实 DOM 发生变化时，浏览器仍然需要进行重排和重绘
- 虚拟dom优势
  - 减少直接 DOM 操作：新旧虚拟 DOM 树的差异，通过 diff 算法计算出需要更新的部分，然后更新真实 DOM
  - 批量更新：虚拟 DOM 允许将多次 DOM 修改合并为一次更新
## vue-router
### 模式
- 模式
  - createWebHashHistory
  - createWebHistory
  - createMemoryHistory
- 区别
  - hash - 使用 url hash 变化记录路由地址
  - history - 使用 H5 history API 来改 url 记录路由地址
  - abstract - 不修改 url ，路由地址在内存中，**但页面刷新会重新回到首页**。
#### hash
- hash 的特点
  - 会触发页面跳转，可使用浏览器的“后退” “前进”
  - 但不会刷新页面，支持 SPA 必须的特性
  - hash 不会被提交到 server 端（因此刷新页面也会命中当前页面，让前端根据 hash 处理路由）
  - url 中的 hash ，是不会发送给 server 端的。前端 `onhashchange` 拿到自行处理。
  ```js
  // 页面初次加载，获取 hash
  document.addEventListener('DOMContentLoaded', () => {
      console.log('hash', location.hash)
  })
  // hash 变化，包括：
  // a. JS 修改 url
  // b. 手动修改 url 的 hash
  // c. 浏览器前进、后退
  window.onhashchange = (event) => {
      console.log('old url', event.oldURL)
      console.log('new url', event.newURL)
      console.log('hash', location.hash)
  }
  ```
  ```js
  // http://127.0.0.1:8881/hash.html?a=100&b=20#/aaa/bbb
  location.protocol // 'http:'
  location.hostname // '127.0.0.1'
  location.host // '127.0.0.1:8881'
  location.port // '8881'
  location.pathname // '/hash.html'
  location.search // '?a=100&b=20'
  location.hash // '#/aaa/bbb'
  ```
#### H5 history API

- 调用`history.pushState` `window.onpopstate`
- 问题：
  - 由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 https://example.com/user/id，就会得到一个 404 错误。这就尴尬了。
  - 要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 index.html 相同的页面（首页）。
  - [参考](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90)
- 分析
  - 按照 url 规范，不同的 url 对应不同的资源，例如：
    - `https://github.com/` server 返回首页
    - `https://github.com/username/` server 返回用户页
    - `https://github.com/username/project1/` server 返回项目页
  - 但是用了 SPA 的前端路由，就改变了这一规则，假如 github 用了的话：
    - `https://github.com/` server 返回首页
    - `https://github.com/username/` server 返回首页，前端路由跳转到用户页
    - `https://github.com/username/project1/` server 返回首页，前端路由跳转到项目页
  - 所以，从开发者的实现角度来看，前端路由是一个违反规则的形式。
  - 但是从不关心后端，只关心前端页面的用户，或者浏览器来看，更喜欢 `pushState` 这种方式。
### 钩子函数
#### activated/mounted 触发
触发四种情况：
- this.$router.push
  - 如果组件不存在，调用activated 和 mounted
  - 如果组件存在，调用activated
- router-link（组件存在）
  - 调用activated
- this.$router.replace（在当前路由，替换为其他路由，再替换回来，组件不存在）
  - 调用mounted
- 页面全量刷新
  - 调用mounted
总结：（只要涉及到这个页面）
  - 缓存的：keep-alive、已加载的：activated
  - 第一次加载：mounted
