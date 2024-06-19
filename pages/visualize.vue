<template lang="pug">
  v-row#visualize
    v-col#image.pa-0.centered(cols="10")
      VisualizeImage
      VisualizeButtons
    v-col#palettes(cols="2")
      VisualizePalettes
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
#image
  position: relative
</style>