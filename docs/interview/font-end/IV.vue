<template>
  <div v-for="item in data">
    <h4 v-html="item.text"></h4>
    <div v-for="ivItem in (item.iv || [])">
      <p v-html="ivItem"></p>
    </div>
    <IV :data="item.items"></IV>
  </div>
</template>
<script lang="ts" setup>
type DataType = {
  text: string, items: DataType
}[]

interface Props {
  data?: DataType | any[]
}

const { data = [] } = defineProps<Props>()

</script>
