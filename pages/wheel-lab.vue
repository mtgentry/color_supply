<template lang="pug">
  #wheel-lab
    header
      h1 Wheel lab
      p Minimal takes on the Munsell hue wheel: 10 hue families, 40 hues, 10RP at the top. A test page, not linked from the site.

    section(v-if="dbPalette")
      .section-head
        h2 From the database: palette {{ dbPalette.id }}
        .key
          span.swatch(v-for="s in dbPalette.swatches" :key="s.hex")
            i(:style="{ backgroundColor: s.hex }")
            | {{ s.hex }} · L {{ s.oklch[0].toFixed(3) }} C {{ s.oklch[1].toFixed(3) }} H {{ s.oklch[2] === null ? '–' : s.oklch[2].toFixed(1) + '°' }}
      .grid
        figure
          WheelLabDial(variant="oklch" :colors="dbPalette.swatches.map((s) => ({ hex: s.hex, angle: s.oklch[2] }))")
          figcaption
            span.name OKLCH hue
            span.note Angle = the stored OKLCH hue
        figure
          WheelLabDial(variant="scale" :colors="dbPalette.swatches.map((s) => ({ hex: s.hex, angle: s.oklch[2] }))")
          figcaption
            span.name Dial 4, no ring
            span.note The degree scale alone; colors at their OKLCH hue
        figure
          WheelLabDial(variant="harmony" :colors="dbPalette.swatches.map((s) => s.hex)")
          figcaption
            span.name On the Munsell dial
            span.note The same hues, at their Munsell positions
    section(v-if="dbPalette")
      .section-head
        h2 Small dials
        .key 140px across: 10px numbers, fewer ticks, heavier strokes
      .grid
        figure(v-for="(v, i) in SMALL" :key="v.variant")
          WheelLabSmallDial(:variant="v.variant" :colors="dbPalette.swatches.map((s) => ({ hex: s.hex, angle: s.oklch[2] }))")
          figcaption
            span.number {{ i + 1 }}
            span.name {{ v.name }}
            span.note {{ v.note }}

    section(v-if="dbPalette")
      .section-head
        h2 Dial 4, no ring: six variations
        .key Palette {{ dbPalette.id }} at its stored OKLCH hues
      .grid.half
        figure(v-for="(v, i) in SCALES" :key="v.variant")
          WheelLabDial(:variant="v.variant" :colors="dbPalette.swatches.map((s) => ({ hex: s.hex, angle: s.oklch[2] }))")
          figcaption
            span.number {{ String.fromCharCode(65 + i) }}
            span.name {{ v.name }}
            span.note {{ v.note }}
    section(v-else-if="dbError")
      .section-head
        h2 From the database: palette {{ DB_PALETTE_ID }}
        .key {{ dbError }}

    section
      .section-head
        h2 Dial: six variations
        .key
          span Mapped on each:
          span.swatch(v-for="c in MAPPED" :key="c.hex")
            i(:style="{ backgroundColor: c.hex }")
            | {{ c.name }} {{ c.hex }} · {{ Math.round(wheelAngle(c.hex)) }}°
      .grid
        figure(v-for="(v, i) in DIALS" :key="v.variant")
          WheelLabDial(:variant="v.variant" :colors="MAPPED.map((c) => c.hex)")
          figcaption
            span.number {{ String.fromCharCode(65 + i) }}
            span.name {{ v.name }}
            span.note {{ v.note }}

    section
      .section-head
        h2 The first nine
      .grid
        figure(v-for="(v, i) in VARIANTS" :key="v.type")
          WheelLabVariant(:type="v.type")
          figcaption
            span.number {{ i + 1 }}
            span.name {{ v.name }}
            span.note {{ v.note }}
</template>

<script setup>
// Test page for sketching color wheel styles (components/wheel-lab/Variant.vue).
// Not in the nav; kept out of search engines.
import WheelLabVariant from '~/components/wheel-lab/Variant.vue'
import WheelLabDial from '~/components/wheel-lab/Dial.vue'
import WheelLabSmallDial from '~/components/wheel-lab/SmallDial.vue'
import { wheelAngle } from '~/lib/wheel-lab/hues.js'

// A palette from the database (GET /api/palettes/<id>/), placed by its stored OKLCH
const DB_PALETTE_ID = 11109
const dbPalette = ref(null)
const dbError = ref(null)
try {
  dbPalette.value = await fetch(`palettes/${DB_PALETTE_ID}/`, 'get')
} catch (error) {
  dbError.value = `Couldn't load it (${error?.status || error?.message || 'error'})`
}

// The site's own red, yellow and blue (the Mix canvas's default palette)
const MAPPED = [
  { name: 'Red', hex: '#D73E2F' },
  { name: 'Yellow', hex: '#FEE16C' },
  { name: 'Blue', hex: '#2A5B96' }
]

