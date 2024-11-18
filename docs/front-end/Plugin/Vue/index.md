# vue Plugin
## component
### vxe-table
- 本地数据，简单筛查：https://vxetable.cn/v3.8/#/table/base/filter
- 本地数据，复杂筛选：https://vxetable.cn/v3.8/#/table/advanced/manualFilter
  - 手动筛选：调用 setFilter 和 updateData 方法来处理复杂场景
  - 修改筛选条件
  - 展示、关闭筛选面板
  - 清除所有筛选条件
- 设置筛选渲染：https://vxetable.cn/v3.8/#/table/renderer/filter
- 本地数据，分页：https://vxetable.cn/v3.8/#/table/advanced/page
- 数据代理，分页：https://vxetable.cn/v3.8/#/table/grid/pageProxy

## api
### vue-request
- useRequest
  - run：手动触发，会自动捕获异常，通过 options.onError 处理
  - runAsync：与 run 用法一致。但返回的是 Promise，需要自行处理异常
  - refresh：使用上一次的 params 重新调用 run
  - refreshAsync：使用上一次的 params 重新调用 runAsync
  - ready 只有当 ready 为 true 时，才会发起请求
  - refreshDeps：当 refreshDeps 里面的内容发生变化时，如果没有设置 refreshDepsAction, 就会触发 refresh 的重新执行。
  - refreshDepsAction：当 refreshDeps 里面的内容发生变化时，会被调用
- usePagination
```html
<n-data-table
  :row-key="(row) => row.id"
  remote
  :loading="loading"
  :columns="columns"
  :data="dataList"
  :pagination="{
    page: current,
    pageSize,
    itemCount: total,
    onUpdatePage: changeCurrent,
    onUpdatePageSize: changePageSize,
    pageSizes: [10, 20, 50, 100],
    showSizePicker: true,
  }"
  :max-height="500"
/>
```
```js
import { usePagination, useRequest } from 'vue-request'
const dataList = ref([])
const {
  current,
  loading,
  pageSize,
  changeCurrent,
  changePageSize,
  run: runGetData,
  total,
} = usePagination(
  (params: Record<'current' | 'size', number>) =>
    getList({
      current: params.current,
      size: params.size,
      param: { boxNo: boxNoModel.value! },
    }),
  {
    defaultParams: [{ current: 1, size: 10 }],
    ready: computed(() => !!boxNoModel.value),
    refreshDeps: () => boxNoModel.value,
    refreshDepsAction: () => {
      runGetData({
        current: 1,
        size: pageSize.value,
      })
    },
    pagination: {
      currentKey: 'current',
      pageSizeKey: 'size',
      totalKey: 'data.total',
    },
    onSuccess(res) {
      dataList.value = res.data.records
    },
  },
)
```
### vueuse
```vue
<script setup>
import { useLocalStorage, useMouse, usePreferredDark } from '@vueuse/core'
// tracks mouse position
const { x, y } = useMouse()

// is user prefers dark theme
const isDark = usePreferredDark()

// persist state in localStorage
const store = useLocalStorage(
  'my-storage',
  {
    name: 'Apple',
    color: 'red',
  },
)
</script>
```
### mitt
- mitt 支持 vue3 (事件总线)
- EventBus 支持 vue2（创建一个Vue实例充当eventBus）
- [参考](https://juejin.cn/post/6973106775755063333)

## vite
### unplugin-vue-components 
- On-demand components auto importing for Vue.
- 按需加载组件
```js
// vite.config.js
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'unplugin-vue-components/resolvers'
// your plugin installation
Components({
  resolvers: [
    AntDesignVueResolver(),
    ElementPlusResolver(),
    VantResolver(),
  ],
})
```
### unplugin-icons
- 按需加载图标
```js
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
export default {
  plugins: [
    Components({
      resolvers: [
        IconsResolver()
      ],
    }),
    Icons(),
  ],
}
```

# my Lib

## [Render-table](./render-table/index.md)
### 前端计算table => filter/sort/page
- 外层触发计算
- 内部筛选计算
- 内部排序计算
