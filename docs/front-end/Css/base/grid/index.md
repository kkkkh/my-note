<script setup>
import repeat3 from '../components/grid/repeat_3.vue'
import autofit from '../components/grid/auto_fit.vue'
</script>
# grid
## 布局
- `grid-template-columns: repeat(3, 1fr);`
<repeat3></repeat3>
- `grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));`
<autofit></autofit>


