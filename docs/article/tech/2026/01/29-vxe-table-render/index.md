---
title: vxe-table 前端控制数据渲染（筛选 + 排序+ 分页）（2）
date: 2026-01-29
tags:
  - front-end
  - Lib
  - Vue
---
# vxe-table 前端控制数据渲染（筛选 + 排序+ 分页）（2）
## 场景需求
- 场景需求，调用后端接口每次查询的数据，要累加到前端做存储，做统一控制
- 实现功能：前端分页查看，搜索筛选，排序
## 前置
- [vxe-table 二次封装（筛选 + 排序 + 分页）（1）](../2026/01/27-vxe-table-pack/)
- 基于vxe-table二次封装的基础上，增强前端数据渲染
- 分页查看，搜索筛选，排序的触发事件，返回的事件参数列表，前端进行数据过滤
## 实现思路
### 外层触发计算

- 列表数据增加

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/index.vue#all-data{js}

### 内层触发计算
- 1、过滤filter

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/index.vue#filter-data{js}

  - 过滤数据分三大类型：字符串、数字、日期（时间）

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/filters.js#filter-value

  - 以字符串为例，根据不同的过滤条件，进行不同的数据过滤

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/filters.js#filter-string-value

- 2、排序sort

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/index.vue#sort-data{js}

  - 排序数据也分三大类型：字符串、数字、日期（时间）

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-sort/index.js#sort-value

  - 以数字为例，根据不同的排序条件进行排序

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-sort/index.js#sort-number

- 3、分页page

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/index.vue#pagination-data{js}

### 注意
- 关于复选数据重复的问题：
  - 数据通过查询，增量累加，不存在单独减少操作，此时不需要考虑复选数据更新；
  - 数据执行操作成功，会对数据重置或删除，此时要更新复选的数据，设置为空；

## 代码
- [github](https://github.com/kkkkh/play/tree/main/packages/vue2/src/plugin/vxe-table-plus)
- [demo](https://kkkkh.github.io/play/vue2/story/src-components-index-story-vue?variantId=VxeTableDemo)
