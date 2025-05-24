---
outline: deep
---
# Vue Plugin
## component
### vxe-table
#### 文档
- 本地数据，简单筛查：https://vxetable.cn/v3.8/#/table/base/filter
- 本地数据，复杂筛选：https://vxetable.cn/v3.8/#/table/advanced/manualFilter
  - 手动筛选：调用 setFilter 和 updateData 方法来处理复杂场景
  - 修改筛选条件
  - 展示、关闭筛选面板
  - 清除所有筛选条件
- 设置筛选渲染：https://vxetable.cn/v3.8/#/table/renderer/filter
- 本地数据，分页：https://vxetable.cn/v3.8/#/table/advanced/page
- 数据代理，分页：https://vxetable.cn/v3.8/#/table/grid/pageProxy

- 常用方法/事件
```js
<vxe
  @checkbox-change="checkboxChange"
  @checkbox-all="checkboxChange"
></vxe>
// 设置选中
setCheckboxRow(rows, checked)
setAllCheckboxRow(checked)
// 清除选中
clearCheckboxRow()
clearCheckboxReserve()
// 获取
getCheckboxRecords()
getCheckboxReserveRecords()
```

- 保持勾选记录
```js
<vxe
  :row-config="{
    keyField: 'id',
  }"
  :checkbox-config="{ reserve: true }"
></vxe>
```
#### [Render-table](./render-table/index.md)
- 前端计算table => filter/sort/page
  - 外层触发计算
  - 内部筛选计算
  - 内部排序计算

- 关于复选数据重复的问题：
  - 数据通过查询，增量累加，不存在单独减少操作，此时不需要考虑复选数据更新；
  - 数据执行操作成功，会对数据重置或删除，此时要更新复选的数据，设置为空；
#### Pack-table
```html
<PackRichTable
  ref="packRichTable"
  :filters="filters"
  :immediate="false"
  is-query-vo
  :load="load"
  :query-form="form"
  :table-id="tableId"
  @checkbox-change="selectChangeEvent"
>
  <template #headerLeftStart></template>
  <template #operate="{ row }"></template>
</PackRichTable>
```
```js{1-3,5-6,9-10,14-16,20}
import { TableIdMap } from '@/const/index'
import { tablePack } from '@/mixins/table-pack'
import PackRichTable from '@/views/common/PackRichTable.vue'
export default {
  components: { PackRichTable },
  mixins: [tablePack],
  data(){
    return {
      load: queryPageV2,
      filters: {},
    }
  },
  computed:{
    tableId() {
      return TableIdMap.xx.xx
    },
  },
  methods:{
    async handleExport() {
      const params = this.$refs.packRichTable.mergeParams()
    },
  }
}
```
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
### eventBus
- EventBus 支持 vue2（创建一个Vue实例充当eventBus）
- 适用：父组件想要调用很深层级子组件的api
```js
import Vue from 'vue'
Vue.prototype.$EventBus = new Vue()
```
```js
// 在子组件
this.$EventBus.$on('eventName1', (val) => {
  
})
this.$EventBus.$on('eventName2', (callback) => {
  // 调取函数,并传入
  callback(vals)
})
```
```js
// 父组件
methods:{
  getSome1(){
    this.$EventBus.$emit('eventName1', val)
  },
  getSome2(){
    return new Promise((resolve) => {
      // 传入函数
      this.$EventBus.$emit('eventName2', (vals) => {
        // 接到返回值
        // 利用promise resolve 返回
        resolve(vals)
      })
    })
  }
}
```
### mitt
- mitt 支持 vue3 (事件总线)
- [参考](https://juejin.cn/post/6973106775755063333)

