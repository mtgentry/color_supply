<template lang="pug">
  v-container#paletteResults(fluid :class="{'pa-0': !selectFirst}")
    v-row#toggleRow
      v-col(md="12" :class="{'mb-5': !selectFirst}")
        v-btn-toggle(variant="text" rounded="0" mandatory v-model="toggle"  v-if="selectFirst")
          v-btn(value="recent").mr-5 Recent
          v-btn(value="favorites") Favorites
        v-label(v-else) Recent
      v-col.pa-0(md="12" v-if="status === 'unauthenticated' && toggle === 'favorites'")
        VisualizeSignUp
      v-col.centered(md="12" v-else-if="pending")
        v-progress-circular(indeterminate)
      v-col#colorRow(md="12" :key="index" v-for="(palette, index) in visualizePalettes" v-else)
        ColorsDisplay(:palette='palette' rounded)
</template>

<script setup>
const props = defineProps({
  selectFirst: {
    type: Boolean,
    default: false
  }
})
const { status } = useAuth()
const colorStore = useColorStore()
const toggle = ref('recent')
const { palettes, recentPalettes, palette, boxColors } = storeToRefs(colorStore)
const pendingDefault = ref(false)
if (!recentPalettes.value.length) {
  pendingDefault.value = true
  const response = await fetch('palettes/default/', 'get')
  recentPalettes.value = [response]
  palette.value = response
  boxColors.value = response.colors
}
const visualizePalettes = ref(recentPalettes.value)

onMounted(() => {
  colorStore.selectPalette(visualizePalettes.value[0])
})
const {data: favorites, pending, refreshAuthExecute} = useApi('palettes/list/',  {
  toggle: toggle
}, 'get', {immediate: false})
watch(toggle, async (value) => {
  if (value === 'recent') {
    visualizePalettes.value = recentPalettes.value
  } else {
    await refreshAuthExecute()
    visualizePalettes.value = favorites.value.results
  }

})
</script>

<style scoped lang="sass">
#paletteResults
  padding: 16px 24px
  .v-col
    padding: 6px 0
    &:first-child
      padding: 0 0 6px 0

  #toggleRow
    margin: 0
    padding-top: 16px

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
    opacity: 1

#colorRow
  padding: 24px
</style>