// The 40 Munsell hues (10 families x 2.5 / 5 / 7.5 / 10), as used on the
// /wheel-lab test page. 10RP sits at 0 degrees (the top) and each step is 9
// degrees clockwise, so 5Y is at 90, 10G at 180 and 5PB at 270.
//
// Colors are approximate: one hand-picked color per family at its "5" hue,
// with the steps between blended in OKLCH. Good enough to sketch wheels with;
// not a Munsell renotation lookup.
import { interpolate, formatHex, fixupHueShorter, interpolatorLinear, converter } from 'culori'

export const FAMILIES = ['R', 'YR', 'Y', 'GY', 'G', 'BG', 'B', 'PB', 'P', 'RP']
const STEPS = [2.5, 5, 7.5, 10]
const STEP_DEGREES = 9

// Each family at hue 5
const ANCHORS = {
  R: '#C4373D',
  YR: '#D27839',
  Y: '#E6C64E',
  GY: '#A3B847',
  G: '#4F9A5B',
  BG: '#3FA39B',
  B: '#3A7EA8',
  PB: '#4A5BA6',
  P: '#5B2E7C',
  RP: '#B83C84'
}

const anchorList = FAMILIES.map((f) => ANCHORS[f])
// Wraps around: RP back to R
const blend = interpolate([...anchorList, anchorList[0]], 'oklch', {
  h: { use: interpolatorLinear, fixup: fixupHueShorter }
})

export const HUES = FAMILIES.flatMap((family, f) => STEPS.map((step, s) => {
  const index = f * 4 + s                // 0 = 2.5R
  const angle = (index + 1) * STEP_DEGREES  // 2.5R at 9 degrees; 10RP at 360 (= 0)
  // Position between the "5" anchors: 5 of family f is at f; 2.5 is a quarter step before
  const t = ((f + (step - 5) / 10) / FAMILIES.length + 1) % 1
  return {
    name: `${step}${family}`,
    family,
    step,
    angle: angle % 360,
    principal: step === 5,
    major: step === 10, // Family boundaries
    color: formatHex(blend(t)).toUpperCase()
  }
}))

// Points on a circle: degrees clockwise from the top
export const polar = (cx, cy, r, degrees) => {
  const a = (degrees - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

// An SVG arc path from one angle to another (clockwise), at radius r
export const arc = (cx, cy, r, from, to) => {
  const a = polar(cx, cy, r, from)
  const b = polar(cx, cy, r, to)
  const large = ((to - from + 360) % 360) > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`
}

// A ring segment (annular wedge) path
export const wedge = (cx, cy, r1, r2, from, to) => {
  const a = polar(cx, cy, r2, from)
  const b = polar(cx, cy, r2, to)
  const c = polar(cx, cy, r1, to)
  const d = polar(cx, cy, r1, from)
  const large = ((to - from + 360) % 360) > 180 ? 1 : 0
  return `M ${a.x} ${a.y} A ${r2} ${r2} 0 ${large} 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${r1} ${r1} 0 ${large} 0 ${d.x} ${d.y} Z`
}

// Where a color sits on this wheel (degrees, 10RP = 0): its OKLCH hue,
// placed between the two wheel hues whose OKLCH hues it falls between.
// Grays (no hue) return null.
const toOklch = converter('oklch')
const wheelOklchHues = HUES.map((h) => ({ angle: h.angle || 360, hue: toOklch(h.color).h }))
  .sort((a, b) => a.angle - b.angle) // 2.5R (9) ... 10RP (360)

export function wheelAngle(color) {
  const target = toOklch(color)
  if (!target || target.h === undefined || target.c < 0.02) return null
  const n = wheelOklchHues.length
  for (let i = 0; i < n; i++) {
    const a = wheelOklchHues[i]
    const b = wheelOklchHues[(i + 1) % n]
    const span = (b.hue - a.hue + 360) % 360       // OKLCH degrees from a to b, going around
    const into = (target.h - a.hue + 360) % 360    // how far past a the color is
    if (into <= span) {
      const angleSpan = ((b.angle - a.angle + 360) % 360) || 9
      return (a.angle + angleSpan * (span ? into / span : 0)) % 360
    }
  }
  return null
}
