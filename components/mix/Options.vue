<template lang="pug">
  #mix-options(@pointerdown="onPointerDown" @click.capture="onClickCapture")
    template(v-if="!narrow")
      MixSliders
      v-divider.section-divider
    //- On phones the sliders are a third tab, Adjust, after Recent and Favorites
    VisualizePalettes(select-first v-model:tab="tab" :extra-tab="narrow ? 'Adjust' : null")
      template(#extra)
        #adjust
          //- Only the hint: with squares selected, the canvas already outlines them
          p.target(v-if="!selectedCount") All squares. Tap a square to adjust just that one.
          MixSliders
    Teleport(to="body")
      .palette-ghost(v-if="ghost" :style="{ left: ghost.x + 'px', top: ghost.y + 'px' }")
        .box(v-for="(hex, i) in ghost.colors" :key="i" :style="{ backgroundColor: hex }")
</template>

<script setup>
// The sidebar: the sliders, and the Recent / Favorites list
// (the same one Visualize and Create use). A palette in the list can be
// dragged onto the canvas, where it lands as a row of squares where it's
// dropped, or clicked to add it below the rest. The drag is handled here
// with pointer events delegated from the list, so the shared list
// components aren't changed.
import { formatHex } from 'culori'

const mixStore = useMixStore()

// Phones: the page stacks (pages/mix.vue) and the sliders move into an Adjust tab
const narrow = ref(false)
let narrowQuery = null
const onNarrowChange = () => { narrow.value = narrowQuery.matches }
onMounted(() => {
  narrowQuery = window.matchMedia('(max-width: 599px)')
  onNarrowChange()
  narrowQuery.addEventListener('change', onNarrowChange)
})
onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))

// The list's open tab. Selecting squares on a phone opens Adjust; it stays open when the
// selection clears, and then adjusts every square, as the sliders do on desktop.
const tab = ref('recent')
const selectedCount = computed(() => mixStore.selection?.ids?.length || 0)
watch(() => mixStore.selection?.ids?.join(','), () => {
  if (narrow.value && selectedCount.value) tab.value = 'extra'
})
watch(narrow, (value) => { if (!value && tab.value === 'extra') tab.value = 'recent' })

// A list row's colors, as hexes
const rowColors = (row) => [...row.querySelectorAll('.color-box')]
  .map((box) => formatHex(box.style.backgroundColor)?.toUpperCase())
  .filter(Boolean)

const listRow = (event) => event.target.closest?.('#paletteResults .color-row')
const overCanvas = (event) => !!document.elementFromPoint(event.clientX, event.clientY)?.closest('#mix-canvas')

const DRAG_THRESHOLD = 5 // Pixels before a press on a row becomes a drag (a shorter one is a click)
let drag = null          // { colors, x, y, started }
let justDragged = false  // Swallow the click that follows a drag
const ghost = ref(null)  // The small row following the pointer while it's not over the canvas

const onPointerDown = (event) => {
  const row = listRow(event)
  if (!row || event.button !== 0) return
  drag = { colors: rowColors(row), x: event.clientX, y: event.clientY, started: false }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('keydown', onKeyDown)
}

const onPointerMove = (event) => {
  if (!drag) return
  if (!drag.started) {
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < DRAG_THRESHOLD) return
    drag.started = true
  }
  const engine = mixStore.engine
  if (engine && overCanvas(event)) {
    // Over the canvas: the engine shows where the row would land
    ghost.value = null
    engine.showDropPreview(drag.colors, engine.worldPoint(event.clientX, event.clientY))
  } else {
    engine?.hideDropPreview()
    ghost.value = { x: event.clientX + 14, y: event.clientY + 14, colors: drag.colors }
  }
}

const onPointerUp = (event) => {
  if (!drag) return
  const { colors, started } = drag
  stopDrag()
  if (!started) return // A click; onClickCapture adds the row
  justDragged = true
  setTimeout(() => { justDragged = false }, 0)
  const engine = mixStore.engine
  if (engine && overCanvas(event)) engine.addRow(colors, engine.worldPoint(event.clientX, event.clientY))
  else engine?.hideDropPreview()
}

const onKeyDown = (event) => {
  if (event.key !== 'Escape') return
  mixStore.engine?.hideDropPreview()
  stopDrag()
}

const stopDrag = () => {
  drag = null
  ghost.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('keydown', onKeyDown)
}

// A click on a list row adds it to the canvas (below the rest) instead of
// selecting it as the current palette, which is what the row itself would do
const onClickCapture = (event) => {
  const row = listRow(event)
  if (!row) return
  event.stopPropagation()
  event.preventDefault()
  if (justDragged) return
  mixStore.engine?.addRow(rowColors(row))
}

onBeforeUnmount(stopDrag)
</script>

<style scoped lang="sass">
#mix-options
  background-color: var(--color7)
  padding: var(--sidebar-padding)
  .section-divider
    margin: var(--section-gap) 0
  :deep(#paletteResults)
    padding: 0
    .color-row
      touch-action: none
      cursor: grab
      position: relative
      // On hover, a "+" chip at the canvas end of the row: clicking (or dragging) adds it.
      // Inside the row, so the scrolling column can't clip it.
      &::before
        content: ''
        position: absolute
        left: 4px
        top: 50%
        width: 18px
        height: 18px
        border-radius: 50%
        // The plus is two centered lines, so it's exactly centered (a text glyph sits on its baseline)
        background: linear-gradient(var(--color1), var(--color1)) center / 8px 2px no-repeat, linear-gradient(var(--color1), var(--color1)) center / 2px 8px no-repeat, var(--color7)
        box-shadow: 0 1px 3px rgba(0, 0, 0, .25)
        pointer-events: none
        opacity: 0
        transform: translateY(-50%) scale(.7)
        transition: opacity .12s ease-out, transform .12s ease-out
      // Not on touch screens, where a tap would leave it stuck on
      @media (hover: hover)
        &:hover::before
          opacity: 1
          transform: translateY(-50%) scale(1)
#adjust
  padding-top: 12px
  .target
    font-size: 13px
    color: var(--color3)
    margin-bottom: 12px
.palette-ghost
  position: fixed
  z-index: 10000
  pointer-events: none
  display: flex
  width: 160px
  height: 24px
  border-radius: 5px
  overflow: hidden
  opacity: .9
  box-shadow: 0 4px 14px rgba(0, 0, 0, .18)
  .box
    flex: 1 1 0
</style>
