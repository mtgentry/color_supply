<template lang="pug">
  v-container#paletteResults(fluid)
    v-row#toggleRow
      v-col(md="12")
        v-btn-toggle(variant="text" rounded="0" mandatory v-model="toggle")
          v-btn(value="recent").mr-5 Recent
          v-btn(value="favorites") Favorites
      v-col.centered(md="12" v-if="pending")
        v-progress-circular(indeterminate)
      v-col(md="12" :key="index" v-for="(palette, index) in palettes?.results" v-else)
        ColorsDisplay(:palette='palette' rounded)
</template>

<script setup>
const colorStore = useColorStore()
const toggle = ref('recent')
const {data: palettes, pending, refresh} = useApi('palettes/list/',  {
  toggle: toggle
}, 'get')

watch(palettes, () => {
  colorStore.selectPalette(palettes.value.results[0])
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

    &.v-btn--active
      text-decoration: underline

  :deep(.v-btn__overlay)
      background: none
      opacity: 0!important
  :deep(.v-ripple__container)
    display: none
</style>