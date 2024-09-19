<template lang="pug">
  v-row#explore(v-auto-animate="{ duration: 200 }")
    //was 'explore' before
    v-col#filter(cols="2")
      ExploreFilter
    v-col#palettes
      ExplorePalettes
    ExplorePreviewBox
    ExplorePreviewOpen
</template>

<script setup>
const store = useFilterStore()
const {preview} = storeToRefs(store)
onBeforeUnmount(() => {
  store.preview = 2
})
</script>

<style scoped lang="sass">
#filter
  max-width: 188px
  padding: 0
  background-color: var(--color7)
  height: calc(100vh - 64px)
  overflow-y: auto
#palettes
  background-color: var(--color7)
  overflow-y: auto
  height: calc(100vh - 64px)
  overflow-x: hidden
</style>