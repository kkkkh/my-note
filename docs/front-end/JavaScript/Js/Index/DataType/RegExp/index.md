### RegExp
#### 常用正则
```js
// 邮箱
/^[A-Za-z0-9\u4E00-\u9FA5]+(\.[A-Za-z0-9\u4E00-\u9FA5]+)+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
// 手机号
const reg = /^1[3456789]\d{9}$/
// 数字要求：最大13位，小数最大4位
const regNumber = /^([1-9]\d{0,12}(\.\d{1,4})?|0\.\d{1,4})$/
// 数字要求：最大9位，小数最大2位（排除0）
const regNumber =  /^([1-9]\d{0,8}(\.\d{1,2})?|0\.0[1-9]|0\.[1-9]\d{0,1})$/

// 强密码
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$
// - 至少一个小写字母；
// - 至少一个大写字母；
// - 至少一个数字；
// - 至少一个特殊字符；
// - 总长度 8–20。
```
#### 特殊字符
```js
/\d/  // \d 范围大 也包含中文全角0-9
/\D/ // 匹配一个非数字字符。等价于 [^0-9]。
/[0-9]/ // 0-9 范围小
/\w/ // A-Za-z0-9_
/\W/ //	匹配一个非单字字符 等价于 [^A-Za-z0-9_]。
/[\u4e00-\u9fa5]/ //汉字
/\s/ // 匹配一个空白字符，包括空格、制表符、换页符和换行符 等价于
/[\f\n\r\t\v\u0020\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/ //与上同
/\S/ // 匹配一个非空白字符
/\f/ // 匹配一个换页符 (U+000C)
/\r/ // 匹配一个回车符 (U+000D)
/\n/ // 换行符匹配 (U+000A)
/./ // （小数点）默认匹配除换行符之外的任何单个字符。
// 在 Unix 和 Linux 系统（包括 macOS）中，换行符用 \n（LF，Line Feed）表示。
// 在 Windows 系统中，换行符用 \r\n（CR+LF，Carriage Return + Line Feed）表示。
// 早期的 Mac OS（例如，Mac OS 9）使用 \r（CR，Carriage Return）表示换行。
// 以\n为主流
// 数量
/\d?/ // 0次 或 1次
/\d*/ // 0次 或 多次
/\d+/ // 1次 或 多次
/{n}/ // n 是一个正整数，匹配了前面一个字符刚好出现了 n 次。 
```
#### 匹配规则
```js
// 匹配 "x" 或 "y" 任意一个字符。
/x|y/
/green|red/ // 在 "green apple" 里匹配 "green"，且在 "red apple" 里匹配 "red" 。
// 匹配任何一个包含的字符
/[xyz]/
/[a-c]/ // [abc]相同
// 一个否定的或被补充的字符集
/[^xyz]/
/[^a-c]/
// 捕获组
/(x)/ // 捕获组会带来性能损失。如果不需要收回匹配的子字符串，请选择非捕获括号，下边的例子
// \n 非捕获括号
/apple(\,)orange\1/.exec("apple,orange,cherry,peach") // 其中 \1 引用了 之前使用第 n 个 () 捕获的 => 'apple, orange,'
// (?<Name>x) 具名捕获组：匹配"x"并将其存储在返回的匹配项的 groups 属性中，
/-(?<customName>\w)/ // 匹配“web-doc” 中的“d”
'web-doc'.match(/-(?<customName>\w)/).groups //{customName: "d"}
// (?:x) 非捕获组：匹配 “x”，但不记得匹配。不能从结果数组的元素中收回匹配的子字符串
/(a)(?:b)(c)/.exec("abc") // ['abc', 'a', 'c', index: 0, input: 'abc', groups: undefined]
/((x)yz)(abc)/.exec("xyzabc") // 嵌套捕获组，先由外到内，再由左到右 => ['xyzabc', 'xyz', 'x', 'abc', index: 0, input: 'xyzabc', groups: undefined]
```
参考：[Groups and ranges](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences)
#### 修饰符
| 标志 | 描述                                                                |
|------|-------------------------------------------------------------------|
| g    | 全局搜索。                                                           |
| i    | 不区分大小写搜索。                                                   |
| m    | 多行搜索。                                                           |
| s    | 允许 . 匹配换行符。                                                  |
| u    | 使用 unicode 码的模式进行匹配。                                      |
| y    | 执行“粘性 (sticky)”搜索，匹配从目标字符串的当前位置开始。             |
| d    | 表示正则表达式匹配的结果应该包含每个捕获组子字符串开始和结束的索引。 |

