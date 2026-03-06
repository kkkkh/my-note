作为表达式类型的联合、交叉
两个接口 -> 交叉 -> 公共子类
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

```ts
// 这是一个无解的题，它事实上与交叉运算“是否更积极地向never收敛”有关，
// 某些情况下，积极的收敛（向never求值）会导致TTT的结果，
// 另一些时候则不会。
// 而且，这个过程没有太明确的原则。

// 在我们的课程中，只是强调：交叉运算可以有求值结果，但求值计算不一定会发生。
// 说的是计算的非必然性，但对交叉结果是否“更积极地”的处理为never，是绕开了的。这既没有官方资料，也没有规则……
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


TypeScript在几乎所有与string | number类型相关的处理中，都需要小心。
因为对象的索引签名中有个潜规则，即“数字索引是字符串索引的子集”，因此几乎在所有有关这两个类型的计算都需要“特殊对待”。因为这个计算结果“有可能需要”在后续运算作为签名使用。
所以我们直观上觉得string & number的结果是never，——因为这两个类型、以及boolean都是primitive type——但它们却通常是用“string & number”这个未求值的表达式参与到后续计算中的。并且带来了非常非常多特例。
只能在使用中多留意了。
```