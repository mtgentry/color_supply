<template lang="pug">
  v-container#paletteResults(fluid :class="{'pa-0': !selectFirst}")
    v-row#toggleRow
      v-col(md="12" :class="{'mb-5': !selectFirst}")
        v-btn-toggle(variant="text" rounded="0" mandatory v-model="toggle"  v-if="selectFirst")
          v-btn(value="recent").mr-5 Recent
          v-btn(value="favorites") Favorites
        v-label(v-else) Recent
      v-col.centered(md="12" v-if="pending")
        v-progress-circular(indeterminate)
      v-col(md="12" :key="index" v-for="(palette, index) in visualizePalettes?.results" v-else)
        ColorsDisplay(:palette='palette' rounded)
</template>

<script setup>
const props = defineProps({
  selectFirst: {
    type: Boolean,
    default: false
  }
})
const colorStore = useColorStore()
const toggle = ref('recent')
const { palettes } = storeToRefs(colorStore)
const {data: visualizePalettes, pending} = useApi('palettes/list/',  {
  toggle: toggle
}, 'get')

watch(visualizePalettes, () => {
  if (props.selectFirst && visualizePalettes.value.results.length > 0) {
    colorStore.selectPalette(visualizePalettes.value.results[0])
  }
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

  .v-label
    font-size: 15px
    letter-spacing: 0.3px
</style>