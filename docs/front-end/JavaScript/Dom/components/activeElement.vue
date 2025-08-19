<template>
  <div>
    <p>从下面的文本区域中选择一些文本：</p>
    <form>
      <textarea name="ta-example-one" id="ta-example-one" rows="7" cols="40">
        这里是一号文本区。这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本。
      </textarea>
      <textarea name="ta-example-two" id="ta-example-two" rows="7" cols="40">
        这里是二号文本区。这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本，这是一段文本。
      </textarea>
    </form>
    <p>激活的元素的 ID：<em id="output-element"></em></p>
    <p>选中文本：<em id="output-text"></em></p>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

const onMouseUp = (e) => {
  debugger
  const activeTextarea = document.activeElement;
  const selection = activeTextarea.value.substring(
    activeTextarea.selectionStart,
    activeTextarea.selectionEnd,
  );
  const outputElement = document.getElementById("output-element");
  const outputText = document.getElementById("output-text");
  outputElement.innerHTML = activeTextarea.id;
  outputText.innerHTML = selection;
}

onMounted(()=>{
  const textarea1 = document.getElementById("ta-example-one");
  const textarea2 = document.getElementById("ta-example-two");
  textarea1.addEventListener("mouseup", onMouseUp, false);
  textarea2.addEventListener("mouseup", onMouseUp, false);
})
</script>
<style lang="scss" scoped>
textarea{
  border: 1px solid #000;
  margin:0 4px;
}
</style>
