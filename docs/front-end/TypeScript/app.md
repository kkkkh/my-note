
#### 16 表达式类型

惰性求值
求值结果 -> 联合、单类型
优先级

(...)
typeof 求值
= 别名、求值

#### 17 表达式类型的联合、交叉
```ts
type A = 'a' | 'b' | string; // 联合、单类型（包括any）
type B = 'a' & string;  // 单类型或never
interface T1 {
    a: string;
    c: number;
}
interface T2 {
    a: string;
    b: boolean;
}
interface T1 {
    a: string;
    c: number;
}
type X = T1 & T2; // 交叉
type T3 = keyof X; // 求值X
type T4 = X['c']; // 求值X
type T5 = X & string;  // 惰性的，或never
type T6 = X | string;  // 惰性的

type U = T1 | T2; // 联合
type T7 = keyof U;  // keyof T1 & keyof T2   （注意keyof的结果是string|numer|...) // T7 结果是 "a"
type T81 = U['c'|'b']; // 1、检查 ('c' | 'b') in (keyof U)
type T82 = (U | {a: boolean})['a']; // 2、T1['a'] | T2 ['a'] | .. | Tn ['a']
type T9 = U & {a: boolean}; // 惰性的，或never（求值方法：T1 & A | .. | T2 & A）  {a:string} & {a:boolean}
type T10 = U | {a: boolean}; // 惰性的 {a: string | boolean}
```
分析过程
```ts
interface T1 {
    a: string;
    c: number;
}

interface T2 {
    a: string;
    b: boolean;
}
type U = T1 | T2; // 联合
type X = T1 & T2; // 交叉  
//两个接口 -> 交叉 -> 公共子类 -> {a: string; c: number; b: boolean;}
```
```ts
A & B // 惰性的，或never
    // 交叉
    -> T1 & T2
    -> {a: string; c: number; b: boolean;}
    // never
    -> U & {a:boolean}
    -> T1 & {a:boolean} | T2 & {a:boolean}
    -> never | never
    -> never
A | B // 惰性的
    // 联合
    -> T1 | T2
    -> {a: string;}
    // 正常
    -> U | {a:boolean}
    -> {a: string | boolean}
T[K]
    // 联合
    -> (U | {a:boolean})['a'] 
    -> (T1 | T2 | {a:boolean})['a'] 
    -> T1['a'] | T2['a'] | {a:boolean}['a'] 
    -> string | string | boolean
    -> string | boolean
    // 交叉
    -> X['c']; // 求值X 

keyof T 
    // 联合
    -> keyof U // 联合惰性，不求值，每一个成员参与运算
    -> keyof (T1 | T2) 
    -> keyof T1 & keyof T2 
    -> ('a' | 'b') & ('a' | 'c') 
    -> 'a'
    // 交叉
    -> keyof X; // 先求值X，再运算
```
注意点
```ts
/**
这是一个无解的题，它事实上与交叉运算“是否更积极地向never收敛”有关，
某些情况下，积极的收敛（向never求值）会导致TTT的结果，
另一些时候则不会。
而且，这个过程没有太明确的原则。

在我们的课程中，只是强调：交叉运算可以有求值结果，但求值计算不一定会发生。
说的是计算的非必然性，但对交叉结果是否“更积极地”的处理为never，是绕开了的。这既没有官方资料，也没有规则……
*/
type B = {a:string} & {a:boolean}
// type B = never
type B1 = B["a"]
// type B1 = never
type B2 = keyof B
// type B2 = string | number | symbol

type C = {a:string} & {a:number}
// type C = {a:never}ß
type C1 =  C["a"]
// type C1 = never
type C2 = keyof C
// type C2 = "a"

/**
TypeScript在几乎所有与string | number类型相关的处理中，都需要小心。
因为对象的索引签名中有个潜规则，即“数字索引是字符串索引的子集”，因此几乎在所有有关这两个类型的计算都需要“特殊对待”。因为这个计算结果“有可能需要”在后续运算作为签名使用。
所以我们直观上觉得string & number的结果是never，——因为这两个类型、以及boolean都是primitive type——但它们却通常是用“string & number”这个未求值的表达式参与到后续计算中的。并且带来了非常非常多特例。
只能在使用中多留意了。
*/
```
#### 18 元组... 和 索引表存取表达式
元组...
```javascript
/*
  Examples of ...T
*/

type T = [string, number, 'a'];
type L = T['length'];

// 用法1：展开（spread），T is Tuple
type T2 = [boolean, ...T]; 
type T3 = [...T, boolean]; 
type T4 = [boolean, ...T, 1]; 

// 用法2：剩余元素（rest element），T is Array<>
type T5 = [...string[]];
type T6 = [number, ...string[]];
type T7 = [number, ...string[], boolean];
type T71 = [number, ...T, ...(string|number)[], boolean];
type T8 = [...string[], boolean];
type L8 = T8['length'];
type T9 = [...T8]; // 展开一个无限长的元组

// 用法3：在函数参数（参数名）中总是识别为剩余参数语法（rest parameter）
type F1 = (..._: T) => void;
type F2 = (...$: string[]) => void; // or any[], or other array of types
type F3 = (...args: any) => void;
type F31 = (...args: any[]) => void;
type F4 = (...T: any) => void; // NOTE: WARNNING!
type F4 = (...T) => void; // NOTE: WARNNING! 非严格模式

// 带有指定前序个参数，并且后面是任意多个其它参数（不定长元组/无限元组）
// 报错的，How to?
type F5 = (...T, ...args: any[]) => void;
// 如下解决
type F5 = (...args: [...T, ...any[]]) => void;

// 其它
let x = [1, 2, 'a'];
let y = {a: 1, b: 2};
type T10 = [...any]; // any[]
type T11 = [...never]; // never
type T12 = [...typeof x]; // T是表达式，先求值
// 报错的
type T13 = [...typeof y]; // 求值的结果不是数组或元组
type T14 = [...T|number[]]; // T是联合，[...T] | [...number[]]
```
T[K]
```javascript
/*
  Examples of T[K]
*/
interface T1 {
    a: string;
    c: number;
}
interface T2 {
    [k: string]: any;
    a: string;
    b: boolean;
}
// 一般用法
type T3 = T1['a']; // 单类型, subtype of string|number|symbol

// T[K]中，T是表达式
let x = {a: 1, b: 2};
type T4 = typeof x['a']; // 先求值T，再确认K
type T5 = T1['a']['toString']; // （同上）
type T6 = (keyof T2)['toString']; // （同上）

/* （上一讲的内容）
type X = T1 & T2; // 交叉
type T4 = X['c']; // 求值X

type U = T1 | T2; // 联合
type T81 = U['c'|'b']; // 1、检查 ('c' | 'b') in (keyof U)
type T82 = (U | {a: boolean})['a']; // 2、T1['a'] | T2 ['a'] | .. | Tn ['a']
*/

// T[K]中，K是表达式
type X = T1 & T2; // 交叉
// 
type T7 = T1[X]; // （先求值T）求值X
type T8 = T1['a'|'c']; // 联合  
// 相当于
type T81 = T1['a'] | T1['c'];

/*
type X = T1 & T2; // 交叉
type T3 = keyof X; // 求值X

type U = T1 | T2; // 联合
type T7 = keyof U;  // keyof T1 & keyof T2   （注意keyof的结果是string|numer|...)
*/

// 其它1：T[K]中，T是特殊的单类型
type S1 = any['a'];
type S2 = never['toString'];

// 其它2：T[K]中，T是包装类型
type S3 = 'a'['toString'];
type S4 = string['toString'];
type S5 = String['toString'];
type S51 = Exclude<keyof String, never>;
type S6 = 1['toString']; // 1 as Number, more ...

// 其它3：T[K]中，T是枚举类型
enum T10 {a, b, c, d='abc'};   // Enum
type T11 = keyof T10 // "toString" | "valueOf" ？ -> 下一讲
type T12 = T10['toString'];
```

