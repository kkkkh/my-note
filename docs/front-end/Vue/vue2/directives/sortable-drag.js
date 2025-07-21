import Sortable from 'sortablejs'
import Vue from 'vue'

export default {
  name: 'sortable-drag',
  bind(el, binding, vnode) {
    Vue.prototype.$nextTick(() => {
      const header = el.querySelector('.vxe-header--row')

      if (header) {
        header.style.cursor = 'move'

        Sortable.create(header, {
          animation: 500,
          delay: 0,
          draggable: 'th',
          handle: '.vxe-cell',
          ghostClass: 'sortable-ghost', // drop placeholder
          chosenClass: 'sortable-chosen', // chosen item 被选择元素 优先级高于 sortable-ghost
          dragClass: 'sortable-drag', // dragging item 拖拽中的元素
          // forceFallback: true,
          filter: '.col--fixed',
          onMove(e) {
            // 这里也永远不会返回false,原因如下：
            // 另外一个为fixed服务的.vxe-header--row，会覆盖在当前的.vxe-header--row的上边，
            // 永远无法经过当前.vxe-header--row的col--fixed元素
            return !e.related.className.includes('col--fixed')
          },
          onFilter(evt) {
            // 这里不会触发，
            // 因为filter: '.col--fixed'中.col--fixed元素并不在当前的.vxe-header--row中
            // fixed列会生成在另外一个.vxe-header--row中
            console.log('onFilter: 试图选中一个被filter过滤的列表单元的回调函数,', evt)
          },
          onEnd: async (event) => {
            if (event.oldIndex === event.newIndex) {
              // 当拖拽到fixed列的时候，上边两个都无法触发，但是event.oldIndex === event.newIndex是相同的，
              // 无效移动，不需要更新，return即可
              return
            }
            const oldCol = await vnode.child.getColumns()

            const oldTarget = oldCol.splice(event.oldIndex, 1)

            oldCol.splice(event.newIndex, 0, oldTarget[0])
            await vnode.child.loadColumn([])
            Vue.prototype.$nextTick(() => {
              vnode.child.loadColumn(oldCol)
            })
          },
        })
      } else {
        console.info(`v-drag 调用 el.querySelector 未找到 '.vxe-header--row'`)
      }
    })
  },
}
