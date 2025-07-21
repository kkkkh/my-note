<script setup>
import Test from '@/components/Test.vue'
import BarChart from './components/bar.vue'
</script>
# Echarts
## 常用配置技巧
### 柱状图显示多个数值
- 柱状图显示多个数值：中间位置 + 顶部位置
- X轴label超出范围...展示
- y轴最大值设置：预留顶部label展示空间

<Test :is="BarChart" />

<<< @/front-end/Visual/frame/echarts/option/bar.js
