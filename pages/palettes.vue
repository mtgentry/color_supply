<template lang="pug">
  v-row#explore(v-auto-animate="{ duration: 200 }")
    //was 'explore' before
    v-col#filter(cols="2" v-if="showFilter")
      ExploreFilter
    v-col#palettes
      v-btn.mt-2.ml-2#hamburger.iconBtn(@click="showFilter = !showFilter" flat)
        svg(width='20', height='10', viewBox='0 0 20 10', fill='none', xmlns='http://www.w3.org/2000/svg')
          path(d='M2.94141 4.70542C2.94141 4.38055 3.20477 4.11719 3.52964 4.11719H16.4708C16.7957 4.11719 17.0591 4.38055 17.0591 4.70542V4.70542C17.0591 5.0303 16.7957 5.29366 16.4708 5.29366H3.52964C3.20477 5.29366 2.94141 5.0303 2.94141 4.70542V4.70542Z', fill='#788092')
          path(d='M5.88232 8.82652C5.88232 8.50164 6.14569 8.23828 6.47056 8.23828H13.5294C13.8543 8.23828 14.1176 8.50164 14.1176 8.82652V8.82652C14.1176 9.15139 13.8543 9.41475 13.5294 9.41475H12.9411H6.47056C6.14569 9.41475 5.88232 9.15139 5.88232 8.82652V8.82652Z', fill='#788092')
          path(d='M0 0.588235C0 0.263362 0.263362 0 0.588235 0H19.4118C19.7366 0 20 0.263362 20 0.588235V0.588235C20 0.913109 19.7366 1.17647 19.4118 1.17647H0.588236C0.263363 1.17647 0 0.913109 0 0.588235V0.588235Z', fill='#788092')
      ExplorePalettes(:showFilter="showFilter")
    ExplorePreviewBox
    ExplorePreviewOpen

</template>

<script setup>
const store = useFilterStore()
const {preview} = storeToRefs(store)
const showFilter = ref(true)
onBeforeUnmount(() => {
  store.preview = 2
})
const showFilterOnResize = function() {
  if (window.innerWidth > 768) {
    showFilter.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', showFilterOnResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', showFilterOnResize)
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