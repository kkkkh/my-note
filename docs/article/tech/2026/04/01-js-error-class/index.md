---
title: 自定义错误基类 CustomError
date: 2026-04-1
tags:
  - front-end
  - js
---
# 自定义错误基类 CustomError
## 封装场景
- 公共 request 工具
- 错误类型需要区分处理
- 项目会长期维护
- 需要日志上报 / 序列化
- 多人协作
- 有统一 UI 错误提示需求
## 普通 class 原型链
JS 的类，本质还是原型链
对象通过 `[[Prototype]]` 连起来 / instanceof 也是顺着原型链判断 / 方法其实放在 prototype 上
class 只是原型链的一层语法糖
```js
class Animal {
  speak() {
    console.log('speak')
  }
}
class Dog extends Animal {
  bark() {
    console.log('wang')
  }
}
const d = new Dog()
```
```js
d
→ Dog.prototype
→ Animal.prototype
→ Object.prototype
→ null

d.bark() // 找不到自己的 bark，就去 Dog.prototype 上找
d.speak() //Dog.prototype 没有，就继续去 Animal.prototype 上找
```
```js

d instanceof Dog // true
d instanceof Animal // true
d instanceof Object // true

// Dog.prototype 是否出现在 d 的原型链上
// Animal.prototype 是否出现在 d 的原型链上

d.__proto__ === Dog.prototype
d.__proto__.__proto__ === Animal.prototype
```
## Error

### 为什么手动继承
```js
// 强制把当前实例的原型，修正到“当前子类的 prototype”上
Object.setPrototypeOf(this, new.target.prototype)
```
- 但对 Error 这种内建对象，历史上存在一些坑
  - 某些环境里实例原型链不对
  - TS/Babel 编译后的结果在某些目标环境下不稳定
  - instanceof 判断可能异常
  - name、stack 等表现不统一
- 如果没有手动设置，if (err instanceof HttpError) 可能失效
