<template lang="pug">
  svg.wheel(viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="`Dial ${variant}`")

    //- A. Fine: a hairline band, 1-degree ticks, numbers every 30; colors as rings on the band
    template(v-if="variant === 'fine'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 138, 142, h.angle - 4.5, h.angle + 4.5)" :fill="h.color")
      line(v-for="d in deg(1)" :key="'k' + d" v-bind="line(d, d % 10 ? 158 : d % 30 ? 154 : 150, 162)" stroke="#788092" :stroke-width="d % 30 ? 0.5 : 1")
      text.number(v-for="d in deg(30)" :key="'n' + d" v-bind="at(d, 176)") {{ d }}
      template(v-for="m in marks" :key="m.hex")
        circle(v-bind="dot(m.angle, 140)" r="9" fill="#fff" :stroke="m.hex" stroke-width="3")
        circle(v-bind="dot(m.angle, 140)" r="10.5" fill="none" stroke="rgba(29, 30, 32, .25)" stroke-width="0.75")
        text.small(v-bind="at(m.angle, 118)" :fill="ink(m.hex)") {{ Math.round(m.angle) }}°

    //- B. Inside out: the scale inside the band; colors as pointers outside it, pointing in
    template(v-else-if="variant === 'inside'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 146, 158, h.angle - 4.5, h.angle + 4.5)" :fill="h.color")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 132 : 126, 138)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 112)") {{ d }}
      path(v-for="m in marks" :key="m.hex" :d="pointer(m.angle, 162, 12)" :fill="m.hex" stroke="rgba(29, 30, 32, .35)" stroke-width="0.75" stroke-linejoin="round")

    //- C. Wide band, cut by the colors: white-edged bars across it, ticks at the 40 hue steps
    template(v-else-if="variant === 'cut'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 120, 146, h.angle - 4.5, h.angle + 4.5)" :fill="h.color")
      line(v-for="h in HUES" :key="'k' + h.name" v-bind="line(h.angle, 152, h.principal ? 162 : 157)" stroke="#788092" :stroke-width="h.principal ? 1.25 : 0.75")
      text.family(v-for="h in principals" :key="'t' + h.name" v-bind="at(h.angle, 176)") {{ h.name }}
      template(v-for="m in marks" :key="m.hex")
        path(:d="wedge(C, C, 114, 152, m.angle - 2.2, m.angle + 2.2)" :fill="m.hex" stroke="#1D1E20" stroke-width="1.25")

    //- D. Harmony: hands from the center to each color, joined into a triangle
    template(v-else-if="variant === 'harmony'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 132, 142, h.angle - 4.5, h.angle + 4.5)" :fill="h.color")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      polygon(:points="marks.map((m) => { const p = polar(C, C, 122, m.angle); return `${p.x},${p.y}` }).join(' ')" fill="none" stroke="#C9CCD3" stroke-width="1" stroke-dasharray="3 3")
      template(v-for="m in marks" :key="m.hex")
        line(v-bind="line(m.angle, 0, 122)" :stroke="m.hex" stroke-width="2")
        circle(v-bind="dot(m.angle, 122)" r="6" :fill="m.hex" stroke="rgba(29, 30, 32, .35)" stroke-width="0.75")
      circle(:cx="C" :cy="C" r="4" fill="#1D1E20")

    //- E. Cells: 40 separate hue cells, a scale outside, colors as swatches on leader lines
    template(v-else-if="variant === 'cells'")
      path(v-for="h in HUES" :key="h.name" :d="wedge(C, C, 112, 132, h.angle - 4, h.angle + 4)" :fill="h.color")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 140 : 136, 144)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      template(v-for="m in marks" :key="m.hex")
        line(v-bind="line(m.angle, 133, 160)" stroke="#1D1E20" stroke-width="1")
        circle(v-bind="dot(m.angle, 172)" r="11" :fill="m.hex" stroke="rgba(29, 30, 32, .35)" stroke-width="0.75")

    //- F. Hairline: the ticks carry the hues; colors as long, labeled ticks
    template(v-else-if="variant === 'hairline'")
      circle(:cx="C" :cy="C" r="128" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 136 : 132, 146)" :stroke="colorAt(d)" :stroke-width="d % 10 ? 1 : 2")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 116)") {{ d }}
      template(v-for="m in marks" :key="m.hex")
        line(v-bind="line(m.angle, 128, 164)" :stroke="m.hex" stroke-width="4" stroke-linecap="round")
        text.small(v-bind="at(m.angle, 180)" :text-anchor="anchor(m.angle)" :fill="ink(m.hex)") {{ m.hex }}

    //- Scale: #4's degree scale with no hue band; colors as dots where the band was
    template(v-else-if="variant === 'scale'")
      circle(:cx="C" :cy="C" r="137" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      circle(v-for="m in marks" :key="m.hex" v-bind="dot(m.angle, 137)" r="9" :fill="m.hex" stroke="rgba(29, 30, 32, .3)" stroke-width="0.75")

    //- Scale variations (the ringless Dial 4, small differences)
    //- A. On the ticks: dots centered on the tick band
    template(v-else-if="variant === 'scale-ticks'")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      circle(v-for="m in marks" :key="m.hex" v-bind="dot(m.angle, 160)" r="8" :fill="m.hex" stroke="#fff" stroke-width="2")

    //- B. Notched: dots on the tick band, the ticks under them left out
    template(v-else-if="variant === 'scale-notch'")
      line(v-for="d in ticksClearOf(6)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      circle(v-for="m in marks" :key="m.hex" v-bind="dot(m.angle, 160)" r="7" :fill="m.hex")

    //- C. Colored tick: each color's own tick, in its color, running in to a small dot
    template(v-else-if="variant === 'scale-tick'")
      circle(:cx="C" :cy="C" r="137" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      template(v-for="m in marks" :key="m.hex")
        line(v-bind="line(m.angle, 137, 168)" :stroke="m.hex" stroke-width="3" stroke-linecap="round")
        circle(v-bind="dot(m.angle, 137)" r="4.5" :fill="m.hex")

    //- D. Outside: dots outside the scale, numbers moved in
    template(v-else-if="variant === 'scale-out'")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 140)") {{ d }}
      circle(v-for="m in marks" :key="m.hex" v-bind="dot(m.angle, 180)" r="7" :fill="m.hex" stroke="rgba(29, 30, 32, .3)" stroke-width="0.75")

    //- E. Rings: hollow rings on the guide circle
    template(v-else-if="variant === 'scale-rings'")
      circle(:cx="C" :cy="C" r="137" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 160 : 154, 166)" stroke="#788092" :stroke-width="d % 90 ? 0.75 : 1.5")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      template(v-for="m in marks" :key="m.hex")
        circle(v-bind="dot(m.angle, 137)" r="8" fill="#fff" :stroke="m.hex" stroke-width="3.5")
        circle(v-bind="dot(m.angle, 137)" r="10" fill="none" stroke="rgba(29, 30, 32, .2)" stroke-width="0.5")

    //- F. Bare: no guide circle, smaller dots, lighter ticks
    template(v-else-if="variant === 'scale-bare'")
      line(v-for="d in deg(2)" :key="'k' + d" v-bind="line(d, d % 10 ? 161 : 156, 166)" stroke="#A4A7B1" :stroke-width="d % 90 ? 0.6 : 1.25")
      text.number(v-for="d in [0, 90, 180, 270]" :key="'n' + d" v-bind="at(d, 182)") {{ d }}
      circle(v-for="m in marks" :key="m.hex" v-bind="dot(m.angle, 140)" r="5.5" :fill="m.hex" stroke="rgba(29, 30, 32, .25)" stroke-width="0.5")

    //- OKLCH: angle = OKLCH hue (0-360), on a ring of OKLCH hues; colors as rings with hex and hue
    template(v-else-if="variant === 'oklch'")
      path(v-for="cell in OKLCH_CELLS" :key="cell.h" :d="wedge(C, C, 136, 144, cell.h - 1.6, cell.h + 1.6)" :fill="cell.color")
      line(v-for="d in deg(1)" :key="'k' + d" v-bind="line(d, d % 10 ? 158 : d % 30 ? 154 : 150, 162)" stroke="#788092" :stroke-width="d % 30 ? 0.5 : 1")
      text.number(v-for="d in deg(30)" :key="'n' + d" v-bind="at(d, 176)") {{ d }}
      template(v-for="m in marks" :key="m.hex")
        circle(v-bind="dot(m.angle, 140)" r="10" :fill="m.hex" stroke="#fff" stroke-width="2.5")
        circle(v-bind="dot(m.angle, 140)" r="11.5" fill="none" stroke="rgba(29, 30, 32, .3)" stroke-width="0.75")
        text.small(v-bind="at(m.angle, 112)" :fill="ink(m.hex)") {{ m.angle.toFixed(1) }}°
</template>

<script setup>
// Six versions of the Dial wheel (#4 on /wheel-lab), each also showing where
// a few colors land on it (wheelAngle in lib/wheel-lab/hues.js).
import { converter, formatCss, formatHex, clampChroma } from 'culori'
import { HUES, polar, wedge, wheelAngle } from '~/lib/wheel-lab/hues.js'

const props = defineProps({
  variant: { type: String, required: true },
  // Hex strings (placed on the Munsell wheel by wheelAngle), or { hex, angle }
  // to place a color at a given angle (the 'oklch' variant: its OKLCH hue)
  colors: { type: Array, default: () => [] }
})

const C = 200
const principals = HUES.filter((h) => h.principal)
const marks = computed(() => props.colors
  .map((c) => typeof c === 'string' ? { hex: c, angle: wheelAngle(c) } : c)
  .filter((m) => m.angle !== null && m.angle !== undefined))

// The OKLCH hue ring, 3 degrees a cell: every hue at one lightness and chroma
// (pulled into sRGB where it doesn't fit), so a color sits on its own hue
const OKLCH_CELLS = Array.from({ length: 120 }, (_, i) => {
  const h = i * 3
  return { h, color: formatHex(clampChroma({ mode: 'oklch', l: 0.72, c: 0.15, h }, 'oklch')) }
})

const deg = (step) => Array.from({ length: 360 / step }, (_, i) => i * step)
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
// A triangle with its tip at radius r, pointing at the center
const pointer = (angle, r, size) => {
  const tip = polar(C, C, r, angle)
  const left = polar(C, C, r + size * 1.3, angle - size / 3)
  const right = polar(C, C, r + size * 1.3, angle + size / 3)
  return `M ${tip.x} ${tip.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`
}
// Text in a mark's color, darkened when the color is too light to read on white
const toOklch = converter('oklch')
const ink = (hex) => {
  const c = toOklch(hex)
  return c.l > 0.7 ? formatCss({ ...c, l: 0.55 }) : hex
}
// Labels outside the wheel grow away from it: left of the wheel they end at the point
const anchor = (angle) => {
  const x = Math.sin(angle * Math.PI / 180)
  return x > 0.3 ? 'start' : x < -0.3 ? 'end' : 'middle'
}

// Every 2-degree tick except those within `gap` degrees of a color (so its dot sits in a clear notch)
const ticksClearOf = (gap) => deg(2).filter((d) =>
  marks.value.every((m) => Math.abs(((d - m.angle + 540) % 360) - 180) > gap))

// The wheel color at any angle (the nearest of the 40 hues)
const colorAt = (angle) => HUES.reduce((best, h) => {
  const d = Math.abs(((h.angle - angle + 540) % 360) - 180)
  return d < best.d ? { d, color: h.color } : best
}, { d: Infinity, color: '#000' }).color
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
.number
  font-size: 12px
  fill: #788092
.family
  font-size: 11px
  font-weight: 600
  fill: #788092
.small
  font-size: 11px
  font-weight: 600
</style>
