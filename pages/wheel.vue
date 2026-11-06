<template lang="pug">
  #wheel-page(ref="page")
    .top
      .wheel-col
        Wheel
      .palettes-col(ref="paletteList")
        WheelPalettes
    WheelRail(:visible="railVisible")
    .sections
      WheelIllustrations
      WheelTriangles
      WheelSwatches
      WheelGradients
</template>

<script setup>
// Imported by hand: a running dev server can miss a newly added component file
import WheelRail from '~/components/wheel/Rail.vue'
// Native version of the old Rails color wheel tool (old.colorsupplyyy.com/app).
// /app redirects here (pages/app.vue).
useHead({ title: 'Color Wheel' })

const wheelStore = useWheelStore()

// Left/right switch the scheme, up/down move through the palettes (as on the old site)
const onKeyDown = (event) => {
  if (event.target.closest?.('input, textarea, [contenteditable]')) return
  const actions = {
    ArrowLeft: () => wheelStore.changeScheme(-1),
    ArrowRight: () => wheelStore.changeScheme(1),
    // The rail is one palette per row; the list at the top is two
    ArrowUp: () => wheelStore.movePalette(-1, { columns: railVisible.value ? 1 : 2 }),
    ArrowDown: () => wheelStore.movePalette(1, { columns: railVisible.value ? 1 : 2 }),
  }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  action()
}

// The side rail (WheelRail) shows once the grid of palettes at the top has scrolled up out of
// view, while the selected palette under it (with its heart) can still be on screen
const page = ref(null)
const paletteList = ref(null)
const railVisible = ref(false)
let listWatch = null

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  listWatch = new IntersectionObserver(([entry]) => {
    railVisible.value = !entry.isIntersecting && entry.boundingClientRect.bottom <= entry.rootBounds.top
  }, { root: page.value })
  listWatch.observe(paletteList.value.querySelector('.grid') || paletteList.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  listWatch?.disconnect()
})
</script>

<style scoped lang="sass">
// The layout doesn't scroll the window (.v-application is overflow: hidden),
// so the page scrolls itself, like #palettes on /palettes
// The -12px margin cancels the layout's #content padding (12px) so the page
// reaches the edges, lining up exactly like the root .v-row on /mix and /palettes
#wheel-page
  margin: -12px
  height: calc(100vh - 64px)
  overflow-y: auto
  padding: 48px 24px
  background-color: var(--color7)

.top
  display: flex
  flex-wrap: wrap
  align-items: flex-start
  justify-content: center
  gap: 64px 96px
  max-width: 1040px
  margin: 0 auto
  // Desktop: clear of the side rail, like .sections below, since the rail can show while the
  // selected palette and its heart are still on screen. The gap between the wheel (440px) and
  // the list (340px) shrinks from 96px to 48px as the window narrows; below that, the list
  // wraps under the wheel
  @media (min-width: 960px)
    max-width: min(1040px, calc(100% - 2 * (68px + 24px)))
    column-gap: clamp(48px, calc(100% - 780px), 96px)

.wheel-col
  flex: 0 1 440px
  display: flex
  justify-content: center

.palettes-col
  flex: 0 1 340px
  display: flex
  justify-content: center
  padding-top: 32px

// Illustrations, triangle band, hex swatches and gradients, one under another
.sections
  display: flex
  flex-direction: column
  gap: 64px
  max-width: 850px
  margin: 96px auto 0
  // Desktop: clear of the side rail's chips (64px wide, 28px from the window's edge, which is
  // 4px inside this page's 24px padding), with a 24px gap, on both sides so it stays centered
  @media (min-width: 960px)
    max-width: min(850px, calc(100% - 2 * (68px + 24px)))

// Below 960px the rail is a row along the bottom: room for it under the last section
@media (max-width: 959px)
  #wheel-page
    padding-bottom: 96px
</style>
