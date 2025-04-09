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

const md = markdownit()
const markdownContent = ref('');

const filterHandle = (val) => {
  return val.filter(item => {
    if(item.iv && item.iv.length > 0){
      return true
    }
    if(item.items && item.items.length){
      item.items = filterHandle(item.items) || []
      if(item.items.length >  0){
        return true
      }else {
        return false
      }
    }else{
      return false
    }
  })
}

markdownContent.value = filterHandle(data)

</script>
