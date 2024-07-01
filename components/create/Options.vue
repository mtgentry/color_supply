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
  margin: -12px
  padding: 32px 24px


  :deep(h2)
    padding-bottom: 20px

  .v-divider
    margin: 15px 0 25px 0
</style>