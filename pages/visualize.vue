<template lang="pug">
  v-row#visualize
    v-col.pa-0.centered(cols="10")
      VisualizeImage
    v-col#palettes(cols="2")
      VisualizePalettes
</template>

<script setup>
</script>

<style scoped lang="sass">
#palettes
  height: calc(100vh - 64px)
  overflow: auto
  padding: 0
</style>