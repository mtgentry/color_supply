<template lang="pug">
  svg.wheel(viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="`${type} color wheel`")

    //- 1. Spokes: every hue a thin line to the center; the 5s heavier, ending in a dot
    template(v-if="type === 'spokes'")
      line(v-for="h in HUES" :key="h.name" v-bind="line(h.angle, 46, h.principal ? 150 : 128)"
        :stroke="h.color" :stroke-width="h.principal ? 3 : 1" stroke-linecap="round")
      circle(v-for="h in principals" :key="'d' + h.name" v-bind="dot(h.angle, 150)" r="7" :fill="h.color")
      text.label(v-for="h in principals" :key="'t' + h.name" v-bind="at(h.angle, 176)" :fill="h.color") {{ h.name }}

    //- 2. Dot ring: one circle of dots, the 5s larger and named
    template(v-else-if="type === 'dots'")
      circle(v-for="h in HUES" :key="h.name" v-bind="dot(h.angle, 140)" :r="h.principal ? 10 : 4" :fill="h.color")
      text.label(v-for="h in principals" :key="'t' + h.name" v-bind="at(h.angle, 170)" :fill="h.color") {{ h.name }}

    //- 3. Segments: one arc per family, with small gaps, and the family letters
    template(v-else-if="type === 'segments'")
      path(v-for="(f, i) in FAMILIES" :key="f" :d="wedge(C, C, 118, 146, i * 36 + 5.5, i * 36 + 39.5)" :fill="principals[i].color")
      line(v-for="h in HUES" :key="h.name" v-bind="line(h.angle, 106, 112)" stroke="#C9CCD3" stroke-width="1")
      text.family(v-for="(f, i) in FAMILIES" :key="'t' + f" v-bind="at(i * 36 + 22.5, 170)" :fill="principals[i].color") {{ f }}

    //- 4. Dial: a thin hue band inside a degree scale, numbered at the quarters
    template(v-else-if="type === 'dial'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 132, 142, h.angle - 4.5, h.angle + 4.5)" :fill="h.color")
      line(v-for="d in degreeTicks" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}

    //- 5. Petals: wedges from the center, longest at the 5s
    template(v-else-if="type === 'petals'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 26, h.principal ? 160 : h.major ? 132 : 112, h.angle - 4.1, h.angle + 4.1)" :fill="h.color")

    //- 6. Type: the 5s as colored words, every hue a small dot inside
    template(v-else-if="type === 'type'")
      circle(v-for="h in HUES" :key="h.name" v-bind="dot(h.angle, 104)" :r="h.principal ? 4 : 2.5" :fill="h.color")
      text.word(v-for="h in principals" :key="'t' + h.name" v-bind="at(h.angle, 146)" :fill="h.color") {{ h.name }}

    //- 7. Band: a continuous ring of all 40 hues, with notches and names at the 5s
    template(v-else-if="type === 'band'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 122, 146, h.angle - 4.6, h.angle + 4.6)" :fill="h.color")
      line(v-for="h in principals" :key="'k' + h.name" v-bind="line(h.angle, 152, 160)" stroke="#1D1E20" stroke-width="1.5")
      text.label(v-for="h in principals" :key="'t' + h.name" v-bind="at(h.angle, 178)" fill="#788092") {{ h.name }}

    //- 8. Compass: only the ten 5s, pointing in, with degrees at the quarters
    template(v-else-if="type === 'compass'")
      circle(:cx="C" :cy="C" r="150" fill="none" stroke="#E6E8EB" stroke-width="1")
      template(v-for="h in principals" :key="h.name")
        line(v-bind="line(h.angle, 44, 150)" :stroke="h.color" stroke-width="2")
        path(:d="arrow(h.angle, 34)" :fill="h.color")
        circle(v-bind="dot(h.angle, 150)" r="5" :fill="h.color")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 176)") {{ d }}

    //- 9. Chroma: each hue as a row of dots, fading toward gray at the center
    template(v-else-if="type === 'chroma'")
      template(v-for="h in HUES" :key="h.name")
        circle(v-for="(ring, i) in CHROMA_RINGS" :key="i" v-bind="dot(h.angle, ring.r)" :r="ring.size" :fill="faded(h.color, ring.k)")
</template>

<script setup>
// One minimal version of the Munsell hue wheel, drawn as SVG, for the
// /wheel-lab test page. All versions share the 40 hues in lib/wheel-lab/hues.js.
import { converter, formatCss } from 'culori'
import { HUES, FAMILIES, polar, wedge } from '~/lib/wheel-lab/hues.js'

defineProps({
  type: { type: String, required: true }
})

const C = 200 // Center of the 400 x 400 viewBox
const principals = HUES.filter((h) => h.principal)
const degreeTicks = Array.from({ length: 180 }, (_, i) => i * 2)

const line = (angle, r1, r2) => {
  const a = polar(C, C, r1, angle)
  const b = polar(C, C, r2, angle)
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
}
const dot = (angle, r) => {
  const p = polar(C, C, r, angle)
  return { cx: p.x, cy: p.y }
}
const at = (angle, r) => {
  const p = polar(C, C, r, angle)
  return { x: p.x, y: p.y }
}
// A small triangle at radius r, pointing at the center
const arrow = (angle, r) => {
  const tip = polar(C, C, r, angle)
  const left = polar(C, C, r + 10, angle - 4)
  const right = polar(C, C, r + 10, angle + 4)
  return `M ${tip.x} ${tip.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`
}

// Chroma rings: outermost is the full color, inward each keeps less chroma (same lightness and hue)
const CHROMA_RINGS = [
  { r: 160, k: 1, size: 5.5 },
  { r: 132, k: 0.7, size: 4.5 },
  { r: 106, k: 0.45, size: 3.5 },
  { r: 82, k: 0.22, size: 2.5 }
]
const toOklch = converter('oklch')
const faded = (hex, k) => {
  const c = toOklch(hex)
  return formatCss({ ...c, c: c.c * k })
}
</script>

<style scoped lang="sass">
.wheel
  width: 100%
  height: auto
  display: block
  overflow: visible
text
  text-anchor: middle
  dominant-baseline: central
  font-family: inherit
.label
  font-size: 13px
  font-weight: 600
  letter-spacing: 0.3px
.family
  font-size: 15px
  font-weight: 600
  letter-spacing: 0.5px
.word
  font-size: 16px
  font-weight: 500
.number
  font-size: 12px
  fill: #788092
</style>
