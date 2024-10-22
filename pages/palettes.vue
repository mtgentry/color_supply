<template lang="pug">
  v-row#explore(v-auto-animate="{ duration: 200 }")
    //was 'explore' before
    v-col#filter(cols="2" v-if="showFilter")
      ExploreFilter
    v-col#palettes
      v-btn#hamburger.iconBtn(@click="showFilter = !showFilter" flat)
        svg(width='67', height='52', viewBox='0 0 67 52', fill='none', xmlns='http://www.w3.org/2000/svg')
          path(d='M26.9414 28.5882C26.9414 28.2634 27.2048 28 27.5296 28H40.4708C40.7957 28 41.0591 28.2634 41.0591 28.5882C41.0591 28.9131 40.7957 29.1765 40.4708 29.1765H27.5296C27.2048 29.1765 26.9414 28.9131 26.9414 28.5882Z', fill='#788092')
          path(d='M29.8823 32.7093C29.8823 32.3845 30.1457 32.1211 30.4706 32.1211H37.5294C37.8543 32.1211 38.1176 32.3845 38.1176 32.7093C38.1176 33.0342 37.8543 33.2976 37.5294 33.2976H36.9411H30.4706C30.1457 33.2976 29.8823 33.0342 29.8823 32.7093Z', fill='#788092')
          path(d='M24 24.471C24 24.1462 24.2634 23.8828 24.5882 23.8828H43.4118C43.7366 23.8828 44 24.1462 44 24.471C44 24.7959 43.7366 25.0593 43.4118 25.0593H24.5882C24.2634 25.0593 24 24.7959 24 24.471Z', fill='#788092')
      ExplorePalettes(:showFilter="showFilter")
    ExplorePreviewBox
    ExplorePreviewOpen

</template>

<script setup>
const store = useFilterStore()
const {preview} = storeToRefs(store)
const showFilter = ref(false)
onBeforeUnmount(() => {
  store.preview = 2
})
</script>

<style scoped lang="sass">
#explore
  position: relative

#filter
  min-width: 188px
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
  padding: 0

#hamburger
  position: absolute
  z-index: 5
  display: initial
  @media (min-width: 768px)
    display: none
</style>