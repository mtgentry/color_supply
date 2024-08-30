<template lang="pug">
  v-row#visualize
    v-col#image.pa-0.centered(col="auto")
      VisualizeImage
      VisualizeButtons
    v-col#palettes
      VisualizePalettes(select-first)
</template>

<script setup>
</script>

<style scoped lang="sass">
#visualize
  background-color: var(--color7)
#palettes
  height: calc(100vh - 64px)
  overflow: auto
  padding: 0
  min-width: 12em
  max-width: 17.375em
#image
  position: relative
</style>