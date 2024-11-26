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