const SMALL = [
  { variant: 'tens', name: 'Tens', note: 'Ticks every 10°; dots on a guide circle' },
  { variant: 'thirties', name: 'Thirties', note: 'Ticks every 30°; dots in a notch' },
  { variant: 'dotted', name: 'Dotted', note: 'Gray dots every 10°, ticks at the quarters' },
  { variant: 'tick', name: 'Colored tick', note: 'Ticks every 15°; colored ticks in to a dot' },
  { variant: 'outside', name: 'Outside', note: 'Numbers inside, dots outside' },
  { variant: 'rings', name: 'Rings', note: 'Ticks every 10°; hollow rings' },
  { variant: 'tens-inline', name: 'Tens, inline', note: 'Numbers in the tick ring' },
  { variant: 'fives-inline', name: 'Fives, inline', note: 'Finer ticks; numbers in the ring' },
  { variant: 'dotted-inline', name: 'Dotted, inline', note: 'Numbers in place of the dots' },
  { variant: 'tick-inline', name: 'Colored tick, inline', note: 'Numbers in the ring; colored ticks' }
]

const SCALES = [
  { variant: 'scale-ticks', name: 'On the ticks', note: 'Dots sit on the tick marks' },
  { variant: 'scale-notch', name: 'Notched', note: 'Dots on the ticks, the ticks under them left out' },
  { variant: 'scale-tick', name: 'Colored tick', note: "Each color's own tick, running in to a dot" },
  { variant: 'scale-out', name: 'Outside', note: 'Dots outside the scale, numbers inside' },
  { variant: 'scale-rings', name: 'Rings', note: 'Hollow rings on the guide circle' },
  { variant: 'scale-bare', name: 'Bare', note: 'No guide circle, smaller dots, lighter ticks' }
]

const DIALS = [
  { variant: 'fine', name: 'Fine', note: 'Hairline band, 1° ticks; colors as rings with their angle' },
  { variant: 'inside', name: 'Inside out', note: 'Scale inside the band; colors as pointers' },
  { variant: 'cut', name: 'Cut', note: 'Wide band; colors cut across it' },
  { variant: 'harmony', name: 'Harmony', note: 'Hands to each color, joined as a triangle' },
  { variant: 'cells', name: 'Cells', note: '40 hue cells; colors as swatches on leaders' },
  { variant: 'hairline', name: 'Hairline', note: 'The ticks carry the hues; colors as long ticks' }
]

useHead({
  title: 'Wheel lab',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const VARIANTS = [
  { type: 'spokes', name: 'Spokes', note: 'Every hue a line; the 5s heavier, with a dot' },
  { type: 'dots', name: 'Dot ring', note: 'One ring of dots, the 5s larger' },
  { type: 'segments', name: 'Segments', note: 'One arc per family' },
  { type: 'dial', name: 'Dial', note: 'Hue band inside a degree scale' },
  { type: 'petals', name: 'Petals', note: 'Wedges from the center' },
  { type: 'type', name: 'Type', note: 'The 5s as words, every hue a dot' },
  { type: 'band', name: 'Band', note: 'A continuous ring, notched at the 5s' },
  { type: 'compass', name: 'Compass', note: 'Only the ten 5s, pointing in' },
  { type: 'chroma', name: 'Chroma', note: 'Each hue fading to gray toward the center' }
]
</script>

<style scoped lang="sass">
// The app itself never scrolls (layouts/default.vue), so the page is its own scroll box
#wheel-lab
  background-color: var(--color7)
  height: calc(100vh - 64px)
  overflow-y: auto
  padding: 48px 24px 80px
header
  max-width: 1200px
  margin: 0 auto 40px
  h1
    font-size: 24px
    font-weight: 600
    color: var(--color2)
  p
    margin-top: 6px
    font-size: 14px
    color: var(--color3)
section
  max-width: 1200px
  margin: 0 auto 64px
.section-head
  display: flex
  align-items: baseline
  flex-wrap: wrap
  gap: 8px 24px
  margin-bottom: 20px
  h2
    font-size: 16px
    font-weight: 600
    color: var(--color2)
.key
  display: flex
  flex-wrap: wrap
  gap: 6px 16px
  font-size: 13px
  color: var(--color3)
  .swatch
    display: inline-flex
    align-items: center
    gap: 6px
    color: var(--color2)
    i
      width: 12px
      height: 12px
      border-radius: 3px
// Wheels at half their usual size, centered in their cards
.grid.half :deep(.wheel)
  width: 50%
  margin: 0 auto
.grid
  max-width: 1200px
  margin: 0 auto
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 32px
  @media (max-width: 960px)
    grid-template-columns: repeat(2, 1fr)
  @media (max-width: 600px)
    grid-template-columns: 1fr
figure
  margin: 0
  padding: 28px
  border: 1px solid #E6E8EB
  border-radius: 8px
figcaption
  margin-top: 20px
  display: flex
  align-items: baseline
  gap: 8px
  font-size: 13px
  .number
    color: var(--color4)
  .name
    color: var(--color2)
    font-weight: 500
  .note
    color: var(--color3)
    margin-left: auto
    text-align: right
</style>
