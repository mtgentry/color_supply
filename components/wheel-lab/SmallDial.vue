<template lang="pug">
  //- Drawn at its real size (1 unit = 1px), so text and strokes are exact
  svg.small-dial(:viewBox="`0 0 ${S} ${S}`" :width="S" :height="S" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="`Small dial ${variant}`")

    //- 1. Tens: a tick every 10 degrees, longer at the quarters; dots on a guide circle
    template(v-if="variant === 'tens'")
      circle(:cx="C" :cy="C" :r="R - 16" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in deg(10)" :key="d" v-bind="line(d, R - (d % 90 ? 5 : 9), R)" stroke="#788092" :stroke-width="d % 90 ? 1 : 1.5")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R + 13)") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R - 16)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 2. Thirties: a tick every 30 degrees; dots in the tick band, in a notch
    template(v-else-if="variant === 'thirties'")
      line(v-for="d in clearOf(deg(30), 8)" :key="d" v-bind="line(d, R - (d % 90 ? 7 : 11), R)" stroke="#788092" :stroke-width="d % 90 ? 1.25 : 1.75")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R + 13)") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R - 4)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 3. Dotted: the scale as small gray dots every 10 degrees, ticks only at the quarters
    template(v-else-if="variant === 'dotted'")
      circle(v-for="d in deg(10).filter((d) => d % 90)" :key="d" v-bind="dot(d, R - 3)" r="1.25" fill="#A4A7B1")
      line(v-for="d in QUARTERS" :key="'q' + d" v-bind="line(d, R - 9, R)" stroke="#788092" stroke-width="1.5")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R + 13)") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R - 18)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 4. Colored tick: ticks every 15 degrees; each color's tick in its color, in to a dot
    template(v-else-if="variant === 'tick'")
      line(v-for="d in deg(15)" :key="d" v-bind="line(d, R - (d % 90 ? 5 : 9), R)" stroke="#788092" :stroke-width="d % 90 ? 1 : 1.5")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R + 13)") {{ d }}
      template(v-for="(m, i) in marks" :key="i")
        line(v-bind="line(m.angle, R - 19, R + 2)" :stroke="m.hex" stroke-width="2.5" stroke-linecap="round")
        circle(v-bind="dot(m.angle, R - 19)" r="3.5" :fill="m.hex")

    //- 5. Outside: ticks every 10 degrees, numbers inside, dots outside
    template(v-else-if="variant === 'outside'")
      line(v-for="d in deg(10)" :key="d" v-bind="line(d, R - (d % 90 ? 5 : 9), R)" stroke="#788092" :stroke-width="d % 90 ? 1 : 1.5")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R - (d % 180 ? 22 : 19))") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R + 11)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 6. Rings: ticks every 10 degrees, hollow rings on a guide circle
    template(v-else-if="variant === 'rings'")
      circle(:cx="C" :cy="C" :r="R - 16" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in deg(10)" :key="d" v-bind="line(d, R - (d % 90 ? 5 : 9), R)" stroke="#788092" :stroke-width="d % 90 ? 1 : 1.5")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R + 13)") {{ d }}
      template(v-for="(m, i) in marks" :key="i")
        circle(v-bind="dot(m.angle, R - 16)" r="4.5" fill="#fff" :stroke="m.hex" stroke-width="2.5")
        circle(v-bind="dot(m.angle, R - 16)" r="6.25" fill="none" :stroke="EDGE" stroke-width="0.5")

    //- Inline: the numbers sit in the tick ring, in a gap in the ticks
    //- 7. Tens, inline: ticks every 10 degrees; dots on a guide circle
    template(v-else-if="variant === 'tens-inline'")
      circle(:cx="C" :cy="C" :r="R - 18" fill="none" stroke="#E6E8EB" stroke-width="1")
      line(v-for="d in besideNumbers(deg(10))" :key="d" v-bind="line(d, R - 7, R)" stroke="#788092" stroke-width="1")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R - 3.5)") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R - 18)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 8. Fives, inline: finer ticks every 5 degrees, so the numbers read as part of the scale
    template(v-else-if="variant === 'fives-inline'")
      line(v-for="d in besideNumbers(deg(5))" :key="d" v-bind="line(d, R - (d % 10 ? 4 : 7), R)" stroke="#788092" stroke-width="1")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R - 3.5)") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R - 18)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 9. Dotted, inline: gray dots every 10 degrees, numbers in their place at the quarters
    template(v-else-if="variant === 'dotted-inline'")
      circle(v-for="d in besideNumbers(deg(10))" :key="d" v-bind="dot(d, R - 3.5)" r="1.25" fill="#A4A7B1")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R - 3.5)") {{ d }}
      circle(v-for="(m, i) in marks" :key="i" v-bind="dot(m.angle, R - 20)" r="5" :fill="m.hex" :stroke="EDGE" stroke-width="0.75")

    //- 10. Colored tick, inline: ticks every 15 degrees; colored ticks running in to a dot
    template(v-else-if="variant === 'tick-inline'")
      line(v-for="d in besideNumbers(deg(15))" :key="d" v-bind="line(d, R - 7, R)" stroke="#788092" stroke-width="1.25")
      text(v-for="d in QUARTERS" :key="'n' + d" v-bind="at(d, R - 3.5)") {{ d }}
      template(v-for="(m, i) in marks" :key="i")
        line(v-bind="line(m.angle, R - 22, R)" :stroke="m.hex" stroke-width="2.5" stroke-linecap="round")
        circle(v-bind="dot(m.angle, R - 22)" r="3.5" :fill="m.hex")
</template>

<script setup>
// The ringless Dial 4 redrawn small (140px across): 10px numbers,
// fewer ticks, heavier strokes. Colors are { hex, angle } (angle = OKLCH hue).
import { polar } from '~/lib/wheel-lab/hues.js'

const props = defineProps({
  variant: { type: String, required: true },
  colors: { type: Array, default: () => [] }
})

const R = 70     // The dial's radius: the outer edge of the ticks, so it's 140px across
const S = 190    // The SVG's width and height in px: the dial plus room for the numbers outside it
const C = S / 2  // Center
const QUARTERS = [0, 90, 180, 270]
const EDGE = 'rgba(29, 30, 32, .3)' // Thin outline, so light colors show on white

const marks = computed(() => props.colors.filter((m) => m.angle !== null && m.angle !== undefined))

const deg = (step) => Array.from({ length: 360 / step }, (_, i) => i * step)
// Leaves out the ticks within `gap` degrees of a color, so its dot sits in a notch
const clearOf = (ticks, gap) => ticks.filter((d) =>
  marks.value.every((m) => Math.abs(((d - m.angle + 540) % 360) - 180) > gap))
// Leaves room for numbers placed in the tick ring: no ticks within a number's width of it
// ("180" across the top or bottom needs more room than "90" or "270" on the sides)
const besideNumbers = (ticks) => ticks.filter((d) => QUARTERS.every((q) => {
  const away = Math.abs(((d - q + 540) % 360) - 180)
  return away > (q % 180 ? 7 : 9)
}))
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
</script>

<style scoped lang="sass">
.small-dial
  display: block
  margin: 0 auto
  overflow: visible
text
  font-size: 10px
  fill: #788092
  text-anchor: middle
  dominant-baseline: central
  font-family: inherit
</style>
