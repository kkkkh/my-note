<template>
  <div v-html="htmlContent"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const htmlContent = ref('');
const props = defineProps({
  url: {
    type: String,
    required: true
  }
})
onMounted(async () => {
  try {
    const response = await fetch(props.url);
    // debugger
    htmlContent.value = await response.text();
    // console.log(htmlContent.value)
  } catch (error) {
    console.error('Error fetching HTML file:', error);
    htmlContent.value = '<p>Failed to load HTML content.</p>';
  }
});
</script>
