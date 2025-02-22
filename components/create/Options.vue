<template lang="pug">
  #options
    div(v-show="selectedColor === null")
      CreateSliders
      v-divider
      VisualizePalettes
    CreateAdjust(v-if="selectedColor !== null")

</template>

<script setup>
const colorStore = useColorStore()
const { selectedColor } = storeToRefs(colorStore)
</script>

<style scoped lang="sass">
#options
  background-color: var(--color7)
  padding: 30px 24px
  :deep(h2)
    padding-bottom: 20px
</style>