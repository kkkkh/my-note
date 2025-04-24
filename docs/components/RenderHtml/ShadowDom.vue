<template>
  <div ref="shadowHost"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps({
  html: {
    type: String,
    required: true
  }
})
const shadowHost = ref(null);
onMounted(() => {
  const shadow = shadowHost.value.attachShadow({ mode: 'open' });
  shadow.innerHTML = props.html;
});
</script>
