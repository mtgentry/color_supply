<template lang="pug">
  #layout-2
    header
      div
        h1 Layout 2
        p The Visualize blocks artboard with palettes of 2 to 5 colors, to see how each size fills it: the palette alone, and with white and black added. Click an artboard to shuffle its colors.
      .controls
        .switch(role="group" aria-label="Neutrals")
          button(type="button" :class="{ on: tinted }" :aria-pressed="tinted" @click="tinted = true") Tinted
          button(type="button" :class="{ on: !tinted }" :aria-pressed="!tinted" @click="tinted = false") Pure
        button.new(type="button" @click="nextSamples" :disabled="loading") New palettes
    .sizes
      section.size(v-for="n in SIZES" :key="n")
        h2 {{ n }} colors
        template(v-if="shown[n]")
          .pair
            figure(v-for="variant in VARIANTS" :key="variant.label")
              .art.clickable(@click="shuffle(n)" :title="`Palette ${shown[n].id}`")
                VisualizeBlocksArt(:colors="shown[n].colors" :neutrals="variant.neutrals && { ...variant.neutrals, tinted }" numbered)
              figcaption {{ variant.label }}
          .strip
            .chip(v-for="(color, i) in shown[n].colors" :key="i" :style="{ backgroundColor: color }" :title="color")
        .art.empty(v-else) {{ loading ? 'Loading…' : 'No palettes of this size' }}
</template>

<script setup>
// Prototype for the Visualize blocks artboard (components/visualize/Blocks.vue):
// the same layout (lib/visualize/blocks.js) once per palette size, with real
// palettes of that size from the database.
import VisualizeBlocksArt from '~/components/visualize/BlocksArt.vue'
import { WIDTH, HEIGHT } from '~/lib/visualize/blocks.js'

const ratio = `${WIDTH} / ${HEIGHT}`

// Each palette twice: alone, and with the scene's white and black
const VARIANTS = [
  { label: 'Palette', neutrals: null },
  { label: '+ White and black', neutrals: { white: true, black: true } },
]
const tinted = ref(true) // Tinted neutrals (toward the palette), or pure white and black

useHead({ title: 'Layout 2' })

const SIZES = [2, 3, 4, 5] // Palettes have 2 to 5 colors
const samples = reactive({}) // size -> palettes of that size, in random order
const index = reactive({})   // size -> which sample is shown
const order = reactive({})   // size -> the shown palette's colors, as shuffled
const loading = ref(true)

const shown = computed(() => Object.fromEntries(SIZES.map((n) => {
  const list = samples[n] || []
  if (!list.length) return [n, null]
  const palette = list[index[n] % list.length]
  return [n, { id: palette.id, colors: order[n] || palette.colors }]
})))

// Each size's palettes in random order (style=all makes the list API shuffle)
onMounted(async () => {
  await Promise.all(SIZES.map(async (n) => {
    const response = await fetch('palettes/list/', 'get', { qty: [n, n], style: 'all' }).catch(() => null)
    samples[n] = (response?.results || []).filter((p) => p.colors.length === n)
    index[n] = 0
  }))
  loading.value = false
})

const nextSamples = () => {
  SIZES.forEach((n) => {
    index[n] = (index[n] || 0) + 1
    delete order[n]
  })
}

// A new order for one palette's colors (never the same order again)
const shuffle = (n) => {
  const colors = [...shown.value[n].colors]
  if (colors.length < 2) return
  let next
  do {
    next = [...colors].sort(() => Math.random() - 0.5)
  } while (next.every((c, i) => c === colors[i]))
  order[n] = next
}
</script>

<style scoped lang="sass">
#layout-2
  margin: -12px
  min-height: calc(100vh - 64px)
  padding: 40px 32px 64px
  background-color: var(--color7)
  display: flex
  flex-direction: column
  gap: 32px

header
  display: flex
  align-items: flex-end
  justify-content: space-between
  gap: 24px
  flex-wrap: wrap
  h1
    font-size: 28px
    font-weight: 500
    margin: 0 0 6px
  p
    margin: 0
    color: var(--color3)
    max-width: 60ch

.new
  font: inherit
  font-size: 14px
  padding: 8px 18px
  border-radius: 999px
  border: 1px solid var(--color2)
  background: var(--color2)
  color: var(--color7)
  cursor: pointer
  &:disabled
    opacity: .5
    cursor: default
  &:focus-visible
    outline: 2px solid var(--color1)
    outline-offset: 2px

.sizes
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
  gap: 40px 32px

.pair
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 12px
  figure
    margin: 0
    min-width: 0
  figcaption
    margin-top: 6px
    font-size: 12px
    color: var(--color3)

.controls
  display: flex
  align-items: center
  gap: 16px

.switch
  display: flex
  border: 1px solid var(--color2)
  border-radius: 999px
  overflow: hidden
  button
    font: inherit
    font-size: 14px
    padding: 8px 16px
    background: none
    color: var(--color2)
    cursor: pointer
    &.on
      background: var(--color2)
      color: var(--color7)
    &:focus-visible
      outline: 2px solid var(--color1)
      outline-offset: -2px

.size
  display: flex
  flex-direction: column
  gap: 10px
  min-width: 0
  h2
    font-size: 13px
    font-weight: 500
    letter-spacing: .06em
    text-transform: uppercase
    color: var(--color3)
    margin: 0

// Each artboard at the layout's own proportions
.art
  aspect-ratio: v-bind(ratio)
  width: 100%
  box-shadow: 0 1px 3px rgba(0, 0, 0, .08)
  :deep(svg)
    display: block
    width: 100%
    height: 100%
  &.empty
    display: flex
    align-items: center
    justify-content: center
    color: var(--color4)
    font-size: 13px
    background: var(--color6, #EEE)

.strip
  display: flex
  height: 18px
  border-radius: 4px
  overflow: hidden
  .chip
    flex: 1
</style>
