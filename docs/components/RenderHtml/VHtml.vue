
<template>
  <div v-html="content"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps({
  html: {
    type: String,
    required: true
  }
})
const content = ref(null);
onMounted(() => {
  content.value = props.html;
});
</script>
