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
- 带表头
```js
import XLSX from 'xlsx';
// 示例数据，字段顺序不固定
const data = [
  { age: 2, name: 1, gender: '男' },
  { name: 3, gender: '女', age: 4 }
];
// 中文表头映射
const headerMap = {
  name: '名称',
  age: '年龄',
  gender: '性别'
};
// 明确指定导出列的字段顺序
const headerFields = Object.keys(headerMap);
// 使用 header 参数固定字段顺序生成 worksheet
const worksheet = XLSX.utils.json_to_sheet(data, { header: headerFields });
// 覆盖默认表头（第一行）为中文表头
headerFields.forEach((field, index) => {
  const cellRef = XLSX.utils.encode_cell({ c: index, r: 0 });
  worksheet[cellRef].v = headerMap[field];
});
// 创建 workbook 并添加 worksheet
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
// 导出 Excel 文件
XLSX.writeFile(workbook, '导出带固定表头顺序的示例.xlsx');
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
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv29TH2Ukhs9RnKHmPrLO
jwFmvvQCJh7jy6GFQgMoQdh408qcqI43fu09SrdZwmvBYTYImnCWDnpbvJjUAex6
B2XFgIFxaZ403MhQNomJnmG/5q3dN9Zjucb0jeShkuvYvtEfy5Q2tBv5mC8DxR1G
WO3/t7cZlI6bkZjvznmUPx2sJC9PzSmqAscn1nrO7zB8SNn2rxFeW+m73XHIgKDj
PBL3yFHI5xuk2BF18cK5TkGL6sND8eHAE4+gPqoR/RR2QvRBujFU60hHnxxbaawi
LDI93ShX6uSs/D7E/i6N3vDIKgiWxmmpXHb/Wk2IqyDEmOYxECh1Y75gnw6x0H4A
kQIDAQAB
-----END PUBLIC KEY-----`;
// 2、密码hash
const hashValue = hashSha256(form.password).toString();
// 3、公钥加密
const JSencrypt = new jsencrypt();
JSencrypt.setPublicKey(publicKey.value);
const encryptValue = JSencrypt.encrypt(hashValue);
console.log(encryptValue);
```
---

## core-js
```js
import "@babel/polyfill"; // 废弃
```
```js
import "core-js/stable";
import "regenerator-runtime/runtime";
```
```js
// core-js：会直接修改全局对象
import 'core-js/actual/promise';
import 'core-js/actual/set';
import 'core-js/actual/iterator';
import 'core-js/actual/array/from';
import 'core-js/actual/array/flat-map';
import 'core-js/actual/structured-clone';
// core-js-pure：不会直接修改全局对象。
// 相反，它会将 polyfill 作为独立的函数或对象导出，你需要显式地调用它们。
import Promise from 'core-js-pure/actual/promise';
import Set from 'core-js-pure/actual/set';
import Iterator from 'core-js-pure/actual/iterator';
import from from 'core-js-pure/actual/array/from';
import flatMap from 'core-js-pure/actual/array/flat-map';
import structuredClone from 'core-js-pure/actual/structured-clone';
```
## fnm
```bash
# 安装
brew install fnm
# .bashrc 或 .zshrc
eval "$(fnm env --use-on-cd)"
# node lts（Long Term Support 长期支持）
fnm install --lts
```
## iconify
- @iconify/react  @iconify-icons/mdi
```tsx
// example: src/components/IconDemo.tsx
import { Icon } from '@iconify/react';
import homeIcon from '@iconify-icons/mdi/home'; // 从某个图标集导入
export default function IconDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Icon icon={homeIcon} width="24" height="24" />
      <span>Home</span>
    </div>
  );
}
```
```tsx
// 如果你不想安装那么多包，可以使用直接字符串引用在线图标
// ✅ 优点：无需单独安装图标包。
// ⚠️ 缺点：图标数据在运行时加载，略影响首屏性能。
import { Icon } from '@iconify/react';
export default function IconDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Icon icon="mdi:home" width="24" height="24" />
      <Icon icon="tabler:bell" width="24" height="24" />
      <Icon icon="fluent:person-24-regular" width="24" height="24" />
    </div>
  );
}
```
- iconify 特点
| 名称              | 作用                       | 示例                                               |
| --------------- | ------------------------ | ------------------------------------------------ |
| **IconifyIcon** | 图标对象的数据结构（本地导入）          | `import homeIcon from '@iconify-icons/mdi/home'` |
| **IconifyJSON** | 一整个图标集的数据（比如包含所有 MDI 图标） | `import mdi from '@iconify-json/mdi/icons.json'` |
| **iconifyInfo** | 描述图标集的元数据（作者、license）    | 一般不用手动管                                          |
| **icon** 属性     | 在组件中使用图标的入口，可以是字符串或对象    | `icon="mdi:home"` 或 `icon={homeIcon}`            |

## axios
### axios post x-www-form-urlencoded 以及 query 传参
```js
const axios = require('axios');
const qs = require('qs');

const data = { name: '张三', age: 30 };       // 请求体
const query = { token: 'abc123', page: 1 };  // URL query

axios.post('/api/user', qs.stringify(data), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  params: query   // 这里就是 URL query
})
.then(res => console.log(res.data));
```
## particles.js
- 在nextjs中使用 particles.js
```js
"use client";
import { useEffect } from "react"
import "particles.js"

export default function Point (){
  useEffect(()=>{
    window.particlesJS.load("point", '/particlesjs-config.json', function() {
      console.log('callback - particles-js config loaded');
    });
  },[])
  return <>
    <div id="point" className="absolute z-2 left-0 top-0 w-full h-full"></div>
  </>
}
```
- 使用 react-tsparticles
## floating-ui

