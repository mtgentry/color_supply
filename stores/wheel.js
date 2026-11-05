import { defineStore } from 'pinia'
import schemes from '~/lib/wheel/schemes.json'

// State for the color wheel tool on /wheel. Self-contained for now: it doesn't
// read or change the palette selected elsewhere in the app (useColorStore).
export const useWheelStore = defineStore('wheel', () => {
  const schemeIndex = ref(0)
  const slice = ref(0)          // The wheel slice under the pointer
  const paletteIndex = ref(0)   // Which of that slice's palettes is selected

  const scheme = computed(() => schemes[schemeIndex.value])
  const palettes = computed(() => scheme.value.steps[slice.value] || [])
  const palette = computed(() => palettes.value[paletteIndex.value] || palettes.value[0])
  // The old site shows at most 4 colors of a palette; some have 5
  const colors = computed(() => (palette.value?.colors || []).slice(0, 4))

  const changeScheme = (direction) => {
    schemeIndex.value = (schemeIndex.value + direction + schemes.length) % schemes.length
    slice.value = 0
    paletteIndex.value = 0
    trackEvent('Wheel Scheme Changed', { scheme: scheme.value.name })
  }

  // Not tracked: it fires continuously while the wheel is dragged
  const setSlice = (index) => {
    if (index === slice.value) return
    slice.value = index
    paletteIndex.value = 0
  }

  // Called when a palette in the list is clicked
  const selectPalette = (index) => {
    paletteIndex.value = index
    trackEvent('Wheel Palette Selected', { scheme: scheme.value.name, slice: slice.value, palette: index })
  }

  // Up/down moves within a column of the two-column grid, wrapping around
  const movePalette = (direction) => {
    const count = palettes.value.length
    if (!count) return
    let next = paletteIndex.value + direction * 2
    if (next < 0) next = count - 1 - ((count - 1 - paletteIndex.value) % 2)
    else if (next >= count) next = paletteIndex.value % 2
    paletteIndex.value = Math.min(next, count - 1)
  }

  return {
    schemes, schemeIndex, slice, paletteIndex,
    scheme, palettes, palette, colors,
    changeScheme, setSlice, selectPalette, movePalette,
  }
})
