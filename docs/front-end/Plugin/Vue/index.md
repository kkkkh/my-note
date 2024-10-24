# vue Plugin
## vxe-table
- 本地数据，简单筛查：https://vxetable.cn/v3.8/#/table/base/filter
- 本地数据，复杂筛选：https://vxetable.cn/v3.8/#/table/advanced/manualFilter
  - 手动筛选：调用 setFilter 和 updateData 方法来处理复杂场景
  - 修改筛选条件
  - 展示、关闭筛选面板
  - 清除所有筛选条件
- 设置筛选渲染：https://vxetable.cn/v3.8/#/table/renderer/filter
- 本地数据，分页：https://vxetable.cn/v3.8/#/table/advanced/page
- 数据代理，分页：https://vxetable.cn/v3.8/#/table/grid/pageProxy
## vue-request
### useRequest
- run：手动触发，会自动捕获异常，通过 options.onError 处理
- runAsync：与 run 用法一致。但返回的是 Promise，需要自行处理异常
- refresh：使用上一次的 params 重新调用 run
- refreshAsync：使用上一次的 params 重新调用 runAsync
- ready 只有当 ready 为 true 时，才会发起请求
- refreshDeps：当 refreshDeps 里面的内容发生变化时，如果没有设置 refreshDepsAction, 就会触发 refresh 的重新执行。
- refreshDepsAction：当 refreshDeps 里面的内容发生变化时，会被调用
### usePagination
```js
import { usePagination, useRequest } from 'vue-request'
const {
  current,
  loading,
  pageSize,
  run: runGetPackageScanDetail,
  total,
} = usePagination(
  (params: Record<'current' | 'size', number>) =>
    getPackageScanDetailList({
      current: params.current,
      size: params.size,
      descs: 'createdTime',
      param: { boxNo: boxNoModel.value! },
    }),
  {
    ready: computed(() => !!boxNoModel.value),
    refreshDeps: () => boxNoModel.value,
    refreshDepsAction: () => {
      runGetPackageScanDetail({
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
      boxScanDataRef.value = res.data.records
    },
  },
)
```
## Render-table
### 前端计算table => filter/sort/page
- 外层触发计算
```vue
<script>
import { cloneDeep } from 'lodash'
import { filterValue } from '../table-filter'
import { sortValue } from '../table-sort'
export default {
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 20,
      },
      filterList: [],
      sortList: [],
    }
  },
  computed: {
    currentData() {
      // 分页计算
      return this.sortData.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      )
    },
    sortData() {
      // 2-排序
      const data = this.fileterData
      if (this.sortList.length > 0) {
        data.sort((a, b) => {
          // 排序条件多条、
          // 有!==0则大小已定
          // 有===0则进行下一个条件比较
          // 参考后端排序算法
          for (const list of this.sortList) {
            const res = sortValue(a, b, list)
            if (res !== 0) {
              return res
            }
          }
          return 0
        })
      }
      return data
    },
    fileterData() {
      // 1-过滤筛选
      let data = []
      data =
        this.filterList.length > 0
          ? this.filterList.reduce((pre, next) => {
            // 筛选是且关系，reduce逐层过滤
              return pre.filter((item) =>
              // 第一参数是值，第二参数是筛选条件
              // 常用过滤就是包含关系/等于
                filterValue(item[next.field], next.datas ? next.datas[0] : next)
              )
            }, this.allData)
          : this.allData
      return data
    },
  },
}
</script>
```
参考：[render-table](../render-table/index.vue)
- 内部筛选计算
```js
// ./table-filter
export function filterStringValue(n, filterData) {
  switch (filterData.condition) {
    case 'eq': {
      return (!isEmpty(n) && String(filterData.value) === String(n)) ?? false
    }
    case 'include': {
      return !isEmpty(n) && String(n).includes(String(filterData.value))
    }
    case 'isEmpty': {
      return isEmpty(n)
    }
    case 'isNotEmpty': {
      return !isEmpty(n)
    }
    case 'in': {
      return !isEmpty(n) && filterData.values.includes(String(n))
    }
    default:
  }
  return false
}
export function filterNumberValue(n, filterData) {
  switch (filterData.condition) {
    case 'eq': {
      return filterData.values?.some((item) => isNumberEquel(n, item)) ?? false
    }
    case 'lt': {
      return isNumberLessThan(n, filterData.value)
    }
    case 'le': {
      return isNumberLessThanOrEqual(n, filterData.value)
    }
    case 'gt': {
      return isNumberGreaterThan(filterData.value, n)
    }
    case 'ge': {
      return isNumberGreaterThanOrEqual(filterData.value, n)
    }
    case 'between': {
      const [start, end] = filterData.values ?? []
      return isNumberBetween(n, start, end, '(]')
    }
    case 'isEmpty': {
      return isEmpty(n)
    }
    case 'isNotEmpty': {
      return !isEmpty(n)
    }
    default:
  }
  return false
}
export function filterDateValue(n, filterData, valueType = 'date') {
  const valueFormat = getDefaultValueFormat(filterData.valueType ?? valueType)
  switch (filterData.condition) {
    case 'eq': {
      return filterData.values?.some((item) => isDateEquel(n, item, valueFormat)) ?? false
    }
    case 'lt': {
      return isDateBefore(n, filterData.value, valueFormat)
    }
    case 'le': {
      return isDateBeforeOrEqual(n, filterData.value, valueFormat)
    }
    case 'gt': {
      return isDateAfter(n, filterData.value, valueFormat)
    }
    case 'ge': {
      return isDateAfterOrEqual(n, filterData.value, valueFormat)
    }
    case 'between': {
      const [start, end] = filterData.values ?? []

      return isDateBetween(n, start, end, valueFormat, '(]')
    }
    default:
  }
  return false
}
export function filterValue(n, filterData) {
  switch (filterData.valueType) {
    case 'string': {
      return filterStringValue(n, filterData)
    }
    case 'number': {
      return filterNumberValue(n, filterData)
    }
    case 'date':
    case 'time':
    case 'datetime': {
      return filterDateValue(n, filterData, filterData.valueType)
    }
    default:
  }
  return false
}
```
参考：[table-filter](../render-table/table-filter/filters.js)
- 内部排序计算
```js
// ./table-sort
import { getColumnFilterValueType } from '../base-table/utils'
const sortNumber = (dataA, dataB, order) => {
  // 数字比大小
  return order === 'asc' ? dataA - dataB : dataB - dataA
}
const sortString = (dataA, dataB, order) => {
  // 字符串比大小
  return order === 'asc' ? dataA.localeCompare(dataB) : dataB.localeCompare(dataA)
}
const sortDateTime = (dataA, dataB, order) => {
  // 日期比较大小
  return order === 'asc' ? new Date(dataA) - new Date(dataB) : new Date(dataB) - new Date(dataA)
}
export const sortValue = (a, b, val) => {
  const dataA = a[val.field]
  const dataB = b[val.field]
  const order = val.order
  const valueType = getColumnFilterValueType(val.column)

  switch (valueType) {
    case 'string': {
      return sortString(String(dataA), String(dataB), order)
    }
    case 'number': {
      return sortNumber(dataA, dataB, order)
    }
    case 'date':
    case 'time':
    case 'datetime': {
      return sortDateTime(dataA, dataB, order)
    }
    default: {
      return 0
    }
  }
}
```
参考：[table-sort](../render-table/table-sort/index.js)
