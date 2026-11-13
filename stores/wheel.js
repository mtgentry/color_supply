import { defineStore } from 'pinia'
import schemes from '~/lib/wheel/schemes.json'
import { hexToOKLCH } from '~/lib/mix/palette.js'

// The API lists a palette's colors darkest first. On the wheel the color that
// best matches the slice leads (the illustrations use the first color as
// background), as in schemes.json; the rest keep their order. Best match:
//  1. a color in the slice's color family (the /palettes color filter's hue
//     ranges, backend core/palettes/color_ranges.py), nearest the slice's hue.
//     A light blue at hue 207 is as blue as a slice at 251. Soft colors count
//     (Painters is muted throughout); pure grays don't.
//  2. else the color closest to the slice color overall (OKLab distance:
//     lightness and saturation as well as hue), so a palette always leads with
//     its best match. Gray-ish slices (Painters' pale gray, near black) go
//     straight to this.
const LEAD_MIN_CHROMA = 0.015
const FAMILIES = [[40, 'orange'], [80, 'yellow'], [115, 'green'], [190, 'blue'], [275, 'purple'], [345, 'red']]
const family = (h) => {
  let name = 'red' // 345 round to 40
  for (const [from, f] of FAMILIES) if (h >= from) name = f
  return name
}
const hueGap = (a, b) => Math.abs(((a - b + 540) % 360) - 180)
const hued = (c) => c.c >= LEAD_MIN_CHROMA && c.h !== undefined
const oklabDistance = (x, y) => {
  const ab = (c) => (c.h === undefined ? [0, 0] : [c.c * Math.cos(c.h * Math.PI / 180), c.c * Math.sin(c.h * Math.PI / 180)])
  const [xa, xb] = ab(x), [ya, yb] = ab(y)
  return Math.hypot(x.l - y.l, xa - ya, xb - yb)
}
const sliceColorFirst = (colors, sliceHex) => {
  const target = hexToOKLCH(sliceHex)
  if (!target || colors.length < 2) return colors
  const all = colors.map((hex) => hexToOKLCH(hex))
  let lead = -1
  if (hued(target)) {
    const want = family(target.h)
    let best = Infinity
    all.forEach((c, i) => {
      if (!c || !hued(c) || family(c.h) !== want) return
      const gap = hueGap(c.h, target.h)
      if (gap < best) { best = gap; lead = i }
    })
  }
  if (lead === -1) {
    let best = Infinity
    all.forEach((c, i) => {
      if (!c) return
      const d = oklabDistance(c, target)
      if (d < best) { best = d; lead = i }
    })
  }
  return lead > 0 ? [colors[lead], ...colors.filter((_, i) => i !== lead)] : colors
}

// State for the color wheel tool on /wheel. Self-contained for now: it doesn't
// read or change the palette selected elsewhere in the app (useColorStore).
export const useWheelStore = defineStore('wheel', () => {
  const schemeIndex = ref(0)
  const slice = ref(0)          // The wheel slice under the pointer
  const paletteIndex = ref(0)   // Which of that slice's palettes is selected

  const scheme = computed(() => schemes[schemeIndex.value])

  // From the database (/wheel_test): every scheme's palettes, in wheel order, in
  // one request when the page opens (GET palettes/wheel/, core/palettes/wheel.py
  // in the backend), so turning the wheel never waits. Hidden (curated out) and
  // deleted palettes are left out by the API.
  const fromDb = ref(false)
  const dbSchemes = ref(null) // scheme id -> [[{ id, colors }] per slice], once loaded
  let loading = null
  const loadWheel = () => {
    loading ??= fetch('palettes/wheel/', 'get').then((response) => {
      if (!response) throw new Error('No wheel palettes')
      // Each palette led by the color nearest its slice's hue (see sliceColorFirst)
      dbSchemes.value = Object.fromEntries(schemes.map((s) => [s.id,
        (response[s.id] || []).map((slicePalettes, index) => slicePalettes.map((p) =>
          ({ ...p, colors: sliceColorFirst(p.colors, s.wheel[index]) })))]))
    }).catch(() => { loading = null }) // Failed: try again next time
    return loading
  }
  watch(fromDb, (on) => { if (on) loadWheel() }, { immediate: true })

  const palettes = computed(() => fromDb.value
    ? dbSchemes.value?.[scheme.value.id]?.[slice.value] || []
    : scheme.value.steps[slice.value] || [])
  // A slice can be shorter from the database (curated out): the selection stays in range
  watch(palettes, (list) => { if (paletteIndex.value >= list.length) paletteIndex.value = 0 })
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

  // Up/down moves within a column of the two-column grid, wrapping around.
  // With columns = 1 (the side rail, one palette per row) it steps one at a time.
  const movePalette = (direction, { columns = 2 } = {}) => {
    const count = palettes.value.length
    if (!count) return
    if (columns === 1) {
      paletteIndex.value = (paletteIndex.value + direction + count) % count
      return
    }
    let next = paletteIndex.value + direction * 2
    if (next < 0) next = count - 1 - ((count - 1 - paletteIndex.value) % 2)
    else if (next >= count) next = paletteIndex.value % 2
    paletteIndex.value = Math.min(next, count - 1)
  }

  return {
    schemes, schemeIndex, slice, paletteIndex, fromDb,
    scheme, palettes, palette, colors,
    changeScheme, setSlice, selectPalette, movePalette,
  }
})
