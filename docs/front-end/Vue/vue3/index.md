---
outline: deep
---
# vue3
## TS 与 组合式API
### props
- 过渡方案
```vue
// 运行时声明
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})
props.foo // string
props.bar // number | undefined
</script>
```
```vue
<!-- 基于类型的声明 -->
<!-- 1 -->
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
<!-- 2 -->
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}
const props = defineProps<Props>()
</script>
<!-- 3 -->
<script setup lang="ts">
import type { Props } from './foo'
const props = defineProps<Props>()
</script>
```
- 最终方案
```ts
// 3.5+ 
// 解决：失去了为 props 声明默认值的能力
interface Props {
  msg?: string
  labels?: string[]
}
const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```
```ts
// 在 3.4 及更低版本
// 使用 withDefaults 编译器宏
interface Props {
  msg?: string
  labels?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```
- 复杂方案
```vue
<!-- 运行时声明 -->
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}
const props = defineProps<{
  book: Book
}>()
</script>
```
```vue
<!-- 基于类型的声明 -->
<!-- 1 -->
<script setup lang="ts">
import type { PropType } from 'vue'
const props = defineProps({
  book: Object as PropType<Book>
})
// 2
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
</script>
```
### emits
```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])
// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```
- 最终方案
```vue
<script setup lang="ts">
// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```
### reactive
```ts
import { reactive } from 'vue'
interface Book {
  title: string
  year?: number
}
const book: Book = reactive({ title: 'Vue 3 指引' })
```
### event
```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```
### provide / inject
- InjectionKey
```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'
const key = Symbol() as InjectionKey<string>
provide(key, 'foo') // 若提供的是非字符串值会导致错误
const foo = inject(key) // foo 的类型：string | undefined
```
- 参数
```ts
// 注入一个值，若为空则使用提供的默认值
const bar = inject('path', '/default-path')
// 注入一个值，若为空则使用提供的函数类型的默认值
const fn = inject('function', () => {})
// 注入一个值，若为空则使用提供的工厂函数
const baz = inject('factory', () => new ExpensiveObject(), true)
```
### 模板引用
```ts
// Vue 3.5 和 @vue/language-tools 2.1 
const el = useTemplateRef<HTMLInputElement>(null) 
```
```vue
// 3.5 前的用法
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const el = ref<HTMLInputElement | null>(null)
onMounted(() => {
  el.value?.focus()
})
</script>
<template>
  <input ref="el" />
</template>
```
### 组件模板引入
```vue
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'
type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>
const compRef = useTemplateRef<FooType | BarType>('comp')
</script>
<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```
参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-provide-inject


## \<script setup\>
#### defineModel
- 第一个参数：如果第一个参数是一个字符串字面量，它将被用作 prop 名称；
否则，prop 名称将默认为 "modelValue"
```js
// 声明 "modelValue" prop，由父组件通过 v-model 使用
const model = defineModel()
// 或者：声明带选项的 "modelValue" prop
const model = defineModel({ type: String })
// 在被修改时，触发 "update:modelValue" 事件
model.value = "hello"

```
```js
// 子组件
// 声明 "count" prop，由父组件通过 v-model:count 使用
const count = defineModel("count")
// 或者：声明带选项的 "count" prop
const count = defineModel("count", { type: Number, default: 0 })

function inc() {
  // 在被修改时，触发 "update:count" 事件
  count.value++
}
// 父组件
const myRef = ref()
<Child v-model:count="myRef"></Child>
```
- 默认值
```js
// 子组件：
const model = defineModel({ default: 1 })
// 父组件
const myRef = ref()
<Child v-model="myRef"></Child>
// => 父组件的 myRef 是 undefined，而子组件的 model 是 1：
```
- 修饰符
```js
const [modelValue, modelModifiers] = defineModel({
  // get() 省略了，因为这里不需要它
  set(value) {
    // 如果使用了 .trim 修饰符，则返回裁剪过后的值
    if (modelModifiers.trim) {
      return value.trim()
    }
    // 否则，原样返回
    return value
  }
})
```
- TS
  ```ts
  const modelValue = defineModel<string>()
  //    ^? Ref<string | undefined>
  // 用带有选项的默认 model，设置 required 去掉了可能的 undefined 值
  const modelValue = defineModel<string>({ required: true })
  //    ^? Ref<string>
  const [modelValue, modifiers] = defineModel<string, "trim" | "uppercase">()
  //                 ^? Record<'trim' | 'uppercase', true | undefined>
  ```
#### defineExpose
```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```
