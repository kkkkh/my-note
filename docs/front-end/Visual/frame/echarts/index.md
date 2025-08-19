<script setup>
import Test from '@/components/Test.vue'
// import CodeCollapse  from '@/components/CodeCollapse.vue'
import BarChart from './components/bar.vue'
import BarAndLineChart from './components/barAndLine.vue'
import LineAndDetail from './components/lineAndDetail.vue'
</script>
# Echarts
## 常用配置技巧
### 柱状图显示多个数值

- 柱状图显示多个数值：中间位置 + 顶部位置
- X轴label超出范围...展示
- y轴最大值设置：预留顶部label展示空间
- 无数据：默认展示
<Test :is="BarChart" />
::: details 查看代码
<<< @/front-end/Visual/frame/echarts/option/bar.js
:::

### 柱状图+折线图

- 渐变颜色
- yAxisIndex 数据维度
- barGap 柱与柱之间的间距
<Test :is="BarAndLineChart" />
::: details 查看代码
<<< @/front-end/Visual/frame/echarts/option/barAndLine.js
:::

### 折线图+查看节点
- 增加监听事件
- vue组件 转为 htmlElement
<Test :is="LineAndDetail" />
::: details 查看代码
<<< @/front-end/Visual/frame/echarts/option/lineAndDetail.js
:::
