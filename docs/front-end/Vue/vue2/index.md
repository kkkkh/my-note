---
outline: deep
---
## vue2
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