##### -y
- RegExp.prototype.sticky
- sticky 属性反映了搜索是否具有粘性（仅从正则表达式的 lastIndex 属性表示的索引处搜索）
- 如果一个表达式同时指定了 sticky 和 global，其将会忽略 global 标志。
```js
const str1 = 'table football';
const regex1 = new RegExp('foo', 'y');
regex1.lastIndex = 6;
console.log(regex1.sticky); // true
console.log(regex1.test(str1));// true
console.log(regex1.lastIndex);// 9
console.log(regex1.test(str1));// false
```
- 当使用带有 y 标识的匹配模式时，^ 断言总是会匹配输入的开始位置或者（如果是多行模式）每一行的开始位置。
```js
var regex = /^foo/y;
regex.lastIndex = 2;
regex.test("..foo"); // false - 索引 2 不是字符串的开始
var regex2 = /^foo/my; // m 多行搜索
regex2.lastIndex = 2;
regex2.test("..foo"); // false - 索引 2 不是字符串或行的开始
regex2.lastIndex = 2;
regex2.test(".\nfoo"); // true - 索引 2 是行的开始
```
#### RegExp涉及的api
- RegExp
- RegExp 的 exec 和 test 方法
- String 的 match、matchAll、replace、replaceAll、search 和 split
#### RegExp
```js
// 1
var re = /ab+c/;
// 构造函数创建的正则表达式会被编译
// 构造函数 可以动态生成正则
var re = new RegExp("ab+c");
// 2
var re = /[a-z]\s/i
var re = new RegExp("[a-z]\\s", "i")
```
#### exec
```js
const regex1 = RegExp('foo(?<rGroup>[^foo]*)', 'dg');
const str1 = 'table foooof, football, foosball';
let array1;
console.log("regex1.lastIndex",regex1.lastIndex)
while ((array1 = regex1.exec(str1)) !== null) {
	console.log("array1",array1)
	console.log("array1.input",array1.input) // 匹配到的字符串和所有被记住的子字符串。
	console.log("array1.groups",array1.groups) // 一个命名捕获组对象，其键是名称，值是捕获组。
	console.log("array1.index",array1.index) //	在输入的字符串中匹配到的以 0 开始的索引值。
	console.log("array1.indices",array1.indices) // 此属性仅在设置了 d 标志位时存在。它是一个数组，其中每一个元素表示一个子字符串的边界。
  console.log("------------------------")
	console.log("regex1",regex1)
	console.log("regex1.source",regex1.source) // 模式字面文本
  console.log("regex1.lastIndex",regex1.lastIndex) // 开始下一个匹配的起始索引值。这个属性只有在使用 g 参数时可用在
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~")
}
/*
> "regex1.lastIndex" 0
> "array1" Array ["foo", ""]
> "array1.input" "table foooof, football, foosball"
> "array1.groups" Object { rGroup: "" }
> "array1.index" 6
> "array1.indices" Array [Array [6, 9], Array [9, 9]]
> "------------------------"
> "regex1" /foo(?<rGroup>[^foo]*)/dg
> "regex1.source" "foo(?<rGroup>[^foo]*)"
> "regex1.lastIndex" 9
> "~~~~~~~~~~~~~~~~~~~~~~~~"
> "array1" Array ["football, ", "tball, "]
> "array1.input" "table foooof, football, foosball"
> "array1.groups" Object { rGroup: "tball, " }
> "array1.index" 14
> "array1.indices" Array [Array [14, 24], Array [17, 24]]
> "------------------------"
> "regex1" /foo(?<rGroup>[^foo]*)/dg
> "regex1.source" "foo(?<rGroup>[^foo]*)"
> "regex1.lastIndex" 24
> "~~~~~~~~~~~~~~~~~~~~~~~~"
> "array1" Array ["foosball", "sball"]
> "array1.input" "table foooof, football, foosball"
> "array1.groups" Object { rGroup: "sball" }
> "array1.index" 24
> "array1.indices" Array [Array [24, 32], Array [27, 32]]
> "------------------------"
> "regex1" /foo(?<rGroup>[^foo]*)/dg
> "regex1.source" "foo(?<rGroup>[^foo]*)"
> "regex1.lastIndex" 32
> "~~~~~~~~~~~~~~~~~~~~~~~~"
*/
```
- 如果你只是为了判断是否匹配，请使用 `RegExp.prototype.test()` 方法代替。
- 如果你只是为了找出所有匹配正则表达式的字符串而又不关心捕获组，请使用 `String.prototype.match()` 方法代替。
- 此外，`String.prototype.matchAll()` 允许你对匹配项进行迭代，这有助于简化匹配字符串的多个部分（带有匹配组）。
- 如果你只是为了查找在字符串中匹配的索引，请使用 `String.prototype.search()` 方法代替。
#### matchAll / match
matchAll(regexp)
- 如果 regexp 是一个正则表达式，那么它必须设置了全局（g）标志，否则会抛出 TypeError 异常。
- 返回值：一个匹配结果的可迭代迭代器对象（它不可重新开始）。每个匹配结果都是一个数组，其形状与 RegExp.prototype.exec() 的返回值相同。
```js
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';
console.log(str.matchAll(regexp))
const array = [...str.matchAll(regexp)];
console.log(array[0]);
console.log(array[1]);
// > [object RegExp String Iterator]
// > Array ["test1", "e", "st1", "1"]
// > Array ["test2", "e", "st2", "2"]
```
与 exec 比对
- matchAll() 方法，则可以避免使用 while 循环和带有 g 标志的 exec
- matchAll 内部做了一个 regexp 的复制，lastIndex 在字符串扫描后不会改变（不像 regexp.exec()）
```js
const regexp = /foo[a-z]*/g;
const str = "table football, foosball";
let match;
while ((match = regexp.exec(str)) !== null) {
  console.log(
    `找到 ${match[0]} 起始位置=${match.index} 结束位置=${regexp.lastIndex}。`,
  );
}
// 找到 football 起始位置=6 结束位置=14。
// 找到 foosball 起始位置=16 结束位置=24。
```
```js
const regexp = /foo[a-z]*/g;
const str = "table football, foosball";
const matches = str.matchAll(regexp);
for (const match of matches) {
  console.log(
    `找到 ${match[0]} 起始位置=${match.index} 结束位置=${
      match.index + match[0].length
    }.`,
  );
}
// 找到 football 起始位置=6 结束位置=14.
// 找到 foosball 起始位置=16 结束位置=24.
// 匹配迭代器在 for...of 迭代后用尽
// 再次调用 matchAll 以创建新的迭代器
Array.from(str.matchAll(regexp), (m) => m[0]);
// [ "football", "foosball" ]
```
与 match 比对
- 比 String.prototype.match() 更好的捕获组获取方式
- 当使用全局 g 标志调用 match() 方法时，捕获组会被忽略
```js
const regexp = /t(e)(st(\d?))/g;
const str = "test1test2";
str.match(regexp); // ['test1', 'test2']
```
```js
const array = [...str.matchAll(regexp)];
array[0];
// ['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', length: 4]
array[1];
// ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', length: 4]
```
#### 前瞻（Lookahead）
- 前瞻：当前位置之后，必须匹配上括号里的内容。
  - ⚙️ 它不会真正匹配这些内容，只是检查条件是否成立。
  - 这也是它和普通分组 () 的最大区别。
  ```js
  // 匹配：foobar 中的 foo，
  // 但不会匹配 foobaz。
  foo(?=bar)
  ```
