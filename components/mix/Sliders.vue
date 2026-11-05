<template lang="pug">
  #sliders
    #hue
      v-label Hue
      v-slider(v-model="hue" hide-details min="-180" max="180" step="1" @start="begin" @end="commit")
    #saturation
      v-label Saturation
      v-slider(v-model="saturation" hide-details min="-100" max="100" step="1" @start="begin" @end="commit")
    #lightness
      v-label Lightness
      v-slider(v-model="lightness" hide-details min="-100" max="100" step="1" @start="begin" @end="commit")
</template>

<script setup>
// Hue, saturation, and lightness sliders, as on Create, but for the squares
// selected on the canvas (or all of them when nothing is selected), and in
// OKLCH, so a move looks the same on every color. The sliders are relative:
// a drag is applied as an offset from the colors as they were when it
// started, and they return to center when the selection changes, keeping
// the adjustment.
import { adjust } from '~/lib/mix/palette.js'

const mixStore = useMixStore()
const { selection } = storeToRefs(mixStore)

const hue = ref(0)
const saturation = ref(0)
const lightness = ref(0)

// The colors the current adjustment started from: [{ id, oklch }]
let from = []

const targetIds = () => {
  const engine = mixStore.engine
  if (!engine) return []
  const selected = selection.value?.ids || []
  return selected.length ? selected : engine.getState().squares.map((s) => s.id)
}

// Snapshots the targets' colors as the drag starts (called on @start, and
// after the selection changes, so a wheel/keyboard change has a baseline too)
const begin = () => {
  const engine = mixStore.engine
  if (!engine) return
  const ids = new Set(targetIds())
  from = engine.getState().squares
    .filter((s) => ids.has(s.id))
    .map((s) => ({ id: s.id, oklch: { mode: 'oklch', ...s.oklch } }))
}

const apply = (settled) => {
  const engine = mixStore.engine
  if (!engine || !from.length) return
  const delta = { hue: hue.value, saturation: saturation.value, lightness: lightness.value }
  engine.setColors(from.map(({ id, oklch }) => ({ id, oklch: adjust(oklch, delta) })), { settled })
}

// Slider released: the colors are final (reported once, saved)
let commitTimer = null
const commit = () => {
  clearTimeout(commitTimer)
  commitTimer = null
  apply(true)
}

watch([hue, saturation, lightness], () => {
  if (!from.length) begin()
  apply(false)
  // Keyboard and wheel changes don't fire @end: settle once they stop
  clearTimeout(commitTimer)
  commitTimer = setTimeout(commit, 300)
})

// A new selection: keep what was done, start over from center
watch(() => selection.value?.ids?.join(','), () => {
  from = []
  hue.value = 0
  saturation.value = 0
  lightness.value = 0
})
</script>

<style scoped lang="sass">
#sliders
  // The sliders use hide-details (no empty hint row under each), so the space
  // between them is set here. The -6px bottom margin trims the slider's empty
  // space below the thumb, so the section gap below starts at the thumb.
  margin-bottom: -6px
  > div + div
    margin-top: 20px
  .v-label
    color: var(--color2)
    opacity: 1
    font-size: 15px
    letter-spacing: 0.15px
  #hue
    line-height: 1!important
    :deep(.v-slider-track__background)
      opacity: 1
      background: linear-gradient(to right, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%)
    :deep(.v-slider-track__fill)
      background: transparent
  #saturation
    :deep(.v-slider-track__background)
      opacity: 1
      background: linear-gradient(90deg, #F0F0F0 0%, #E3E7EF 24.07%, #A0BAEF 98.26%)
    :deep(.v-slider-track__fill)
      background: transparent
  #lightness
    :deep(.v-slider-track__background)
      opacity: 1
      background: linear-gradient(to right, hsl(0, 0%, 100%), hsl(0, 0%, 0%))
    :deep(.v-slider-track__fill)
      background: transparent

  :deep(.v-slider-track__background)
    height: 8px

  :deep(.v-slider.v-input--horizontal)
    margin: 0
  :deep(.v-slider-thumb__surface)
    color: var(--color2)
</style>
