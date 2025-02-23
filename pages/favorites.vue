<template lang="pug">
  v-row#favorites(v-auto-animate="{ duration: 200 }")
    v-col#header(cols="12")
      h1 Favorites
    v-col#palettes(cols="12")
      ExplorePalettes(favorites)
    ExplorePreviewBox
    ExplorePreviewOpen
</template>

<script setup>
const store = useFilterStore()
const {preview} = storeToRefs(store)

</script>

<style scoped lang="sass">
#favorites
  background-color: var(--color7)
  #header
    height: calc(152px)
  #palettes
    height: 100%
  h1
    font-size: 36px
    font-style: normal
    font-weight: 500
    line-height: normal
    letter-spacing: 0.72px
    text-align: center
    padding: 44px 0 54px 0
</style>