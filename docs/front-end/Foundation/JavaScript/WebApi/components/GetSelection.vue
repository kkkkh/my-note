<template>
  <div ref="refGetSelection">
    白日依山尽，黄河入海流
    <br />
    <span>123,456</span>
    <span>abc,def</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const refGetSelection = ref(null)
const handleSelectionChange1 = () => {
  let ranges = [];
  const sel = window.getSelection();
  console.log(sel.rangeCount) // 打印实际为1
  for (var i = 0; i < sel.rangeCount; i++) {
    ranges[i] = sel.getRangeAt(i);
  }
  console.log(ranges)
}
const handleSelectionChange2 = () => {
  var selObj = window.getSelection();
  var range = selObj.getRangeAt(0);
  console.log(range)

  // 选区的开始节点和结束节点
  const startNode = range.startContainer;
  const endNode = range.endContainer;
  console.log(startNode.nodeName) // SPAN

  console.log("选区开始节点：", startNode); // 就是选中的开始文字的所在节点
  console.log("选区结束节点：", endNode); // 就是选中的结束文字的所在节点
  // 选区包含的父级元素
  const commonAncestor = range.commonAncestorContainer; // 两个节点 共同往父节点以上找，找到共同的父级元素
  console.log("公共父节点：", commonAncestor);
}
onMounted(() => {
  document.addEventListener('selectionchange', handleSelectionChange1)
  document.addEventListener('selectionchange', handleSelectionChange2)
})
onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', handleSelectionChange1)
  document.removeEventListener('selectionchange', handleSelectionChange2)
})
</script>

<style scoped>
</style>
