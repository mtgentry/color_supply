<template lang="pug">
  v-row#explore
    v-col#filter(cols="2")
      ExploreFilter
    v-col#palettes(cols="10")
      ExplorePalettes
</template>

<script setup>
</script>

<style scoped lang="sass">
#filter
  padding: 0
  background-color: var(--color7)
  height: calc(100vh - 64px)
  overflow-y: auto
#palettes
  background-color: var(--color7)
</style>