- 负前瞻（Negative Lookahead）：当前位置之后，不能匹配括号里的内容
  ```js
  // 匹配 foobaz 中的 foo，但不匹配 foobar。
  // （因为后面是 bar，会被排除）
  foo(?!bar)
  ```
- 密码校验：经常用到前瞻
```js
^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$
```
| 片段                 | 含义                    |
| ------------------ | --------------------- |
| `^`                | 匹配字符串开头               |
| `(?=.*[A-Za-z])`   | 前瞻：要求后面**至少出现一个字母**   |
| `(?=.*\d)`         | 前瞻：要求后面**至少出现一个数字**   |
| `[A-Za-z\d]{8,20}` | 实际匹配：只允许字母或数字，长度 8–20 |
| `$`                | 匹配字符串结尾               |
- 其他例子
| 正则                                       | 含义                |
| ---------------------------------------- | ----------------- |
| `(?=.*[A-Z])`                            | 至少包含一个大写字母        |
| `(?=.*[a-z])`                            | 至少包含一个小写字母        |
| `(?=.*\W)`                               | 至少包含一个特殊字符（非字母数字） |
| `(?=.*[@$!%*?&])`                        | 至少包含上述符号之一        |
| `(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)` | 同时包含大小写字母、数字、特殊字符 |
#### 贪婪 / 懒惰
```js
// 1
// *?懒惰查找 默认是贪婪查找
// $1 代表正则中第一个()
// [^$] 代表非$的字符 反向字符集
// $$t 插入一个 "$"
const reg = /placeholder="([^$]*?)"/
const str = `placeholder="请输入信息"`
const res = str.replace(reg,`:placeholder="$$t('N:$1')"`)
console.log(res)
// :placeholder="$t('N:请输入信息')"
const reg = /label="([^$]*?)"/
const str = `label="重置"`
const res = str.replace(reg,`:label="$$t('F:$1')"`)
console.log(res)
```
```js
var str = "bbbaaccaa";
var reg1 = /.*aa/;
console.log(reg1.exec(str)); // bbbaaccaa
// 增加?，非贪婪
var reg2 = /.*?aa/;
console.log(reg2.exec(str)); // bbbaa 只找最前面
/**
 * exec每次只查询一次,
 * g在上一次基础上继续往下查找
 */
var reg3 = /.*?aa/g;
console.log(reg3.exec(str)); // bbbaa
console.log(reg3.exec(str)); // ccaa 只找最前面
```
#### 案例
- 字符串通过“换行”截取为 => 数据组
```js
const strings= "111\n222"
const arr = strings.split(/\r?\n+/).filter((val) => val !== '').map((item) => item.trim())
```
- 获取标签、key
```js
/**
 * 获取标签、key:
 * <el-input v-model="form.type"></el-input>
 * input、type
 */
const reg = /<([\w-]+)\n?\s*[\w"'=]*\n?\s*v-model=["']\w*[Ff]orm\.(\w+)/g
```
- 路径中获取文件名
```js
// 路径中获取文件名
const path = "/*/**/01.text"
const res = path.match(/\/([^\/]+)$/)[1]
```
- 其他示例：[String replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

- 参考：
  - [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions#special-line-feed)
  - [learn-regex-zh](https://github.com/cdoco/learn-regex-zh)
  - [learn-regex](https://github.com/ziishaned/learn-regex/blob/master/translations/README-cn.md)
  - [common-regex](https://github.com/cdoco/common-regex)
