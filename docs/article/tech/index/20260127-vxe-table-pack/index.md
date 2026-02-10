---
title: vxe-table 二次封装（筛选 + 排序 + 分页）(1)
date: 2026-01-27
---
# vxe-table 二次封装（筛选 + 排序 + 分页）
## 业务场景
- 在vxe-table的基础上，增加对排序和筛选的配置
- 同时增加对分页的支持
## 基本调研
- 查看[v3版本文档](https://vxetable.cn/v3/#/demo/list)

> 注意：本次使用 v3.8版本，现在已经不维护了（只做封装思路参考）

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

- 常用事件
  ```js
  <vxe
    @checkbox-change="checkboxChange"
    @checkbox-all="checkboxChange"
  ></vxe>
  ```
- 常用方法
  ```js
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
- 常用配置
  ```html
  <!--  保持勾选记录,数据更新（翻页后，再翻回来） -->
  <vxe
    :row-config="{
      keyField: 'id',
    }"
    :checkbox-config="{ reserve: true }"
  ></vxe>
  ```
## 实现思路

### 排序配置

> 排序配置比较简单

- 配置：
  - 在 VxeColumn 组件的 sortable 设置为true `<VxeColumn :sortable="true"></VxeColumn>`
- 触发：
  - 在 VxeTable 组件上，监听 sort-change 事件，获取排序参数数据 `<VxeTable @sort-change="sortChange>`
  - 存在多列触发排序的情况，排序参数数据返回是多条，其中排序类型 order：`正序 asc` `倒序 desc`

### 筛选配置

> 筛选配置相对复杂

#### 配置1：注册筛选组件

- 1、需要 `VXETable.renderer.add(BaseFilterRenderName, filterConfig)` 注册一个筛选配置

<<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/index.js#vxe-plus

- 2、filterConfig如下

<<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/index.jsx#config

- 3、TableFilter 筛选组件如何构造
  - 筛选组件数据来源

    <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/index.vue#data{js}

  - 筛选选项控制（核心点）
    - 确认筛选数据的类型 option.data.valueType 包括：数字、字符串、日期时间类（日期、时间、日期时间）
    - 根据筛选数据的类型，获取对应控制下拉对比条件 condition

    <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/BaseFilter.vue#condition{js}

    - 根据筛选数据的类型，渲染对应组件

    <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/BaseFilter.vue#filterComponent{js}

  - 自定义了筛选按钮的逻辑

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/index.vue#filter{js}

  - 自定义重置按钮的逻辑

  <<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/table-filter/index.vue#reset{js}


#### 配置2：使用筛选组件
- 1、在 VxeColumn组件 上配置 filter-render 和 filters
  - `<VxeColumn :filter-render="getColumnFilterRender(column)" :filters="getColumnFilters(column)">`
- 2、filter-render 主要用来配置渲染器（对应筛选组件）

<<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/base-table/index.vue#filter-render{js}

- 3、filters 配置筛选数据（筛选条件）

<<< @/submodule/play/packages/vue2/src/plugin/vxe-table-plus/base-table/index.vue#filters{js}

到此，vxe-table 二次封装（筛选、排序）配置完毕

### 分页封装

- 将 `<ElPagination />`与 `<VxeTable><VxeColumn />`組件进行组合
- 将 `<ElPagination />`组件触发事件 emit 到最外层

### 注意点

- VxeTable 插件注册
- 需要二次封装组件和 vxe-table组件 同时注册，才能将配置渲染出来

<<< @/submodule/play/packages/vue2/src/main.js#vxe-install{js}


## 代码
- [github](https://github.com/kkkkh/play/tree/main/packages/vue2/src/plugin/vxe-table-plus)
- [demo](https://kkkkh.github.io/play/vue2/story/src-components-index-story-vue?variantId=VxeTableDemo)
