---
outline: deep
---
# Lib
## xlsx
- xlsx 基本使用
```js
import * as XLSX from 'xlsx'
const rows = [{name:'Jim',age:"18"}]
const ws = XLSX.utils.json_to_sheet(rows)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
XLSX.writeFile(wb, `${Date.now()}.xlsx`, { compression: true })
```
- blob 生成 csv
```js
function exportToExcel(data) {
  // 将数据转换为 CSV 格式
  let csvContent = '';
  data.forEach(row => {
    csvContent += row.join(",") + "\n";
  });
  // 使用 Blob 生成文件并创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.csv';
  link.click();
}
// 示例数据
const data = [
  ['Name', 'Age', 'City'],
  ['John', '30', 'New York'],
  ['Jane', '25', 'Los Angeles']
];
exportToExcel(data);
```
- 分析
  - .xlsx文件
    - 要生成 .xlsx 文件，必须处理更复杂的二进制数据结构，例如单元格样式、公式等
  - .csv文件
    - CSV是纯文本，只需要将文本按照逗号或其他分隔符格式化好
  - xls库
    - 它会把数据组织成表格、行和单元格的形式，转换为符合Excel格式的XML结构
    - 本质上是多个XML文件压缩打包而成的ZIP文件，包含表格数据、样式、公式等信息
## sortablejs
```js
/**
 * 给vxe-table 添加 拖拽表头
 */
import Sortable from 'sortablejs'
import Vue from 'vue'

Vue.directive('sortable-drag', {
  bind(el, binding, vnode) {
    app.$nextTick(() => {
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
            app.$nextTick(() => {
              vnode.child.loadColumn(oldCol)
            })
          },
        })
      } else {
        console.info(`v-drag 调用 el.querySelector 未找到 '.vxe-header--row'`)
      }
    })
  },
})
```
- 参考：[使用sortablejs给vxe-table添加表头左右拖的能力](https://juejin.cn/post/7227003813571313725)
## dayjs
- 获取时间
```js
dayjs().hour() // gets current hour
dayjs().minute() // gets current minute
```
- 计算时间
```js
// 提前7天
const lastWeekDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
// 推后7天
const nextWeekDate = dayjs().add(7, 'day').format('YYYY-MM-DD')

```
- 计算时间差
```js
const updateDate = () => {
  /** 增加定时器
   * 获取第二天日期，计算第二天毫秒数
   * 定时器启动时间 = 第二天毫秒数- 当前毫秒
   * 更新时间
   */
  const nextDay = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const time = dayjs(nextDay).valueOf() - Date.now()

  setTimeout(() => {
    ...
  }, time)
},
```
## jsencrypt / crypto-js
```js
import hashSha256 from "crypto-js/sha256";
import jsencrypt from "jsencrypt";
const form = {
  password: "123",
};
const publicKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv29TH2Ukhs9RnKHmPrLO
jwFmvvQCJh7jy6GFQgMoQdh408qcqI43fu09SrdZwmvBYTYImnCWDnpbvJjUAex6
B2XFgIFxaZ403MhQNomJnmG/5q3dN9Zjucb0jeShkuvYvtEfy5Q2tBv5mC8DxR1G
WO3/t7cZlI6bkZjvznmUPx2sJC9PzSmqAscn1nrO7zB8SNn2rxFeW+m73XHIgKDj
PBL3yFHI5xuk2BF18cK5TkGL6sND8eHAE4+gPqoR/RR2QvRBujFU60hHnxxbaawi
LDI93ShX6uSs/D7E/i6N3vDIKgiWxmmpXHb/Wk2IqyDEmOYxECh1Y75gnw6x0H4A
kQIDAQAB
-----END RSA PRIVATE KEY-----`
// 2、密码hash
const hashValue = hashSha256(form.password).toString();
// 3、公钥加密
const JSencrypt = new jsencrypt();
JSencrypt.setPublicKey(publicKey.value);
const encryptValue = JSencrypt.encrypt(hashValue);
console.log(encryptValue);
```
