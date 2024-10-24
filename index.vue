<template>
  <div>
    <TrRichTable
      v-bind="$attrs"
      :id="tableId"
      ref="TrRichTableRef"
      :all-columns="columns"
      :checkbox-config="{
        reserve: true,
      }"
      :data="currentData"
      :filter-config="{ remote: true }"
      :immediate="false"
      :remote="false"
      :sort-config="{ remote: true, multiple: true, chronological: true }"
      :view-config="viewConfig"
      @checkbox-all="selectAllEvent"
      @current-change="currentChange"
      @filter-change="filterChange"
      @get-checkbox-records="handleCheckBoxChange"
      @size-change="sizeChange"
      @sort-change="sortChange"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot v-if="slotName !== 'pagination'" :name="slotName" />
      </template>

      <template v-for="(_, slotName) in $scopedSlots" #[slotName]="slotProps">
        <slot v-if="slotName !== 'pagination'" :name="slotName" v-bind="slotProps" />
      </template>
    </TrRichTable>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

import tableControlMixin from '@/mixins/table-control'
import tableViewMixin from '@/mixins/table-view'

import TrRichTable from '../rich-table/TrRichTable.vue'
import { filterValue } from '../table-filter'
import { sortValue } from '../table-sort'

export default {
  name: 'RenderTable',
  components: { TrRichTable },
  mixins: [tableViewMixin, tableControlMixin],
  inheritAttrs: false,
  props: { allData: { type: Array, default: () => [] }, tableId: { type: String, default: '' } },
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
      return this.sortData.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      )
    },
    total() {
      return this.fileterData.length
    },
    sortData() {
      const data = this.fileterData

      if (this.sortList.length > 0) {
        data.sort((a, b) => {
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
      let data = []

      data =
        this.filterList.length > 0
          ? this.filterList.reduce((pre, next) => {
              return pre.filter((item) =>
                filterValue(item[next.field], next.datas ? next.datas[0] : next)
              )
            }, this.allData)
          : this.allData

      return data
    },
  },
  watch: {
    fileterData: {
      handler() {
        this.$nextTick(() => {
          this.$refs.TrRichTableRef.setTotal(this.total)
        })
      },
      immediate: true,
    },
  },
  methods: {
    clearSelections() {
      this.$refs.TrRichTableRef.clearSelections()
    },
    filterChange(val) {
      this.filterList = cloneDeep(val.filterList)
      console.log(val)
    },
    sortChange(val) {
      this.sortList = cloneDeep(val.sortList)
      console.log(val)
    },
    currentChange(val) {
      this.page.currentPage = val
    },
    sizeChange(val) {
      this.page.pageSize = val
    },
  },
}
</script>