```javascript
type T = [...['a',1,string],...any[],args:string[]]
type T0 = T[0|5] // any
type T1 = T[1]
type T2 = T[2]
type T3 = T[3]
type T5 = T[5]
type T6 = T[6]
type T7 = T[7]
type L  =T['length']
// 获取T最后一个元素类型
type Pop<T> = T extends [...any[], infer Last] ? Last : never;
type Last = Pop<T>;
```
#### 19 keyof
```ts
/* 第17讲
type X = T1 & T2; // 交叉
type T4 = X['c']; // 求值X

type U = T1 | T2; // 联合
type T81 = U['c'|'b']; // 1、检查 ('c' | 'b') in (keyof U)
type T82 = (U | {a: boolean})['a']; // 2、T1['a'] | T2 ['a'] | .. | Tn ['a']
*/

/* 第18讲
// 一般用法
type T3 = T1['a']; // 单类型, subtype of string|number|symbol

type X = T1 & T2; // 交叉
type T7 = T1[X]; // （先求值T）求值X
type T8 = T1['a'|'c']; // 联合  
type T81 = T1['a'] | T1['c'];
*/
interface T {
    a: string;
    c: number;
}

type U = keyof T; // 结果是string|number|...

// keyof anything
type T1 = keyof never;
type T2 = keyof any;
type T3 = keyof void; // 单类型：void, unknown, undefined, null
type T4 = keyof 'a'; // 单类型：包装类('a', string, String, 1, ...)
type T5 = keyof T;  // 单类型：接口类型(interfaces, lists, object, function, class, ...)
type T51 = keyof {};  // never, and `interface Empty { }`
type T52 = keyof object;  // never
type T53 = keyof (()=>void);  // never
type T54 = keyof (new () => void);  // never, and `class Empty { }`
class MyClass { a: 100 };
type T55 = keyof typeof MyClass; // 'prototype'

let v = {a: 1, b: 'abc'};
type T6 = keyof typeof v;  // 表达式类型：非联合，总是求值
type U1 = ({       // 表达式类型：联合（ex: T1 | T2  |.. | Tn）
    a: string;
    b: string;
  } | {
    a: string;
    c: number;
  });
type T7 = keyof U1; // ex: keyof T1 & keyof T2 ... & keyof Tn （比较特殊、17讲中有讲过）
// => "a"

// 索引存取运算中的枚举类型（T[...]）
// - 1、检查 ... in (keyof T)
// - 2、T1['a'] | T2 ['a'] | .. | Tn ['a']
// 其它3：T[K]中，T是枚举类型
enum T10 {a, b, c, d='abc'};   // Enum
// enum T10 {a = 0, b = 1, c = 2, d='abc'};   // Enum
type T11 = keyof T10
/*
keyof T10 =
  keyof (T10.a | T10.b | T10.c | T10.d) // 枚举类型在ts中表现为联合
  (keyof T10.a) & (keyof T10.b) & (keyof T10.c) & (keyof T10.d)
  (keyof 0) & (keyof 1) & (keyof 2) & (keyof 'abc')
  (keyof Number) & (keyof Number) & (keyof Number) & (keyof String)
  (keyof Number) & (keyof String)

  // enum EE { } 空枚举 -> 数字类型枚举 // (keyof Number)
*/
type X1 = Exclude<keyof Number, never>; // 数字枚举(keyof Number)
type X2 = Exclude<keyof String, never>; // 字符串枚举(keyof String)
type T111 = (keyof Number) & (keyof String)

// => 结果： "toString" | "valueOf"

type T12 = T10['toString'];
type T121 = String['toString'] | Number['toString']

// => 结果：(() => string) | ((radix?: number) => string)

// 带索引签名的接口类型
type T13 = [string, number, 1]; // {[k: number]: string | number}
type T131 = Exclude<keyof T13, never>;
// number | typeof Symbol.iterator | typeof Symbol.unscopables | "0" | "1" | "2" | "length" | "toString" | "toLocaleString" | "pop" | "push" | "concat" | "join" | ... 22 more ... | "includes" 
// => number 无法与其它字符串合并
type T14 = object[]; // {[k: number]: object}
type T141 = Exclude<keyof T14, never>;
type T15 = {
    [k: string]: any;
    a: 1;
    b: 'string';
    3: true;
}
type T151 = Exclude<keyof T15, never>; // string | number => string 对其他的key进行了合并
type T152 = Pick<T15, keyof T15>; 
// {
//     [x: string]: any;
//     [x: number]: any;
// }
type T153 = Omit<T15, never>;
// {
//     [x: string]: any;
//     [x: number]: any;
// }
```
#### 20 映射类型
```ts
/* 前置知识
1、keyof只返回 string|number|symbol|never 以及它们的子类型的联合。
2、'a' 能赋值给 string，但反过来string不能赋值给'a'；etc. 
3、A extends B ? X ：Y  => 简单语义：如果A能够赋值给 B，则 X,否则 Y
*/
type T = {
    [k: string]: string | number;
    a: string;
    b: number;
    readonly c: 1;
}

// 一般使用
type T1 = {
  -readonly [k in keyof T]: T[k]; // readonly or optional ..
}

// 自定义的联合
type U = Exclude<keyof T, 'b'>; // or any union type
type T2 = {
  [k in U]: any; // or any types
}

// 断言语法
type T3 = {
  [k in U as string]: any;  // k as string
}

type T31 = {
  [k in string]: any;
}

type T32 = {
  [k: string]: any;
}

// 联合成员的过滤1：extends
type keys = keyof T;
type U1 = 'a' | 'b';
type T4 = {
  [k in keys as (// keys => string | number（keyof T 联合合并到了）
    k extends U1 ? k : never)]: T[k];  // make a accepted list
}
// => {}

type U1 = 'a' | 'b';
type T4 = {
  [k in keyof T as (
    k extends U1 ? k : never)]: T[k];  // make a accepted list
}
// => {a:..,b:..}

/*
// 当声明string类型的签名时，number是隐式声明的
type T5 = Omit<T, never>;
type T6 = Exclude<keyof T, never>

// 数组或元组是带索引签名的，并且keyof中的数字索引是转换成字符串key的
type T7 = Exclude<keyof [string, number, boolean], never>;
*/

// 联合成员的过滤2：keyof T 在in的右侧时，求值但不合并
type T9 = {
  [k in keyof T as (  // keyof T 在in的右侧时，求值但不合并
    k extends 'c' ? k : never)]: T[k];
}
// => {c:..}

// 非联合成员：模板字符串字面类型
type P = `a${string}b`
type T10 = {
  [k in P]: any;
}
...
```
将元祖转换为类数组 TupleToArrayLike
```ts
// 官方（lib.ews5.d.ts）中ArrayLike如下：
interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
}
// ai 给出的类数组，如下：
interface ArrayLike<T> {
  readonly length: number;
  [n: number]: T;
}
// 测试一下
type A = ArrayLike<number>
var a:A = [1]
function foo1 <T>(...a: T[]){
  const arg:ArrayLike<T>  = arguments
  return arg
}
function foo2 <T>(a: T){
  const arg:ArrayLike<T>  = arguments
  return arg
}
// 官方和ai区别就是：索引签名 [n: number]: T 中的元素可以是可变的或不可变的，暂且不管
// 就以ai给的为标准
// 分析：类数组与数组的不同
// 1、类数组只有number类型的key，数组除了numbe类型的key以外还有（toString、length、splice...）；
// 2、类数组length只读，数组的length可变；
// 思路：
// 1、因为元祖T本质还是一个数组，k in keyof T时候，数组的属性和方法（toString、length、splice）都会在遍历中生成，要把和number无关的删除掉，使用never;
// 2、单独保留 length 并且 readonly
type TupleToArrayLike<T extends unknown[]>  = {
  [k in keyof T as k extends number ? k :  never ]:T[k];
} & {readonly length:T['length']}

// 再进一步
// `${number}`
type TupleToArrayLike<T extends unknown[]>  = {
  [k in keyof T as k extends `${number}` ? k :  never ]:T[k];
} & {readonly length:T['length']}

// 再进一步
// 类数组的length不固定、元祖length固定
type TupleToArrayLike<T extends unknown[]>  = {
  [k in keyof T as k extends `${number}` ? k :  never ]:T[k];
} & {readonly length:number}

type Tu = ["string", "1", 'a'];

type B = TupleToArrayLike<Tu>
// type B = {
//     0: "string";
//     1: "1";
//     2: "a";
// } & {
//     readonly length: 3;
// }

// 终极答案
type TupleToArrayLike<T extends any[]> = {
  [K in keyof T as K extends number|&#34;length&#34;|`${number}` ? K : never]: T[K];
};

type TupleToArrayLike<T extends any[]> = {
  [K in Extract<keyof T, number|&#34;length&#34;|`${number}`>]: T[K];
};

type R<T extends any[]> = {
  [key in Extract<keyof T, &#34;length&#34;|number|`${number}`>]:
    key extends &#34;length&#34; ? number : T[key];  // &#34;length&#34; 需要单独处理
}

type TupleToArrayLike<T extends any[]> = Pick<T, number|&#34;length&#34;|(keyof T & `${number}`)>;
```
#### 21 模板字面量类型
```ts
// 模板字面量类型
type T = `abc`; // 简单字符串
// （带模板参数的）模板字面量类型
type T1 = `a${string}c`; // 模板字面量类型
// ----------------------------------------
// 将模板字符串用于其它类型表达式
// ----------------------------------------
// interface, object literal or alias types with index signature
type T2 = {
    [x: T1]: number; // deny type T
    abc: 1;
    abbc: 2;
    abac: boolean; // => 报错，boolean与number不匹配
    abaaac: 4;
    abb: 5;
    abokn: boolean;
}
type P2 = T2[T1]; // support template with variables/parameters, but will pre-check `keyof T1`
// mapping, as index signature
type T3 = {
    [k in T1]: number; // support
    // 'abc': 1;       // deny
}
// keyof T
type U2 = keyof T2;   // support
type T4 = T3 & {
    // [x: T1]: number;
    abc: 1;
    abbc: 2;
    abac: boolean;
    abaaac: 4;
    abb: 5;
    abokn: boolean;
};
type P6 = T4[`a${string}c`];
// mapping with intersection
type T5 = {
    [k in keyof T4]: T4[k];
}
// A | B
type T6 = `a${string}c` | 'ab' | 'abb' | 'ac' | 'abc'; // support and merged
// A & B
type T7 = `a${string}c` & 'abc'; // support and converged
// ----------------------------------------
// 将其它类型表达式用作模板参数
// ----------------------------------------
type U = 'a' | 'b';
type T10 = `a${U}b` // => "aab" | "abb"
type X = keyof T2; // 1、keyof T和`...`总是安全的；2、typeof V，T[K]，A & B总是预先求值；3、映射与展开总是不兼容的
type T11 = `a${X}b`; // 总是求值X，并确定X是否满足“模板参数”的条件

// ----------------------------------------
// 多模板参数的情况
//  - 可以用正则表达式来表达！(注意如下的空格只是用来排版的)
//  - 模板变量（类型）：subtype of 'string | number | bigint | boolean | null | undefined ｜ never'
// ----------------------------------------
// 1) 如果string、number或bigint用作最后一个模板变量
type T201 = `a${string}b`; // .*
type T202 = `a${number}b`; // [0-9.]{1,}, more... ex: 112.2e3
// 如果是一个超过数字边界（超大的）数字，那么它会被理解为number类型来参与匹配（也就是说，数字的有效范围被一定程度上是忽略的）
let x1: T202 = 'a11999999999999999999999999999999934513590134519999999999999999999999999999999999999999999999999999999999999999999999999999999999999999935094135135134511b'; // pass
// bigint字面量会被作为一般数字类型解析（末尾没有n）
let x2: `a${bigint}b` = 'a1134514b'; // let x = 1134514n;
// 2）与定界符或其它变量的交互作用
//  - 字符串字面量和true/false/null/undefined总是作为“有限个确定字符的字符串（定界符）”去匹配
//  - 在右侧没有有效“定界符（字面量）”的情况下，${string}、${bigint}和${number}有着额外的处理逻辑
//  - ${string}、${number}、${bigint}和${infer X}都不能作为“定界符”。这使得它们
//     * 是最后一个模板变量时，就采用贪婪匹配（采用.*）；
//     * 右侧是非定界时，就采用尽量少的匹配（采用.）；
//     * 右侧是定界且还有其它非定界时，就采用非贪婪匹配（采用.*?）。
type T21 = `a${U}   ${number}b`;    // (U1|U2|...|Un)
        // `a(U1|U2)${number}b`
type T22 = `a${string}XXXX`;        // .*
        // `a.*       XXXX`;
type T23 = `a${string}${number}b`;  // .
        // `a.        ${number}b`
type T24 = `a${string}X${number}b`; // .*? （非贪婪）
        // `a.*?      X${number}b`
let X22: T22 = 'a1bbbca43asdfasd134513f12aaa34134bbbc43XXXX';
let X23: T23 = 'aa111234b';
let X24: T24 = 'a1ba111abbcX43b';
// 3) 0-3个字符
type CH_A = 'A';
type CH_B = 'B';
// ...
type CH_Z = 'Z'; // @see faker-js/faker/src/modules/string/index.ts
type CH = CH_A | CH_B | CH_Z; // A..Z
type NUL = ""
type CHS = `${CH|NUL}${CH|NUL}${CH|NUL}`
// 本讲最后的示例就是“字符表”的生成
type upper = CH_A | CH_B; // ... | CH_Z
type lower = Lowercase<upper>;
type alpha = upper | lower;
type digit = 0 | 1 | 2; // ... | 9
type alnum = alpha | digit;
type space = ' ' | '\t';
type blank = space | '\n' | '\r' | '\v' | '\f'; // ... | `\u00a0\u1680\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff`
// [:alnum:] - 字母数字字符
// [:alpha:] - 字母字符
// [:digit:] - 数字: '0 1 2 3 4 5 6 7 8 9'
// [:lower:] - 小写字母: 'a b c d e f g h i j k l m n o p q r s t u v w x y z'
// [:upper:] - 大写字母: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'
// [:blank:] - 空字符: 空格键符 和 制表符
// [:space:] - 空格字符: 制表符、换行符、垂直制表符、换页符、回车符和空格键符
// [:punct:] - 所有标点符号: .,;:!?./-"\'#{([-|\\@)]=}*+
// Separators - 字符分隔符: `${space}${numeric}-_.`
type ToUnion<T extends string> =
    T extends `${infer U}${infer V}` ? U | ToUnion<V> : never;
type S = 'abcdefghijklmnopqrstuvwxyz';
type Low = ToUnion<S>;
```
```ts
type Email = `...`
let mail:Email = 'aaa.bbb@mail.com'

type Url = ``
let url :Url = https:www.baidu.com
```
#### 22 条件类型
```ts
// 条件类型：类型检查
type L = 'abc';
type R = string;
type T = L extends R ? true : false;  // L extends R ? X : Y
// 示例，从映射中去除签名
type T1 = { // jike/20/t.ts
  [k: string]: string | number;
  a: string;
  b: number;
  c: 1;
}
type T2 = {
  [k in keyof T1 as (
    string extends k ? never : k
  )]: T1[k];
}
type T21 = Exclude<keyof T1, string>;
// 两种语义（基础类型，注意交换L/R与交换X/Y是不同的）
type Is<T, target> = T extends target ? 'true' : 'false';
type Equal<T, target> = target extends T ? Is<T, target> : 'false'; // WARNING!
type C1 = Is<'abc', string>
type C2 = Equal<string, string>
// 裸类型参数
type X<T> = T;
// 非裸类型参数
type XN1 = `${U}`;
type XN2 = U[];
type XN3 = [U];
type XN4 = X<U>;
type XN5 = Promise<U>;
// 两种特殊的“裸类型参数（naked type parameter）”
//   - 作为“泛型参数”传入
//   - 以“祼类型参数”的形式参与extends左侧运算
type U = 'a' | 2;
type X1 = Is<U, string>;   // X, Y, X|Y
type X2 = Is<never, string>; // never
// any是特殊的（boolean与enum并不特殊，它们都是按联合来处理的）
type X3 = Is<any, false>;
type X31 = any extends false ? 'true' : 'false';
type X4 = Is<boolean, true>;
type X41 = boolean extends true ? 'true' : 'false';
enum E {a, b, c}
type X5 = Is<E, 1>;
type X51 = E extends 1 ? 'true' : 'false';
// 【问题】在类型集合（Collections）中，将基础类型与结构类型分开处理
//  - 表达式类型：联合（包括boolean/enum）
//  - 单类型：数组、元组、string、number、symbol、bigint
//  - 单类型（特殊类型）：any和never
type O1 = { a: 'a' };
class O2 { a: 'a'};
enum O3 {a, b};
function O4() { };
interface O5 { };
type Arr = string[];
type Tuple = [1,2,3];
type B1 = Exclude<
  'a' | 1 | null | 223 | bigint | O1 | O2 | O3 | O5 | Arr | Tuple | typeof O4 | typeof O2,
  object>;
type B2 = Extract<
  'a' | 1 | null | 223 | bigint | O1 | O2 | O3 | O5 | Arr | Tuple | typeof O4 | typeof O2,
  object>;
```
```ts
// 使用条件类型来分别得到一个接口的签名和成员列表
type T = {
    [k:string | symbol | number]:string | number
    a:string
    b:number
    c:1
}
type Keys<T, P = PropertyKey> = keyof {
    [k in keyof T as
        true extends (P extends k ? true : never) ? never : k]: any
};
type keys = Keys<T>
type Signs<T> = Exclude<keyof T, Keys<T>>;
type signs = Signs<T>


// 分析过程
// 第一步分析 P extends k ? true : never，
// k 分为两种情况：sign：string 和 key：“a”
// P 也有两种情况：直接 和 泛型传参
// 1、P 直接 条件判断 => 结果都是never
type T1 = PropertyKey extends string ? true : never //never
type T11 = PropertyKey extends "a" ? true : never //never
// 2、P 使用泛型传参 条件判断 => 得到不同的结果
type T2<T> =  T extends string ? true : never
type T22 = T2<PropertyKey> // sign string => true   
// 得到结果以后，第二步分析 true extends resType（true 和 never） ? never : k
type T4 = true extends true ? never: string // never
// string => never => 排除
type T3<T> =  T extends "a" ? true : never
type T33 = T3<PropertyKey> // key "a" => never
type T5 = true extends never ? never: "a" // "a"
// T5 key "a" => "a" => 得到key

// 实现 Keys<T, P = PropertyKey>
// 关键点是：never 和 true 的巧用以及PropertyKey 泛型传参的巧用
// 得到keys
// 排除 sign: string | symbol | number
// 比较复杂
```
#### 23 赋值兼容性再说明
```ts
// BAD CASE
type SingleUnion = any | never | unknown | void | null | undefined | 1 | 'a' | string | true | false | boolean;
type U1 = SingleUnion extends 'a' ? true : false;
type U2 = {
    [key in SingleUnion]: SingleUnion extends SingleUnion[key] ? true : false;
}
// Tuple based
type Singles = [any, never, unknown, void, null, undefined, 1, 'a', string, true, false, boolean];
type X = Omit<Singles, never>;
type T = {
    [k in keyof Singles as (  // Singles is Tuple
        k extends symbol
            ? never
            : k extends infer X extends string
                ? `${X}` extends `${number}`
                    ? k
                    : never
                : never
    )]: Singles[k] extends 'a' ? true : false
};
type T1 = {
    [k in keyof Singles as (
        k extends string
            ? `${k}` extends `${number}`  // k extends `${number}`
                ? k
                : never
            : never
    )]: Singles[k] extends 'a' ? true : false
};
type T2 = {
    [k in keyof Singles as (
        k extends string & `${number}`
            ? k
            : never
    )]: Singles[k] extends 'a' ? true : false
};
type T3 = {
    [k in keyof Singles as Extract<k, `${number}`>]: // `${number|'length'}`
        Singles[k] extends 'a' ? true : false
};
type T4 = {
    [k in keyof Singles]: k extends `${number}`
        ? Singles[k] extends 'a' ? true : false
        : Singles[k]
};
// -------------- 我是分隔线 --------------
type T6<T> = {
    [k in keyof T]: k extends `${number}`
        ? T[k] extends 'a' ? true : false
        : T[k]
}
type T61 = T6<Singles>;

// 在泛型工具的出口，映射类型会做一些后续处理，例如将结果修正为元组或数组。参见如下
//  @see release-notes/typescript-3-1.html#mapped-types-on-tuples-and-arrays
//  @see https://devsuhas.com/2018/11/18/typescript-3-1/
// 必须是1、是用keyof来操作的裸类型参数；2、是完全映射（即使是`... as k`也是不行的）
type MapT<T> = {
    [k in keyof T]: T[k]
}/*  */
type T7 = MapT<Singles>;
type T71 = MapT<T4>;
type MapTX<Source, T> = {
    [k in keyof Source]: k extends keyof T ? T[k] : Source[k]
}
type T72 = MapTX<Singles, T2>; // ObjectToTuple<>
type MapMatrix<Source> = {
    [k in keyof Source]: k extends `${number}`
        ? MapTX<Source, {
            [i in Extract<keyof Source, `${number}`>]:
                Source[k] extends Source[i] ? true : false
          }>
        : Source[k]
}
type T8 = MapMatrix<Singles>;
```
```ts
// 添加标题头和标题列
type MapTX<Source, T> = {
    [k in keyof Source]: k extends keyof T ? T[k] : Source[k]
}
type MapMartix2<Source extends any[]> = [['', ...Source], ...{
    [k in keyof Source]: k extends `${number}`
        ? [Source[k], ...MapTX<Source, {
            [i in Extract<keyof Source, `${number}`>]:
                Source[k] extends Source[i] ? true : false
          }>]
        : Source[k]
}]
type TEST = MapMartix2<Singles>
```
#### 24 将条件类型用作操作数（X、Y）
将L、R用于X、Y
```ts
// 基本逻辑
type L = 1
type R = 2
type X = 3
type Y = 4
type T = L extends R ? X : Y;  // L&R, X, Y, X | Y, never
// @see release-notes/typescript-4.9.html
interface Animal { type: string }
interface Zoo<T extends Animal> { // 这里需要多做一次运算
  // ...
}
// 在X位置，引用L，有可能得到一个 L&R 结果，消除一次运算
type MakeZoo<A> = A extends Animal ? Zoo<A> : never;
                                  // ^b1
// case 1
type Pig = { type: 'pig', leg: 4 };
type Pig2 = Omit<Animal &Pig, never>;
type b1 = Pig extends Animal ? true : false;
type b2 = Pig & Animal extends Animal ? true : false;

// case 2
type Tx<L, R> = L extends R ? ['X', L, R] : ['Y', L, R];
type b4 = Tx<boolean, true>
type b3 = Tx<any, never>; // ["X", never, never] | ["Y", any, never]
// X = L = L & R
// -------------------- 我是友好的分割线 --------------------
// keyof T
//   - 求值结果T：anything
type T1 = keyof 's' extends string ? true : false; // BAD CASE
type T2 = keyof ('s' extends string ? true : false);
// T[x]
//   - 求值结果T：anything
//   - 求值结果x：never | string | symbol | number ｜subset union，And x in keyof T，
type A = {a: string; b: number; c: 1}
type T3 = A['s' extends string ? 'a' : false]; // NOTE: 注意false分支在这里是无意义的
type T4 = ('s' extends string ? 'a' : never)['toString']; // NOTE: 注意never，同上。
// A | B
//   - 求值结果：anything
type T5 = {} | ('s' extends string ? {a: string} : {})
// A & B
//   - 求值结果：anything
type T6 = {} & ('s' extends string ? {a: string} : {})
// A extends B ...
//   - 求值结果：anything
type T7 = 's' extends string
            ? `${number}` extends string
              ? true
              : false
            : never;
type T71 = ('s' extends string ? {a: string} : {}) extends
            ('' extends `${number}` ? {a: string} : {}) ? true : false;
type T711 = {a: string} extends  {} ? true : false;
// ...T
//   - 求值结果：never | array | tuple | union
type T8 = [...('s' extends string ? [] : never)];

// `${...}`
//   - 求值结果：never | string | number | bigint | boolean | null | undefined ｜subset
//   - any
type T9 = `...${'s' extends string ? any : never}`;
// x in U as K
//   - 求值结果U：never | string | symbol | number ｜subset union，@see x in T[x]
//   - 求值结果K：（同上）
type T10 = {
    [k in 's' extends string ? {a: string} : {} as
      's' extends string ? keyof {a: string} : keyof {}]: any
}
// 结构类型的成员类型
type T11 = {
  a: 's' extends string ? [] : never;
}
```
#### 25 在条件中使用其他类型（L、R）
```ts
// 基本逻辑
type L = 1
type R = 2
type X = 3
type Y = 4
type T = L extends R ? X : Y;
/* 以下是惰性求值在【表达式类型】中的情况
  - 某些情况下，是TypeScript中“显示类型的方式”表现出来的“类似于延迟计算”的现象
    @see release-notes/typescript-4.2.html `Type Alias Preservation`
    @see release-notes/typescript-5.0.html `Type display`
*/
//  - 带模板参数的模板字符串字面量类型
type T1 = `_${string}_`;  // `_${string}_` ...
type Trans<T> = T;  // 验证
type TransX = { a: keyof X2 }; // 验证2
//  - 某些keyof T
type X2 = {a: string; b: number};
type T2 = keyof X2;
//  - 某些typeof V
let v = {a: 'a', b: 1};
function FooX() { }
class MyClassX {}
type T3 = typeof FooX;  // 某些情况下（例如FooX或v）是直接求值的
//  - 某些含剩余元素语法的元组
type T4 = [number, ...string[]];
type T41 = [...string[]]; // 这个不是惰性求值的
type T42 = [...T4]; // （同上）
//  - 带惰性求值类型的映射
type T5 = {
    [k in `_${string}_`]: any;
}
type T51 = { [k in string]: any; } // string是单类型（非惰性的、非表达式的），将求值到一个带索引签名的对象类型
type T52 = { [k in keyof T4 as string]: any; } // （同上，求值计算过程之后，结果被优化）
//  - 结构类型的交叉（包括在类型收窄等在内的多数情况下）
type T6 = typeof v & {a: string};
//  - 索引访问由于要检查下标，所以通常“总是”非惰性的
// （略）
//  - 联合类型（对结构类型和表达式类型总是尽量惰性求值）
// （略）
// -------------------- 这里是友好的分割线 --------------------
/* 以下是惰性求值在【单类型】中的情况
  - 带泛型参数的结构类型（单类型）也是惰性求值的，但在语义上是【实例化】一个泛型声明，而不是求值。
*/
type T7<T> = { a: T, b: T | string }
type T8<T> = () => T | null;
class MyClass<X> { foo: T8<X> };
// more ...

// 以下两种，都称为“未实例化的类型”：
//  - A: 如果工具类型的求值结果是返回一个参数化类型的自身，那么该工具类型可以视为“未实例化的类型”。
//  - B: 任何带参数的结构类型，都可以称为“末实例化的类型”。
type A1<T> = {[k in keyof T]: any}; // ex, Record<>
type B1<T> = {a: T};  // ex, Array<>
// 反例（Exclude, ...）
type IsNever<T> = never extends T ? true : false;
type C1 = IsNever<never>;
type IsNever2<T> = T extends never ? true : false;
type C2 = IsNever2<never>;
// -------------------- 分割线+1 --------------------
// 以上所有类型（包括单类型）作为条件表达操作数
//   - 如果是L/R操作数，总是立即求值的（除非L是裸的never类型）
//   - 如果是True/Flase分支，则是在该分支中作为结果被返回的（只作传出没有后续计算时，通常不求值）
type T10 = keyof X extends (typeof v & {a: string}) ? T2 : typeof v & {a: string};
type T11 = {a: 'abc', b: 10} extends (typeof v & {a: string})
    ? keyof X  // try `keyof X2`, or `T2`
    : typeof v & {a: string};
// 如果有未实例化的类型，那么将部分地（尽量地）考虑该类型的可兼容性赋值的状况
//   - 最终有可能返回惰性的求值结果（表达式本身）
class MyClass2<T> {
    foo(x: T) {
        return x;
    }
    func!: { (y: T, ...args: any[]): T[] }
}
type T12 = typeof MyClass2.prototype;
type T13 = T12['foo'] extends T12['func'] ? true : false;
// -------------------- 增强版的分隔线 --------------------
// -------------------- 增强版的分隔线 --------------------
// -------------------- 增强版的分隔线 --------------------
// 【延迟求值 vs. 未实例化类型】
// NOTE：讲述，什么是“严格意义上的”惰性求值（亦即是延迟计算，deferred）

// 1) 所有“未实例化的类型”都是延迟求值的，直到它的参数能被代以确定的类型值为止。
class MyClass3<X> {
    a!: A1<X>; 
    b!: 1;
    constructor(x: X) {}
}
// 实例化的
let x =  new MyClass3('a');
type TypeOfX = typeof x;
// 未实例化的
//   - 注意在这里MyClass2.a是声明了一个“A1”类型，后者显然是映射类型，但是它是“未实例化的”，并且由
//     于类型X未知，所以它在后续运算是“总是”处于未实例化的状态。
type TypeOfX2 = typeof MyClass3.prototype;

// 2) 那么两个“延迟求值的表达式类型”如何比较兼容性呢？
//  - 有泛型参数，并不一定就是延迟计算的 @see release-note/typescript-2.8.html
type Tx1 = TypeOfX2 extends {b: number} ? true : false;
//  - Tx2将是延迟求值的（Deferred）
type Tx2 = <X>() => X extends 'T' ? 1 : 2;
type Tx21 = Trans<Tx2>;
type Tx22 = {
    a: <X>() => X extends 'T' ? 1 : 2;
}
//  - compare 'T1 extends U1 ? X1 : Y1' and 'T2 extends U2 ? X2 : Y2'
type Tx3 = 
    (<X>() => X extends 'T' ? 1 : 2) extends
    (<Y>() => Y extends 'U' ? 1 : 2)
        ? true
        : false
```
#### 26 分布式条件类型的应用
```ts
// 基本语法与惯例
// --------------------------------------
// 1
type TNT = | never;
type TNT2 = 'a' | never;
// 2
type TTT<T> = T extends T ? T : never;
// 3
type TRT<T, R = T> = T extends R ? Exclude<R, T> : never;
// 4
type TUT<U> = [U] extends [any] ? true : false;
type TUT2<U> = [U] extends [never] ? true : false;
// 与其它表达式的关系与应用（1）
// --------------------------------------
// keyof T
//      ===> keyof T1 & .. & keyof Tn
interface Bird {
  weight: boolean;
  leg: number;
  wings: number;
}
interface Horse {
  [x: string]: any;
  weight: number;
  leg: number;
  id: string;
}
type U = Bird | Horse;  // Animal
type X = Bird & Horse;  // BirdAndHorse
type T1 = keyof U; // "weight" | "leg"
type T2 = keyof X; // "weight" | "leg" | "wings" | "id"
// BUT, when X equal never ????!
// U extends ...
type AllKeys<T> = T extends T ? keyof T : never;
type T11 = AllKeys<U>;
type T21 = AllKeys<X>;

// remove index signatrues
//  - 映射是处理一个结果集合中存在“可能被联合合并掉的成员”的唯一有效方法
type NoSign<T> = {
  [k in keyof T as
    (string|symbol|number extends k ? never : k)]: T[k]  // 这里需要分布式联合，但却并没有作为祼类型参数（所以不能用）
}
type T22 = NoSign<Bird>; //会返回所有


// 为了使得联合类型获取所有共同的key
// T extends T 为的是 Bird的key weight | leg | wings 再联合 Horse key weight | leg | id
// (Bird extends U) ? keyof {[k in keyof Bird as .....] } | (Horse extends U) ? keyof {[k in keyof Horse as .....] }
// type TTT<T> = (A extends T ? A : never) | (B extends T ? B : never);

//  X=PropertyKey X extends k 裸类型 +  ? k : never) extends never ? k : never 过滤掉签名 
// 解释 ? k : never) extends never ? k : never 为什么要多加一层判断
// 过滤签名是 PropertyKey 与 2层判断共同的作用
// type a3<T = PropertyKey> = (T extends string ? never:string)
// type a33<T = PropertyKey> = (T extends string ? string:never)
// type a31 = a3<PropertyKey>
// type a331 = a33<PropertyKey>
// a33 与 a331 结果一样
// 因为 a33 结果是 never | string | string => 最终结果都是 string
// 因为 a331 结果是 string | never | never => string 

type AllKeys2<T, X=PropertyKey> = T extends T 
  ? keyof {
      [k in keyof T as
        (X extends k ? k : never) extends never ? k : never
      ]: T[k]
    }
  : never;
type AllKeys3<T, X=PropertyKey> = AllKeys<T extends T
  ? {[k in keyof T as
      (X extends k ? k : never) extends never ? k : never
     ]: T[k]
    }
  : never>;

type T3 = AllKeys<any>;
type T4 = AllKeys2<any, number>;
type T41 = AllKeys3<U>;
// 与其它表达式的关系与应用（2）
// --------------------------------------
// T[k]
//      ===> T[k1] | .. | T[kn]
//      ===> T1[k] | .. | Tn[k], k in keyof T
type AllValues<T, K = keyof T> = T extends object
    ? K extends keyof T ? T[K] : never
    : never;

type AllValues2<T, K = AllKeys2<T>> = T extends object
    ? K extends keyof T ? T[K] : never
    : never;
type T5 = AllValues2<X>;
type T51 = AllKeys2<X>;
// `_${T}_`
//      ===> `_${T1}_` | .. | `_${Tn}_`
type U6 = 'a' | 'b';
type T6 = `_${U6}_`;
type PatX<U> = U extends string ? `_${U}_` : never;
// type PatX1<U> = `_${U extends string ? U : never}_`;
// type PatX2<U extends string> = `_${U}_`;
type T61 = PatX<U6>;
// Naked
type PatX3<U extends string> = `${U}` extends string ? [U] : never; // `${U}`是特例
type T63 = PatX3<U6>;
type PatX4<U>                = (U)    extends string ? [U] : never; // （与上例相似的语义）
type T64 = PatX4<U6>;
type Trans<T> = T;
type Trans2<T> = T[][number];
type Trans3<T> = boolean extends true ? never : Trans<T>;
type PatX5<U>                = Trans3<U> extends string ? [U] : never;
type T65 = PatX5<U6 | 'c'>;
type Trans6<T> = T extends T ? T : never;
// 这里Trans6<U>得到一个新的类型，不再是传入的U，所以不是分布式了
type PatX6<U>                = Trans6<U> extends string ? [U] : never;
type T66 = PatX6<U6 | 'c'>;
// [...T]
//      ===> [...T1] | .. | [...Tn]
//      ===> [...T1, ...T2, .., ...Tn]   << 这绝对是一个史诗级别的大难题！
// NOTE: 从联合中取出/列举出成员：从多重签名中推断，并使用递归来生成元组（Union To Tuple）
type U7 = ['a'] | ['b']; // U6 = 'a' | 'b';
type T7 = ['c', ...U7];
type T71<U> = U extends any[] ? ['c', ...U] : never;
type T72 = T71<U7>;
// { [k in U as 0]: k }
//      ===> { 0: U1| .. |Un }
type X8 = {
  [k in U6 as string]: k    // NOTE: 这里将会出现{ 0: U1| .. |Un }
}
type X81 = {
  0: "a";
//  0: "b";
//  ...
}
```
```ts
// 在一个联合类型中找到所有的Truthy类型
type Falsy = false | 0 | -0 | "" | null | undefined;
type NotFalsy<T> = T extends Falsy ? never : T
type Truthy = NotFalsy<false | 0 | -0 | "" | null | undefined | true | {} | { a: string } | (() => void) | []>
```
#### 27 推断
```ts
// 基础语法
type L = 1;
type R = number;
type T = L extends R ? true : false;
//-------------------------------------------------
// 1） 命名（声明临时变量/参数/类型参数）
//-------------------------------------------------
type TRT<T, R = T> = T extends R ? Exclude<R, T> : never;
type TRT2<T> = [T] extends [infer R]
   ? T extends R ? Exclude<R, T> : never
   : never;
type AllKeys2<T> = [T, PropertyKey] extends [infer R, infer X]
   ? T extends R
      ? keyof {
         [k in keyof T as
            (X extends k ? k : never) extends never ? k : never
         ]: T[k]
        }
      : never
   : never;
//-------------------------------------------------
// 2） 在语义上的`x in U`列举
//-------------------------------------------------
// 第26讲 @see jike/26/t.ts
type TTT<T> = T extends infer k ? k : never;
// type X8 = {
//    [k in T as 0]: k    // NOTE: 这里将会出现{ 0: U1| .. |Un }
//  }
//-------------------------------------------------
// 3） 解构（匹配、推断、提取）
//-------------------------------------------------
// 第21讲 @see jike/21/t.ts
//  - 定界符（定界字符串）、其它匹配（通用匹配）
type ToUnion<T extends string> =
    T extends `${infer U}${infer V}` ? U | ToUnion<V> : never;

type S = 'abcdefghijklmnopqrstuvwxyz';
type Low = ToUnion<S>;
// 基础类型可以转换成模板字符串处理
//  - string, number, bigint, boolean, true, false, null, undefined, never
//  - 某些情况下能处理的：any, never
//  - 不能处理的：symbol, unknown/void/this
type T2 = `aafdsf;ajl;dg` extends `${any}s${any}${infer x};${infer y}` ? [x, y] : false;
                              //   .*?   s.     .*?       ;.*
type T3 = never extends `a${infer x}${infer y}b` ? [x, y] : false;
// 结构类型使用匹配/提取的语义
//  - 只能使用一个剩余元素（rest elements）
type T4 = [string, 'a', number, false] extends [infer x, ...infer more] ? [x, more] : never;
type T51 = [string, 'a', number, false] extends [infer x, ...infer more, false] ? [x, more] : never;
type T52 = [string, 'a', number, false] extends [infer x, ...infer more1, number, ...infer more2] ? [x, more1, more2] : never; // BAD CASE
type X6 = {
  a: string;
  b: 1;
  c: 2;
  d: {
    1: string;
    a: number;
  };
};
type T6 = X6 extends {a: infer x; d: infer y} ? [x, y] : false;
type T7 = (a: string) => void extends (a: infer x) => infer y ? [x, y] : never;  // BAD CASE
      //  ----------     ------------------------------------
type T71 = ((a: string) => void) extends ((a: infer x) => infer y) ? [x, y] : never;
//  - 善用Pick<>/Omit<>
// rest properties ?
// type XX3<T> = T extends {'a': any; ...infer props} ? props : never;
type X7<T> = Omit<T, 'a'>;
// type XX4<T1, T2> = {...T1, ...T2};
type X8<T1, T2> = Omit<T1 & T2, never>;
```
#### 28 理解约束 constraint
```ts
//-------------------------------------------------
// 示例：使用递归来列举字符串和元组
//  - NOTE: TS 4.7+
//-------------------------------------------------
type ReverseString<T> = T extends string
   ? ReverseString<[T, ""]>  // warp in tuple and resend
   : T extends [infer T2, infer Result extends string]
        ? T2 extends `${infer C}${infer X}`
            ? ReverseString<[X, `${C}${Result}`]>
            : Result
        : never
type T8 = ReverseString<'abcd'>;
type T81 = ReverseString<['abcd', '']>;
type T82 = "" extends `${infer C}${infer X}` ? [C, X] : never;
type T83 = ReverseString<"">;
type T84 = ReverseString<never>;  // WARNNING: 在第一行检测时即返回
type T85 = ReverseString<any>; // ERROR
//-------------------------------------------------
// 约束的语义1 - “必须是”：限制推断类型（参数传入限制）
//-------------------------------------------------
type X6 = {
    a: string;
    b: 1;
    c: 2;
    d: {
      1: string;
      a: number;
    };
};
type T6  = X6 extends {a: infer x; d: infer y extends object} ? [x, y] : false;
//-------------------------------------------------
// 约束的语义2 - “将会是”：结果的类型
//-------------------------------------------------
type T7 = 'a11.234true1234aabc' extends
    `a${infer x extends `1${infer y}`}true${string}` ? [x, y] : never;
//    .*?                .*?          true.*
type T71 = 'a423true1234aabc' extends
    `a${infer L}${infer X extends number}${true}${infer R}c` ? [L, X, R] : never;
//    .         [0-9]+?                  true   .*
// 取枚举中的数字值（联合）
enum T { A, B, C, D, E='abc', F=5, G='def' }; // 0..3, 5
type T61 = `${Extract<T, number>}` extends `${infer N extends number}` ? N : never;
type T62 = `${Extract<T, string>}` extends `${infer S}` ? S : never;
//-------------------------------------------------
// 更简化的版本：使用递归来列举字符串和元组
//-------------------------------------------------
type ReverseString2<T extends string, Result extends string = ''> =
    T extends `${infer C}${infer X}`
        ? ReverseString2<X, `${C}${Result}`>
        : Result
type T20 = ReverseString2<'abcd'>;
```
```ts
// 翻转元组
type TupleCase = [1, '2', true, null, undefined, { a: Map<string, unknown>}, [], (() => void), never];
type ReverseTuple<T extends unknown[], R extends unknown[] = []> = T extends [infer First, ...infer Rest] ?
  ReverseTuple<Rest, [First, ...R]> :
  R;
type Result = ReverseTuple<TupleCase>;
```
```js
// 12讲中讲过
// 枚举 在ts中既声明为类型，又声明为值（相对js中）
// 利用这一点 typeof E 获取到它的类型，keyof 获取到它 key
enum E {
    A, B, C, D='d'
}
type B = keyof typeof E // A | B | C | D
```