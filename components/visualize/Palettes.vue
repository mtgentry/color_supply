<template lang="pug">
  v-container#paletteResults(fluid)
    v-row#toggleRow
      v-col(md="12")
        v-btn-toggle(variant="text" rounded="0" mandatory v-model="filter")
          v-btn(value="recent").mr-5 Recent
          v-btn(value="favorites") Favorites
      v-col(md="12" v-for='(palette, index) in palettes' :key='index')
        ColorsDisplay(:palette='palette' rounded)
</template>

<script setup>
const colorStore = useColorStore()
const next = ref('palettes/list/')
const palettes = ref([])
const filter = ref('recent')

const response = await fetch(next.value, 'get')
palettes.value = [...palettes.value, ...response.results]
if (!colorStore.palette) {
  colorStore.selectPalette(palettes.value[0])
}
</script>

<style scoped lang="sass">
#paletteResults
  .v-col
    padding: 6px 24px

  #toggleRow
    padding-top: 12px

  .v-btn--size-default
    min-width: 0

  .v-btn-group
    height: 20px!important
  .v-btn
    height: 20px!important
    padding: 0!important

    &.v-btn--active
      text-decoration: underline

  :deep(.v-btn__overlay)
      background: none
      opacity: 0!important
  :deep(.v-ripple__container)
    display: none
</style>