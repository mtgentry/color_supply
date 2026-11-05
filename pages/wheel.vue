<template lang="pug">
  #wheel-page
    .top
      .wheel-col
        Wheel
      .palettes-col
        WheelPalettes
    .sections
      WheelIllustrations
      WheelTriangles
      WheelSwatches
      WheelGradients
</template>

<script setup>
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
    ArrowUp: () => wheelStore.movePalette(-1),
    ArrowDown: () => wheelStore.movePalette(1),
  }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  action()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
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
</style>
