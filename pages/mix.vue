<template lang="pug">
  v-row#mix
    v-col#canvasDiv
      MixCanvas
    v-col#optionsDiv
      MixOptions
</template>

<script setup>
useHead({ title: 'Mix' })
</script>

<style scoped lang="sass">
#mix
  .v-col
    height: calc(100vh - 64px)

#canvasDiv
  padding: 0

#optionsDiv
  padding: 0
  overflow-y: auto
  background-color: var(--color7)
  min-width: 12rem
  max-width: 17.375rem

// Phones: the canvas on top at full width, Recent / Favorites scrolling below it.
// The sliders are a sheet there (components/mix/Options.vue).
@media (max-width: 599px)
  #mix
    flex-direction: column
    flex-wrap: nowrap
    height: calc(100vh - 64px)
    height: calc(100dvh - 64px)
    .v-col
      height: auto
  #canvasDiv
    flex: 0 0 58%
  #optionsDiv
    flex: 1 1 0
    min-height: 0
    min-width: 0
    max-width: none
    border-top: 1px solid var(--color5)
</style>
