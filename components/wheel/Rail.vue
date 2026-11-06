<template lang="pug">
  //- The slice's palettes again, small, once the list at the top has scrolled out of view,
  //- so they can be switched while looking at the illustrations below (as on the old site).
  //- Desktop: a column pinned to the right. Below 960px: a row pinned to the bottom.
  Transition(name="rail")
    nav#wheel-rail(v-if="visible" ref="rail" aria-label="Palettes")
      button.chip(
        v-for="(p, index) in palettes"
        :key="scheme.id + '-' + slice + '-' + index"
        type="button"
        :class="{ active: index === paletteIndex }"
        :aria-pressed="index === paletteIndex"
        :aria-label="`Palette ${index + 1}`"
        :style="{ backgroundImage: stripes(p.colors) }"
        @click="wheelStore.selectPalette(index)"
      )
</template>

<script setup>
defineProps({
  // Set by the page: true once the palette list at the top is scrolled out of view
  visible: { type: Boolean, default: false },
})

// A chip's colors as hard-edged stripes, painted by the button itself rather than
// one empty span per color inside it: the spans only showed if the browser gave
// them width, and chips were seen blank (though still clickable) without it.
const stripes = (colors) => {
  const shown = colors.slice(0, 4) // The old site shows at most 4
  const step = 100 / shown.length
  return `linear-gradient(to right, ${shown.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(', ')})`
}

const wheelStore = useWheelStore()
const { scheme, slice, palettes, paletteIndex } = storeToRefs(wheelStore)

// When the rail is shorter (or narrower) than its palettes, keep the selected one in view.
// Scrolled by hand: scrollIntoView would also scroll the page and the app around it.
const rail = ref(null)
const revealActive = () => {
  const el = rail.value
  const chip = el?.querySelectorAll('.chip')[paletteIndex.value]
  if (!chip) return
  // Focus follows the selection: after clicking a chip and then using the arrow keys,
  // the focus ring would otherwise stay on the clicked chip, a second outline
  if (el.contains(document.activeElement) && document.activeElement !== chip) chip.focus({ preventScroll: true })
  const across = el.scrollWidth > el.clientWidth // The phone row scrolls sideways
  const [start, size, view, scroll] = across
    ? [chip.offsetLeft, chip.offsetWidth, el.clientWidth, el.scrollLeft]
    : [chip.offsetTop, chip.offsetHeight, el.clientHeight, el.scrollTop]
  const margin = 12
  let next = scroll
  if (start - margin < scroll) next = start - margin
  else if (start + size + margin > scroll + view) next = start + size + margin - view
  if (next === scroll) return
  if (across) el.scrollLeft = next
  else el.scrollTop = next
}
watch([paletteIndex, palettes, rail], () => nextTick(revealActive))
</script>

<style scoped lang="sass">
#wheel-rail
  position: fixed
  z-index: 5
  display: flex
  // Desktop: a column on the right, centered in the space under the nav
  right: 20px // The chips 28px from the window's edge (20 + the 8px padding)
  top: calc(64px + (100vh - 64px) / 2)
  transform: translateY(-50%)
  flex-direction: column
  gap: 10px
  max-height: calc(100vh - 64px - 48px)
  overflow-y: auto
  // Room inside the scroll box (which clips) for the selected ring (4px) on a chip grown by hover (9%)
  padding: 8px
  scrollbar-width: none
  &::-webkit-scrollbar
    display: none
  // Below 960px: a row along the bottom of the screen, scrolling sideways
  @media (max-width: 959px)
    top: auto
    left: 0
    right: 0
    bottom: 0
    transform: none
    flex-direction: row
    max-height: none
    overflow-x: auto
    overflow-y: hidden
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom))
    background-color: var(--color7)
    box-shadow: 0 -4px 16px rgba(0, 0, 0, .08)

.chip
  flex: 0 0 auto
  width: 64px
  height: 14px
  padding: 0
  border: none
  border-radius: 3px
  overflow: hidden
  background-color: transparent
  cursor: pointer
  transition: transform .1s ease-in-out
  &:hover
    transform: scale(1.09)
  &.active
    box-shadow: 0 0 0 2px var(--color7), 0 0 0 4px var(--color1)
  &:focus-visible
    outline: 2px solid var(--color1)
    outline-offset: 3px
  @media (max-width: 959px)
    width: 52px
    height: 18px

// Fades in, sliding in a little from its edge
.rail-enter-active, .rail-leave-active
  transition: opacity .2s ease, translate .2s ease
.rail-enter-from, .rail-leave-to
  opacity: 0
  translate: 8px 0
  @media (max-width: 959px)
    translate: 0 8px
@media (prefers-reduced-motion: reduce)
  .rail-enter-active, .rail-leave-active
    transition: opacity .2s ease
  .rail-enter-from, .rail-leave-to
    translate: none
</style>
