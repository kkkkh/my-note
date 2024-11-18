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
<!-- 基于类型的声明 -->
```
```vue
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

