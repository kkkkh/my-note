### Intl
Intl 是 ECMAScript 国际化 API 的命名空间对象，提供了一系列用于多语言、多地区环境下的格式化和比较功能。

#### Intl.NumberFormat &I
用于数字格式化（包括货币、百分比等），根据语言环境自动添加千分位分隔符、小数点格式、货币符号等。
```js
const num = 1234567890;
const formatter = new Intl.NumberFormat('en-US');
const formatted = formatter.format(num);
console.log(formatted); // 输出：1,234,567,890
```
Intl.DateTimeFormat
用于日期和时间格式化，支持多种语言和地区的显示格式，比如年月日顺序、12小时制/24小时制等。

Intl.Collator
用于字符串排序和比较，考虑不同语言的字母顺序、重音符号等细节。

Intl.RelativeTimeFormat
用于相对时间描述，比如“2天前”、“1小时后”等。

Intl.PluralRules
用于根据数字确定复数规则，比如“1 apple”，“2 apples”中单复数的区分；针对不同语言规则不同。

Intl.ListFormat
用于格式化列表，比如英语中"A, B, and C"，中文中“A、B和C”。

Intl.Locale
表示语言环境标签（locale），用于描述语言、脚本、区域等信息。

```js
// 数字格式化
const numFmt = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' });
console.log(numFmt.format(1234567.89)); // 输出：￥1,234,567.89
// 日期格式化
const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
console.log(dateFmt.format(new Date())); // e.g. February 28, 2024
// 字符串排序
const collator = new Intl.Collator('fr-FR');
const items = ['éclair', 'eclair', 'École'];
console.log(items.sort(collator.compare)); // 符合法语排序顺序
// 相对时间
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
console.log(rtf.format(-1, 'day')); // "yesterday"
```
