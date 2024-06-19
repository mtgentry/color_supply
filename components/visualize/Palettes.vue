<template lang="pug">
  v-container#paletteResults(fluid)
    v-row#toggleRow
      v-col(md="12")
        v-btn-toggle(variant="text" rounded="0" mandatory v-model="toggle")
          v-btn(value="recent").mr-5 Recent
          v-btn(value="favorites") Favorites
      v-col.centered(md="12" v-if="pending")
        v-progress-circular(indeterminate)
      v-col(md="12" :key="index" v-for="(palette, index) in visualizePalettes?.results" v-else)
        ColorsDisplay(:palette='palette' rounded)
</template>

<script setup>
const colorStore = useColorStore()
const toggle = ref('recent')
const { palettes } = storeToRefs(colorStore)
const {data: visualizePalettes, pending} = useApi('palettes/list/',  {
  toggle: toggle
}, 'get')

watch(visualizePalettes, () => {
  colorStore.selectPalette(visualizePalettes.value.results[0])
  let filtered = visualizePalettes.value.results.filter(p => !palettes.value.find(p2 => p2.id === p.id))
  palettes.value = [...palettes.value, ...filtered]
})


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
    line-height: 23px

    &.v-btn--active
      border-bottom: 1px solid var(--color2)

  :deep(.v-btn__overlay)
      background: none
      opacity: 0!important
  :deep(.v-ripple__container)
    display: none
</style>