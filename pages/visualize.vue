<template lang="pug">
  v-row#visualize
    v-col#image.pa-0.centered(col="auto")
      //- The artboards, one at a time; Back and Next in the bottom right move between them
      Transition(name="artboard" mode="out-in")
        //- One element for the fade (each artboard is the art plus its heart button)
        .artboard(:key="artboard")
          component(:is="ARTBOARDS[artboard]")
      VisualizeArtboardNav(
        :background="background"
        :show-back="artboard > 0"
        :show-next="artboard < ARTBOARDS.length - 1"
        @back="artboard--"
        @next="artboard++")
    v-col#palettes
      VisualizePalettes(select-first)
</template>

<script setup>
// Imported by hand: a running dev server can miss a newly added component file
import VisualizeImage from '~/components/visualize/Image.vue'
import VisualizeBlocks from '~/components/visualize/Blocks.vue'
import VisualizeArtboardNav from '~/components/visualize/ArtboardNav.vue'

// In order. Each says what its corner buttons sit on: the fruit fills the column with the
// palette's first color; the blocks artboard scrolls under them, so it reports the color
// that's under the Next button (components/visualize/Blocks.vue).
const ARTBOARDS = [VisualizeBlocks, VisualizeImage]
const REPORTS_BACKGROUND = [true, false]
const artboard = ref(0)

const reported = ref('#FFFFFF')
provide('artboardNavBackground', reported)

const { palette, boxColors } = storeToRefs(useColorStore())
// A palette clicked in Recent or Favorites colors whichever artboard is showing
// (each artboard draws boxColors, which shuffling reorders)
watch(palette, (palette, oldPalette) => {
  if (palette?.colors && palette.colors !== oldPalette?.colors) boxColors.value = palette.colors
}, { deep: true })
const background = computed(() => REPORTS_BACKGROUND[artboard.value] ? reported.value : boxColors.value[0] || 'white')
</script>

<style scoped lang="sass">
#visualize
  background-color: var(--color7)
#palettes
  height: calc(100vh - 64px)
  overflow: auto
  padding: 0
  min-width: 12rem
  max-width: 17.375rem
#image
  position: relative
  height: calc(100vh - 65px)
.artboard
  width: 100%
  height: 100%

// Phones: the artboard on top at full width, Recent / Favorites scrolling below
// it, as on Mix (pages/mix.vue)
@media (max-width: 599px)
  #visualize
    flex-direction: column
    flex-wrap: nowrap
    height: calc(100vh - 64px)
    height: calc(100dvh - 64px)
  #image
    flex: 0 0 58%
    height: auto
    min-height: 0
  #palettes
    flex: 1 1 0
    height: auto
    min-height: 0
    min-width: 0
    max-width: none
    border-top: 1px solid var(--color5)

.artboard-enter-active, .artboard-leave-active
  transition: opacity .2s ease
.artboard-enter-from, .artboard-leave-to
  opacity: 0
@media (prefers-reduced-motion: reduce)
  .artboard-enter-active, .artboard-leave-active
    transition: none
</style>
