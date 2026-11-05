<template lang="pug">
  v-container#paletteResults(fluid :class="{'pa-0': !selectFirst}")
    v-row#toggleRow
      v-col(cols="12" :class="{'mb-5': !selectFirst}")
        v-btn-toggle(variant="text" rounded="0" mandatory v-model="toggle"  v-if="selectFirst")
          v-btn.toggle(value="recent").mr-3 Recent
          v-btn.toggle(value="favorites") Favorites
        v-label(v-else) Recent
      v-col.pa-0(cols="12" v-if="status === 'unauthenticated' && toggle === 'favorites'")
        VisualizeSignUp
      v-col.centered(cols="12" v-else-if="favoritesLoading")
        v-progress-circular(indeterminate)
      v-col#colorRow(cols="12" :key="index" v-for="(palette, index) in visualizePalettes" v-else)
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
// Recent is shown as it was when the tab opened, so clicking a palette (which
// moves it to the front of the store's list) doesn't reorder the list under
// the pointer. A palette new to the list, like one just saved on Mix, is added
// at the top straight away.
const recentShown = ref(recentPalettes.value)
watch(recentPalettes, (latest) => {
  const shown = new Set(recentShown.value.map(p => p.id))
  const added = latest.filter(p => !shown.has(p.id))
  if (added.length) recentShown.value = [...added, ...recentShown.value]
})

// Favorites come from the store, which every heart in the app keeps up to date
const { favoritePalettes } = storeToRefs(colorStore)
const visualizePalettes = computed(() =>
  toggle.value === 'favorites' ? (favoritePalettes.value || []) : recentShown.value)
// A spinner only before the first load; after that the stored list shows at once
const favoritesLoading = computed(() => toggle.value === 'favorites' && !favoritePalettes.value)

onMounted(() => {
  colorStore.selectPalette(visualizePalettes.value[0])
})

// Opening Favorites (or logging in while it's open) syncs it with the server, in the background
watch([toggle, status], ([value, auth]) => {
  if (value === 'recent') recentShown.value = recentPalettes.value
  else if (auth === 'authenticated') colorStore.loadFavorites()
})
</script>

<style scoped lang="sass">
#paletteResults
  padding: var(--sidebar-padding)
  .v-col
    padding: 6px 0
    &:first-child
      padding: 0 0 6px 0

  #toggleRow
    margin: 0

  .v-btn--size-default
    min-width: 0

  .v-btn-group
    height: 20px!important
  .v-btn
    height: 20px!important
    padding: 0!important
    color: var(--color4)
    font-size: 15px!important
    font-style: normal!important
    font-weight: 400!important
    line-height: normal!important
    letter-spacing: 0.15px!important

    &.v-btn--active
      color: var(--color2)
      border-bottom: 1px solid var(--color2)

  :deep(.v-btn__overlay)
    background: none
    opacity: 0!important
  :deep(.v-ripple__container)
    display: none

  .v-label
    font-size: 15px
    letter-spacing: 0.15px
    opacity: 1

#colorRow
  padding: 24px
</style>