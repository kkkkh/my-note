---
outline: deep
---
## flex

### 基础语法

### 进阶
#### 深入理解1-缩写语法

- flex属性是flex-grow，flex-shrink和flex-basis这3个CSS属性的缩写
- 建议使用单值缩写，而不是完整的3个属性值，因为单值属性所对应的flex计算值根据开发者日常最常用的使用进行了优化。

| 单值语法 | 单值语法 | 备注 |
| ----------- | ----------- | ----------- |
| flex: initial | flex: 0 1 auto |初始值，常用|
| flex: 0 | flex: 0 1 0% |适用场景少|
| flex: none | flex: 0 0 auto |推荐：适合不换行的内容固定或者较少的小控件元素上|
| flex: 1 | flex: 1 1 0% |推荐：适合平分场景|
| flex: auto | flex: 1 1 auto |适用场景少：适合按各自内容多少占比（基于内容动态适配的布局）|


- 助记：
  - flex: initial 就是 0 1 auto
  - flex: 0 在初始基础上，主要是flex-basis 为 0，
  - flex: none 是flex-grow/flex-shrink 为 0
  - flex: 1 是flex-grow/flex-shrink 为 1，flex-basis 为 0
  - flex: auto 是flex-grow/flex-shrink 为 1，flex-basis 为 auto，全部有值
- 区别
  - flex-basis 为 0，元素的最终尺寸表现为最小内容宽度；
  - flex-basis 为 auto，最终尺寸通常表现为最大内容宽度。

参考：[flex:0 flex:1 flex:none flex:auto应该在什么场景下使用？](https://www.zhangxinxu.com/wordpress/2020/10/css-flex-0-1-none/)


#### 深入理解2-缩写语法2
flex: none | auto | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```css
flex: auto;
flex: none;

/* 1个值，flex-grow，
此时flex-shrink和flex-basis的值分别是1和0% */
flex: 1;

/* 1个值，flex-basis，
此时flex-grow和flex-shrink都是1 */
flex: 100px;

/* 2个值，flex-grow和flex-basis，
此时flex-shrink使用默认值0 */
flex: 1 100px;

/* 2个值，flex-grow和flex-shrink，
此时flex-basis计算值是0%*/
flex: 1 1;

/* 3个值 */
/* flex: [ <'flex-grow'> <'flex-shrink'> <'flex-basis'> ] */
/* 长度值表示flex-basis，其余2个数值分别表示flex-grow和flex-shrink */
flex: 1 1 100px;
flex: 1 2 50%；
flex: 50% 1 2;
```

参考：[CSS flex属性深入理解](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-deep/)

#### 深入理解3-flex-basis

参考：[Oh My God，CSS flex-basis原来有这么多细节](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-basis/)


