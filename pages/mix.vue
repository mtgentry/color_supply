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
</style>
