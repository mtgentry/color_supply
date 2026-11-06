<template lang="pug">
  v-row#favorites(v-auto-animate="{ duration: 200 }")
    v-col#header(cols="12")
      h1 Favorites
      //- How many palettes per row (from 960px up; narrower screens show 2 or 1)
      #views(role="group" aria-label="Palettes per row")
        button(
          v-for="n in [3, 4]" :key="n" type="button"
          :class="{ active: columns === n }" :aria-pressed="columns === n"
          :title="`${n} columns`" :aria-label="`${n} columns`"
          @click="setColumns(n)")
          //- Outline style of the color view icons in the Palettes filter (components/explore/Color.vue)
          svg(width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true")
            //- Solid bars 1.25px apart, centered in the tile
            template(v-if="n === 3")
              rect(x="4.25" y="5" width="4" height="13" rx="1")
              rect(x="9.5" y="5" width="4" height="13" rx="1")
              rect(x="14.75" y="5" width="4" height="13" rx="1")
            template(v-else)
              rect(x="3.625" y="5" width="3" height="13" rx="0.75")
              rect(x="7.875" y="5" width="3" height="13" rx="0.75")
              rect(x="12.125" y="5" width="3" height="13" rx="0.75")
              rect(x="16.375" y="5" width="3" height="13" rx="0.75")
    v-col#palettes(cols="12")
      ExplorePalettes(favorites :columns="columns")
    ExplorePreviewBox
    ExplorePreviewOpen
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
})
const store = useFilterStore()
const {preview} = storeToRefs(store)

// Delete (or Backspace, the Mac's delete key) removes the selected palette from the
// user's favorites: it fades out quickly and leaves the grid, and the next palette is selected so
// several can be removed in a row. If the server refuses, it goes back where it was
// (favorite() flips it back and shows the error).
const colorStore = useColorStore()
const isTyping = (event) => {
  const t = event.target
  return t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
}
const REMOVE_FADE_MS = 150
let removing = false // A palette is fading out: a second press waits for it
const onKeyDown = async (event) => {
  if (event.key !== 'Delete' && event.key !== 'Backspace') return
  if (removing) {
    event.preventDefault()
    return
  }
  if (isTyping(event) || document.querySelector('.v-overlay--active')) return // A field or a dialog has it
  const selected = colorStore.paletteHighlighted ? colorStore.palette : null
  const list = colorStore.palettes
  const index = selected?.id ? list.findIndex((p) => p.id === selected.id) : -1
  if (index === -1 || !list[index].favorite) return
  event.preventDefault()
  const removed = list[index]
  removing = true
  // The grid's columns are keyed by position, so the fade is on this column's element,
  // cancelled as the palette leaves (the element then shows the next palette)
  const col = document.querySelectorAll('#palettes .grid > .colorCol')[index]
  const fade = col?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: REMOVE_FADE_MS, easing: 'ease-out', fill: 'forwards' })
  await fade?.finished.catch(() => {})
  list.splice(index, 1)
  fade?.cancel()
  removing = false
  const next = list[index] || list[index - 1]
  if (next) colorStore.selectPalette(next)
  else colorStore.clearPaletteHighlight()
  await favorite(removed)
  if (removed.favorite) {
    // It failed: put it back
    const at = Math.min(index, colorStore.palettes.length)
    colorStore.palettes.splice(at, 0, removed)
    colorStore.selectPalette(removed)
  }
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))

// 3 or 4 palettes per row, remembered in this browser
const COLUMNS_KEY = 'favoritesColumns'
const stored = (() => { try { return Number(localStorage.getItem(COLUMNS_KEY)) } catch { return 0 } })()
const columns = ref([3, 4].includes(stored) ? stored : 3)
const setColumns = (n) => {
  columns.value = n
  try { localStorage.setItem(COLUMNS_KEY, String(n)) } catch {}
}

</script>

<style scoped lang="sass">
#favorites
  background-color: var(--color7)
  #header
    height: calc(152px)
    position: relative
  // Right-aligned with the grid's right edge (24px from the window), just above the first row
  #views
    position: absolute
    right: 24px
    bottom: 4px
    display: none
    gap: 2px
    @media (min-width: 960px)
      display: flex
    // As in the Palettes filter's color views, on a slightly bigger 28px tile: gray bars;
    // the active one on a light blue tile with blue bars
    button
      display: flex
      align-items: center
      justify-content: center
      width: 28px  // The tile; the 23px icon sits centered in it
      height: 28px
      padding: 0
      border: none
      border-radius: 5px
      background: none
      cursor: pointer
      transition: background-color .12s
      rect
        fill: var(--color4)
        transition: fill .12s
      &:hover rect
        fill: var(--color3)
      &.active
        background-color: var(--color10)
        rect
          fill: var(--color1)
      &:focus-visible
        outline: 2px solid var(--color1)
        outline-offset: 1px
  // The window minus the nav (64px) and the header (152px). Without the nav, the page ran 64px
  // past the window: the app could be nudged up under the browser bar, and the last row was cut off
  // No column padding: the grid's own padding sets the margins, the same as on /palettes
  #palettes
    overflow-y: auto
    height: calc(100vh - 64px - 152px)
    padding: 0
  h1
    font-size: 36px
    font-style: normal
    font-weight: 500
    line-height: normal
    letter-spacing: 0.72px
    text-align: center
    padding: 44px 0 54px 0
</style>