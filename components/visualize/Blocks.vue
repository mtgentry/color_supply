<template lang="pug">
  //- Second artboard: the blocks layout (lib/visualize/blocks.js) in the selected
  //- palette's colors, the column's full width. It's taller than the column, so
  //- this box scrolls (pages scroll in their columns, not the window). Click to
  //- shuffle, like the fruit.
  .blocks-artboard.clickable(ref="scroller" @scroll.passive="measure" @click="shufflePalette")
    VisualizeBlocksArt(:colors="boxColors" :top="layout.TOP" :stacked="layout.STACKED" :neutrals="artNeutrals")
  //- The heart stays in the column's top right as the art scrolls under it
  VisualizeButtons(:background="colorAt(HEART)" neutrals-menu)
</template>

<script setup>
import VisualizeBlocksArt from '~/components/visualize/BlocksArt.vue'
import { WIDTH, TOP, blocksLayout, blockAt, roleColors, neutralColors } from '~/lib/visualize/blocks.js'

const colorStore = useColorStore()
const { boxColors } = storeToRefs(colorStore)
const { shufflePalette } = colorStore

// The corner buttons sit still over art that scrolls, so each takes its color
// from the module under it. Their centers, in px from the column's right edge
// and from its top (the heart, Buttons.vue) or bottom (Next, ArtboardNav.vue).
const HEART = { right: 30, top: 27 }
const NEXT = { right: 58, bottom: 58 }

const scroller = ref(null)
const box = reactive({ width: 0, height: 0, scrolled: 0 })
const measure = () => {
  const el = scroller.value
  if (!el) return
  box.width = el.clientWidth
  box.height = el.clientHeight
  box.scrolled = el.scrollTop
}

// Module 1 takes this share of the column's height, so the top of the next
// row shows below it on load (blocksLayout keeps it tall enough for the stars).
// A column narrower than STACK_BELOW px (phones) gets the stacked layout.
const TOP_SHARE = 0.62
const STACK_BELOW = 600
const layout = computed(() => {
  if (!box.width || !box.height) return blocksLayout(TOP)
  if (box.width < STACK_BELOW) return blocksLayout(TOP, { stacked: true })
  const scale = box.width / WIDTH // px per layout unit
  return blocksLayout(Math.round((TOP_SHARE * box.height) / scale))
})

// The white and black the scene adds, pure for now (composables/sceneNeutrals.js)
const { neutrals } = useSceneNeutrals()
const artNeutrals = computed(() => ({ ...neutrals.value, tinted: false }))
const roles = computed(() => roleColors(boxColors.value, neutralColors(boxColors.value, artNeutrals.value).white))
// The color under a point of the column; the page's own below the art's end
const colorAt = (point) => {
  if (!box.width) return '#FFFFFF'
  const scale = box.width / layout.value.WIDTH // px per layout unit
  const top = point.top ?? box.height - point.bottom
  const block = blockAt((box.width - point.right) / scale, (box.scrolled + top) / scale, layout.value.BLOCKS)
  return block ? roles.value[block.role] : '#FFFFFF'
}

// The page's Back and Next buttons (pages/visualize.vue) take theirs from here
const navBackground = inject('artboardNavBackground', null)
watchEffect(() => {
  if (navBackground) navBackground.value = colorAt(NEXT)
})

// The column's size changes with the window, and on phones with the page's stacking
let observer
onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  observer.observe(scroller.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped lang="sass">
// The column's height (pages/visualize.vue), scrolling the art, which is as wide as the column
.blocks-artboard
  height: 100%
  width: 100%
  overflow-y: auto
  overscroll-behavior: contain
  svg
    display: block
    width: 100%
    height: auto
</style>
