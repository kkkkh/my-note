---
title: vxe-table 二次封装（筛选 + 排序 + 分页）+ 前端控制数据渲染（筛选 + 排序+ 分页）
date: 2026-01-29
---
# vxe-table 二次封装（筛选 + 排序 + 分页）+ 前端控制数据渲染（筛选 + 排序+ 分页）
## 业务需求
- 由于业务场景需求，调用后端接口每次查询的数据，要累加到前端做存储，做统一控制
- 实现功能：分页查看，搜索筛选，排序
- 技术栈：vue2 + vxe-table@3.8.22
## 基本调研
- 查看[v3版本文档](https://vxetable.cn/v3/#/demo/list)

- 一些demo的代码实现：
  - 本地数据，简单筛查：https://vxetable.cn/v3.8/#/table/base/filter
  - 本地数据，复杂筛选：https://vxetable.cn/v3.8/#/table/advanced/manualFilter
    - 手动筛选：调用 setFilter 和 updateData 方法来处理复杂场景
    - 修改筛选条件
    - 展示、关闭筛选面板
    - 清除所有筛选条件
  - 设置筛选渲染：https://vxetable.cn/v3.8/#/table/renderer/filter
  - 本地数据，分页：https://vxetable.cn/v3.8/#/table/advanced/page
  - 数据代理，分页：https://vxetable.cn/v3.8/#/table/grid/pageProxy

- 一些常用api以及配置：
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
## 前置条件
对vxe-table进行配置，实现以下功能功能
- 漏斗筛查
- 排序
## 实现思路
- 外层触发计算：列表数据增加
- 前端计算table顺序：1、过滤filter/2、排序sort/3、分页page
- 数据分三种类型：字符串、数字、日期（时间），同类型之间进行比较（筛选、排序）
```vue
<script>
import { filterValue } from '../table-filter'
import { sortValue } from '../table-sort'
export default {
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 20,
      },
      // 筛选条件、排序条件：vxe-table的筛选条件、排序条件的选择（配置）
      filterList: [],
      sortList: [],
    }
  },
  computed: {
    currentData() {
      // 3-分页计算
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
- 内部筛选计算
```js
// ./table-filter/filters.js
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
```
- 内部排序计算
```js
// ./table-sort/index.js
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
- 关于复选数据重复的问题：
  - 数据通过查询，增量累加，不存在单独减少操作，此时不需要考虑复选数据更新；
  - 数据执行操作成功，会对数据重置或删除，此时要更新复选的数据，设置为空；
