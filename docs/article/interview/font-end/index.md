---
outline: deep
---

# interview

<IV :data="markdownContent" />


<script setup>
import IV from './IV.vue'
import { ref } from 'vue';
import { data } from './index.data.mjs'
import { withBase } from 'vitepress'
import markdownit from 'markdown-it'
// console.log(JSON.stringify(data,null,2))
const md = markdownit()
const markdownContent = ref('');

const filterHandle = (val) => {
  return val.filter(item => {
    if(item.items && item.items.length > 0){
      item.items = filterHandle(item.items) || []
      if(item.items?.length >  0){
        return true
      }
    }
    if(item.iv && item.iv.length > 0){
      return true
    }
    return false
  })
}

markdownContent.value = filterHandle(data)

</script>
