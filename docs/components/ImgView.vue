<template>
  <div>
    <div class="img-view" v-viewer>
      <img v-for="src in images" :key="src" :src="src">
    </div>
  </div>
</template>
<script setup>
  defineOptions({
    name: 'ImgView'
  })
  import 'viewerjs/dist/viewer.css'
  const props = defineProps({
    images: {
      type: Array,
      default: () => []
    }
  })
  // const images = ref( [
  //   "https://picsum.photos/200/200",
  //   "https://picsum.photos/300/200",
  //   "https://picsum.photos/250/200"
  // ])
</script>
<style lang="scss" scoped>
.img-view {
  img {
    width: 100%;
  }
}
</style>
