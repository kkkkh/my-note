---
outline: deep
---
## vue2
### 1、v-model和.sync
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

### 2、event 
#### .native
- 1、在一个组件的根元素上直接监听一个原生事件，使用.native修饰符
```vue
<!-- 父组件 -->
<base-input v-on:focus.native="onFocus"></base-input>
```
- 2、focus事件绑定到了label元素上
```vue
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
