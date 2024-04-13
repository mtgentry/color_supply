<template lang="pug">
  .color-row
    .color-box(v-for='(color, index) in colors' :key='index' :style='{backgroundColor: color}')

</template>

<script setup>
const props = defineProps({
  colors: Array
})

</script>

<style scoped lang="sass">
.color-row
  display: flex
  width: 100%

.color-box
  flex: 1 1 0
  height: 50px
</style>